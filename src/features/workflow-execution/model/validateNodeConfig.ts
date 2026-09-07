import type { WorkflowNode } from "@/entities/workflow/model";

export function validateNodeConfig(node: WorkflowNode): string[] {
  const errors: string[] = [];

  switch (node.type) {
    case "start": {
      if (!node.config.triggerType) {
        errors.push(`Start "${node.label}" must have a trigger type.`);
      }

      break;
    }

    case "action": {
      if (node.config.actionType === "http_request") {
        const endpoint = node.config.endpoint?.trim();

        if (!endpoint) {
          errors.push(`Action "${node.label}": HTTP endpoint is required.`);
        } else {
          try {
            const url = new URL(endpoint);

            if (!["http:", "https:"].includes(url.protocol)) {
              errors.push(
                `Action "${node.label}": endpoint must use HTTP or HTTPS.`,
              );
            }
          } catch {
            errors.push(
              `Action "${node.label}": endpoint must be a valid URL.`,
            );
          }
        }
      }

      const retryCount = node.config.retryCount ?? 0;

      if (!Number.isInteger(retryCount) || retryCount < 0 || retryCount > 5) {
        errors.push(
          `Action "${node.label}": retryCount must be an integer between 0 and 5.`,
        );
      }

      break;
    }

    case "condition": {
      const validOperators = [
        "equals",
        "not_equals",
        "greater_than",
        "less_than",
        "contains",
      ];

      if (!node.config.field?.trim()) {
        errors.push(`Condition "${node.label}": field is required.`);
      }

      if (!validOperators.includes(node.config.operator)) {
        errors.push(
          `Condition "${node.label}": unsupported operator "${node.config.operator}".`,
        );
      }

      if (node.config.value === undefined || node.config.value === "") {
        errors.push(`Condition "${node.label}": comparison value is required.`);
      }

      break;
    }

    case "delay": {
      const durationMs = node.config.durationMs;

      if (!Number.isFinite(durationMs) || durationMs <= 0) {
        errors.push(
          `Delay "${node.label}": durationMs must be greater than 0.`,
        );
      }

      break;
    }

    case "end": {
      if (!node.config.status) {
        errors.push(`End "${node.label}" must have a status.`);
      }

      break;
    }

    default:
      break;
  }

  return errors;
}
