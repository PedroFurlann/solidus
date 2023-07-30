import Image from "next/image"
import { HTMLAttributes, useState } from "react"

interface Props extends HTMLAttributes<HTMLDivElement> {
  size: "small" | "medium" | "large" | "extraLarge" | "profileSize"
}

export function Avatar({ size = "medium", ...rest }: Props) {
  const [imgUrl, setImgUrl] = useState("http://www.github.com/PedroFurlann.png")

  return (
    <div 
    {...rest}
    className={`border flex items-center justify-center border-amber-600 rounded-full ${size === "small" ? "h-8 w-8" : size === "medium" ? "h-12 w-12" : size === "large" ? "h-16 w-16" : size === "extraLarge" ? "h-20 w-20" : "h-40 w-40"}`}>
      <Image 
        alt="Avatar Image"
        src={imgUrl}
        width={size === "small" ? 32 : size === "medium" ? 48 : size === "large" ? 64 : size === "extraLarge" ? 80 : 160 }
        height={size === "small" ? 32 : size === "medium" ? 48 : size === "large" ? 64 :  size === "extraLarge" ? 80 : 160 }
        className="rounded-full"
      />
    </div>
  )
}