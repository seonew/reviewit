"use client";

import Link from "next/link";
import { UserIcon } from "@heroicons/react/20/solid";
import HeaderSearchSection from "./HeaderSearchSection";
import Image from "next/image";
import logo from "@/public/assets/logo.png";

const Header = () => {
  return (
    <div className="header-wrapper">
      <div className="header-container">
        <div className="header-contents">
          <Link href="/" className="header-link" aria-label="Home">
            <Image src={logo} alt={"logo"} width={100} height={40} />
          </Link>
          <div className="inline-block flex items-center">
            <HeaderSearchSection />
            <Link href="/mypage" className="header-link" aria-label="Mypage">
              <UserIcon className="icon" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
