// import { t } from '@/i18n/serverSide'
import { Metadata } from 'next/types'
// import { cookies } from 'next/headers'
// import __en from "@/i18n/__en.json"
// import __tr from "@/i18n/__tr.json"
// export const LANG_LISTS: any = {
//   en: __en,
//   tr: __tr,
// }
export function pageMeta(title: string, description?: string) {
  const metadata: Metadata = {
    title: ` ${t(title)} - ${process.env.NEXT_PUBLIC_APP_TITLE || 'ENV ERROR'}`,
    description: `${description && t(description)} || process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'ENV Error'}`,
  }
  return metadata
}

function t(key: string) {
  return key
  // const list = LANG_LISTS[cookies().get('lang')?.value || 'en'] || __en

  // if (Object.keys(list).includes(key)) {
  //   return list[key] as string
  // } else {
  //   return key
  // }
}