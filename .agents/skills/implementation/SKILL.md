---
name: implementation
description: Implement software features and components according to approved requirements, architecture, and database design.
---

# Implementation Skill

## Objective
Implement features following approved architectural and database specifications with high code quality, testability, and adherence to clean code standards.

## Inputs
Read:
- `docs/requirements.md`
- `docs/architecture.md`
- `docs/database-design.md`

## Process
1. **Read Specification**: Understand requirements and acceptance criteria before writing code.
2. **Understand Architecture**: Identify layer boundaries (Controller -> Service -> Repository -> Database).
3. **Understand Database**: Consult schema, tables, types, and constraints.
4. **Implement**:
   - Write clean, modular, and maintainable code.
   - Separate concerns cleanly.
   - Use parameterized SQL queries for all DB access.
   - Implement robust error handling with informative status codes.
5. **Run Linter / Type Checker**: Ensure zero compilation or type errors (`tsc --noEmit`, ESLint).
6. **Run Tests**: Execute unit tests and verify all test cases pass.
7. **Review Diff**: Review git diff before submitting changes.

## Rules
- Do NOT alter approved requirements or architecture without explicit human approval.
- If specification is ambiguous or incomplete, STOP and report rather than guessing.
- Do NOT hard-code secrets, API keys, or connection credentials. Use `.env`.
- Report all modified files and key technical decisions.

## Outputs
- Source code in respective directories (`controllers/`, `services/`, `repositories/`, `components/`).
- Accompanying unit tests.
