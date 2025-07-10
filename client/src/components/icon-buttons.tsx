import { CheckIcon, ListCheckIcon, ListTreeIcon, PlusCircleIcon, PlusIcon, PlusSquareIcon, TextSelectionIcon, XIcon } from 'lucide-react'
import { Button } from './ui/button'
import { SelectIcon } from '@radix-ui/react-select'

interface ButtonProps {
  className?: string
  onClick?: () => void
}
export function ButtonOK({ className, onClick }: ButtonProps) {
  return (
    <Button
      className={`bg-blue-600 text-white hover:bg-blue-800 hover:text-white px-2 ${className}`}
      variant={'outline'}
      size={'sm'}
      onClick={() => onClick && onClick()}
    >
      <CheckIcon size={'24px'} />
    </Button>
  )
}

export function ButtonSelect({ className, onClick }: ButtonProps) {
  return (
    <div
      className={`border-slate-500 border border-opacity-25 dark:text-white hover:bg-amber-800 hover:text-white px-[3px] py-[2px] rounded-md ${className}`}
      onClick={() => onClick && onClick()}
    >
      <ListCheckIcon size={'22px'} className='opacity-50' />
    </div>
  )
}


export function ButtonCancel({ className, onClick }: ButtonProps) {
  return (
    <Button
      className={`bg-gray-600 text-white hover:bg-gray-800 hover:text-white px-2 ${className}`}
      variant={'outline'}
      size={'sm'}
      onClick={() => onClick && onClick()}
    >
      <XIcon size={'24px'} />
    </Button>
  )
}
export function ButtonLinePlus({ className, onClick }: ButtonProps) {
  return (
    <Button
      className={`bg-green-600 text-white hover:bg-green-800 hover:text-white px-2 flex gap-1 ${className}`}
      variant={'outline'}
      size={'sm'}
      onClick={() => onClick && onClick()}
    >
      <ListTreeIcon size={'24px'} /><PlusSquareIcon size={'24px'} />
    </Button>
  )
}