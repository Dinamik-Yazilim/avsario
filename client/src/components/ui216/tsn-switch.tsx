import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { Switch } from '../ui/switch'

interface Props extends SwitchPrimitives.SwitchProps {
  title?: any

}
export function TsnSwitch(props: Props) {
  return (<div className={`flex flex-row items-center gap-1 my-1 ${props.className}`} >

    <Switch
      {...props} className=''
    ></Switch>
    <Label className='ms-2'>{props.title}</Label>


  </div>)
}