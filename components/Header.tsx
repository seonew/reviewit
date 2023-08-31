"use client";

import Link from "next/link";
import { HomeIcon, BookOpenIcon, UserIcon } from "@heroicons/react/20/solid";

const Header = () => {
  return (
    <div className="header-wrapper">
      <div className="header-container">
        <div className="header-contents">
          <Link href="/" className="header-link">
            <HomeIcon className="icon" />
          </Link>
          <Link href="/dashboard" className="header-link">
            <BookOpenIcon className="icon" />
          </Link>
          <Link href="/mypage" className="header-link">
            <UserIcon className="icon" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
