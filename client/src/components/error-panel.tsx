import { AlertCircle } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export function ErrorPanel({ children, title }: { children?: any, title?: string }) {
  return (
    <Alert variant="destructive" className=''>
      <AlertCircle className="h-6 w-6 " />
      <AlertTitle className='text-red-600'>{title || 'Error'}</AlertTitle>
      <AlertDescription className='text-red-600'>
        {children}
      </AlertDescription>
    </Alert>
  )
}
