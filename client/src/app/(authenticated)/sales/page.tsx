"use client"

import { Button } from '@/components/ui/button'
import { MenuPage } from '@/components/ui216/menu-page'
import { useLanguage } from '@/i18n'
import { NotebookPenIcon, UsersIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
export default function SalesPage() {
  const router = useRouter()
  const { t } = useLanguage()

  return (<MenuPage title={t('Sales')}>
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      <Button onClick={() => router.push('/sales/customers')} variant={'outline'} className='flex justify-start gap-4'>
        <span className='text-2xl'>🕺🏻💃🏻</span>{t('Customers')}
      </Button>
      <Button onClick={() => router.push('/sales/orders')} variant={'outline'} className='flex justify-start gap-4'>
        <span className='text-2xl'>🛒📝</span>
        {t('Sales Orders')}
      </Button>
      <Button onClick={() => router.push('/sales/invoices')} variant={'outline'} className='flex justify-start gap-4'>
        <span className='text-2xl'>🧾↗️</span>
        {t('Outgoing Invoices')}
      </Button>
    </div>
  </MenuPage>)
}