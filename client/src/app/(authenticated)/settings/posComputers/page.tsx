"use client"

import { useEffect, useState } from 'react'
import { getItem, getList, putItem } from '@/lib/fetch'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { useToast } from '@/components/ui/use-toast'
import { useLanguage } from '@/i18n'
import { ComputerIcon, StoreIcon, Users2Icon } from 'lucide-react'
import { ListGrid } from '@/components/ui216/list-grid'
import { StorePosComputer } from '@/types/StorePosComputer'
interface Props {
}
export default function SettingsPage({ }: Props) {
  const [storePosComputers, setStorePosComputers] = useState<StorePosComputer[]>([])
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()

  const load = () => {
    setLoading(true)
    getList(`/storePosComputers`, token)
      .then(result => {
        setStorePosComputers(result.docs as StorePosComputer[])
      })
      .catch(err => toast({ title: 'Error', description: err || '', variant: 'destructive' }))
      .finally(() => setLoading(false))
  }

  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && load() }, [token])

  return (
    <ListGrid
      apiPath='/storePosComputers'

      title={t('POS Computers')}
      icon=<ComputerIcon />
      onHeaderPaint={() => <div className='grid grid-cols-9 w-full'>
        <div>{t('Store')}</div>
        <div>{t('Name')}</div>
        <div>{t('Sales Serial')}</div>
        <div>{t('Integration Code')}</div>
        <div>{t('Cash')}</div>
        <div>{t('Bank')}</div>
        <div>{t('Responsibility')}</div>
        <div>{t('Project')}</div>
        <div className='text-center'>{t('Passive?')}</div>
      </div>}
      onRowPaint={(e:StorePosComputer,colIndex) => <div className='grid grid-cols-9 w-full'>
        <div>{e.store?.name}</div>
        <div>{e.name}</div>
        <div>{e.salesDocNoSerial}</div>
        <div>{e.integrationCode}</div>
        <div>{e.cashAccount}</div>
        <div>{e.bankAccount}</div>
        <div>{e.responsibility}</div>
        <div>{e.project}</div>
        <div className='text-center'>{e.passive?'✅':''}</div>
      </div>}
    />
  )
}