import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { LegacyRef } from 'react'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  title?: any
  inputClassName?: string
  labelClassName?: string
}
export function TsnInput({ title, inputClassName, labelClassName="text-muted-foreground", ...props }: Props) {
  return (<div className={`flex flex-col gap-1 my-1 ${props.className}`} >
    <Label className={`ms-2 ${labelClassName}`}>{title}</Label>
    <Input
      onFocus={e => {
        props.type == 'number' && e.target.select()
      }}
      {...props}
      className={inputClassName}
    />
  </div>)
}