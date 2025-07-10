import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CheckIcon, XIcon } from 'lucide-react'

interface Props {
  className?: string
  title?: string
  description?: any
  children?: any
  onOk?: () => void
  onCancel?: () => void
}

export function ButtonConfirm({
  className = "",
  title = "?",
  description = undefined,
  children = undefined,
  onOk = undefined,
  onCancel = undefined,
}: Props) {
  return (
    <AlertDialog >
      <AlertDialogTrigger>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>
            {description}
          </AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className='bg-blue-600 text-white hover:bg-blue-800 hover:text-white' onClick={() => onOk && onOk()}><CheckIcon /></AlertDialogAction>
          <AlertDialogCancel className='bg-gray-600 text-white hover:bg-gray-800 hover:text-white' onClick={() => onCancel && onCancel()}><XIcon /></AlertDialogCancel>

        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

  )
}