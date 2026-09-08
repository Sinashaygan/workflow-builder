import { WorkflowCanvas } from "@/widgets/workflow-canvas/ui/WorkflowCanvas";
import { WorkflowToolbar } from "@/features/workflow-toolbar/ui/WorkflowToolbar";
import { NodeInspector } from "@/features/workflow-inspector/ui/NodeInspector";
import { ExecutionPanel } from "@/features/workflow-execution/ui/ExecutionPanel";
import { ExecutionLog } from "@/features/workflow-execution/ui/ExecutionLog";

export default function WorkflowBuilderPage() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 w-full h-full">
        <WorkflowCanvas />
      </div>

      <WorkflowToolbar />

      <NodeInspector />

      <ExecutionPanel />

      <ExecutionLog />
    </main>
  );
}
