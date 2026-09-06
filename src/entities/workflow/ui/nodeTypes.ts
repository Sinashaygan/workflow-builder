import type { NodeTypes } from "@xyflow/react";
import { StartNode } from "./StartNode";
import { ActionNode } from "./ActionNode";
import { ConditionNode } from "./ConditionNode";
import { DelayNode } from "./DelayNode";
import { EndNode } from "./EndNode";

export const workflowNodeTypes: NodeTypes = {
  start: StartNode,
  action: ActionNode,
  condition: ConditionNode,
  delay: DelayNode,
  end: EndNode,
};
