import { Metadata } from "next"
import { pageMeta } from '@/lib/meta-info'
export const metadata: Metadata = pageMeta('Home')


interface Props {
  params:{id:string}
}
export default function ModuleClosedPage({params}:Props){
  return (<div className="flex-1 justify-center items-center">
    <h2>Modul Kapalı - {params.id}</h2>
    <p>Lütfen sistem yönticinize başvurun.</p>
  </div>)
}


