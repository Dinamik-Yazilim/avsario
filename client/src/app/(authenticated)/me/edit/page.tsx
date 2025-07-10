"use client"
import { Button } from '@/components/ui/button'
import Image from "next/image"
import { redirect, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { getItem, postItem } from '@/lib/fetch'
import CustomLink from '@/components/custom-link'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { Member } from '@/types/Member'
import { useLanguage } from '@/i18n'

export default function MeEditPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [token, setToken] = useState('')
  const [user, setUser] = useState<Member>({})
  const { t } = useLanguage()

  const save = () => {
    postItem('/me', token, user)
      .then(result => {
        Cookies.set('user', JSON.stringify(result))
        router.replace('/me')
      })
      .catch(err => console.log(err))
  }

  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => {
    if (token) {
      getItem('/me', token)
        .then(result => setUser(result as Member))
        .catch(err => toast({ title: 'Error', description: err || '', variant: 'destructive' }))
    }
  }, [token])
  return (<>
    {user && <>

      <div className="w-f11ull m11ax-w-3xl mx-auto py-8 px-4 md:px-6 flex flex-col gap-8">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={'/img/avatar-place-holder.png'} alt="" />

          </Avatar>

        </div>
        <div className='grid grid-cols-2 gap-4'>
          <Label>Organization</Label>
          <div>{user.organization?.name} </div>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <Label>Username</Label>
          <div>{user.username} </div>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <Label>{t('Name')}</Label>
          <Input defaultValue={user?.name} onBlur={e => setUser({ ...user, name: e.target.value })} />
        </div>

        <div className='w-full flex flex-row justify-end gap-4'>
          <Button className="text-2xl" variant={'secondary'} onClick={() => router.back()}><i className="fa-solid fa-angle-left"></i>       </Button>
          <Button className="text-2xl" onClick={save}><i className="fa-solid fa-cloud-arrow-up"></i>        </Button>

        </div>
      </div>




    </>}
  </>
  )
}
