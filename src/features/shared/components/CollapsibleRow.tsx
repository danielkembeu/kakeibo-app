import { ChevronDown } from "lucide-react"
import { useState, type ReactNode } from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/features/shared/components/ui/collapsible"
import { cn } from "@/features/shared/lib/utils"

interface CollapsibleRowProps {
  label: ReactNode
  defaultOpen?: boolean
  children: ReactNode
}

export function CollapsibleRow({
  label,
  defaultOpen = false,
  children,
}: CollapsibleRowProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="rounded-lg border">
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm font-medium">
        <span className="flex-1">{label}</span>
        <ChevronDown
          className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="border-t px-3 py-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}
