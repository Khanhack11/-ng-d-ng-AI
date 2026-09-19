---
name: product-retrieval
description: Retrieve matching products from database using parameterized queries derived from structured user intent.
---

# Product Retrieval Skill

## Objective
Query product database securely and efficiently based on structured intent criteria extracted from customer queries.

## Input
Structured intent object:
```json
{
  "category": "string | null",
  "brands": "string[]",
  "min_price": "number | null",
  "max_price": "number | null",
  "min_warranty": "number | null",
  "keywords": "string[]"
}
```

## Retrieval Process
1. Build parameterized SQL statement dynamically based on present filters.
2. Apply category filter (`category_id` or `c.name LIKE @category`).
3. Apply price range filter (`p.price >= @min_price AND p.price <= @max_price`).
4. Apply keyword / name matching using parameterized wildcards (`@kw`).
5. Only select approved products (`p.approval_status = 'APPROVED'`).
6. Apply ordering (default: by popularity, rating, or price).
7. Enforce pagination limit (`LIMIT 10` or `TOP 10`).

## Security & Performance Rules
- **NEVER** use string concatenation or template interpolation into SQL clauses. Always use parameterized queries (`@param` with explicit SQL types).
- Do NOT retrieve the entire database into memory.
- Do NOT transmit full raw database dumps to the LLM.
- If no matching products exist, return an empty array `[]` gracefully without throwing exceptions.

## Output Format
```json
[
  {
    "id": 3,
    "name": "Áo Hoodie Streetwear Unisex",
    "categoryName": "Áo khoác & Hoodie",
    "price": 420000,
    "stock": 45,
    "image_url": "https://images.unsplash.com/..."
  }
]
```
