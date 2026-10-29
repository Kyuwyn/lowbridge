# ADR-0037: The content expression language

## Status
Accepted

## Date
2026-10-29

## Last Verified
2026-10-29

## Decision Makers
Owner (Kyuwyn); drafted by Claude from the as-built code after the architecture review of 29 October 2026.

## Summary
Content writes its gates (`require`, `need`, breakthrough cores and pointers, event `when`, room doors) and many amounts as expression strings, and several ADRs rely on them (`g.t_<tag>` in ADR-0024, `g.<id>.attuned` in ADR-0023, expression-valued `mod` entries in ADR-0021 and ADR-0030), but no ADR fixed the language itself (TR-grammar-002). This ADR records it as built: a hand-written tokenizer, precedence parser and tree evaluator over numbers and booleans, with no function calls, no assignment and no access to anything but the paths the engine chooses to resolve, shared unchanged by the browser, the validator and the tests.

## Engine Compatibility

| Field | Value |
|-------|-------|
| **Engine** | None — TypeScript 7.0 on Bun 1.4.3, plain DOM |
| **Domain** | Core |
| **Layer** | Foundation |
| **Knowledge Risk** | LOW — pure TypeScript over standard ECMAScript (sticky regular expressions, `Map`); no toolchain or browser API is involved |
| **References Consulted** | `research/arcanum-reference/03-data-model.md` ("Expression strings"); `research/arcanum-reference/12-design-rules.md` rule 3 |
| **Post-Cutoff APIs Used** | None |
| **Verification Required** | None beyond the tests listed under Validation Criteria |

## ADR Dependencies

| Field | Value |
|-------|-------|
| **Depends On** | ADR-0021, ADR-0023, ADR-0024, ADR-0030, ADR-0036 |
| **Enables** | None |
| **Blocks** | None |
| **Ordering Note** | Records existing code. ADR-0021, 0023 and 0024 add path forms this language must resolve; ADR-0030 writes expression-valued `mod` entries; ADR-0036 keeps the engine, and so this evaluator, free of clock, DOM and randomness. |

## Context

### Problem Statement
Rule 3 of the reference (*copy*) puts gates and prices in data: "Gates and prices are expressions over state, so escalation and history are authored, not coded." The reference compiles "JavaScript-like expressions" at load and lets costs call `Math.floor` (`03-data-model.md`). Lowbridge copied the idea in its first slice: the implementation plan names "a restricted expression parser shared by runtime and validators", and design plan Part D gives the shape `expr := boolean over g.<id> (level/count), g.<id>.max, g.t_<key>, classes, reps`. Later ADRs then added path forms (`g.t_<tag>` counters, `g.<id>.attuned`) and expression-valued modifiers. None fixed what the language may contain, how it is kept safe, or what happens when an expression names something that does not exist. A change to any of these would alter every gate in content at once, with nothing to check it against.

### Constraints
- Content is data written by people and agents, and an imported save never carries expressions, but a content file is still untrusted text from the evaluator's point of view: it must not be able to reach browser globals or prototypes.
- No runtime dependencies (ADR-0036).
- The validator must be able to list every path an expression reads without evaluating it, to check references and route keys (ADR-0024's seam check).
- Expressions run inside `recompute`, which sweeps to a fixed point on every change (ADR-0021), so evaluation must be cheap and allocation-light.

### Requirements
- TR-grammar-002: a restricted expression language in data, one evaluator shared by runtime and validator.

## Decision

### 1. Grammar
`src/expression.ts` defines the whole language.

- **Values**: finite numbers (decimal, optional fraction and exponent) and the literals `true` and `false`. No strings, arrays, objects or `null`.
- **References**: an identifier, optionally dotted (`g.qi`, `g.qi.max`, `g.t_school_body`, `g.settle_breath.attuned`, `bank.cap`). A reference is a path handed to the caller's resolver; the language attaches no meaning to it.
- **Operators**, loosest to tightest: `||`; `&&`; `==` `!=` `===` `!==`; `<` `<=` `>` `>=`; `+` `-`; `*` `/` `%`; then the unary `!`, `+`, `-`, which bind tighter than every binary operator. Binary operators are left-associative; parentheses group.
- **Nothing else**: no function calls, no member calls, no indexing, no assignment, no ternary, no sequence (`;`). `Math.floor` and its kin are not available; an author who needs rounding writes the threshold instead.

### 2. Semantics
- `&&` and `||` short-circuit and return a boolean (not one of their operands, as JavaScript does). A reference on the side not taken is never resolved, so `true || g.missing` is `true`.
- Every other binary operator works on numbers: a boolean operand becomes 0 or 1. `==` and `===` are the same numeric equality, as are `!=` and `!==`.
- `!` returns a boolean; unary `+` and `-` return numbers.
- The operands and result of every arithmetic and comparison operator must be finite, or evaluation throws (division by zero, overflow). A bare reference, `!`, and the operands of `&&`/`||` are not checked by the evaluator; an amount is checked again by `GameEngine.value`, which refuses a non-finite result. A number literal that is not finite (`1e999`) is refused at parse time.
- `evaluateCondition(undefined)` is `true`: an absent gate is open.

### 3. Safety limits
The parser refuses, by throwing: an empty source or one over 4096 characters; more than 512 tokens; recursion deeper than 64 (counting each parenthesis, each unary operator and each right operand at a tighter precedence level); any character sequence that is not a token; any reference with a segment named `__proto__`, `prototype` or `constructor`; and trailing tokens after a complete expression. Parsed trees are cached by source text (at most 256 entries, oldest dropped first). The evaluator never calls `eval`, `new Function` or any host object; the only way out of an expression is the resolver.

### 4. Paths are the engine's, not the language's
`GameEngine.resolve` decides what a path means:

- `g.` is an optional prefix; `bank`, `bank.value` and `bank.seconds` read the bank's balance, `bank.max` and `bank.cap` its cap.
- `g.<id>` reads a record's `value`; `g.<id>.<field>` reads one stat field (`value`, `exp`, `reps`, `ticks`, `max`, `rate`, …); a boolean field reads as 0 or 1. More than two segments is an error.
- `g.<tag>` for a tag no record has as an id reads the count of owned records carrying that tag (ADR-0024). A tag takes no field other than `value` (`g.<tag>.value` is the same counter).
- `g.<id>.attuned` reads 1 while that method holds an attunement place, else 0 (ADR-0023).
- Anything else (an unknown id, an unknown field) throws at evaluation.

The validator mirrors these rules: `expressionReferences` lists every path in an expression, and `checkReference` in `scripts/validate.ts` refuses, without evaluating, an unknown record, a field other than `value` on a tag counter, `attuned` on a record without `attune`, and any field outside its fixed list of twelve stat fields. (Elsewhere the validator does evaluate gates, with a stub resolver, to find records that gate on themselves.) It runs over every expression-carrying field: `require`, `need`, breakthrough `core` and pointer `when`, event `when`, room `need`, and every string value in modifier and effect maps.

### 5. One implementation
The engine (and through it the browser and `scripts/routes.ts`), `scripts/validate.ts` and `bun test` use the same `parseExpression`, `evaluateExpression`, `evaluateCondition` and `expressionReferences` from `src/expression.ts`. There is no second parser. Two engine methods read the parsed tree's shape directly:

- `atLimitWall` splits a `need` at every `&&` and `||` into atoms and evaluates each on its own, to decide whether a locked row is a wall the interface should hide (it gathers each atom's references with its own walk). Because it evaluates every atom, it does not honour §2's short-circuit: an atom that is only safe behind its guard (`g.b / g.a` behind `g.a > 0`) can throw here.
- `pointerProgress` recognises a breakthrough pointer of the form `g.x >= N` to show progress toward it.

The `ExpressionNode` shape is therefore an interface, not an internal detail.

### Architecture Diagram

```
 content JSON string ──► parseExpression ──► cached tree (≤256)
   ("g.lore >= 4 &&            │  tokens ≤512, depth ≤64, no __proto__/prototype/constructor
     g.t_furnished >= 1")      ▼
                         evaluateExpression(tree, resolve) ──► number | boolean (finite)
                               │ every reference
                               ▼
                    GameEngine.resolve(path)   ── bank / g.<id>[.field] / g.<tag> / g.<id>.attuned
 scripts/validate.ts ── expressionReferences(source) ──► checkReference(path)   (no evaluation)
```

### Key Interfaces
- `parseExpression(source: string): ExpressionNode`
- `evaluateExpression(source: string | ExpressionNode, resolve: ExpressionResolver): number | boolean`
- `evaluateCondition(source: string | undefined, resolve): boolean`
- `expressionReferences(source: string): string[]`
- `ExpressionResolver = (path: string) => number | boolean`; the engine's is `GameEngine.resolve`.
- `ExpressionNode` (`literal`, `reference`, `unary`, `binary`), read by `atLimitWall` and `pointerProgress`; changing its shape changes this ADR.

### Implementation Guidelines
- Expressions must be parsed and evaluated only through `src/expression.ts`; there must never be a second parser, and never `eval` or `new Function` on content.
- The language must stay closed: adding an operator, a literal type or a function is a change to this ADR, and the validator's reference check must learn any new path form in the same change.
- A new path form must be added to `GameEngine.resolve` and to `checkReference` together.
- Content must not rely on JavaScript's `&&`/`||` returning an operand, or on string comparison; both are absent.
- Guards against prototype access, size and depth must stay in the parser, not in callers.
- Every atom of a `need` (each operand of `&&`/`||`) must evaluate safely on its own, since `atLimitWall` evaluates atoms without short-circuit; or `atLimitWall` must catch the error. Content must not hide a division or an unknown path behind a guard inside a `need`.
- A change to `ExpressionNode`'s shape must update `atLimitWall`, `pointerProgress` and `expressionReferences` in the same change.
- Enforcement: the grammar and its limits are enforced by the parser itself; the path rules by `checkReference` in `bun run validate`; "one implementation" by code review.

## Alternatives Considered

### Alternative 1: JavaScript via `new Function` with a guarded scope
- **Description**: Compile each content string as a JavaScript function over a `g` proxy, as the reference does with its "JavaScript-like expressions compiled at load".
- **Pros**: The whole of JavaScript, including `Math.floor`, ternaries and string tests, with no parser to maintain; reference content would port as written.
- **Cons**: A content string can reach globals, prototypes and side effects unless the scope is sealed perfectly; the validator cannot list a string's references without executing or separately parsing it; a Content Security Policy without `unsafe-eval` would break the game.
- **Rejection Reason**: The validator's reference and seam checks need the references without running the code, and safety would rest on a sandbox rather than on a grammar that cannot express an escape.

### Alternative 2: Structured JSON conditions
- **Description**: Write gates as JSON trees, for example `{ "and": [{ "gte": ["lore", 4] }, …] }`.
- **Pros**: No parser at all; trivially walkable.
- **Cons**: Gates become several times longer and much harder to read and review in content files; amounts such as `"3 * (g.circulation >= 4)"` (ADR-0030) become nested objects.
- **Rejection Reason**: Rule 3's point is that authors write the gate as they think it; a string with a small grammar keeps that and is still walkable once parsed.

### Alternative 3: A third-party expression library
- **Description**: Use a published expression parser and evaluator.
- **Pros**: Tested code; richer grammar if wanted.
- **Cons**: A runtime dependency, against ADR-0036; its grammar would be larger than content needs, and its safety model would have to be audited instead of read in 125 lines.
- **Rejection Reason**: ADR-0036 rules out runtime dependencies, and the language is small enough to own.

## Consequences

### Positive
- Content cannot reach anything the engine does not resolve, so a content file cannot run code.
- The validator checks every reference without evaluating, which is what makes ADR-0024's seam check and the route-key checks possible.
- One grammar for gates and amounts: an author learns it once.
- Parsed trees are cached, so `recompute`'s repeated evaluation pays for parsing once per source string.

### Negative
- No rounding or minimum/maximum functions: an escalating price that wants `Math.floor` has to be written as thresholds (`at`, `every`) or a different formula. This narrows the reference's rule 3, which allows such calls.
- Errors from an unknown path surface at evaluation in play, not at parse; only the validator catches them before release.
- The cache keys by source string, so two spellings of one expression parse twice (harmless at 256 entries).

## Risks
- **An unvalidated content change ships a broken path.** Play throws on the first evaluation of an unknown id. Mitigation: `bun run validate` checks every reference; the deploy workflow does not run it yet (ADR-0036's ungated-deploy risk).
- **A guarded `need` throws in `atLimitWall`.** It evaluates every atom of a `need` on its own, so `g.a > 0 && g.b / g.a >= 1` evaluates fine in play but throws when the interface asks whether the row is a wall. No content does this today. Mitigation: the guideline above; a validator check that evaluates every `need` atom against a fresh engine would make it mechanical.
- **`resolve` and `checkReference` drift.** They encode the same path rules differently: `checkReference` accepts a fixed list of twelve stat fields, while `resolve` accepts any field the stat object has (`Object.hasOwn`); and `g.<id>.attuned` on a record without `attune` reads 0 at runtime but is a validation error. Mitigation: the guideline that a new path form changes both together, and the required test below.
- **Boolean/number coercion surprises an author.** `g.flag == true` compares 1 with 1 and works, but `g.count == true` is true only at exactly 1. Mitigation: content convention compares numbers (`> 0`, `>= 1`).
- **Unary precedence surprises an author.** `!g.x >= 1` parses as `(!g.x) >= 1`, as in JavaScript. Mitigation: content convention writes `g.x < 1` or `!(g.x >= 1)`.

## GDD Requirements Addressed

| GDD System | Requirement | How This ADR Addresses It |
|------------|-------------|--------------------------|
| Content grammar and expressions (`design/gdd/systems-index.md`; source design plan Part D, implementation plan) | TR-grammar-002: a restricted expression language in data, one evaluator shared by runtime and validator | §1–§5 |
| Content grammar (ADR-0023, ADR-0024) | TR-grammar-003, TR-grammar-004 (already covered): `g.t_<tag>` and `g.<id>.attuned` | §4 records how both resolve and how the validator checks them |
| Pacing and validation | TR-pacing-003 (already covered): the validator plays the real engine | §5: the validator and the engine share the evaluator |

No system GDD exists; the requirement IDs are those in `docs/architecture/tr-registry.yaml`.

## Performance Implications
- **CPU**: Parsing is cached; evaluation is a tree walk with one resolver call per reference. No budget is set here (TR-fight-005).
- **Memory**: At most 256 cached trees.
- **Load Time**: Negligible.
- **Network**: None.

## Migration Plan
None. This records `src/expression.ts`, `GameEngine.resolve` and `checkReference` as they stand at commit 733723a.

## Validation Criteria
- Existing: `tests/engine.test.ts` "restricted shared expression evaluator" checks precedence, short-circuiting past an unknown reference, reference listing, and refusal of assignment, calls, `__proto__`, trailing code, `1e999`, an unclosed parenthesis and division by zero.
- Required, in `tests/engine.test.ts`: every path form `checkReference` accepts resolves in a fresh engine over the real content.
- To add, in `tests/engine.test.ts`: the size and depth limits (4097 characters, 513 tokens, 65 nested `(` or `!`).

## Related
- ADR-0021 (expression-valued modifiers in `recompute`), ADR-0023 (`g.<id>.attuned`), ADR-0024 (`g.t_<tag>` and the seam check), ADR-0030 (expression `mod` entries on Directions), ADR-0036 (no runtime dependencies; the engine reads no clock or randomness).
- `research/arcanum-reference/12-design-rules.md` rule 3 (*copy*, narrowed: no function calls).
- `docs/architecture/architecture-review-2026-10-29.md` (Required ADR 3).
