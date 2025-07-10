"use client"

import { useEffect, useState } from 'react'
import { getItem, postItem, putItem } from '@/lib/fetch'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { Connector, getMainAppList } from '@/types/Connector'
import { useToast } from '@/components/ui/use-toast'

import { useLanguage } from '@/i18n'
import { StandartForm } from '@/components/ui216/standart-form'
import { TsnSelect } from '@/components/ui216/tsn-select'
import { TsnInput } from '@/components/ui216/tsn-input'
import { Label } from '@/components/ui/label'
import { TsnPanel } from '@/components/ui216/tsn-panel'
import { BrushIcon, DatabaseZapIcon, PaintbrushIcon, PlugZapIcon, SettingsIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TsnSwitch } from '@/components/ui216/tsn-switch'
import { Skeleton } from '@/components/ui/skeleton'

export default function ConnectorPage() {
  const [connector, setConnector] = useState<Connector>({
    clientId: '',
    clientPass: '',
    connectionType: 'mssql',
    mssql: {
      server: 'localhost',
      port: 1433,
      database: 'MikroDB_V16',
      user: 'sa',
      password: '',
    }
  })
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [connTesting, setConnTesting] = useState(false)
  const [connTestResult, setConnTestResult] = useState<any>()
  const [sqlTestResult, setSqlTestResult] = useState<any>()
  const [mainApp, setMainApp] = useState('mikro16')
  const router = useRouter()
  const { t } = useLanguage()

  const load = () => {
    setLoading(true)
    getItem(`/connector`, token)
      .then(result => {
        result.connector && setConnector(result.connector as Connector)
        console.log('result.mainApp:', result.mainApp)
        result.mainApp && setMainApp(result.mainApp)
      })
      .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
      .finally(() => setLoading(false))
  }

  const save = () => {
    setLoading(true)
    putItem(`/connector`, token, { connector: connector, mainApp: mainApp })
      .then(result => {
        toast({ title: `🙂 ${t('Success')}`, description: t('Document has been saved successfuly'), duration: 800 })
        setTimeout(()=>location.href='/',1000)
      })
      .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
      .finally(() => setLoading(false))
  }

  const connectorTest = () => {
    setConnTesting(true)

    postItem(`/connector/connectorTest`, token, connector)
      .then(result => {
        setConnTestResult(result)
      })
      .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
      .finally(() => setConnTesting(false))
  }

  const sqlConnTest = () => {
    setConnTesting(true)

    postItem(`/connector/mssqlTest`, token, connector)
      .then(result => {
        setSqlTestResult(result)
      })
      .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
      .finally(() => setConnTesting(false))
  }

  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && load() }, [token])

  return (
    <StandartForm
      title={t('Connector')}
      onSaveClick={save}
      onCancelClick={() => router.back()}
      icon=<PlugZapIcon />
    >
      {!loading && <div className='flex flex-col gap-8'>
        <div className='border rounded-md border-dashed p-2'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
            <TsnInput title='ClientID' defaultValue={connector?.clientId} onBlur={e => setConnector({ ...connector, clientId: e.target.value })} />
            <TsnInput title='ClientPass' defaultValue={connector?.clientPass} onBlur={e => setConnector({ ...connector, clientPass: e.target.value })} />
            <TsnSelect title='Connection Type' defaultValue={connector?.connectionType} disabled list={[{ _id: 'mssql', name: 'MS SQL Server' }]} />
          </div>
          <div className="flex flex-col gap-2">
            <div className='flex gap-2'>
              <Button onClick={connectorTest} disabled={connTesting || connTestResult != undefined} className='w-44 bg-green-600 text-white' variant={'outline'} >
                <PlugZapIcon />  {t('Connector Test')}
              </Button>
              {connTestResult && <Button onClick={() => setConnTestResult(undefined)} ><PaintbrushIcon /></Button>}
            </div>
            <div className='flex flex-col gap-1'>
              <Label>{t('Result')}</Label>
              <div>{JSON.stringify(connTestResult, null, 2)}</div>
            </div>
            {connTesting && <Skeleton className='w-full h-12' />}
          </div>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
          <TsnSelect title={t('Main Application')} list={getMainAppList()}
            defaultValue={mainApp}
            onValueChange={e => {
              setMainApp(e)
              switch (e) {
                case 'mikro16':
                  setConnector({ ...connector, mssql: { ...connector.mssql, database: 'MikroDB_V16' } })
                  break;
                case 'mikro17':
                  setConnector({ ...connector, mssql: { ...connector.mssql, database: 'MikroDesktop' } })
                  break;
              }
            }}
          />
        </div>
        <div className='border rounded-md border-dashed p-2'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
            <TsnInput title={'Server'} defaultValue={connector?.mssql?.server} onBlur={e => setConnector({ ...connector, mssql: { ...connector.mssql, server: e.target.value } })} />
            <TsnInput title={'Instance'} defaultValue={connector?.mssql?.dialectOptions?.instanceName} onBlur={e => setConnector({ ...connector, mssql: { ...connector.mssql, dialectOptions: { ...connector.mssql?.dialectOptions, instanceName: e.target.value } } })} />
            <TsnInput type='number' title={'Port'} defaultValue={connector?.mssql?.port} onBlur={e => setConnector({ ...connector, mssql: { ...connector.mssql, port: !isNaN(Number(e.target.value)) ? Number(e.target.value) : 0 } })} />
            <TsnInput title={'Database'} value={connector?.mssql?.database} readOnly />
            <TsnInput title={'User'} defaultValue={connector?.mssql?.user} onBlur={e => setConnector({ ...connector, mssql: { ...connector.mssql, user: e.target.value } })} />
            <TsnInput title={'Password'} defaultValue={connector?.mssql?.password} onBlur={e => setConnector({ ...connector, mssql: { ...connector.mssql, password: e.target.value } })} />
            <TsnSwitch title={'Encrypt'} defaultChecked={connector?.mssql?.options?.encrypt} onCheckedChange={e => setConnector({ ...connector, mssql: { ...connector.mssql, options: { ...connector.mssql?.options, encrypt: e } } })} />
            <TsnSwitch title={'Trust Server Certificate'} defaultChecked={connector?.mssql?.options?.trustServerCertificate} onCheckedChange={e => setConnector({ ...connector, mssql: { ...connector.mssql, options: { ...connector.mssql?.options, trustServerCertificate: e } } })} />
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex gap-2'>
              <Button onClick={sqlConnTest} disabled={connTesting || sqlTestResult != undefined} className='w-44 bg-amber-600 text-white' variant={'outline'} >
                <DatabaseZapIcon />  {t('SQL Test')}
              </Button>
              {sqlTestResult && <Button onClick={() => setSqlTestResult(undefined)} ><PaintbrushIcon /></Button>}
            </div>
            <div className='flex flex-col gap-1'>
              <Label>{t('Result')}</Label>
              <pre>{JSON.stringify(sqlTestResult, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>}
    </StandartForm>
  )
}