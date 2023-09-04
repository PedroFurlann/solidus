import Lottie from "lottie-react";
import loadingCoin from "../lib/lottie/loadingCoin.json";
import useWindowSize from "@/hooks/useWindowsSize";

interface Props {
  size: "sm" | "md" | "lg" | "xl";
}

export function MainLoading({ size = "md" }: Props) {
  const { isMobile } = useWindowSize();

  const animationSize = isMobile
    ? 150
    : size === "sm"
    ? 200
    : size === "md"
    ? 260
    : size === "lg"
    ? 320
    : 400;

  return (
    <div className="flex flex-col gap-1 items-center justify-center">
      <Lottie
        animationData={loadingCoin}
        loop={true}
        style={{
          width: animationSize,
          height: animationSize,
        }}
      />

      <p
        className={`text-amber-400 font-extrabold ${
          isMobile ? "text-lg" :
          size === "sm"
            ? "text-lg"
            : size === "md"
            ? "text-xl"
            : size === "lg"
            ? "text-2xl"
            : "text-3xl"
        }`}
      >
        Carregando
      </p>
    </div>
  );
}
