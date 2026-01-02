import { ZodError } from "zod";

function getFormattedZodIssuePath(
  path: ZodError["issues"][number]["path"]
): string {
  // Zod path: path: ["senses", 0, "definition"]
  // Expected path: senses[0].definition
  return path.length === 0
    ? "input"
    : path
        .map((segment, index) =>
          typeof segment === "number"
            ? `[${segment}]`
            : index === 0
            ? segment
            : `.${String(segment)}`
        )
        .join("");
}

export function getFormattedZodIssue(
  issue: ZodError["issues"][number]
): string {
  return `${issue.message} at ${getFormattedZodIssuePath(issue.path)}`;
}
