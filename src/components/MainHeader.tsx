import Image from "next/image";
import Logo from "../../public/logo.png";
import Link from "next/link";

export function MainHeader() {
  return (
    <div className="w-full h-24 bg-amber-400 flex items-center pl-8 gap-6">
      <Image
        alt="Solidus logo"
        src={Logo}
        className="w-16 h-16 bg-transparent cursor-pointer"
      />
        <p className="text-lg font-extrabold text-gray-800 transition-all ease-in-out duration-500 cursor-pointer hover:bg-gray-950 hover:text-gray-200 py-2 px-3 rounded-2xl">
          Transações
        </p>
        <p className="text-lg font-extrabold text-gray-800 transition-all ease-in-out duration-500 cursor-pointer hover:bg-gray-950 hover:text-gray-200 py-2 px-3 rounded-2xl">
          Coin Bot
        </p>
        <p className="text-lg font-extrabold text-gray-800 transition-all ease-in-out duration-500 cursor-pointer hover:bg-gray-950 hover:text-gray-200 py-2 px-3 rounded-2xl">
          Perfil
        </p> 
    </div>
  );
}
