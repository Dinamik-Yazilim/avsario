"use client"
import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LanguagesIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/i18n'
import Cookies from 'js-cookie'

export function SelectLang() {
  const { langList } = useLanguage()
  const [lang, setLang] = useState('')
  const [defaultLang, setDefaultLang] = useState('tr')
  useEffect(() => {
    if (typeof window != 'undefined') {
      const navLang = navigator.language.substring(0, 2)
      const l = langList.indexOf(navLang) > -1 ? navLang : 'tr'
      setDefaultLang(lang)
      setLang(Cookies.get('lang') || l)
    }
  }, [])

  return (<div className='flex items-center gap-1 px-2 py-0 border rounded-md'>
    <LanguagesIcon size={32} />
    <Select
      value={lang}
      onValueChange={e => {
        setLang(e)
        Cookies.set('lang', e)
        location.reload()
      }}

    >
      <SelectTrigger className="w-full border-0 p-0">
        <SelectValue placeholder="-" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="en">English</SelectItem>
          {/* <SelectItem value="es">Español</SelectItem> */}
          <SelectItem value="tr">Türkçe</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
  )
}