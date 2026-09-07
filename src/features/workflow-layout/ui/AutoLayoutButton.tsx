"use client";

import { Network } from "lucide-react";
import { useReactFlow } from "@xyflow/react";
import { setLayoutPositions } from "@/entities/workflow/model";
import { getLayoutedElements } from "../model/getLayoutedElements";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks";

export function AutoLayoutButton() {
  const dispatch = useAppDispatch();
  const { workflow } = useAppSelector((state) => state.workflow);
  const { fitView } = useReactFlow();

  const handleAutoLayout = () => {
    if (workflow.nodes.length === 0) return;

    const newPositions = getLayoutedElements(workflow.nodes, workflow.edges, {
      direction: "TB",
    });

    dispatch(setLayoutPositions(newPositions));

    // تنظیم مجدد کادر نمایش بعد از تغییر موقعیت‌ها
    window.requestAnimationFrame(() => {
      fitView({ duration: 400, padding: 0.2 });
    });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={handleAutoLayout}
            className="h-9 w-9 bg-background/95 backdrop-blur shadow-md"
          >
            <Network className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Auto Layout (Dagre)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
