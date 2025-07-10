"use client"

import { useEffect, useState } from 'react'
import { getItem, getList, putItem } from '@/lib/fetch'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { Settings } from '@/types/Settings'
import { useToast } from '@/components/ui/use-toast'
import { TsnSelect } from '@/components/ui216/tsn-select'
import { useLanguage } from '@/i18n'
import { StandartForm } from '@/components/ui216/standart-form'
import { TsnInput } from '@/components/ui216/tsn-input'
import { Label } from '@/components/ui/label'
import { TsnPanel } from '@/components/ui216/tsn-panel'
import { Users2Icon } from 'lucide-react'
import { getRoleList, Member } from '@/types/Member'
import { ListGrid } from '@/components/ui216/list-grid'
interface Props {
}
export default function SettingsPage({ }: Props) {
  const [members, setMembers] = useState<Member[]>([])
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const roleList=getRoleList(t)

  const load = () => {
    setLoading(true)
    getList(`/members`, token)
      .then(result => {
        setMembers(result.docs as Member[])
      })
      .catch(err => toast({ title: 'Error', description: err || '', variant: 'destructive' }))
      .finally(() => setLoading(false))
  }

  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && load() }, [token])

  return (
    <ListGrid
      apiPath='/members'

      title={t('Users')}
      icon=<Users2Icon />
      onHeaderPaint={() => <div className='grid grid-cols-4 w-full'>
        <div>{t('Username')}</div>
        <div>{t('Name')}</div>
        <div>{t('Rol')}</div>
        <div className='text-center'>{t('Passive?')}</div>
      </div>}
      onRowPaint={(e:Member,colIndex) => <div className='grid grid-cols-4 w-full'>
        <div>{e.username}</div>
        <div>{e.name}</div>
        <div>{roleList.find(r=>r._id==e.role)?.name}</div>
        <div className='text-center'>{e.passive?'✅':''}</div>
      </div>}
    />
  )
}