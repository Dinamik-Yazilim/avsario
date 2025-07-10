"use client"

import { useToast } from "@/components/ui/use-toast"
import { StandartForm } from "@/components/ui216/standart-form"
import { useLanguage } from "@/i18n"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import { getItem, postItem, putItem } from "@/lib/fetch"
import { getRoleList, Member } from "@/types/Member"
import { TsnInput } from "@/components/ui216/tsn-input"
import { TsnSwitch } from "@/components/ui216/tsn-switch"
import { TsnPanel } from "@/components/ui216/tsn-panel"
import { TsnSelect } from "@/components/ui216/tsn-select"

interface Props {
  params: { id: string }
}

export default function UserEditPage({ params }: Props) {
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const [member, setMember] = useState<Member>()
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')

  const load = () => {
    setLoading(true)
    getItem(`/members/${params.id}`, token)
      .then(result => {
        console.log(result)
        setMember(result as Member)
      })
      .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
      .finally(() => setLoading(false))
  }

  const save=()=>{
    if(!member?._id){
      postItem(`/members`,token,member)
      .then(result=>router.back())
      .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
    }else{
      putItem(`/members/${member?._id}`,token,member)
      .then(result=>router.back())
      .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
    }
  }
  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && params.id != 'addnew' && load() }, [token])

  return (<StandartForm
    title={params.id == 'addnew' ? t('New User') : t('Edit User')}
    onSaveClick={save}
    onCancelClick={()=>router.back()}
    loading={loading}
  >
    <TsnInput title={t('Username')} defaultValue={member?.username} onBlur={e => setMember({ ...member, username: e.target.value })} />
    <TsnInput title={t('Name')} defaultValue={member?.name} onBlur={e => setMember({ ...member, name: e.target.value })} />
    <TsnSelect title={t('Role')} list={getRoleList(t)} value={member?.role} onValueChange={e=>setMember({...member,role:e})} />
    <TsnSwitch title={t('Passive?')} defaultChecked={member?.passive} onCheckedChange={e=>setMember({...member,passive:e})} />
    
    <TsnPanel name="changePass" className="mt-4" trigger={t('Change Password')} contentClassName="grid grid-cols-2 gap-2 w-full">
      <TsnInput type='password' title={t('Password')} onChange={e=>setPassword(e.target.value)} />
      <TsnInput type='password' title={t('Re-Password')} onChange={e=>setPassword(e.target.value)} />
    </TsnPanel>
  </StandartForm>)
}
