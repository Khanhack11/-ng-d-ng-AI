---
name: code-review
description: Perform comprehensive code quality, architecture compliance, maintainability, and standards review across the codebase.
---

# Code Review Skill

## Objective
Evaluate implementation quality, maintainability, architectural integrity, and conformance to engineering best practices.

## Inputs
Read:
- Source code changes (git diff or target files)
- `docs/architecture.md`
- `docs/requirements.md`

## Review Dimensions
1. **Correctness**: Does the code perform the intended business logic without bugs or race conditions?
2. **Requirements Compliance**: Does it adhere to the approved specifications and acceptance criteria?
3. **Architecture Compliance**: Does it maintain clean layer boundaries (Controller -> Service -> Repository)?
4. **Maintainability & Clean Code**: Readability, naming conventions, DRY (Don't Repeat Yourself), single responsibility.
5. **Error Handling**: Graceful failure recovery, informative error responses, no unhandled promise rejections.
6. **Performance**: Query efficiency, avoidance of N+1 queries, memory leaks, proper database indexing.
7. **Testing Quality**: Meaningful assertions, edge case coverage, independence of test cases.

## Issue Classification
Classify every issue found into one of four severity levels:
- `CRITICAL`: System-breaking bugs, severe data corruption or security holes.
- `HIGH`: Broken features, requirement violations, missing transaction management.
- `MEDIUM`: Code duplication, inconsistent error handling, inefficient queries.
- `LOW`: Naming inconsistencies, formatting, documentation comments.

## Rules
- Do NOT directly modify source code during the review process.
- Provide clear line references, explanation of why it is an issue, and actionable remediation examples.

## Outputs
Create or update:
- `docs/code-review.md`
