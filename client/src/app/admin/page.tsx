import HomePage from './home/page'
import { Metadata } from "next"
import { pageMeta } from '@/lib/meta-info'
export const metadata: Metadata = pageMeta('Home')


const IndexPage = () => {
  return (<HomePage />)
}

export default IndexPage
