"use client"
import { Button } from '@/components/ui/button'
import Image from "next/image"
import Link from 'next/link'
import { redirect, RedirectType } from 'next/navigation'
import { FC, useEffect, useState } from 'react'

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { getItem } from '@/lib/fetch'
import CustomLink from '@/components/custom-link'
import Cookies from 'js-cookie'
import { Member } from '@/types/Member'
import { useLanguage } from '@/i18n'

const MePage = () => {
  const [token, setToken] = useState('')
  const [user, setUser] = useState<Member | null>(null)
  const { t } = useLanguage()
  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => {
    if (token) {
      getItem('/me', token)
        .then(result => {
          setUser(result as Member)
        })
        .catch(err => console.log(err))
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
          <div>{user.name} </div>
        </div>
        <div className='w-full flex flex-row justify-end gap-4'>
          <Link href="/me/edit" className="bg-primary text-primary-foreground py-2 px-3 rounded-md text-2xl">
            <i className="fa-regular fa-edit"></i>
          </Link>
        </div>
      </div>
    </>}
  </>)
}

export default MePage