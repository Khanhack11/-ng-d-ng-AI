---
name: database-design
description: Design normalized, performant, and secure relational database schemas based on approved requirements and architecture.
---

# Database Design Skill

## Objective
Design and maintain a relational database schema supporting all functional requirements, ensuring data integrity, 3NF normalization, and optimized search performance for AI/Chatbot retrieval.

## Inputs
Read:
- `docs/requirements.md`
- `docs/architecture.md`

## Process
1. **Identify entities**: Users, Roles, Customers, Sellers, Categories, Products, Carts, CartItems, Orders, OrderItems, Payments.
2. **Define relationships**:
   - `Roles` 1 — N `Users`
   - `Users` 1 — 1 `Customers` / `Sellers`
   - `Categories` 1 — N `Products`
   - `Customers` 1 — 1 `Carts`
   - `Carts` 1 — N `CartItems` N — 1 `Products`
   - `Customers` 1 — N `Orders` 1 — N `OrderItems`
3. **Apply normalization**: Achieve 3NF (Third Normal Form) to eliminate data redundancy and anomalies.
4. **Define Keys**: Assign explicit Primary Keys (PK) with auto-increment/identity and Foreign Keys (FK) with referential integrity.
5. **Enforce constraints**: NOT NULL, UNIQUE (e.g. user email), CHECK constraints (e.g. price >= 0, stock >= 0), DEFAULT values.
6. **Design indexes**:
   - Clustered index on Primary Keys.
   - Non-clustered indexes on search fields: `Products(category_id)`, `Products(price)`, `Products(name)`, `Users(email)`.
7. **Generate DDL Scripts**: Output clean, standard SQL scripts (`schema.sql`).
8. **Verification**: Verify that all attributes required by the FRs are adequately stored.

## Rules
- Do NOT write application backend code in this skill.
- NEVER store plain-text passwords; ensure schema accounts for password hashes.
- Always include timestamps (`created_at`, `updated_at`) where temporal tracking is required.

## Outputs
Create or update:
- `docs/database-design.md`
- `database/schema.sql` (or `szshop-backend/database.sql`)
