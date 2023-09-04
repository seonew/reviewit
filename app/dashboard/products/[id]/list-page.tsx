"use client";

import useStore from "@/store";
import { ReactNode } from "react";
import Image from "next/image";
import { handleClickSignIn } from "@/utils/common";
import CommentSection from "@/components/view/CommentSection";
import { PhotoIcon } from "@heroicons/react/24/outline";
import DefaultImage from "@/components/DefaultImage";

export default function List({ id }: { id: string }) {
  const { currentProduct: product, user, currentMovie } = useStore();
  const { reviewData } = currentMovie;

  const handleSubmitReview = (review: string) => {
    if (!user.id && !user.name) {
      handleClickSignIn();
      return;
    }
  };

  const handleLikeReview = (reviewId: string) => {
    console.log(reviewId);
  };

  return (
    <div className="contents-container">
      {product && (
        <>
          <div className="banner-container">
            <div className="relative pt-24 ml-16 z-10 text-white">
              <div className="float-left mr-10 w-52 h-80">
                {product.image ? (
                  <Image
                    className="rounded"
                    src={product.image}
                    alt={product.title}
                    width={200}
                    height={300}
                  />
                ) : (
                  <DefaultImage size="w-52 h-80">
                    <PhotoIcon className="w-40 h-40" />
                  </DefaultImage>
                )}
              </div>
              <div className="relative ml-10 float-left w-2/3">
                <div className="break-words">
                  <h3 className="text-3xl leading-10 font-bold text-ellipsis">
                    {product.title}
                  </h3>
                </div>
                <div className="pt-8 pb-10">
                  <Info name="카테고리" content={product.category} />
                  <Info name="판매처" content={product.mall} />
                  {product.brand && (
                    <Info name="브랜드" content={product.brand} />
                  )}
                  {product.maker && (
                    <Info name="제공" content={product.maker} />
                  )}
                  <Info name="가격" content={`${product.lprice}원`} />
                </div>
              </div>
            </div>
            <div className="banner-background opacity-50"></div>
          </div>

          <div className="pb-10 min-w-1024">
            <hr className="line-hr" />
            <CommentSection
              reviewData={reviewData}
              onSubmit={handleSubmitReview}
              onClickLike={handleLikeReview}
            />
          </div>
        </>
      )}
    </div>
  );
}

const Info = ({
  name,
  content,
  children,
}: {
  name: string;
  content?: string | number;
  children?: ReactNode;
}) => {
  return (
    <p>
      <span className="movie-info-description">{name}</span>
      {children ?? <span>{content}</span>}
    </p>
  );
};
