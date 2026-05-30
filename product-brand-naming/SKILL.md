---
name: product-brand-naming
description: Product, startup, SaaS, AI app, API, devtool, and digital-product naming workflow for market-informed brand naming. Use this whenever the user asks to name or rename a product or company, choose a domain, validate brand-name candidates, compare product names, check domain availability, research competitor naming patterns, do obvious same-name search, or perform preliminary trademark/conflict screening before launch.
---

# Product Brand Naming

## Overview

Use this skill to create commercially usable brand-name shortlists for SaaS products, AI apps, API products, devtools, marketplaces, content products, and other digital businesses. The workflow is repeatable: scan the market, clarify positioning, generate candidates, screen obvious conflicts, check domains, flag trademark risk, and return a ranked decision table.

This skill is for product and brand planning, not legal advice. Trademark findings are preliminary risk signals only; recommend counsel review before public launch, Stripe setup, OAuth app verification, legal pages, or paid acquisition.

## Workflow

### 0. Scan the market landscape

Read `references/market-scan.md` before generating names when the task involves a real product category, launch decision, or domain purchase.

If browsing is available, search current competitors and adjacent products first. If browsing is unavailable, use known competitors plus any user-provided examples and clearly label the scan as limited.

Capture:

- Competitors and adjacent products
- Their names, domains, taglines, and categories
- Naming patterns used in the category
- Overcrowded words and weakly differentiated patterns
- Risk words that imply certification, legal certainty, regulated status, or guarantees
- Naming whitespace: credible directions that are still underused

Use the scan to shape candidate generation. Do not copy competitor names, imitate distinctive coined names too closely, or recommend a name only because the domain appears available.

### 1. Build the naming brief

Extract the brief from the conversation first. If important fields are missing, ask only the highest-impact question.

Capture:

- Product category and ICP
- Product shape: SaaS, AI app, API, devtool, plugin, marketplace, service, open-source project, etc.
- Primary job-to-be-done
- Desired tone: technical, trustworthy, premium, friendly, sharp, enterprise, etc.
- Words to include or avoid
- Legal/claims constraints, especially words that imply certification, compliance, guarantees, or regulated status
- Preferred TLDs and launch markets
- Competitors and adjacent categories

### 2. Generate candidates in lanes

Generate 25-60 candidates before screening. Use several lanes so the list does not collapse into one naming pattern:

- Descriptive: clear category signal, e.g. `ConsentProbe`
- Evocative: implies outcome or operating model, e.g. `SignalVault`
- Compound: two familiar words, e.g. `TagRadar`
- Invented/lightly coined: brandable but still pronounceable, e.g. `Consento`
- Future-proof: works if the product grows beyond the initial feature

Avoid names that:

- Overpromise legal certainty: `Compliant`, `Certified`, `Proof`, `Legal`
- Are too narrow for the roadmap unless deliberately scoped: `Pixel` when the product audits cookies, storage, requests, CMPs, and GPC too
- Are hard to say, spell, or hear over a call
- Depend on punctuation, unusual capitalization, or exact stylization to make sense

### 3. Screen domains

Use `scripts/check-domains.mjs` for the first pass:

```bash
node /path/to/product-brand-naming/scripts/check-domains.mjs ConsentProbe ConsentRadar --tlds=com,io,app
```

Interpret results conservatively:

- `likely_available`: no registration found via RDAP/WHOIS signal; verify at a registrar before recommending purchase
- `registered`: likely unavailable or requires acquisition
- `unknown`: do not treat as available; re-check manually or with a registrar

Prefer `.com` for the primary brand if feasible. Treat `.io`, `.app`, or category TLDs as acceptable fallbacks only if the user understands the tradeoff.

### 4. Screen obvious conflicts

For finalists, run exact-match searches and adjacent-category searches:

- `"Name"`
- `"Name" SaaS`
- `"Name" software`
- `"Name" app`
- `"Name" trademark`
- `"Name" + category keyword`
- Domain string, e.g. `"name.com"`

If available and relevant, check USPTO, WIPO Global Brand Database, EUIPO, Companies House, GitHub, npm, X, LinkedIn, Product Hunt, and app marketplaces.

### 5. Score and shortlist

Read `references/scorecard.md` when producing a ranked table or making a recommendation.

Score each finalist on:

- Category clarity
- Brand distinctiveness
- Memorability and pronunciation
- Domain strength
- Search uniqueness
- Trademark/conflict risk
- Roadmap fit
- Claim-safety

### 6. Output format

Return:

1. Naming brief summary
2. Market naming scan summary
3. Naming pattern takeaways and whitespace
4. Top 5-10 ranked candidates
5. Domain status table
6. Conflict/trademark-risk notes
7. Recommendation and backup option
8. Next actions before adopting the name

Use direct risk language:

- `low obvious conflict found` means only no obvious issue found in quick screening
- `needs manual verification` means domain/search data is incomplete
- `higher legal/name risk` means do not use without deeper review

## Optional External Skills

If these skills are installed, use them as supporting references; do not require them:

- `product-name` for product naming framing
- `brand-naming-strategies` for naming lanes
- `domain-name-brainstormer` for domain variants
- `search-domain-validator` for availability checks
- `trademark-search` or `uspto-database` for trademark screening

If they are not installed, proceed with this skill's workflow and available web/RDAP/WHOIS tools.
