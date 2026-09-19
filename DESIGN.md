# Shopee Việt Nam

## Mission
Create implementation-ready, token-driven UI guidance for Shopee Việt Nam that is optimized for consistency, accessibility, and fast delivery across e-commerce storefront.

## Brand
- Product/brand: Shopee Việt Nam
- URL: https://shopee.vn/
- Audience: online shoppers and consumers
- Product surface: e-commerce storefront

## Style Foundations
- Visual style: clean, functional, implementation-oriented
- Main font style: `font.family.primary=SHPBurmese`, `font.family.stack=SHPBurmese, SHPKhmer, Helvetica Neue, Helvetica, Arial, 文泉驛正黑, WenQuanYi Zen Hei, Hiragino Sans GB, 儷黑 Pro, LiHei Pro, Heiti TC, 微軟正黑體, Microsoft JhengHei UI, Microsoft JhengHei, sans-serif`, `font.size.base=14px`, `font.weight.base=400`, `font.lineHeight.base=16.8px`
- Typography scale: `font.size.xs=12px`, `font.size.sm=13px`, `font.size.md=14px`, `font.size.lg=17px`
- Color palette: `color.surface.base=#000000`, `color.text.secondary=#0000ee`, `color.surface.muted=#ffffff`, `color.text.inverse=#0284C7`, `color.surface.raised=#f5f5f5`, `color.border.strong=rgba(0, 0, 0, 0.87) rgba(0, 0, 0, 0.05) rgba(0, 0, 0, 0.05) rgba(0, 0, 0, 0.87)`
- Spacing scale: `space.1=4px`, `space.2=5px`, `space.3=6px`, `space.4=10px`, `space.5=13px`, `space.6=20px`, `space.7=40px`
- Radius/shadow/motion tokens: `motion.duration.instant=100ms`, `motion.duration.fast=200ms`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
Concise, confident, implementation-focused.

## Rules: Do
- Use semantic tokens, not raw hex values, in component guidance.
- Every component must define states for default, hover, focus-visible, active, disabled, loading, and error.
- Component behavior should specify responsive and edge-case handling.
- Interactive components must document keyboard, pointer, and touch behavior.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.
- Do not ship component guidance without explicit state rules.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and semantic tokens.
3. Define component anatomy, variants, interactions, and state behavior.
4. Add accessibility acceptance criteria with pass/fail checks.
5. Add anti-patterns, migration notes, and edge-case handling.
6. End with a QA checklist.

## Required Output Structure
- Context and goals.
- Design tokens and foundations.
- Component-level rules (anatomy, variants, states, responsive behavior).
- Accessibility requirements and testable acceptance criteria.
- Content and tone standards with examples.
- Anti-patterns and prohibited implementations.
- QA checklist.

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.
- Include known page component density: links (661), buttons (17), lists (13), navigation (2), inputs (1).


## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Teams should prefer system consistency over local visual exceptions.
