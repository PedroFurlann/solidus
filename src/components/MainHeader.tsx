"use client"

import { HTMLAttributes, useState } from "react";
import Link from "next/link";
import useWindowSize from "@/hooks/useWindowsSize";
import { List } from "phosphor-react";
import { Avatar } from "./Avatar";

interface Props extends HTMLAttributes<HTMLDivElement> {
  chosenPage: "Transactions" | "CoinBot" | "Profile"

}

export function MainHeader({ chosenPage, ...rest }: Props) {
  const { isMobile } = useWindowSize();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div {...rest} className={`w-full h-20 bg-amber-400 flex items-center pl-8 gap-6 ${isMobile ? "justify-between" : ""}`}>
      <Avatar size="medium" />

      {isMobile ? (
        <div>
          <button
            className="text-md font-extrabold text-black transition-all ease-in-out duration-500 cursor-pointer hover:bg-black hover:text-white py-2 px-3 rounded-2xl"
            onClick={toggleMenu}
          >
            <List weight="bold" size={28} />
          </button>
          {isMenuOpen && (
           <div
           className="absolute right-8 top-12 bg-black w-48 border border-amber-400 rounded-md shadow-lg"
           style={{ transform: "translateX(-10%)" }}
         >
           <Link href="/transactions">
             <p className="block py-2 px-4 text-white hover:bg-amber-400">
               Transações
             </p>
           </Link>
           <Link href="/coinBot">
             <p className="block py-2 px-4 text-white hover:bg-amber-400">
               Coin Bot
             </p>
           </Link>
           <Link href="/profile">
             <p className="block py-2 px-4 text-white hover:bg-amber-400">
               Perfil
             </p>
           </Link>
         </div>
          )}
        </div>
      ) : (
        
        <div className="flex gap-4">
          <Link href="/transactions">
          <p className={`text-md font-extrabold ${chosenPage === "Transactions" ? "text-white bg-black" : "text-black"} transition-all ease-in-out duration-500 cursor-pointer hover:bg-black hover:text-white py-1 px-3 rounded-2xl`}>
              Transações
            </p>
          </Link>
          <Link href="/coinBot">
          <p className={`text-md font-extrabold ${chosenPage === "CoinBot" ? "text-white bg-black" : "text-black"} transition-all ease-in-out duration-500 cursor-pointer hover:bg-black hover:text-white py-1 px-3 rounded-2xl`}>
              Coin Bot
            </p>
          </Link>
          <Link href="/profile">
          <p className={`text-md font-extrabold ${chosenPage === "Profile" ? "text-white bg-black" : "text-black"} transition-all ease-in-out duration-500 cursor-pointer hover:bg-black hover:text-white py-1 px-3 rounded-2xl`}>
              Perfil
            </p>
          </Link>
        </div>
      )}
    </div>
  );
}
