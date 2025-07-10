import { Metadata } from "next"
import { pageMeta } from '@/lib/meta-info'
export const metadata: Metadata = pageMeta('Home')


export default function ModuleClosedPage(){
  return (<div className="flex-1 justify-center items-center">
    <h2>Modul Kapalı</h2>
    <p>Lütfen sistem yönticinize başvurun.</p>
  </div>)
}


