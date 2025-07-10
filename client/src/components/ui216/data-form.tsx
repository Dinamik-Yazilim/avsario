"use client"

import { ReactNode, useEffect, useState } from 'react'
import { getItem, postItem, putItem } from '@/lib/fetch'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { useToast } from '@/components/ui/use-toast'
import Loading from '@/components/loading'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { CheckIcon, CheckSquare2Icon, XIcon } from 'lucide-react'
import { ButtonCancel, ButtonOK } from '@/components/icon-buttons'
import { useLanguage } from '@/i18n'

interface Props {
  id: string
  apiPath?: string
  onDataForm?: (e: any, setData: (a: any) => void) => ReactNode
  isPopup?: boolean
}
export function DataForm({
  id,
  apiPath = "",
  isPopup = false,
  onDataForm
}: Props) {
  const [formData, setFormData] = useState<any>({})
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()

  const load = () => {
    setLoading(true)
    getItem(`${apiPath}/${id}`, token)
      .then(result => { setFormData(result) })
      .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
      .finally(() => setLoading(false))
  }

  const save = () => {
    setLoading(true)
    if (id == 'addnew') {
      postItem(`${apiPath}`, token, formData)
        .then(result => router.back())
        .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
        .finally(() => setLoading(false))
    } else {
      putItem(`${apiPath}/${id}`, token, formData)
        .then(result => router.back())
        .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
        .finally(() => setLoading(false))
    }

  }

  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && id != 'addnew' && load() }, [token])

  return (<div className='flex flex-col gap-4 h-full'>
    {!loading &&
      <div className='flex flex-col gap-4 '>
        <div className='flex justify-between'>
          <div>
            {id == 'addnew' && <h2>Yeni form</h2>}
            {id != 'addnew' && <h2>Edit form</h2>}
          </div>
          <div className='flex gap-2'>
            <ButtonOK onClick={save} />
            <ButtonCancel onClick={() => router.back()} />
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {onDataForm && onDataForm(formData, (data) => setFormData({ ...data }))}

        </div>

      </div>
    }

    {
      loading &&
      <div className='flex w-full h-full justify-center items-center'>
        <Loading />
      </div>
    }
  </div >)
}




