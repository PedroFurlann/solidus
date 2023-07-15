import Image from "next/image";
import Logo from '../../public/logo.png'
import Link from "next/link";

export function LoginHeader() {

  return (
    <div className="w-full h-24 bg-amber-400 flex items-center justify-center">
      <Link href="/login">
        <Image alt="Solidus logo" src={Logo} className="w-16 h-16 bg-transparent cursor-pointer" />
      </Link>
    </div>
  )
}