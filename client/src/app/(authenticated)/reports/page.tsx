"use client"

import { Button } from '@/components/ui/button'
import { MenuPage } from '@/components/ui216/menu-page'
import { useLanguage } from '@/i18n'
import { NotebookPenIcon, UsersIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
export default function ReportsPage() {
  const router = useRouter()
  const { t } = useLanguage()

  return (<div>
    <h2>Reports Page</h2>
  </div>)
}