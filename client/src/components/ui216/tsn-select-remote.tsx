import { Label } from '@/components/ui/label'
import { TsnListType, TsnSelect, TsnSelectProps } from './tsn-select'
import { useEffect, useState } from 'react'
import { useToast } from '../ui/use-toast'
import { getList, postItem } from '@/lib/fetch'
import Cookies from 'js-cookie'
import { Skeleton } from '../ui/skeleton'

interface TsnSelectRemoteProps extends TsnSelectProps {
  apiPath?: string
  textField?: string
  query?:string
  
}

export function TsnSelectRemote({ apiPath='/mikro/get', textField = 'name', query, ...props }: TsnSelectRemoteProps) {
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<TsnListType[]>([])
  const load = () => {
    setLoading(true)
    postItem(`${apiPath}`, token, {query:query})
      .then(result => {
        let l=result.docs || result || []
        setList((l).map((e: any) => { return ({ _id: e._id, text: e[textField] }) }))
      })
      .catch(err => toast({ title: 'Error', description: err || '', variant: 'destructive' }))
      .finally(() => setLoading(false))
  }
  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && load() }, [token])
  return (<>
    {!loading && <TsnSelect list={list}  {...props} />}
    {loading && <Skeleton className='h-10 w-full mt-4' />}
  </>)
}