"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useBoundStore as useStore } from "@/store";
import Header from "@/app/components/Header";

const HeaderSection = () => {
  const pathname = usePathname();
  const searchPamams = useSearchParams();
  const query = searchPamams.get("query");
  const hideHeader = pathname.includes(`/search`) && !query;

  const { setQuery } = useStore();

  useEffect(() => {
    if (!pathname.includes(`/search`)) {
      setQuery("");
    }
  }, [pathname, setQuery]);

  return <>{hideHeader ? <></> : <Header />}</>;
};

export default HeaderSection;
