#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 3 ]]; then
  echo "Usage: $0 <owner/repo> <baseline_workflow_file> <warpbuild_workflow_file> [runs]"
  exit 1
fi

REPO="$1"
BASELINE_WORKFLOW="$2"
WARPBUILD_WORKFLOW="$3"
RUNS="${4:-20}"

fetch_durations() {
  local workflow="$1"
  gh api "repos/$REPO/actions/workflows/$workflow/runs?per_page=$RUNS" \
    --jq '.workflow_runs[]
      | select(.conclusion=="success")
      | ((.updated_at|fromdateiso8601)-(.run_started_at|fromdateiso8601))'
}

calc_stats() {
  awk '
  { a[NR]=$1; }
  END {
    if (NR == 0) { print "count=0 p50=0 p95=0"; exit; }
    for (i = 1; i <= NR; i++) {
      for (j = i + 1; j <= NR; j++) {
        if (a[i] > a[j]) {
          tmp = a[i]; a[i] = a[j]; a[j] = tmp;
        }
      }
    }
    p50_i = int((NR + 1) * 0.50); if (p50_i < 1) p50_i = 1; if (p50_i > NR) p50_i = NR;
    p95_i = int((NR + 1) * 0.95); if (p95_i < 1) p95_i = 1; if (p95_i > NR) p95_i = NR;
    printf "count=%d p50=%d p95=%d\n", NR, a[p50_i], a[p95_i];
  }'
}

echo "Benchmarking $REPO with last $RUNS successful runs"
echo

echo "Baseline workflow: $BASELINE_WORKFLOW"
fetch_durations "$BASELINE_WORKFLOW" | calc_stats

echo "WarpBuild workflow: $WARPBUILD_WORKFLOW"
fetch_durations "$WARPBUILD_WORKFLOW" | calc_stats
