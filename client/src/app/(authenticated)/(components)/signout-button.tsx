"use client"


import { Button } from "@/components/ui/button"
import { useLanguage } from '@/i18n'
// import { authSignOut } from '@/lib/authHelper'
import Cookies from 'js-cookie'
// import { cookies } from 'next/headers'
import { useRouter } from 'next/navigation'


export function SignOutButton() {
  const router = useRouter()
  const { t } = useLanguage()

  return (
    <Button variant={'outline'}
      onClick={() => {
        if (confirm(t('Do you want to exit?'))) {
          Cookies.remove('token')
          Cookies.remove('user')
          Cookies.remove('db')
          setTimeout(() => {
            router.push('/auth/login')
          }, 300)
        }
      }}
    >
      <i className='fa-solid fa-power-off'></i>
    </Button>
  )
}


