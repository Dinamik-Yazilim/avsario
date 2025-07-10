"use client"

import { ThemeToggleButton } from '@/components/theme-toggle-button'
import { HeaderLogo2 } from '@/components/logo'
import CustomLink from '@/components/custom-link'
import { Input } from "@/components/ui/input"
import { UserMenu } from './user-menu'
import { FC, useEffect, useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BoxesIcon, DatabaseIcon, FactoryIcon, HomeIcon, PiggyBankIcon, ShoppingCartIcon, TruckIcon } from 'lucide-react'
import { useLanguage } from '@/i18n'
import Cookies from 'js-cookie'
import { NotificationButton } from '@/components/notify-icon'
import { Sidebar } from './sidebar'

export function Header() {
  const { t } = useLanguage()

  return (
    <header className="flex h-16 items-center justify-between bor11der-b bg-white px-0 md:px-2 dark:border-gray-800 dark:bg-gray-950"    >
      <div className="flex items-center gap-8">
        <CustomLink className="" href="/">
          <HeaderLogo2 className='w-40 lg:w-48' />
        </CustomLink>
        

      </div>
      <div className="flex items-center justify-end gap-2">
        
        {/* <NotificationButton /> */}
        <UserMenu />
        <div className='flex lg:hidden'><MobileMenu /></div>

      </div>
    </header>
  )
}

function MobileMenu() {
  return (<>
    <DropdownMenu >
      <DropdownMenuTrigger asChild  >
        <Button className="rounded-full border border-gray-200 w-12 h-12 dark:border-gray-800"
          size="icon"
          variant="ghost"
        >
          <i className="fa-solid fa-bars"></i>
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" >
        <Sidebar />
      </DropdownMenuContent>
    </DropdownMenu>
  </>)
}