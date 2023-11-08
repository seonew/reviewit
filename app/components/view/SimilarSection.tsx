"use client";

import { MovieProps } from "@/types";
import ScrollContents from "./ScrollContents";
import SectionTemplate from "./SectionTemplate";

type Props = {
  similars: MovieProps[];
};

const SimilarSection = ({ similars }: Props) => {
  return (
    <SectionTemplate title="유사 콘텐츠">
      <ScrollContents contents={similars} />
    </SectionTemplate>
  );
};

export default SimilarSection;
