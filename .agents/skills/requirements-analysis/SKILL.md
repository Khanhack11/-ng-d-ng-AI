---
name: requirements-analysis
description: Analyze software requirements and transform natural-language requirements into structured functional requirements, non-functional requirements, user stories, acceptance criteria, and traceability information.
---

# Requirements Analysis Skill

## Objective
Analyze software requirements systematically and produce a structured specification suitable for subsequent architecture, database, implementation, and testing activities.

## Inputs
Read the following project artifacts when available:
- `docs/customer-requirement.md`
- Business requirements and user requests
- Existing requirements documentation
- Project constraints

## Process
### 1. Identify stakeholders
Identify all stakeholders relevant to the system (Customers, Store Managers, Admins, Developers).

### 2. Identify actors
Identify actors interacting with the system and their respective roles.

### 3. Identify functional requirements (FR)
Convert explicit business needs into functional requirements with unique IDs:
- `FR-001`: User authentication & authorization
- `FR-002`: Product catalog browsing & search
- `FR-003`: Shopping cart management & checkout
- `FR-004`: Order tracking & status updates
- `FR-005`: AI Chatbot product consultation & recommendation

### 4. Identify non-functional requirements (NFR)
Identify requirements related to:
- Performance (response time < 2s, search retrieval < 500ms)
- Security (SQL injection prevention, password hashing, parameterized queries)
- Reliability & availability
- Usability & responsiveness across devices
Use IDs: `NFR-001`, `NFR-002`, ...

### 5. Identify business rules
List business rules explicitly stated by requirements:
- Prices must be in VND.
- Out-of-stock items cannot be purchased beyond available quantity.
- Do not invent undocumented business rules.

### 6. Identify assumptions
Separate assumptions from verified requirements clearly.

### 7. Identify ambiguities
Identify requirements that are ambiguous, incomplete, contradictory, or non-testable.

### 8. Create user stories
Standard format:
> As a `<role>`, I want `<capability>`, so that `<benefit>`.

### 9. Create acceptance criteria
Each user story must have concrete, testable acceptance criteria (Gherkin format: Given - When - Then).

### 10. Traceability
Every user story must map to at least one Functional Requirement ID.

## Rules
- Do NOT write source code.
- Do NOT design database schemas in this skill.
- Do NOT make architectural choices in this skill.
- Clearly distinguish requirements from assumptions.

## Outputs
Create or update:
- `docs/requirements.md`
- `docs/user-stories.md`
- `docs/acceptance-criteria.md`
- `docs/requirements-issues.md`

## Verification
Before completing verification:
- All functional requirements have IDs.
- All non-functional requirements have IDs.
- User stories trace back to requirements.
- Acceptance criteria are verifiable and testable.
