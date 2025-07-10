"use client"
import { useEffect, useState } from "react"

import __en from "./__en.json"
import __tr from "./__tr.json"
import { createGlobalState } from "react-hooks-global-state"
import Cookies from 'js-cookie'
export const LANG_LISTS: any = {
  en: __en,
  tr: __tr,
}


const initialState = { lang: "en" }
const { useGlobalState } = createGlobalState(initialState)

export const useLanguage = () => {
  const [lang, setLang] = useGlobalState("lang")
  const [defaultLang, setDefaultLang] = useState('en')


  useEffect(() => {
    const navLang = navigator.language.substring(0, 2)
    setDefaultLang(Object.keys(LANG_LISTS).indexOf(navLang) > -1 ? navLang : 'en')
    if (!Cookies.get("lang")) {
      Cookies.set("lang", defaultLang)
    }
    setLang(Cookies.get("lang") || defaultLang)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const t = (key: string) => {
    const list = LANG_LISTS[lang || defaultLang] || __en

    if (Object.keys(list).includes(key)) {
      return list[key] as string
    } else {
      return key
    }
  }

  const changeLanguage = (language: string) => {
    localStorage.setItem("lang", language)
    setLang(language)
  }
  return {
    langList: Object.keys(LANG_LISTS),
    t,
    lang,
    changeLanguage,
  }
}
