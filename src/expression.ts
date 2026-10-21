export type ExpressionValue = number | boolean;
export type ExpressionResolver = (path: string) => ExpressionValue;
export type ExpressionNode =
  | { kind: "literal"; value: ExpressionValue }
  | { kind: "reference"; path: string }
  | { kind: "unary"; operator: string; operand: ExpressionNode }
  | { kind: "binary"; operator: string; left: ExpressionNode; right: ExpressionNode };

const precedence: Record<string, number> = {
  "||": 1, "&&": 2, "==": 3, "!=": 3, "===": 3, "!==": 3,
  "<": 4, "<=": 4, ">": 4, ">=": 4,
  "+": 5, "-": 5, "*": 6, "/": 6, "%": 6,
};
const cache = new Map<string, ExpressionNode>();

/** Deliberately small grammar: literals, references, arithmetic, comparisons, logic. */
export function parseExpression(source: string): ExpressionNode {
  const cached = cache.get(source);
  if (cached) return cached;
  if (!source.trim() || source.length > 4096) throw new Error("Expression must contain 1-4096 characters.");
  const tokens: string[] = [];
  const tokenPattern = /\s*(?:(\d+(?:\.\d*)?(?:[eE][+-]?\d+)?|\.\d+(?:[eE][+-]?\d+)?)|([A-Za-z_][A-Za-z_0-9]*(?:\.[A-Za-z_][A-Za-z_0-9]*)*)|(===|!==|&&|\|\||==|!=|<=|>=|[()+\-*/%!<>]))/y;
  let offset = 0;
  while (offset < source.length) {
    if (!source.slice(offset).trim()) break;
    tokenPattern.lastIndex = offset;
    const token = tokenPattern.exec(source);
    if (!token) throw new Error(`Invalid expression token at character ${offset + 1}.`);
    tokens.push(token[1] ?? token[2] ?? token[3]!);
    offset = tokenPattern.lastIndex;
    if (tokens.length > 512) throw new Error("Expression is too complex.");
  }
  let cursor = 0;
  function parse(minimum = 1, depth = 0): ExpressionNode {
    if (depth > 64) throw new Error("Expression nesting is too deep.");
    const token = tokens[cursor++];
    let left: ExpressionNode;
    if (token === "!" || token === "+" || token === "-") {
      left = { kind: "unary", operator: token, operand: parse(7, depth + 1) };
    } else if (token === "(") {
      left = parse(1, depth + 1);
      if (tokens[cursor++] !== ")") throw new Error("Expression is missing a closing parenthesis.");
    } else if (token === "true" || token === "false") {
      left = { kind: "literal", value: token === "true" };
    } else if (token && /^(?:\d|\.\d)/.test(token)) {
      const value = Number(token);
      if (!Number.isFinite(value)) throw new Error("Expression number must be finite.");
      left = { kind: "literal", value };
    } else if (token && /^[A-Za-z_]/.test(token)) {
      if (token.split(".").some(part => ["__proto__", "prototype", "constructor"].includes(part))) {
        throw new Error("Forbidden expression reference.");
      }
      left = { kind: "reference", path: token };
    } else {
      throw new Error(`Expected a value, received ${token ?? "end of expression"}.`);
    }
    while (cursor < tokens.length) {
      const operator = tokens[cursor]!;
      const priority = precedence[operator];
      if (priority === undefined || priority < minimum) break;
      cursor++;
      left = { kind: "binary", operator, left, right: parse(priority + 1, depth + 1) };
    }
    return left;
  }
  const result = parse();
  if (cursor !== tokens.length) throw new Error(`Unexpected expression token ${tokens[cursor]}.`);
  if (cache.size >= 256) cache.delete(cache.keys().next().value!);
  cache.set(source, result);
  return result;
}

function numeric(value: ExpressionValue): number {
  const number = typeof value === "boolean" ? Number(value) : value;
  if (!Number.isFinite(number)) throw new Error("Expression produced a non-finite value.");
  return number;
}

export function evaluateExpression(source: string | ExpressionNode, resolve: ExpressionResolver): ExpressionValue {
  const node = typeof source === "string" ? parseExpression(source) : source;
  function visit(current: ExpressionNode): ExpressionValue {
    if (current.kind === "literal") return current.value;
    if (current.kind === "reference") return resolve(current.path);
    if (current.kind === "unary") {
      const value = visit(current.operand);
      if (current.operator === "!") return !value;
      return current.operator === "-" ? -numeric(value) : numeric(value);
    }
    const left = visit(current.left);
    if (current.operator === "&&") return Boolean(left) && Boolean(visit(current.right));
    if (current.operator === "||") return Boolean(left) || Boolean(visit(current.right));
    const right = visit(current.right);
    const a = numeric(left), b = numeric(right);
    switch (current.operator) {
      case "+": return numeric(a + b);
      case "-": return numeric(a - b);
      case "*": return numeric(a * b);
      case "/": return numeric(a / b);
      case "%": return numeric(a % b);
      case "<": return a < b;
      case "<=": return a <= b;
      case ">": return a > b;
      case ">=": return a >= b;
      case "==": case "===": return a === b;
      case "!=": case "!==": return a !== b;
      default: throw new Error(`Unsupported expression operator ${current.operator}.`);
    }
  }
  return visit(node);
}

export function evaluateCondition(source: string | undefined, resolve: ExpressionResolver): boolean {
  return source === undefined || Boolean(evaluateExpression(source, resolve));
}

export function expressionReferences(source: string): string[] {
  const found = new Set<string>();
  function visit(node: ExpressionNode): void {
    if (node.kind === "reference") found.add(node.path);
    else if (node.kind === "unary") visit(node.operand);
    else if (node.kind === "binary") { visit(node.left); visit(node.right); }
  }
  visit(parseExpression(source));
  return [...found];
}
