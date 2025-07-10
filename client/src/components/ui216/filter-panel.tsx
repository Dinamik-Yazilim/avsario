import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ReactNode, useState } from 'react'
import { ButtonOK } from '../icon-buttons'
interface Props {
  className?: string
  trigger?: any
  children?: any
}
export function FilterPanel({
  className = "",
  trigger = "?",
  children = undefined,
}: Props) {
  const [open, setOpen] = useState(false)
  return (
    <div className='relative'>
      <div className='cursor-pointer' onClick={() => setOpen(!open)}>
        {trigger}
      </div>
      <div className={`z-10 absolute start-auto end-0 top-8 min-w-80 min-h-60 pt-2 pb-10 px-4 bg-popover shadow-lg rounded border border-dashed ${className} ${!open ? 'hidden' : ''}`}>
        {children}
        <ButtonOK className='absolute end-1 bottom-1' onClick={() => setOpen(false)} />
      </div>
    </div>
  )
}
