import { EditIcon, PlusSquareIcon } from 'lucide-react'
import { ButtonCancel, ButtonOK } from '../icon-buttons'
import Loading from '../loading'

interface Props {
  onSaveClick?: () => void
  onCancelClick?: () => void
  loading?: boolean
  id?: string
  children?: any
  title?: string
  icon?:React.ReactNode
}
export function StandartForm({
  onCancelClick, onSaveClick, loading, id, children, title, icon
}: Props) {

  return (<div className='flex flex-col h-full'>
    {!loading &&
      <div className='flex flex-col '>
        <div className='flex justify-between border-b'>
          <h2 className='flex items-center gap-4 border-none text-base lg:text-2xl'>
            {!icon && <>
            {id == 'addnew' && <PlusSquareIcon />}
            {id != 'addnew' && <EditIcon />}
            </>}
            {icon && <>{icon}</>}
            {title}
          </h2>
          <div className='flex gap-2 mb-1'>
            {onSaveClick && <ButtonOK className='w-8 h-8 lg:w-9 lg:h-9' onClick={onSaveClick} />}
            {onCancelClick && <ButtonCancel className='w-8 h-8 lg:w-9 lg:h-9' onClick={onCancelClick} />}
          </div>
        </div>
        <div>
          {children}
        </div>

      </div>
    }
    {
      loading &&
      <div className='flex w-full h-full justify-center  items-center'>
        <Loading />
      </div>
    }
  </div>)
}