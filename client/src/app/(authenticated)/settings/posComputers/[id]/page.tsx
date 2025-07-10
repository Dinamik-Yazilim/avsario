"use client"

import { useToast } from "@/components/ui/use-toast"
import { StandartForm } from "@/components/ui216/standart-form"
import { useLanguage } from "@/i18n"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import { getItem, getList, postItem, putItem } from "@/lib/fetch"
import { StorePosComputer } from "@/types/StorePosComputer"
import { TsnInput } from "@/components/ui216/tsn-input"
import { TsnSwitch } from "@/components/ui216/tsn-switch"
import { TsnPanel } from "@/components/ui216/tsn-panel"
import { TsnSelect } from "@/components/ui216/tsn-select"
import { SelectResponsibilityWithLabel } from "@/app/(authenticated)/(components)/select-responsibility"
import { SelectProjectWithLabel } from "@/app/(authenticated)/(components)/select-project"
import { SelectWarehouseWithLabel } from "@/app/(authenticated)/(components)/select-warehouse"
import { TsnSelectRemote } from "@/components/ui216/tsn-select-remote"
import { Store } from "@/types/Facility"
import { SelectCashAccountWithLabel } from "@/app/(authenticated)/(components)/select-cashAccount"
import { SelectBankAccountWithLabel } from "@/app/(authenticated)/(components)/select-bankAccount"

interface Props {
  params: { id: string }
}

export default function EditPage({ params }: Props) {
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const [storePosComputer, setStorePosComputer] = useState<StorePosComputer>()
  const [stores, setStores] = useState<Store[]>()
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')

  const load = () => {
    setLoading(true)
    getItem(`/storePosComputers/${params.id}`, token)
      .then(result => {
        setStorePosComputer(result as StorePosComputer)

      })
      .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
      .finally(() => setLoading(false))
  }

  const loadStores = () => {
    getList(`/stores?pageSize=1000`, token)
      .then(result => {
        result.docs && setStores(result.docs as Store[])
      })
      .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
  }

  const save = () => {
    if (!storePosComputer?._id) {
      postItem(`/storePosComputers`, token, storePosComputer)
        .then(result => router.back())
        .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
    } else {
      putItem(`/storePosComputers/${storePosComputer?._id}`, token, storePosComputer)
        .then(result => router.back())
        .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
    }
  }


  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => {
    if (token) {
      loadStores()
      params.id != 'addnew' && load()
    }
  }, [token])

  return (<StandartForm
    title={params.id == 'addnew' ? t('New POS Computer') : t('Edit POS Computer')}
    onSaveClick={save}
    onCancelClick={() => router.back()}
    loading={loading}
  >
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TsnSelect title={t('Store')} defaultValue={storePosComputer?.store?._id}
          onValueChange={e => setStorePosComputer({ ...storePosComputer, store: { ...storePosComputer?.store, _id: e } })}
          list={stores}
        />
        <TsnInput title={t('Name')} defaultValue={storePosComputer?.name} onBlur={e => setStorePosComputer({ ...storePosComputer, name: e.target.value })} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TsnInput title={t('Integration Code')} defaultValue={storePosComputer?.integrationCode} onBlur={e => setStorePosComputer({ ...storePosComputer, integrationCode: e.target.value })} />
          <TsnInput title={t('Sales Serial')} maxLength={4} defaultValue={storePosComputer?.salesDocNoSerial} onBlur={e => setStorePosComputer({ ...storePosComputer, salesDocNoSerial: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SelectProjectWithLabel caption={storePosComputer?.project} t={t} onSelect={e => { setStorePosComputer({ ...storePosComputer, projectId: e._id, project: e.name }) }} />
        <SelectResponsibilityWithLabel caption={storePosComputer?.responsibility} t={t} onSelect={e => { setStorePosComputer({ ...storePosComputer, responsibilityId: e._id, responsibility: e.name }) }} />
        <SelectCashAccountWithLabel caption={storePosComputer?.cashAccount} t={t} onSelect={e => { setStorePosComputer({ ...storePosComputer, cashAccountId: e._id, cashAccount: e.name }) }} />
        <SelectBankAccountWithLabel caption={storePosComputer?.bankAccount} t={t} onSelect={e => { setStorePosComputer({ ...storePosComputer, bankAccountId: e._id, bankAccount: e.name }) }} />
      </div>
      <TsnPanel name='scaleOptions' trigger={'Terazi Ayarlari'} >

      </TsnPanel>
      <TsnSwitch title={t('Passive?')} defaultChecked={storePosComputer?.passive} onCheckedChange={e => setStorePosComputer({ ...storePosComputer, passive: e })} />
    </div>

  </StandartForm>)
}
