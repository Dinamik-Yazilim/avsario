"use client"

import { useEffect, useState } from 'react'
import { getItem, putItem } from '@/lib/fetch'
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
import { PosIntegrationPos312 } from '../stores/[id]/pos-integration-pos312'
interface Props {
}
export default function SettingsPage({ }: Props) {
  const [settings, setSettings] = useState<Settings>()
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()

  const load = () => {
    setLoading(true)
    getItem(`/settings`, token)
      .then(result => {
        setSettings(result as Settings)
      })
      .catch(err => toast({ title: 'Error', description: err || '', variant: 'destructive' }))
      .finally(() => setLoading(false))
  }

  const save = () => {
    setLoading(true)
    putItem(`/settings`, token, settings)
      .then(result => {
        getItem(`/settings`, token)
          .then(result => {
            toast({ title: `🙂 ${t('Success')}`, description: t('Document has been saved successfuly'), duration: 800 })
            //setTimeout(() => location.href = '/', 1000)
          })
          .catch(err => toast({ title: 'Error', description: err || '', variant: 'destructive' }))
      })
      .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
      .finally(() => setLoading(false))

  }


  
  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && load() }, [token])

  return (
    <StandartForm
      title={t('Settings')}
      onSaveClick={save}
      onCancelClick={() => router.back()}
      loading={loading}
    >
      
    </StandartForm>
  )
}