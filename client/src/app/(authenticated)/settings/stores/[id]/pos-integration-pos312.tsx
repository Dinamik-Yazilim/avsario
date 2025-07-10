"use client"

import { Button } from "@/components/ui/button"
import { TsnInput } from "@/components/ui216/tsn-input"
import { TsnPanel } from "@/components/ui216/tsn-panel"
import { postItem } from "@/lib/fetch"
import { Store } from "@/types/Facility"
import { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import { useToast } from "@/components/ui/use-toast"
import { PaintbrushIcon, PlugZapIcon } from "lucide-react"
interface Props {
  store: Store
  setStore: (s: Store) => void
  t: (s: string) => string
}
export function PosIntegrationPos312({ t, store, setStore }: Props) {
  const [token, setToken] = useState('')
  const [result, setResult] = useState<any>()
  const { toast } = useToast()
  const [testing, setTesting] = useState(false)

  const pos312Test = () => {
    setTesting(true)
    // try{
    postItem(`/storeIntegration/${store._id || '0'}/test`, token,
      {
        integrationType:store?.posIntegration?.integrationType,
        webServiceUrl:store?.posIntegration?.pos312?.webServiceUrl,
        webServiceUsername: store?.posIntegration?.pos312?.webServiceUsername,
        webServicePassword: store?.posIntegration?.pos312?.webServicePassword,
      })
      .then(setResult)
      .catch(err=>{
        setResult({error:err})
        // toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' })
      })
      .finally(()=>setTesting(false))
    // }catch(err){
    //   setTesting(false)
    //   setResult(err)
    // }
    // fetch(`${store?.posIntegration?.pos312?.webServiceUrl}/auth/loginuser`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     username: store?.posIntegration?.pos312?.webServiceUsername,
    //     password: store?.posIntegration?.pos312?.webServicePassword
    //   })
    // })
    //   .then(res => {
    //     if (res.ok) {
    //       res.json()
    //         .then(setResult)
    //         .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
    //     } else {
    //       setResult({ error: res.statusText })
    //     }
    //   })
    //   .catch(err => setResult(err))
    //   .finally(()=>setTesting(false))


  }

  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])

  return (<TsnPanel name='PosIntegrationPos312' trigger={'Pos 312'} collapsible={false}>
    <TsnInput title={t('Web Service Url')}
      defaultValue={store?.posIntegration?.pos312?.webServiceUrl}
      onBlur={e => setStore({ ...store, posIntegration: { ...store?.posIntegration, pos312: { ...store?.posIntegration?.pos312, webServiceUrl: e.target.value } } })}
    />
    <TsnInput title={t('Username')}
      defaultValue={store?.posIntegration?.pos312?.webServiceUsername}
      onBlur={e => setStore({ ...store, posIntegration: { ...store?.posIntegration, pos312: { ...store?.posIntegration?.pos312, webServiceUsername: e.target.value } } })}
    />
    <TsnInput title={t('Password')}
      defaultValue={store?.posIntegration?.pos312?.webServicePassword}
      onBlur={e => setStore({ ...store, posIntegration: { ...store?.posIntegration, pos312: { ...store?.posIntegration?.pos312, webServicePassword: e.target.value } } })}
    />
    <TsnInput title={t('StoreId')}
      type='number'
      defaultValue={store?.posIntegration?.pos312?.storeId}
      onBlur={e => {
        const val = !isNaN(Number(e.target.value)) ? Number(e.target.value) : 0
        setStore({ ...store, posIntegration: { ...store?.posIntegration, pos312: { ...store?.posIntegration?.pos312, storeId: val } } })
      }}
    />
    <div className="flex flex-col gap-4 my-4">
      <div className='flex gap-2'>
        <Button onClick={pos312Test} disabled={result != undefined || testing} className='w-44 bg-green-600 text-white' variant={'outline'} >
          <PlugZapIcon />  {t('Pos312 Test')}
        </Button>
        {result && <Button onClick={() => setResult(undefined)} ><PaintbrushIcon /></Button>}
      </div>
      {result &&
        <TsnPanel name='PosIntegrationPos312_result' trigger={t('Result')} defaultOpen={true}>
          <pre className="text-wrap">{JSON.stringify(result, null, 2)}</pre>
        </TsnPanel>
      }
    </div>
  </TsnPanel>)
}