// import LayoutClientSide from './layout-client'

import { CopyrightInfo } from '@/components/copyright'
import { HeaderLogo2 } from '@/components/logo'
import { SelectLang } from '@/components/select-lang'
import { ThemeToggleButton } from '@/components/theme-toggle-button'
import Link from 'next/link'

interface AuthLayoutProps {
  children?: any
}

export default function AuthLayout({ children }: AuthLayoutProps) {

  return (<div className="container relative  h-[92vh] flex-col justify-center px-6 pb-4 11m-0">
    <div className='w-full flex justify-between'>
      <Link href={'/auth/login'}>
        <HeaderLogo2 className=" w-40" />
      </Link>
      <div className='flex items-center gap-2 max-h-12'>
        <SelectLang />
        <ThemeToggleButton />

      </div>
    </div>


    {children}
    <div className='absolute bottom-1 w-full text-center start-0 text-xs text-muted-foreground'>
      <CopyrightInfo />

    </div>
  </div>)
}


