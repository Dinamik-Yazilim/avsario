import { pageMeta } from '@/lib/meta-info'
import { Metadata } from 'next/types'

export const metadata: Metadata = pageMeta('Working Params')

export default function PageLayout({ children }: { children: any }) {
  return (<>{children}</>)
}
