import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Props {
  className?: string
  onChange?: (e: string) => void
  defaultValue?: string
}

export function GenderSelect({
  className,
  onChange,
  defaultValue
}: Props) {
  return (
    <Select value={defaultValue || ''} onValueChange={e => {
      onChange && onChange(e)
    }}>
      <SelectTrigger className={`w-[180px] ${className}`}>
        <SelectValue placeholder="---" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Cinsiyet</SelectLabel>
          <SelectItem value="female">Kadın</SelectItem>
          <SelectItem value="male">Erkek</SelectItem>
          <SelectItem value="other">Diğer</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}