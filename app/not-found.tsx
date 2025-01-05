import Image from 'next/image'
import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='text-center font-semibold text-xl text-blue-800'>
      <div className="flex justify-center  py-20">
        <Image src={'/no-results.png'} width={150} height={150} alt="Page not found" />
      </div>   
      <Link href="/">Return Home</Link>
    </div>
  )
}
