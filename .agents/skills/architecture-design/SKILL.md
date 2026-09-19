---
name: architecture-design
description: Design software architecture from approved requirements while preserving traceability and documenting architectural decisions.
---

# Architecture Design Skill

## Objective
Transform approved software requirements into a coherent, modular, and extensible software architecture.

## Inputs
Read:
- `docs/requirements.md`
- `docs/user-stories.md`
- `docs/acceptance-criteria.md`

Only use approved requirements as the architectural baseline.

## Process
1. **Identify architectural style**: Layered Architecture, Client-Server, RESTful API, RAG Pattern.
2. **Identify major components**: Frontend (React/Vite), Backend API (Express.js/Node.js), Database (SQL Server/MySQL), AI Engine (Gemini / AI Skill Engine).
3. **Define responsibilities**: Clear separation of concerns between Controller, Service, Repository, and Presentation layers.
4. **Define component dependencies**: Dependency direction must always point inward toward business logic.
5. **Define communication contracts**: REST JSON endpoints, status codes, payload schemas.
6. **Define data flow**: Request lifecycle from User Query -> API Controller -> Service Layer -> Repository / DB -> Response.
7. **Identify external systems**: Payment Gateways (VietQR, MoMo), External AI APIs (Google Gemini).
8. **Identify security boundaries**: Authentication tokens, CORS policy, SQL parameterization layer, input sanitization.
9. **Document architectural decisions (ADR)**: Record context, options considered, chosen solution, and rationale.
10. **Traceability check**: Validate that every FR has a designated component responsible for its execution.

## Rules
- Do NOT implement application source code in this skill.
- Do NOT modify approved requirements without explicit review.
- Do NOT introduce unnecessary technologies or premature complexity.
- Every architectural decision must document clear rationale.

## Outputs
Create or update:
- `docs/architecture.md`
- `docs/architecture-decisions.md`

## Verification
Verify that every major functional requirement is mapped to at least one architectural component.
