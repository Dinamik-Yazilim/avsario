import { EditIcon, PlusSquareIcon } from 'lucide-react'
import { ButtonCancel, ButtonOK } from '../icon-buttons'
import Loading from '../loading'

interface Props {
  loading?: boolean
  children?: any
  title?: string
}
export function MenuPage({
  loading, children, title
}: Props) {

  return (<div className='flex flex-col gap-4 h-full'>
    {!loading &&
      <div className='flex flex-col gap-4 '>
        <div className='flex justify-between border-b pb-2'>
          <h1 className='text-xl md:text-4xl'>
            {title}
          </h1>
          <div className='flex gap-2'>
            {/* TODO: buraya birseyler */}
            qwerty
          </div>
        </div>
        <div>
          {children}
        </div>

      </div>
    }
    {
      loading &&
      <div className='flex w-full h-full justify-center items-center'>
        <Loading />
      </div>
    }
  </div>)
}