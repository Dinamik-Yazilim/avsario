import { FC } from 'react'


import Link from "next/link"

import { cookies } from 'next/headers'
import { RedirectType, redirect } from 'next/navigation'
import { Header } from './(components)/header'
import { Footer } from './(components)/footer'
import { getAuthToken } from '@/lib/authHelper'
import React from 'react'
import '@/styles/piechart-style.css'
import { Sidebar } from './(components)/sidebar'


export interface AppLayoutProps {
  children?: any
}
const AppLayout: FC<AppLayoutProps> = ({ children }) => {

  // if (!getAuthToken()) {
  //   return redirect('/auth/login', RedirectType.push)
  // }


  return (
    <div className="flex min-h-screen w-full flex-col px-2 dark:bg-[#030611] ">
      <Header />
      <div className="flex flex-row justify-between md:border border-dashed border-opacity-25 rounded-md border-yellow-400 " style={{ overflowWrap: 'anywhere' }}>
        <Sidebar className='hidden lg:flex' />
        <div className='container mx-auto py-1 px-1 md:px-4 md:py-4'>
          {children}
        </div>
      </div>
      <div className='lg:mb-2'></div>
      {/* <Footer /> */}
    </div>
  )

}

export default AppLayout