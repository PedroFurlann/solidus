import Image from "next/image"

interface Props {
  size: "small" | "medium" | "large" | "extraLarge"
  image: string
}

export function Avatar({ size = "medium", image }: Props) {
  return (
    <div className={`border flex items-center justify-center border-amber-600 rounded-full ${size === "small" ? "h-8 w-8" : size === "medium" ? "h-12 w-12" : size === "large" ? "h-16 w-16" : "h-20 w-20"}`}>
      <Image 
        alt="Avatar Image"
        src={image}
        width={size === "small" ? 32 : size === "medium" ? 48 : size === "large" ? 64 : 80}
        height={size === "small" ? 32 : size === "medium" ? 48 : size === "large" ? 64 : 80}
        className="rounded-full"
      />
    </div>
  )
}