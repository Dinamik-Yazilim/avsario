"use client"

import { ReactNode, useEffect, useState } from 'react'
import { BracketsIcon, ChevronsUpDown, MenuIcon, PanelBottomIcon } from "lucide-react"

import { usePathname } from 'next/navigation'
import { getLocalStorage, setLocalStorage } from '@/lib/utils'

export function generateStorageKey(prefix: string, name?: string, pathName?: string) {
  let s = prefix ? prefix + '_' : ''
  if (name) s += name
  if (pathName?.substring(1)) s += '_' + pathName?.substring(1).replaceAll('/', '_')

  return s
}
interface Props {
  name?: string
  children?: any
  trigger?: ReactNode | any
  defaultOpen?: boolean
  className?: string
  contentClassName?: string
  collapsible?: boolean
}
export function TsnPanel({ name, children, trigger, defaultOpen = true, className, contentClassName, collapsible = true }: Props) {
  const [open, setOpen] = useState(collapsible ? defaultOpen : true)
  const pathName = usePathname()
  const storageKey = generateStorageKey('', name, pathName)
  useEffect(() => {
    if (collapsible) {
      if (getLocalStorage('panel_status', storageKey) == true) {
        setOpen(true)
      } else {
        setOpen(false)
      }
    }
  }, [])
  return (
    <div className={`flex flex-col my-1 ${className}`}>
      <div
        onClick={() => {
          if (collapsible) {
            // if (typeof window != 'undefined') {
            //   try{
            //     let panel_status = JSON.parse(localStorage.getItem('panel_status') || '{}') as any
            //     panel_status[storageKey]=!open
            //     localStorage.setItem('panel_status', JSON.stringify(panel_status))
            //   }catch{}
            // }
            setLocalStorage('panel_status', storageKey, !open)
            setOpen(!open)
          }
        }}
        className={`cursor-pointer ps-2 bg-slate-500 text-white dark:bg-slate-900 py-[4px]  ${!open ? 'rounded-lg' : 'rounded-t-lg'} flex items-center gap-2`}
      >
        {collapsible && <ChevronsUpDown />}
        {!collapsible && <PanelBottomIcon size={'16px'} />}

        {trigger}
      </div>
      <div className={` py-4 px-4 rounded-b-lg border border-dashed ${contentClassName} ${!open ? 'hidden' : ''}`}>
        {children}
      </div>
    </div>
  )
}