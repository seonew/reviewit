"use client";

import { MovieProps } from "@/utils/types";
import ScrollContents from "./ScrollContents";
import SectionTemplate from "./SectionTemplate";

const RecommendationSection = ({
  recommendations,
}: {
  recommendations: MovieProps[];
}) => {
  return (
    <SectionTemplate title="추천 콘텐츠">
      <ScrollContents contents={recommendations} />
    </SectionTemplate>
  );
};

export default RecommendationSection;
