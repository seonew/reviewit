"use client";

import Link from "next/link";
import SectionTemplate from "./SectionTemplate";

type Props = {
  keywords: Array<{ id: string; name: string }>;
};

const KeywordSection = ({ keywords }: Props) => {
  return (
    <SectionTemplate title="키워드">
      <ul className="tag-list">
        {keywords.map((keyword) => {
          return (
            <li key={keyword.id} className="m-1">
              <Link
                className="tag-item cursor-pointer"
                href={`/movies/keyword/${keyword.id}`}
              >
                {keyword.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </SectionTemplate>
  );
};

export default KeywordSection;
