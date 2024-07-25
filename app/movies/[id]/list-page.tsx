"use client";

import { useBoundStore as useStore } from "@/store";
import { useEffect, useState } from "react";
import { numberWithCommas } from "@/utils/common";
import KeywordSection from "@/app/components/view/KeywordSection";
import SimilarSection from "@/app/components/view/SimilarSection";
import RecommendationSection from "@/app/components/view/RecommendationSection";
import CommentSection from "@/app/components/view/CommentSection";
import VideoSection from "@/app/components/view/VideoSection";
import BannerSkeleton from "@/app/components/skeleton/BannerSkeleton";
import Pagination from "@/app/components/Pagination";
import { LIMIT } from "@/utils/constants";
import { MovieContentsProps } from "@/types";
import Contents from "@/app/components/view/Banner/Contents";
import BannerContainer from "@/app/components/view/Banner/BannerContainer";

type Props = {
  id: string;
  movieContents: MovieContentsProps;
};

export default function List({ id, movieContents }: Props) {
  const {
    fetchMovieReviews,
    insertMovieReview,
    insertReviewLike,
    deleteReviewLike,
    movieReviews,
    checkLoginStatus,
    addLikedMovie,
    deleteLikedMovie,
    setCurrentMovie,
    currentMovie,
    loaded,
  } = useStore();
  const { movie, keywords, recommendations, similars, videos } = movieContents;
  const [page, setPage] = useState<number>(1);

  const handleClickPage = (current: number) => {
    setPage(current);
    fetchMovieReviews(id, current);
  };

  const handleClickPrevButton = () => {
    setPage(page - 1);
    fetchMovieReviews(id, page - 1);
  };

  const handleClickNextButton = () => {
    setPage(page + 1);
    fetchMovieReviews(id, page + 1);
  };

  const handleSubmitReview = async (review: string, like: boolean) => {
    const isLogin = await checkLoginStatus();
    if (!isLogin) {
      return;
    }

    const contentInfo = {
      content: review,
      contentId: id,
      contentImgUrl: movie.posterImage ?? "",
      contentTitle: movie.title,
      like,
    };
    insertMovieReview(contentInfo);
  };

  const handleLikeReview = async (
    reviewId: string,
    isLike: boolean | undefined
  ) => {
    const isLogin = await checkLoginStatus();
    if (!isLogin) {
      return;
    }

    if (!isLike) {
      await insertReviewLike(reviewId, id, page);
    } else {
      await deleteReviewLike(reviewId, page);
    }
    await fetchMovieReviews(id, page);
  };

  const handleClickBookmark = async () => {
    const isLogin = await checkLoginStatus();
    if (!isLogin) {
      return;
    }

    const isChecked = currentMovie.checked;
    if (isChecked) {
      deleteLikedMovie(movie.id);
    } else {
      addLikedMovie(movie);
    }
  };

  const BannerContents = () => {
    const {
      id,
      title,
      originalTitle,
      tagline,
      releaseDate,
      genres,
      runtime,
      average,
      budget,
      revenue,
    } = movie;
    const nodes = genres.length > 0 && (
      <>
        {genres.map((genre: { id: string; name: string }) => {
          return (
            <span key={genre.id} className="mr-1">
              {genre.name}
            </span>
          );
        })}
      </>
    );
    const data = [
      { name: "개봉", content: releaseDate },
      { name: "장르", children: nodes },
      { name: "러닝타임", content: runtime },
      { name: "평점", content: average },
      { name: "제작비", content: budget },
      { name: "수익", content: revenue },
    ];
    const titleData = { title, originalTitle, tagline };
    const subRowData = data
      .filter((e) => (e.content !== undefined || e.children) && e)
      .map((e) => {
        if (e.name === "러닝타임") {
          e.content = `${runtime}분`;
        } else if (e.name === "평점") {
          e.content = `${average}점`;
        } else if (e.name === "제작비") {
          e.content = `$${numberWithCommas(budget)}`;
        } else if (e.name === "수익") {
          e.content = `$${numberWithCommas(revenue)}`;
        }
        return e;
      });

    return <Contents id={id} titleData={titleData} subRowData={subRowData} />;
  };

  useEffect(() => {
    fetchMovieReviews(id, 1);
    setCurrentMovie(movie);
  }, [fetchMovieReviews, id, movie, setCurrentMovie]);

  return (
    <div className="contents-container">
      {!loaded ? (
        <BannerSkeleton />
      ) : (
        <BannerContainer
          title={movie.title}
          backdropImage={movie.backdropImage}
          posterImage={movie.posterImage}
          checked={currentMovie.checked}
          onClickBookmark={handleClickBookmark}
        >
          <BannerContents />
        </BannerContainer>
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
          reviewData={movieReviews}
          onSubmit={handleSubmitReview}
          onClickLike={handleLikeReview}
        />
        {movieReviews.count > 0 && (
          <Pagination
            total={movieReviews.count}
            limit={LIMIT}
            currentPage={page}
            onClickPage={handleClickPage}
            onClickPrev={handleClickPrevButton}
            onClickNext={handleClickNextButton}
          />
        )}
      </div>
    </div>
  );
}
