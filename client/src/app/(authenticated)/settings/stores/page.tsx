"use client"

import { useEffect, useState } from 'react'
import { getItem, getList, putItem } from '@/lib/fetch'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { useToast } from '@/components/ui/use-toast'
import { useLanguage } from '@/i18n'
import { StoreIcon, Users2Icon } from 'lucide-react'
import { ListGrid } from '@/components/ui216/list-grid'
import { Store, getPosIntegrationTypeList } from '@/types/Facility'
interface Props {
}
export default function SettingsPage({ }: Props) {
  const [stores, setStores] = useState<Store[]>([])
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const posIntegrationTypeList=getPosIntegrationTypeList()

  const load = () => {
    setLoading(true)
    getList(`/stores`, token)
      .then(result => {
        setStores(result.docs as Store[])
      })
      .catch(err => toast({ title: 'Error', description: err || '', variant: 'destructive' }))
      .finally(() => setLoading(false))
  }

  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && load() }, [token])

  return (
    <ListGrid
      apiPath='/stores'

      title={t('Stores')}
      icon=<StoreIcon />
      onHeaderPaint={() => <div className='grid grid-cols-7 w-full'>
        <div>{t('Name')}</div>
        <div>{t('Default Firm')}</div>
        <div>{t('Warehouse')}</div>
        <div>{t('Responsibility')}</div>
        <div>{t('Project')}</div>
        <div>{t('Pos')}</div>
        <div className='text-center'>{t('Passive?')}</div>
      </div>}
      onRowPaint={(e:Store,colIndex) => <div className='grid grid-cols-7 w-full'>
        <div>{e.name}</div>
        <div>{e.defaultFirm}</div>
        <div>{e.warehouse}</div>
        <div>{e.responsibility}</div>
        <div>{e.project}</div>
        <div>{posIntegrationTypeList.find(r=>r._id==e.posIntegration?.integrationType)?.name}</div>
        <div className='text-center'>{e.passive?'✅':''}</div>
      </div>}
    />
  )
}