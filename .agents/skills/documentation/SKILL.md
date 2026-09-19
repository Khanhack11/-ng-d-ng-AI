---
name: documentation
description: Generate and maintain comprehensive, synchronized technical documentation reflecting actual system implementation.
---

# Documentation Skill

## Objective
Ensure all project documentation accurately and completely reflects the actual state of the codebase, APIs, architecture, database schemas, and operational procedures.

## Inputs
Read:
- Entire project codebase (`routes/`, `services/`, `controllers/`, `repositories/`, `components/`)
- Existing documentation in `docs/` and root `README.md`
- Database schema and seed data

## Process
1. **Audit Implementation**: Inspect implemented APIs, database tables, and UI flows.
2. **Synchronize API Docs**: Document each endpoint, HTTP method, request headers/body, response format, and error codes.
3. **Synchronize Architecture Docs**: Update component diagrams and data flow diagrams.
4. **Update Database Reference**: Document all tables, relationships, indexes, and sample data.
5. **Update Deployment & Run Guide**: Detail environment variables, prerequisites (Node.js, SQL Server, ports), and step-by-step startup commands.
6. **Maintain User & Developer Guides**: Provide instructions for end users, store sellers, and administrators.

## Rules
- Do NOT document functions or endpoints that have not yet been implemented.
- Do NOT include outdated or broken instructions.
- Keep documentation clean, clear, and formatted in GitHub Flavored Markdown.

## Outputs
Synchronize and update:
- `README.md`
- `docs/api.md`
- `docs/architecture.md`
- `docs/database-design.md`
- `docs/deployment.md`
- `docs/user-guide.md`
