"use client"

import { useToast } from "@/components/ui/use-toast"
import { StandartForm } from "@/components/ui216/standart-form"
import { useLanguage } from "@/i18n"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import { getItem, postItem, putItem } from "@/lib/fetch"
import { getPosIntegrationTypeList, Store } from "@/types/Facility"
import { TsnInput } from "@/components/ui216/tsn-input"
import { TsnSwitch } from "@/components/ui216/tsn-switch"
import { TsnPanel } from "@/components/ui216/tsn-panel"
import { TsnSelect } from "@/components/ui216/tsn-select"
import { SelectResponsibilityWithLabel } from "@/app/(authenticated)/(components)/select-responsibility"
import { SelectProjectWithLabel } from "@/app/(authenticated)/(components)/select-project"
import { PosIntegrationPos312 } from "./pos-integration-pos312"
import { SelectWarehouseWithLabel } from "@/app/(authenticated)/(components)/select-warehouse"
import { SelectFirmWithLabel } from "@/app/(authenticated)/(components)/select-firm"

interface Props {
  params: { id: string }
}

export default function EditPage({ params }: Props) {
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const [store, setStore] = useState<Store>()
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')

  const load = () => {
    setLoading(true)
    getItem(`/stores/${params.id}`, token)
      .then(result => {
        setStore(result as Store)
      })
      .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
      .finally(() => setLoading(false))
  }

  const save = () => {
    if (!store?._id) {
      postItem(`/stores`, token, store)
        .then(result => router.back())
        .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
    } else {
      putItem(`/stores/${store?._id}`, token, store)
        .then(result => router.back())
        .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
    }
  }

  const PosIntegrationDinamikUp = ({ }) => {
    return (<TsnPanel name='PosIntegrationDinamikUp' trigger={'DinamikUp POS'} collapsible={false}>
      DinamikUp Pos
    </TsnPanel>)
  }

  const PosIntegrationIngenico = ({ }) => {
    return (<TsnPanel name='PosIntegrationIngenico' trigger={'WorldLine Ingenico'} collapsible={false}>
      <TsnInput title={t('Web Service Url')}
        defaultValue={store?.posIntegration?.ingenico?.webServiceUrl}
        onBlur={e => setStore({ ...store, posIntegration: { ...store?.posIntegration, ingenico: { ...store?.posIntegration?.ingenico, webServiceUrl: e.target.value } } })}
      />
      <TsnInput title={t('Username')}
        defaultValue={store?.posIntegration?.ingenico?.webServiceUsername}
        onBlur={e => setStore({ ...store, posIntegration: { ...store?.posIntegration, ingenico: { ...store?.posIntegration?.ingenico, webServiceUsername: e.target.value } } })}
      />
      <TsnInput title={t('Password')}
        defaultValue={store?.posIntegration?.ingenico?.webServicePassword}
        onBlur={e => setStore({ ...store, posIntegration: { ...store?.posIntegration, ingenico: { ...store?.posIntegration?.ingenico, webServicePassword: e.target.value } } })}
      />
    </TsnPanel>)
  }

  const PosIntegrationGenius3 = ({ }) => {
    return (<TsnPanel name='PosIntegrationGenius3' trigger={'IBM Genius 3'} collapsible={false}>
      IBM Genius 3
    </TsnPanel>)
  }
  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && params.id != 'addnew' && load() }, [token])

  return (<StandartForm
    title={params.id == 'addnew' ? t('New Store') : t('Edit Store')}
    onSaveClick={save}
    onCancelClick={() => router.back()}
    loading={loading}
  >
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TsnInput className="col-span-2" title={t('Name')} defaultValue={store?.name} onBlur={e => setStore({ ...store, name: e.target.value })} />
        <SelectFirmWithLabel caption={store?.defaultFirm} t={t} onSelect={e => { setStore({ ...store, defaultFirmId: e._id, defaultFirm: e.name }) }} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SelectWarehouseWithLabel caption={store?.warehouse} t={t} onSelect={e => { setStore({ ...store, warehouseId: e._id, warehouse: e.name }) }} />
        <SelectProjectWithLabel caption={store?.project} t={t} onSelect={e => { setStore({ ...store, projectId: e._id, project: e.name }) }} />
        <SelectResponsibilityWithLabel caption={store?.responsibility} t={t} onSelect={e => { setStore({ ...store, responsibilityId: e._id, responsibility: e.name }) }} />
      </div>
      <TsnPanel name='PosIntegrationIngenico' trigger={t('New Firm')} collapsible={false} >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <TsnInput title={t('Code Pattern')} defaultValue={store?.newFirm?.codePattern} onBlur={e => { setStore({ ...store, newFirm: { ...store?.newFirm, codePattern: e.target.value } }) }} />
          <TsnInput title={t('Email')} type='email' defaultValue={store?.newFirm?.email} onBlur={e => { setStore({ ...store, newFirm: { ...store?.newFirm, email: e.target.value } }) }} />
          <TsnInput title={t('Accounting Code')} defaultValue={store?.newFirm?.accountingCode} onBlur={e => { setStore({ ...store, newFirm: { ...store?.newFirm, accountingCode: e.target.value } }) }} />
        </div>
      </TsnPanel>
      <div className='flex flex-col ga-4 w-full max-w-3xl'>
        <TsnSelect
          list={getPosIntegrationTypeList()}
          title={t('Pos Integration Type')}
          defaultValue={store?.posIntegration?.integrationType}
          onValueChange={e => setStore({ ...store, posIntegration: { ...store?.posIntegration, integrationType: e } })}
        />
      </div>
      {store?.posIntegration?.integrationType == 'dinamikup' && <PosIntegrationDinamikUp />}
      {store?.posIntegration?.integrationType == 'pos312' && <PosIntegrationPos312 t={t} store={store} setStore={setStore} />}
      {store?.posIntegration?.integrationType == 'ingenico' && <PosIntegrationIngenico />}
      {store?.posIntegration?.integrationType == 'genius3' && <PosIntegrationGenius3 />}
      <TsnSwitch title={t('Passive?')} defaultChecked={store?.passive} onCheckedChange={e => setStore({ ...store, passive: e })} />
    </div>

  </StandartForm>)
}
