"use client"

import React, { useEffect, useState } from "react"
import { RedirectType, redirect, usePathname, useRouter } from "next/navigation"
import { eventLog, consoleLogWelcomeMsg } from '@/lib/log'
import Cookies from 'js-cookie'
import { v4 } from 'uuid'
import { useLanguage } from '@/i18n'

const LayoutClientSide = () => {
  const router = useRouter()
  const pathName = usePathname()
  const [deviceId, setDeviceId] = useState(Cookies.get('deviceId') || '')
  // const { t } = useLanguage()
  // const title = t(document.title.replaceAll(' - ' + (process.env.NEXT_PUBLIC_APP_TITLE || ''), ''))
  if (!deviceId) {
    const newDeviceId = v4()
    setDeviceId(newDeviceId)
    Cookies.set('deviceId', newDeviceId)
  }
  useEffect(() => {
    if (Cookies.get('token') && (pathName.startsWith('/auth') || pathName == '/')) {
      router.push('/')
    } else if (!Cookies.get('token') && !pathName.startsWith('/auth')) {
      router.push('/auth/login')
    }
    // setTimeout(() => {
    //   document.title = title
    // }, 1500)
  }, [])
  // useEffect(() => {


  // }, [title])
  return <></>
}


export default LayoutClientSide
