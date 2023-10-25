import Image from "next/image";
import Logo from "../../public/logo.png";
import LinkedinIcon from "../../public/icons8-linkedin.svg";
import GitHubIcon from "../../public/logo_github_icon_143196.svg";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer p-6 bg-gray-950 text-gray-200 font-bold items-center flex  justify-center gap-12 ">
      <aside className="flex flex-col items-center justify-center mt-6">
        <p className="text-center text-gray-200 font-bold">
          Solidus
          <br />
          Developed by Pedro Furlan
        </p>
      </aside>
      <nav className="flex flex-col items-center">
        <header className="footer-title opacity-80 text-center text-gray-200 font-bold">Social</header>
        <div className="grid grid-flow-col gap-4">
          <Link
            href="https://www.linkedin.com/in/pedro-furlan-b77707245/"
            className="no-underline"
            target="_blank"
          >
            <Image alt="Linkedin logo" src={LinkedinIcon} />
          </Link>{" "}
          <Link
            href="https://github.com/PedroFurlann"
            className="no-underline"
            target="_blank"
          >
            <Image alt="Github logo" src={GitHubIcon} className="w-12 h-12 bg-transparent" />
          </Link>{" "}
        </div>
      </nav>
    </footer>

    
  );
}
