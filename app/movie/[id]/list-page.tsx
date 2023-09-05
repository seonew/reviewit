"use client";

import { useBoundStore as useStore } from "@/store";
import { ReactNode, useLayoutEffect } from "react";
import Image from "next/image";
import { handleClickSignIn, numberWithCommas } from "@/utils/common";
import KeywordSection from "@/components/view/KeywordSection";
import SimilarSection from "@/components/view/SimilarSection";
import RecommendationSection from "@/components/view/RecommendationSection";
import CommentSection from "@/components/view/CommentSection";
import { PhotoIcon } from "@heroicons/react/24/outline";
import DefaultImage from "@/components/DefaultImage";
import VideoSection from "@/components/view/VideoSection";

export default function List({ id }: { id: string }) {
  const { currentMovie, fetchMovieDetail, insertMovieReview, user } =
    useStore();
  const { movie, keywords, reviewData, recommendations, similars, videos } =
    currentMovie;

  const handleSubmitReview = (review: string) => {
    if (!user.id && !user.name) {
      handleClickSignIn();
      return;
    }
    insertMovieReview({ review, movieId: id });
  };

  const handleLikeReview = (reviewId: string) => {
    console.log(reviewId);
  };

  useLayoutEffect(() => {
    fetchMovieDetail(id);
  }, [fetchMovieDetail, id]);

  return (
    <div className="contents-container">
      {movie && (
        <>
          <div className="banner-container">
            {movie.backdropImage && (
              <Image
                className="rounded opacity-95"
                src={movie.backdropImage}
                alt={movie.title}
                fill
                sizes="100vw"
                style={{
                  objectFit: "cover",
                }}
              />
            )}
            <div className="relative pt-24 ml-16 z-10 text-white">
              <div className="float-left mr-10 w-52 h-80">
                {movie.posterImage ? (
                  <Image
                    className="rounded"
                    src={movie.posterImage}
                    alt={movie.title}
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
                    {movie.title}
                  </h3>
                  <div>{movie.originalTitle}</div>
                  <div className="pt-5">{movie.tagline}</div>
                </div>
                <div className="pt-8 pb-10">
                  <Info name="개봉" content={movie.releaseDate} />
                  <Info name="장르">
                    {movie.genres.map((genre: { id: string; name: string }) => {
                      return (
                        <span key={genre.id} className="mr-1">
                          {genre.name}
                        </span>
                      );
                    })}
                  </Info>
                  <Info name="러닝 타임" content={`${movie.runtime}분`} />
                  <Info name="평점" content={movie.average} />
                  {movie.budget && (
                    <Info
                      name="제작비"
                      content={`$${numberWithCommas(movie.budget)}`}
                    />
                  )}
                  {movie.revenue && (
                    <Info
                      name="수익"
                      content={`$${numberWithCommas(movie.revenue)}`}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="banner-background opacity-60"></div>
          </div>

          <div className="pb-10 min-w-1024">
            <div className="movie-description">
              <div className="mb-10">{movie.description}</div>
              <div>
                {videos.length > 0 && <VideoSection videos={videos} />}
                {keywords.length > 0 && <KeywordSection keywords={keywords} />}
              </div>
            </div>

            {recommendations.length > 0 && (
              <>
                <hr className="line-hr" />
                <RecommendationSection recommendations={recommendations} />
              </>
            )}

            {similars.length > 0 && (
              <>
                <hr className="line-hr" />
                <SimilarSection similars={similars} />
              </>
            )}

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
