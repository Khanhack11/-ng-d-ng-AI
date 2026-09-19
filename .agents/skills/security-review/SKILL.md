---
name: security-review
description: Audit software implementation for security vulnerabilities, injection flaws, authentication/authorization issues, and sensitive data leakage.
---

# Security Review Skill

## Objective
Audit the application, APIs, database layer, and third-party integrations for security vulnerabilities according to OWASP standards.

## Inputs
Read:
- Source code (backend endpoints, repositories, controllers, services)
- Environment configuration templates (`.env.example`)
- Database query implementations

## Security Checklist
1. **SQL Injection**: Ensure ALL database queries use parameterized inputs (`@param` with typed parameters). NO string concatenation in queries.
2. **Cross-Site Scripting (XSS)**: Verify user inputs rendered in views/chat are properly sanitized or escaped.
3. **Cross-Site Request Forgery (CSRF)**: Validate CORS configuration, API methods, and token verification.
4. **Authentication & Authorization**: Verify role checks (Customer vs Seller vs Admin), JWT token expiration, and secure session handling.
5. **Password & Secret Security**: Enforce password hashing (bcrypt/Argon2); ensure plain-text passwords are NEVER stored or logged.
6. **Environment & Secrets Management**: Ensure `.env` is gitignored. No hard-coded Gemini API keys, DB passwords, or private tokens in repo.
7. **Input Validation**: Check that all incoming payloads validate types, length, range, and format before processing.
8. **Sensitive Data Leakage**: Ensure stack traces, internal database error details, or private server keys are NOT exposed to the client.
9. **Dependency Vulnerability**: Run dependency auditing (`npm audit`) and address critical/high CVEs.
10. **Rate Limiting & DoS Protection**: Check for reasonable timeouts, payload size limits, and basic request throttling.

## Rules
- Do NOT modify application code directly during review.
- Every finding must state: Severity, Vulnerable Component, Attack Vector, and Remediation Code Snippet.

## Outputs
Create or update:
- `docs/security-review.md`
