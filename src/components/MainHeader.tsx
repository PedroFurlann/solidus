import { useState } from "react";
import Image from "next/image";
import Logo from "../../public/logo.png";
import Link from "next/link";
import useWindowSize from "@/hooks/useWindowsSize";
import { DotsThreeVertical } from "phosphor-react";

interface Props {
  chosenPage: "Transactions" | "CoinBot" | "Profile"
}

export function MainHeader({ chosenPage }: Props) {
  const { isMobile } = useWindowSize();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={`w-full h-24 bg-amber-400 flex items-center pl-8 gap-6 ${isMobile ? "justify-between" : ""}`}>
      <Image
        alt="Solidus logo"
        src={Logo}
        className="w-16 h-16 bg-transparent cursor-pointer"
      />

      {isMobile ? (
        // Hamburger menu for mobile view
        <div>
          <button
            className="text-lg font-extrabold text-gray-800 transition-all ease-in-out duration-500 cursor-pointer hover:bg-gray-950 hover:text-gray-200 py-2 px-3 rounded-2xl"
            onClick={toggleMenu}
          >
            <DotsThreeVertical weight="bold" size={28} />
          </button>
          {isMenuOpen && (
           <div
           className="absolute right-8 top-12 bg-gray-950 w-48 border border-amber-400 rounded-md shadow-lg"
           style={{ transform: "translateX(-10%)" }} // Ajuste para a esquerda
         >
           <Link href="/transactions">
             <p className="block py-2 px-4 text-gray-200 hover:bg-amber-400">
               Transações
             </p>
           </Link>
           <Link href="/coin-bot">
             <p className="block py-2 px-4 text-gray-200 hover:bg-amber-400">
               Coin Bot
             </p>
           </Link>
           <Link href="/profile">
             <p className="block py-2 px-4 text-gray-200 hover:bg-amber-400">
               Perfil
             </p>
           </Link>
         </div>
          )}
        </div>
      ) : (
        // Regular header for larger screens
        <div className="flex gap-4">
          <Link href="/transactions">
          <p className={`text-lg font-extrabold ${chosenPage === "Transactions" ? "text-gray-200 bg-gray-950" : "text-gray-800"} transition-all ease-in-out duration-500 cursor-pointer hover:bg-gray-950 hover:text-gray-200 py-2 px-3 rounded-2xl`}>
              Transações
            </p>
          </Link>
          <Link href="/coin-bot">
          <p className={`text-lg font-extrabold ${chosenPage === "CoinBot" ? "text-gray-200 bg-gray-950" : "text-gray-800"} transition-all ease-in-out duration-500 cursor-pointer hover:bg-gray-950 hover:text-gray-200 py-2 px-3 rounded-2xl`}>
              Coin Bot
            </p>
          </Link>
          <Link href="/profile">
          <p className={`text-lg font-extrabold ${chosenPage === "Profile" ? "text-gray-200 bg-gray-950" : "text-gray-800"} transition-all ease-in-out duration-500 cursor-pointer hover:bg-gray-950 hover:text-gray-200 py-2 px-3 rounded-2xl`}>
              Perfil
            </p>
          </Link>
        </div>
      )}
    </div>
  );
}
