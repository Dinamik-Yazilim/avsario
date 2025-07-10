"use client"

import { CopyrightInfo } from '@/components/copyright'
import { DatabaseSelect } from '@/app/(authenticated)/(components)/database-select'

// import { DatabaseSelect } from './database-selection'
export function Footer() {

  return (
    <footer className="flex items-center justify-between border-t bg-white px-2 py-4 dark:border-gray-800 dark:bg-gray-950 p-1">
      <div className='flex items-center gap-2'>
        <DatabaseSelect />
      </div>
      <div className="text-xs text-muted-foreground">
        <div className='hidden md:flex'>
          <CopyrightInfo />

        </div>
      </div>

    </footer>
  )
}
