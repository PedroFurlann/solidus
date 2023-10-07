import ReduxProvider from "@/components/ReduxProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { AuthContextProvider } from "@/contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const roboto = Roboto({ weight: "400", subsets: ["greek"] });

export const metadata: Metadata = {
  title: "Solidus",
  description: "Sua organização financeira em um lugar só.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <ReduxProvider>
        <AuthContextProvider>
          <ToastContainer />
        <body className={roboto.className}>{children}</body>
        </AuthContextProvider>
      </ReduxProvider>
    </html>
  );
}
