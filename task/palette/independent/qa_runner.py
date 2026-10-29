import os
import sys
import json
import time
import hashlib
from datetime import datetime, timezone
from playwright.sync_api import sync_playwright

BASE_URL = "http://127.0.0.1:3917/agent-blog"
AXE_PATH = "/Users/vj/Documents/work/personal/projects/web/victorjimenezdev.github.io-main-trees/engineering-series-20261018/node_modules/axe-core/axe.min.js"
SCREENSHOTS_DIR = "/Users/vj/Documents/work/personal/projects/ai-agents/agent-blog-trees/cover-palette-20261018/task/palette/independent/screenshots"
OUTPUT_JSON = "/Users/vj/Documents/work/personal/projects/ai-agents/agent-blog-trees/cover-palette-20261018/task/palette/independent/results.json"

os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

with open(AXE_PATH, "r", encoding="utf-8") as f:
    AXE_SCRIPT = f.read()

def calc_sha256(filepath):
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def get_color_luminance(rgb_str):
    # rgb_str like 'rgb(246, 242, 231)' or 'rgba(...)'
    import re
    m = re.search(r"rgba?\((\d+),\s*(\d+),\s*(\d+)", rgb_str)
    if not m:
        return 0.0
    r, g, b = [int(x) / 255.0 for x in m.groups()]
    def adjust(c):
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * adjust(r) + 0.7152 * adjust(g) + 0.0722 * adjust(b)

def calc_contrast_ratio(rgb1, rgb2):
    l1 = get_color_luminance(rgb1)
    l2 = get_color_luminance(rgb2)
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)

results = {
    "timestamp": datetime.now(timezone.utc).isoformat(),
    "source_hashes": {
        "src/css/custom.css": calc_sha256("src/css/custom.css"),
        "docusaurus.config.ts": calc_sha256("docusaurus.config.ts"),
    },
    "build_hashes": {},
    "browser_versions": {},
    "console_errors": [],
    "network_errors": [],
    "axe_scans": {},
    "computed_styles": {},
    "contrast_ratios": {},
    "responsive_screenshots": [],
    "interaction_tests": {},
    "mermaid_checks": {},
    "search_tests": {},
    "mobile_sidebar_test": {},
    "preference_tests": {},
}

import glob
for css_file in glob.glob("build/assets/css/styles.*.css"):
    results["build_hashes"][css_file] = calc_sha256(css_file)

with sync_playwright() as p:
    # 1. Chromium primary testing
    browser = p.chromium.launch()
    results["browser_versions"]["chromium"] = browser.version

    context = browser.new_context(viewport={"width": 1440, "height": 900})
    page = context.new_page()

    def on_console(msg):
        if msg.type in ["error"]:
            results["console_errors"].append({"type": msg.type, "text": msg.text, "location": msg.location})

    def on_request_failed(req):
        results["network_errors"].append({"url": req.url, "failure": req.failure})

    page.on("console", on_console)
    page.on("requestfailed", on_request_failed)

    # Routes to test
    routes = {
        "home": f"{BASE_URL}/",
        "post_code": f"{BASE_URL}/2026-03-11-ally-wordpress-unauthenticated-sqli-response-playbook/",
        "post_diagrams": f"{BASE_URL}/how-i-combine-harness-loop-graph-engineering/",
        "tags": f"{BASE_URL}/tags/",
        "archive": f"{BASE_URL}/archive/",
    }

    # Verify routes & computed styles & axe
    for r_name, r_url in routes.items():
        page.goto(r_url, wait_until="networkidle")
        time.sleep(0.5)

        # Axe scan
        page.evaluate(AXE_SCRIPT)
        axe_res = page.evaluate("axe.run()")
        violations = axe_res.get("violations", [])
        results["axe_scans"][r_name] = [
            {
                "id": v["id"],
                "impact": v["impact"],
                "description": v["description"],
                "help": v["help"],
                "nodes": [n["target"] for n in v["nodes"]],
            }
            for v in violations
        ]

    # Measure exact computed palette styles on home and post
    page.goto(f"{BASE_URL}/", wait_until="networkidle")
    styles_home = page.evaluate("""() => {
        const getStyles = (sel) => {
            const el = document.querySelector(sel);
            if (!el) return null;
            const cs = window.getComputedStyle(el);
            return {
                bg: cs.backgroundColor,
                color: cs.color,
                border: cs.borderColor,
                textDecorationColor: cs.textDecorationColor,
            };
        };
        return {
            body: getStyles('body'),
            navbar: getStyles('.navbar'),
            navbarBrand: getStyles('.navbar__brand'),
            footer: getStyles('.footer'),
            footerLink: getStyles('.footer__link-item'),
            h1: getStyles('h1'),
            h2: getStyles('h2 a'),
            p: getStyles('.markdown p'),
            btnPrimary: getStyles('.button--primary'),
            activeLink: getStyles("a[aria-current='page']"),
            themeMeta: document.querySelector("meta[name='theme-color']")?.getAttribute('content'),
        };
    }""")
    results["computed_styles"]["home"] = styles_home

    # Measure code and diagram styles
    page.goto(f"{BASE_URL}/2026-03-11-ally-wordpress-unauthenticated-sqli-response-playbook/", wait_until="networkidle")
    styles_code = page.evaluate("""() => {
        const pre = document.querySelector('pre');
        const code = document.querySelector('pre code');
        const inlineCode = document.querySelector('p code');
        const getCs = (el) => el ? {
            bg: window.getComputedStyle(el).backgroundColor,
            color: window.getComputedStyle(el).color,
            border: window.getComputedStyle(el).borderColor
        } : null;
        return {
            pre: getCs(pre),
            code: getCs(code),
            inlineCode: getCs(inlineCode),
        };
    }""")
    results["computed_styles"]["code_route"] = styles_code

    # Measure Mermaid diagrams on combined route
    page.goto(f"{BASE_URL}/how-i-combine-harness-loop-graph-engineering/", wait_until="networkidle")
    mermaid_info = page.evaluate("""() => {
        const diagrams = Array.from(document.querySelectorAll('.docusaurus-mermaid-container'));
        const labels = Array.from(document.querySelectorAll('.docusaurus-mermaid-container .edgeLabel'));
        return {
            count: diagrams.length,
            labels: labels.map(l => {
                const cs = window.getComputedStyle(l);
                const rect = l.querySelector('rect');
                const text = l.querySelector('text') || l.querySelector('span') || l;
                const csText = window.getComputedStyle(text);
                return {
                    text: (l.textContent || '').trim(),
                    labelBg: cs.backgroundColor,
                    textFill: csText.fill,
                    textColor: csText.color,
                };
            }),
        };
    }""")
    results["mermaid_checks"] = mermaid_info

    # Calculate key contrast ratios
    bg_body = styles_home["body"]["bg"] if styles_home.get("body") else "rgb(246, 242, 231)"
    h1_color = styles_home["h1"]["color"] if styles_home.get("h1") else (styles_home["h2"]["color"] if styles_home.get("h2") else "rgb(13, 26, 45)")
    results["contrast_ratios"] = {
        "text_on_body": {
            "foreground": styles_home["body"]["color"] if styles_home.get("body") else "n/a",
            "background": bg_body,
            "ratio": round(calc_contrast_ratio(styles_home["body"]["color"], bg_body), 2) if styles_home.get("body") else "n/a",
        },
        "heading_on_body": {
            "foreground": h1_color,
            "background": bg_body,
            "ratio": round(calc_contrast_ratio(h1_color, bg_body), 2),
        },
        "footer_text_on_footer_bg": {
            "foreground": styles_home["footer"]["color"] if styles_home.get("footer") else "n/a",
            "background": styles_home["footer"]["bg"] if styles_home.get("footer") else "n/a",
            "ratio": round(calc_contrast_ratio(styles_home["footer"]["color"], styles_home["footer"]["bg"]), 2) if styles_home.get("footer") else "n/a",
        },
        "footer_link_on_footer_bg": {
            "foreground": styles_home["footerLink"]["color"] if styles_home.get("footerLink") else "n/a",
            "background": styles_home["footer"]["bg"] if styles_home.get("footer") else "n/a",
            "ratio": round(calc_contrast_ratio(styles_home["footerLink"]["color"], styles_home["footer"]["bg"]), 2) if styles_home.get("footerLink") else "n/a",
        },
        "code_text_on_code_bg": {
            "foreground": styles_code["code"]["color"] if styles_code.get("code") else "n/a",
            "background": styles_code["pre"]["bg"] if styles_code.get("pre") else "n/a",
            "ratio": round(calc_contrast_ratio(styles_code["code"]["color"], styles_code["pre"]["bg"]), 2) if styles_code.get("code") and styles_code.get("pre") else "n/a",
        },
        "btn_text_on_btn_bg": {
            "foreground": styles_home["btnPrimary"]["color"] if styles_home.get("btnPrimary") else "n/a",
            "background": styles_home["btnPrimary"]["bg"] if styles_home.get("btnPrimary") else "n/a",
            "ratio": round(calc_contrast_ratio(styles_home["btnPrimary"]["color"], styles_home["btnPrimary"]["bg"]), 2) if styles_home.get("btnPrimary") else "n/a",
        },
    }

    # Responsive testing in Chromium:
    # Widths: 320, 375, 430, 600, 768, 1024, 1440, 2560
    # Breakpoint 996: 995, 996, 997
    # Short: 1024x500, Tall: 1024x1200
    widths = [320, 375, 430, 600, 768, 995, 996, 997, 1024, 1440, 2560]
    for w in widths:
        page.set_viewport_size({"width": w, "height": 900})
        page.goto(f"{BASE_URL}/", wait_until="networkidle")
        time.sleep(0.3)
        path = f"{SCREENSHOTS_DIR}/chromium-w{w}.png"
        page.screenshot(path=path, full_page=False)
        results["responsive_screenshots"].append({"width": w, "height": 900, "engine": "chromium", "file": f"chromium-w{w}.png"})

    # Short & Tall
    for (w, h, name) in [(1024, 500, "short"), (1024, 1200, "tall")]:
        page.set_viewport_size({"width": w, "height": h})
        page.goto(f"{BASE_URL}/", wait_until="networkidle")
        time.sleep(0.3)
        path = f"{SCREENSHOTS_DIR}/chromium-{name}-{w}x{h}.png"
        page.screenshot(path=path, full_page=False)
        results["responsive_screenshots"].append({"width": w, "height": h, "engine": "chromium", "file": f"chromium-{name}-{w}x{h}.png"})

    # 320 reflow / 200% zoom
    ctx_zoom = browser.new_context(viewport={"width": 320, "height": 640}, device_scale_factor=2.0)
    page_zoom = ctx_zoom.new_page()
    page_zoom.goto(f"{BASE_URL}/", wait_until="networkidle")
    page_zoom.screenshot(path=f"{SCREENSHOTS_DIR}/chromium-zoom200-w320.png")
    results["responsive_screenshots"].append({"width": 320, "scale": 2.0, "engine": "chromium", "file": "chromium-zoom200-w320.png"})
    ctx_zoom.close()

    # Reduced motion
    ctx_rm = browser.new_context(viewport={"width": 1024, "height": 900}, reduced_motion="reduce")
    page_rm = ctx_rm.new_page()
    page_rm.goto(f"{BASE_URL}/", wait_until="networkidle")
    page_rm.screenshot(path=f"{SCREENSHOTS_DIR}/chromium-reduced-motion.png")
    results["responsive_screenshots"].append({"reduced_motion": "reduce", "engine": "chromium", "file": "chromium-reduced-motion.png"})
    ctx_rm.close()

    # Saved dark / light preference
    for theme_pref in ["dark", "light"]:
        ctx_pref = browser.new_context(viewport={"width": 1024, "height": 900})
        p_pref = ctx_pref.new_page()
        p_pref.goto(f"{BASE_URL}/", wait_until="domcontentloaded")
        p_pref.evaluate(f"localStorage.setItem('theme', '{theme_pref}')")
        p_pref.reload(wait_until="networkidle")
        bg = p_pref.evaluate("window.getComputedStyle(document.body).backgroundColor")
        color = p_pref.evaluate("window.getComputedStyle(document.body).color")
        theme_attr = p_pref.evaluate("document.documentElement.getAttribute('data-theme')")
        p_pref.screenshot(path=f"{SCREENSHOTS_DIR}/chromium-pref-{theme_pref}.png")
        results["preference_tests"][theme_pref] = {
            "requested_pref": theme_pref,
            "data_theme_attr": theme_attr,
            "body_bg": bg,
            "body_color": color,
            "screenshot": f"chromium-pref-{theme_pref}.png",
        }
        ctx_pref.close()

    # Diagram screenshots 1:1 on Chromium
    page.set_viewport_size({"width": 1440, "height": 1000})
    page.goto(f"{BASE_URL}/how-i-combine-harness-loop-graph-engineering/", wait_until="networkidle")
    diagrams = page.query_selector_all(".docusaurus-mermaid-container")
    for idx, d in enumerate(diagrams):
        d.scroll_into_view_if_needed()
        time.sleep(0.3)
        d.screenshot(path=f"{SCREENSHOTS_DIR}/diagram-{idx}.png")
    page.screenshot(path=f"{SCREENSHOTS_DIR}/diagrams-fullpage.png", full_page=True)

    # Code route screenshot
    page.goto(f"{BASE_URL}/2026-03-11-ally-wordpress-unauthenticated-sqli-response-playbook/", wait_until="networkidle")
    pre = page.query_selector("pre")
    if pre:
        pre.scroll_into_view_if_needed()
        time.sleep(0.3)
        pre.screenshot(path=f"{SCREENSHOTS_DIR}/code-pre.png")

    # Search testing
    page.goto(f"{BASE_URL}/", wait_until="networkidle")
    # Locate search input
    search_input = page.query_selector("input.navbar__search-input, input[placeholder*='Search'], input[type='search']")
    if not search_input:
        # maybe a button triggers search modal
        search_btn = page.query_selector("button.navbar__search-button, .searchBox_node_modules")
        if search_btn:
            search_btn.click()
            time.sleep(0.3)
            search_input = page.query_selector("input")

    if search_input:
        search_input.focus()
        search_input.fill("harness")
        time.sleep(1.0)
        page.screenshot(path=f"{SCREENSHOTS_DIR}/search-success.png")
        results_count = page.evaluate("""() => {
            const items = document.querySelectorAll('.suggestion_node_modules, .search-result, .dropdown-menu li, .hitItem_node_modules, [class*="searchResult"], [class*="suggestion"]');
            return items.length;
        }""")
        results["search_tests"]["success"] = {
            "query": "harness",
            "items_count": results_count,
            "screenshot": "search-success.png",
        }

        # Clear and test no-results
        search_input.fill("xyznonexistentquery999")
        time.sleep(1.0)
        page.screenshot(path=f"{SCREENSHOTS_DIR}/search-no-results.png")
        no_res_text = page.evaluate("""() => {
            const emptyEl = document.querySelector('.noResults_node_modules, [class*="noResults"], [class*="empty"]');
            return emptyEl ? emptyEl.innerText : (document.body.innerText.includes("No results") ? "No results found" : "");
        }""")
        results["search_tests"]["no_results"] = {
            "query": "xyznonexistentquery999",
            "message": no_res_text,
            "screenshot": "search-no-results.png",
        }
        # Close search
        page.keyboard.press("Escape")
    else:
        results["search_tests"]["error"] = "Search input element not found"

    # Mobile menu open / close test
    page.set_viewport_size({"width": 375, "height": 812})
    page.goto(f"{BASE_URL}/", wait_until="networkidle")
    hamburger = page.query_selector(".navbar__toggle")
    if hamburger:
        hamburger.click()
        time.sleep(0.5)
        sidebar = page.query_selector(".navbar-sidebar")
        is_sidebar_visible = sidebar.is_visible() if sidebar else False
        sidebar_bg = page.evaluate("() => window.getComputedStyle(document.querySelector('.navbar-sidebar')).backgroundColor")
        page.screenshot(path=f"{SCREENSHOTS_DIR}/mobile-sidebar-open.png")
        
        # Click close button or toggle to close sidebar
        page.evaluate("""() => {
            const closeBtn = document.querySelector('.navbar-sidebar__close') || document.querySelector('button[aria-label*=\"Close\"]') || document.querySelector('.navbar__toggle');
            if (closeBtn) closeBtn.click();
        }""")
        time.sleep(0.5)
        
        sidebar_closed = not page.evaluate("() => document.querySelector('.navbar-sidebar--show') !== null")
        page.screenshot(path=f"{SCREENSHOTS_DIR}/mobile-sidebar-closed.png")
        results["mobile_sidebar_test"] = {
            "opened": is_sidebar_visible,
            "bg": sidebar_bg,
            "closed": sidebar_closed,
            "open_screenshot": "mobile-sidebar-open.png",
            "closed_screenshot": "mobile-sidebar-closed.png",
        }

    # Keyboard Tab & Focus Ring & Hover
    page.set_viewport_size({"width": 1440, "height": 900})
    page.goto(f"{BASE_URL}/", wait_until="networkidle")
    # Press tab several times
    tab_history = []
    for _ in range(5):
        page.keyboard.press("Tab")
        time.sleep(0.2)
        info = page.evaluate("""() => {
            const el = document.activeElement;
            if (!el) return null;
            const cs = window.getComputedStyle(el);
            return {
                tag: el.tagName,
                text: (el.innerText || el.textContent || '').trim().slice(0, 30),
                outline: cs.outline,
                outlineColor: cs.outlineColor,
                outlineWidth: cs.outlineWidth,
                boxShadow: cs.boxShadow,
            };
        }""")
        tab_history.append(info)
    page.screenshot(path=f"{SCREENSHOTS_DIR}/keyboard-tab-focus.png")
    results["interaction_tests"]["keyboard_tabs"] = tab_history

    # Hover test on primary button or article link
    article_link = page.query_selector("article h2 a")
    if article_link:
        article_link.hover()
        time.sleep(0.3)
        hover_style = page.evaluate("""() => {
            const el = document.querySelector('article h2 a');
            const cs = window.getComputedStyle(el);
            return {
                color: cs.color,
                textDecoration: cs.textDecoration,
                textDecorationColor: cs.textDecorationColor,
            };
        }""")
        page.screenshot(path=f"{SCREENSHOTS_DIR}/hover-article-link.png")
        results["interaction_tests"]["hover_link"] = hover_style

    # Pagination navigation test
    page.goto(f"{BASE_URL}/", wait_until="networkidle")
    pagination = page.query_selector(".pagination-nav, .pagination-nav__item")
    results["interaction_tests"]["pagination_present"] = bool(pagination)

    # TOC navigation test on detail page
    page.goto(f"{BASE_URL}/how-i-combine-harness-loop-graph-engineering/", wait_until="networkidle")
    toc_link = page.query_selector(".table-of-contents__link, .toc_node_modules a, [class*='tableOfContents'] a")
    if toc_link:
        href = toc_link.get_attribute("href")
        toc_link.click()
        time.sleep(0.5)
        current_url = page.url
        results["interaction_tests"]["toc_navigation"] = {
            "target_href": href,
            "final_url": current_url,
            "navigated": href in current_url if href else False,
        }
        page.screenshot(path=f"{SCREENSHOTS_DIR}/toc-navigated.png")

    context.close()
    browser.close()

    # 2. WebKit representative testing
    try:
        wk_browser = p.webkit.launch()
        results["browser_versions"]["webkit"] = wk_browser.version
        wk_ctx = wk_browser.new_context(viewport={"width": 375, "height": 812})
        wk_page = wk_ctx.new_page()
        wk_page.goto(f"{BASE_URL}/", wait_until="networkidle")
        wk_page.screenshot(path=f"{SCREENSHOTS_DIR}/webkit-375.png")
        results["responsive_screenshots"].append({"width": 375, "height": 812, "engine": "webkit", "file": "webkit-375.png"})
        
        # Also 1024
        wk_page.set_viewport_size({"width": 1024, "height": 900})
        wk_page.goto(f"{BASE_URL}/how-i-combine-harness-loop-graph-engineering/", wait_until="networkidle")
        wk_page.screenshot(path=f"{SCREENSHOTS_DIR}/webkit-1024-diagrams.png")
        results["responsive_screenshots"].append({"width": 1024, "height": 900, "engine": "webkit", "file": "webkit-1024-diagrams.png"})
        
        wk_ctx.close()
        wk_browser.close()
    except Exception as e:
        results["browser_versions"]["webkit_error"] = str(e)

    # 3. Firefox representative testing
    try:
        ff_browser = p.firefox.launch()
        results["browser_versions"]["firefox"] = ff_browser.version
        ff_ctx = ff_browser.new_context(viewport={"width": 375, "height": 812})
        ff_page = ff_ctx.new_page()
        ff_page.goto(f"{BASE_URL}/", wait_until="networkidle")
        ff_page.screenshot(path=f"{SCREENSHOTS_DIR}/firefox-375.png")
        results["responsive_screenshots"].append({"width": 375, "height": 812, "engine": "firefox", "file": "firefox-375.png"})
        
        # Also 1024
        ff_page.set_viewport_size({"width": 1024, "height": 900})
        ff_page.goto(f"{BASE_URL}/how-i-combine-harness-loop-graph-engineering/", wait_until="networkidle")
        ff_page.screenshot(path=f"{SCREENSHOTS_DIR}/firefox-1024-diagrams.png")
        results["responsive_screenshots"].append({"width": 1024, "height": 900, "engine": "firefox", "file": "firefox-1024-diagrams.png"})
        
        ff_ctx.close()
        ff_browser.close()
    except Exception as e:
        results["browser_versions"]["firefox_error"] = str(e)

with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2)

print("QA Runner finished successfully.")
