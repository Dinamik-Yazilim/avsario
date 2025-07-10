import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ReactNode } from 'react'
interface Props {
  className?: string
  trigger?: any
  children?: any
}
export function ButtonInfo({
  className = "",
  trigger = "?",
  children = undefined,
}: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className={`min-w-80 min-h-80`}>
        {children}
      </PopoverContent>
    </Popover>
  )
}
