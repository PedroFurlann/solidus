import Image from "next/image";
import Logo from '../../public/logo.png'
import Link from "next/link";

export function LoginHeader() {

  return (
    <div className="w-full h-20 bg-amber-400 flex items-center justify-center">
      <Link href="/login" className="cursor-pointer">
        <Image alt="Solidus logo" src={Logo} className="w-14 h-14 bg-transparent cursor-pointer" />
      </Link>
    </div>
  )
}