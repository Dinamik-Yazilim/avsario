import type { Metadata } from "next"
import Link from 'next/link'
// import {redirect, useRouter} from 'next/navigation'
export const metadata: Metadata = {
  title: 'Page Not Found - DinamikUp',
  // description: 'TODO: description eklenecek. Excepteur fugiat labore labore enim aliqua deserunt aliqua amet.',
}

const Page404 = () => {


  return (
    <div className='rel11ative w-full h-screen flex justify-center items-center'>
      <div className='grid grid-cols-1 gap-4'>
        <h2 className='text-2xl'>Error 404 - Page not found.</h2>
        <Link className="bg-primary px-3 py-3 text-white rounded-md shrink" href="/" title="go to home page" >Go back</Link>
      </div>
    </div>)

}

export default Page404