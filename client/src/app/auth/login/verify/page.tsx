'use client'

import { HeaderLogo2 } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useLanguage } from '@/i18n'
import { useState } from 'react'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { ArrowLeftIcon, CheckIcon } from 'lucide-react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { getItem, postItem } from '@/lib/fetch'
import { useToast } from '@/components/ui/use-toast'
import Cookies from 'js-cookie'

export default function VerifyPage() {
  const { t } = useLanguage()
  const [authCode, setAuthCode] = useState('')
  const router = useRouter()
  const { toast } = useToast()
  const username = useSearchParams().get('username')
  const deviceId = Cookies.get('deviceId') || ''

  const verify = () => {
    postItem(`/auth/verify`, '', {
      authCode: authCode,
      username: username,
      deviceId: deviceId,
    })
      .then(result => {
        Cookies.set('token', result.token)
        if (result.db) {
          Cookies.set('db', result.db)
        }

        console.log('verify result:', result)
        getItem(`/me`, Cookies.get('token') || '')
          .then(meResult => {
            Cookies.set('user',JSON.stringify(meResult))
            router.push('/')
          })
          .catch(err => toast({ title: t('Error'), description: err, variant: 'destructive' }))
      })
      .catch(err => toast({ title: t('Error'), description: err, variant: 'destructive' }))
  }
  return (
    <div className="relative h-full flex flex-col justify-center items-center gap-4">
      <div className="flex justify-center">
        <HeaderLogo2 className='w-40'/>
      </div>
      <div className="flex flex-col justify-between gap-4 w-full h-full  mb-6 text-2xl max-w-[350px] max-h-[240px] rounded-lg border border-dashed border-opacity-50 border-slate-400 p-4">
        <div className="flex flex-col gap-2 items-center">
          <Label className="ms-2 my-4 text-blue-600 font-bold">
            {username}
          </Label>
          <Label className="ms-2">{t('Enter 6-digits Auth Code')}</Label>
          <div className="flex gap-2 ">
            <InputOTP maxLength={6} onChange={e => setAuthCode(e)}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              {/* <InputOTPSeparator /> */}
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>
        <div className="flex justify-between w-full my-4">
          <Button variant={'secondary'} onClick={() => router.back()}>
            <ArrowLeftIcon />
          </Button>
          <Button className="flex-shrink" onClick={verify}>
            <CheckIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
