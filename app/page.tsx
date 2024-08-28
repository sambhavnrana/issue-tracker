import Image from 'next/image'
import Pagination from './components/Pagination'

export default function Home({ searchParams }: { searchParams: { page: string } }) { //Extract the searchParams property from the props object, and assign it to a variable searchParams
  return (
    <Pagination itemCount={100} pageSize={10} currentPage={parseInt(searchParams.page)} />
  )
}
