"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { StandartForm } from "@/components/ui216/standart-form"
import { useLanguage } from "@/i18n"
import { getList, postItem } from "@/lib/fetch"
import { getPosIntegrationTypeList, Store } from "@/types/Facility"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import Cookies from 'js-cookie'
import { ListGrid } from "@/components/ui216/list-grid"
import { BanknoteIcon, BarcodeIcon, CircleArrowDown, ComputerIcon, Divide, Grid2x2PlusIcon, LucideUserSquare, MoveRightIcon, Package2Icon, RefreshCcwDotIcon, StoreIcon } from "lucide-react"
import { ProgressBar } from "../../../../components/ui216/progressBar"
import { ButtonConfirm } from "@/components/button-confirm"


interface Props {
  play?:boolean
}
export default function PosPage(props: Props) {
  const [stores, setStores] = useState<Store[]>([])
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [busyItems, setBusyItems] = useState(false)
  const [busyFirms, setBusyFirms] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const posIntegrationTypeList = getPosIntegrationTypeList()

  const [sonucItems, setSonucItems] = useState<any>({})
  const [sonucFirms, setSonucFirms] = useState<any>({})

  const load = () => {
    setLoading(true)
    getList(`/stores`, token)
      .then(result => {
        setStores(result.docs as Store[])
      })
      .catch(err => toast({ title: 'Error', description: err || '', variant: 'destructive' }))
      .finally(() => setLoading(false))
  }

  const storePage = (store: Store) => {
    return (<div className="border rounded-md border-dashed px-4 py-2 flex flex-col gap-4 w-full min-h-40">
      <div className="flex justify-between">
        <div className="flex gap-4"><StoreIcon /> {store.name}</div>
        {!busyItems && !busyFirms &&
          <ButtonConfirm
            title="Reset?"
            description={'Son Guncelleme tarihleri resetlenecek. Onayliyor musunuz?'}
            onOk={() => {
              postItem(`/storeIntegration/${store._id}/syncReset`, token, store)
                .then(result => {
                  toast({ title: 'Bilgi', description: '😀 Guncelleme tarihleri resetlendi' })
                  location.reload()
                })
                .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
            }}
          >
            <Button variant={'destructive'}><RefreshCcwDotIcon /> Reset</Button>
          </ButtonConfirm>
        }
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 items-end">
        <Button disabled={busyItems} variant={'outline'}
          onClick={() => {
            setBusyItems(true)
            postItem(`/storeIntegration/${store._id}/syncItems`, token, store)
              .then(result => setSonucItems(result))
              .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
          }}
          className="flex gap-2 justify-start"
        ><Package2Icon />Stok Kartlari Aktar</Button>
        <ProgressBar className="col-span-3" title={'Stok Aktarimi'} eventName="syncItems_progress" onProgress={e => setBusyItems(true)} onFinished={() => setBusyItems(false)} />
        <div>{JSON.stringify(sonucItems)}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 items-end">
        <Button disabled={busyFirms} variant={'outline'}
          onClick={() => {
            setBusyFirms(true)
            postItem(`/storeIntegration/${store._id}/syncFirms`, token, store)
              .then(result => setSonucFirms(result))
              .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
          }}
          className="flex gap-2 justify-start"
        ><LucideUserSquare />Cari Kartlari Aktar</Button>
        <ProgressBar className="col-span-3" title={'Cari Aktarimi'} eventName="syncFirms_progress" onProgress={e => setBusyFirms(true)} onFinished={() => setBusyFirms(false)} />
        <div>{JSON.stringify(sonucFirms)}</div>
      </div>
      <div className="flex justify-start">
        {!busyItems && !busyFirms &&
          <ButtonConfirm
            title="Güncellemeleri Gönder?"
            description={'Yeni Stok/Barkod/Fiyat Bilgileri Mağaza Terminallerine gönderilecek. Onayliyor musunuz?'}
            onOk={() => {
              postItem(`/storeIntegration/${store._id}/syncPriceTrigger`, token, store)
                .then(result => {
                  toast({ title: 'Bilgi', description: '😀 Yeni Stok/Barkod/Fiyat Bilgileri Mağaza Terminallerine gönderildi' })
                })
                .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
            }}
          >
            <div className="flex gap-2 bg-indigo-600 p-3"><Grid2x2PlusIcon /> <MoveRightIcon /><ComputerIcon /> Güncellemeleri Kasalara Gönder</div>
          </ButtonConfirm>
        }
      </div>
    </div >)
  }

  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && load() }, [token])
  useEffect(() => { !busyItems && audioRef?.current && audioRef.current.play() }, [busyItems])
  useEffect(() => { !busyFirms && audioRef?.current && audioRef.current.play() }, [busyFirms])

  return (
    <StandartForm
      title={t('POS Transactions')}
      loading={loading}
      icon={<ComputerIcon />}
    >

      <div className="flex flex-col gap-8 mt-6">
        {stores && stores.map(store => <div key={store._id}>{storePage(store)}</div>)}
      </div>
      <audio ref={audioRef} src="/mp3/notification-1.mp3" />
    </StandartForm>
  )
}