"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { StandartForm } from "@/components/ui216/standart-form"
import { useLanguage } from "@/i18n"
import { getList, postItem } from "@/lib/fetch"
import { getPosIntegrationTypeList, Store } from "@/types/Facility"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import Cookies from 'js-cookie'
import { BanknoteIcon, BarcodeIcon, CircleArrowDown, ComputerIcon, Divide, Grid2x2PlusIcon, MoveRightIcon, Package2Icon, RefreshCcwDotIcon, StoreIcon, WandSparklesIcon } from "lucide-react"
import { ProgressBar } from "../../../../components/ui216/progressBar"
import { ButtonConfirm } from "@/components/button-confirm"
import { Input } from "@/components/ui/input"
import { today, yesterday } from "@/lib/utils"


interface Props {
}
export default function PosGetSalesPage({ }: Props) {
  const [stores, setStores] = useState<Store[]>([])
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [busySales, setBusySales] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const [startDate,setStartDate]=useState(yesterday())
  const [endDate,setEndDate]=useState(yesterday())
  const [sonucSales, setSonucSales] = useState<any>({})
  
  
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
      <div className="flex justify-between items-center">
        <div className="flex gap-4"><StoreIcon /> {store.name}</div>
        <div className="flex justify-end items-center">
          <div>{t('Date')}:</div>
          <div className="flex justify-end items-center">
            <Input type='date' defaultValue={startDate} onChange={e=>setStartDate(e.target.value)} />
            -
            <Input type='date' defaultValue={endDate} onChange={e=>setEndDate(e.target.value)} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 items-end">
        <Button disabled={busySales} variant={'outline'}
          onClick={() => {
            setBusySales(true)
            postItem(`/storeIntegration/${store._id}/syncSales`, token, {startDate:startDate,endDate:endDate})
              .then(result => setSonucSales(result))
              .catch(err => {
                setSonucSales(err)
                toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' })
              })
          }}
          className="flex gap-2 justify-start"
        ><Package2Icon />{t('Transfer')}</Button>
        <ProgressBar className="col-span-3" title={t('Sales transfer')} eventName="syncSales_progress" onProgress={e => setBusySales(true)} onFinished={() => setBusySales(false)} />
        <div>{JSON.stringify(sonucSales)}</div>
      </div>
    
     
    </div >)
  }

  const audioRef=useRef<HTMLAudioElement | null>(null)

  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && load() }, [token])
  useEffect(() => { !busySales && audioRef?.current && audioRef.current.play() }, [busySales])

  return (
    <StandartForm
      title={'Mikro Aktarım'}
      loading={loading}
      icon={<WandSparklesIcon />}
    >

      <div className="flex flex-col gap-8 mt-6">
        {stores && stores.map(store => <div key={store._id}>{storePage(store)}</div>)}
      </div>
      <audio ref={audioRef} src="/mp3/notification-1.mp3" />
    </StandartForm>
  )
}