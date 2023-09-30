"use client";

import { useBoundStore as useStore } from "@/store";
import { ReactNode, useEffect } from "react";
import Image from "next/image";
import { handleClickSignIn, numberWithCommas } from "@/utils/common";
import KeywordSection from "@/app/components/view/KeywordSection";
import SimilarSection from "@/app/components/view/SimilarSection";
import RecommendationSection from "@/app/components/view/RecommendationSection";
import CommentSection from "@/app/components/view/CommentSection";
import { PhotoIcon } from "@heroicons/react/24/outline";
import DefaultImage from "@/app/components/DefaultImage";
import VideoSection from "@/app/components/view/VideoSection";
import InitializeBanner from "@/app/components/InitializeBanner";

export default function List({ id }: { id: string }) {
  const {
    currentMovie,
    fetchMovieDetail,
    insertMovieReview,
    fetchCurrentMovie,
    initializeMovie,
    user,
  } = useStore();
  const { movie, keywords, reviewData, recommendations, similars, videos } =
    currentMovie;
  const loaded = movie.id === "" ? false : true;

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

  useEffect(() => {
    initializeMovie();
    fetchCurrentMovie(id);
  }, [fetchCurrentMovie, id, initializeMovie]);

  useEffect(() => {
    if (!loaded) {
      return;
    }
    fetchMovieDetail(id);
  }, [fetchMovieDetail, id, loaded]);

  return (
    <div className="contents-container">
      {!loaded ? (
        <InitializeBanner />
      ) : (
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
                <GridRow name="개봉" content={movie.releaseDate} />
                <GridRow name="장르">
                  {movie.genres.map((genre: { id: string; name: string }) => {
                    return (
                      <span key={genre.id} className="mr-1">
                        {genre.name}
                      </span>
                    );
                  })}
                </GridRow>
                {movie.runtime && (
                  <GridRow name="러닝 타임" content={`${movie.runtime}분`} />
                )}
                {movie.average && (
                  <GridRow name="평점" content={`${movie.average}점`} />
                )}
                {movie.budget && (
                  <GridRow
                    name="제작비"
                    content={`$${numberWithCommas(movie.budget)}`}
                  />
                )}
                {movie.revenue && (
                  <GridRow
                    name="수익"
                    content={`$${numberWithCommas(movie.revenue)}`}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="banner-background opacity-60"></div>
        </div>
      )}
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
    </div>
  );
}

const GridRow = ({
  name,
  content,
  children,
}: {
  name: string;
  content?: string | number;
  children?: ReactNode;
}) => {
  return (
    <div className="flex">
      <div className="grow-0 w-20 movie-info-description">{name}</div>
      <div className="grow">{children ?? <div>{content}</div>}</div>
    </div>
  );
};
