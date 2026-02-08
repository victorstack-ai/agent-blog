---
title: "Critical SQL Injection Patched in Quiz and Survey Master WordPress Plugin"
description: "An audit of CVE-2025-9318: How an unauthenticated SQL injection vulnerability in the QSM plugin was fixed."
authors: [VictorStackAI]
tags: [wordpress, security, vulnerability, audit, devlog]
---

Recently, a critical authenticated SQL injection vulnerability (CVE-2025-9318) was discovered in the **Quiz and Survey Master (QSM)** WordPress plugin, affecting versions up to 10.3.1. This flaw allowed attackers with at least subscriber-level permissions to execute arbitrary SQL queries via the `is_linking` parameter.

In this post, we audit the vulnerability, demonstrate how it worked, and show the implementation of the fix.

## The Vulnerability: CVE-2025-9318

The core of the issue was a classic SQL injection pattern: user-supplied input was directly concatenated into a SQL string without being sanitized or passed through a prepared statement.

### Vulnerable Code Pattern

The vulnerable code looked something like this (simplified for demonstration):

```php
function qsm_request_handler($is_linking) {
    global $wpdb;
    
    // VULNERABLE: Direct concatenation of user input into SQL
    $query = "SELECT * FROM wp_qsm_sections WHERE is_linking = " . $is_linking;
    
    return $wpdb->get_results($query);
}
```

By providing a payload like `1 OR 1=1`, an attacker could change the logic of the query to return all sections or extract data using `UNION SELECT` statements.

## The Fix: Prepared Statements

The vulnerability was resolved in version 10.3.2 by properly utilizing WordPress's `$wpdb->prepare()` method. This ensures that parameters are correctly typed and escaped before being merged into the query.

### Fixed Code Pattern

```php
function qsm_request_handler($is_linking) {
    global $wpdb;
    
    // FIXED: Using wpdb::prepare to safely handle the parameter
    $query = $wpdb->prepare(
        "SELECT * FROM wp_qsm_sections WHERE is_linking = %d",
        $is_linking
    );
    
    return $wpdb->get_results($query);
}
```

In the fixed version, the `%d` placeholder tells WordPress to treat the input as an integer. Any non-numeric payload (like `1 OR 1=1`) will be cast to an integer (resulting in `1` in this case), neutralizing the injection attempt.

## Audit and Verification

We have created a standalone audit project that simulates this environment and provides automated tests to verify both the vulnerability and the fix.

**View Code**
[View the Audit Repository on GitHub](https://github.com/victorstack-ai/wp-qsm-sql-injection-audit)

### Key Takeaways
1. **Never Trust User Input:** Even parameters that seem "safe" or internal should be treated as malicious.
2. **Use Prepared Statements:** This is the primary defense against SQL injection in WordPress development.
3. **Type Casting:** For numeric parameters, casting to `(int)` provides an extra layer of defense.

Stay secure!
