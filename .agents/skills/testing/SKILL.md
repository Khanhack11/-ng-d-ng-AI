---
name: testing
description: Plan, design, implement, and execute automated test suites (unit, integration, regression) to ensure system reliability and requirement compliance.
---

# Testing Skill

## Objective
Verify that implementation satisfies all functional and non-functional requirements through rigorous automated testing and test reporting.

## Inputs
Read:
- `docs/requirements.md`
- `docs/user-stories.md`
- `docs/acceptance-criteria.md`
- Source code implementation

## Process
1. **Requirements Analysis for Test Scope**: Map all FRs and Acceptance Criteria to test targets.
2. **Design Test Scenarios**: Identify happy paths, boundary values, error scenarios, and edge cases.
3. **Write Test Cases**:
   - ID, Description, Preconditions, Input Data, Expected Output.
4. **Implement Automated Tests**:
   - Unit tests for Services and Utility functions.
   - API integration tests for endpoints (`POST /api/chat`, `GET /api/products`, `POST /api/orders`).
5. **Execute Test Suite**: Run tests (`npm test` or `pytest`) and collect logs.
6. **Defect & Failure Analysis**: Diagnose root cause of any failed tests.
7. **Coverage Verification**: Ensure all acceptance criteria are covered.

## Rules
- Do NOT modify test assertions just to force tests to pass without fixing the underlying bug.
- Test negative cases and input boundaries thoroughly (e.g. negative prices, empty search strings, missing fields).
- Document pass/fail statistics transparently.

## Outputs
Create or update:
- `docs/test-plan.md`
- `docs/test-report.md`
- Test files under `tests/` directory
