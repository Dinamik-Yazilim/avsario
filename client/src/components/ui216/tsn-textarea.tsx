import { Label } from '@/components/ui/label'
import { Textarea } from '../ui/textarea'

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  title?: any
}
export function TsnTextarea(props: Props) {
  return (<div className={`flex flex-col gap-1 my-1 ${props.className}`} >
    <Label className='ms-2'>{props.title}</Label>
    <Textarea {...props} className='' />
  </div>)
}