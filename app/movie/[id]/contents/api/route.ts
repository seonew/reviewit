import { replaceDateFormat } from "@/utils/common";
import { MOVIE_API_URL, MOVIE_BASE_URL } from "@/utils/constants";
import {
  MediaVideoProps,
  MovieApiResponse,
  MovieProps,
  ReviewProps,
} from "@/types";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const movieId = params.id;

  try {
    const movieApiKey = process.env.MOVIE_READONLY_API_KEY;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${movieApiKey}`,
      },
    };

    const keywordsUrl = `${MOVIE_API_URL}/movie/${movieId}/keywords`;
    const keywordsResponse = await fetch(keywordsUrl, options);
    const keywordsData = await keywordsResponse.json();
    const { keywords } = keywordsData;

    const reviewsUrl = `${MOVIE_API_URL}/movie/${movieId}/reviews?language=ko-KR`;
    const reviewsResponse = await fetch(reviewsUrl, options);
    const reviewsData = await reviewsResponse.json();
    const reviewsResult = reviewsData.results;
    const reviews: ReviewProps[] = reviewsResult.map(
      (review: {
        id: string;
        author: string;
        content: string;
        updated_at: string;
      }) => {
        return {
          id: review.id,
          movieId: movieId,
          userName: review.author,
          content: review.content,
          updateDate: replaceDateFormat(review.updated_at),
        };
      }
    );

    const recommendationsUrl = `${MOVIE_API_URL}/movie/${movieId}/recommendations?language=ko-KR`;
    const recommendationsResponse = await fetch(recommendationsUrl, options);
    const recommendationsData = await recommendationsResponse.json();
    const recommendationsResult = recommendationsData.results;
    const recommendations: MovieProps[] = recommendationsResult.map(
      (recommendation: MovieApiResponse) => {
        if (!recommendation.adult)
          return {
            id: recommendation.id,
            title: recommendation.title,
            description: recommendation.overview,
            releaseDate: recommendation.release_date,
            posterImage:
              recommendation.poster_path !== null
                ? `${MOVIE_BASE_URL}/t/p/w440_and_h660_face${recommendation.poster_path}`
                : undefined,
            link: `/movie/${recommendation.id}`,
            average: recommendation.vote_average,
            adult: recommendation.adult,
          };
      }
    );

    const similarUrl = `${MOVIE_API_URL}/movie/${movieId}/similar?language=ko-KR`;
    const similarResponse = await fetch(similarUrl, options);
    const similarData = await similarResponse.json();
    const similarResult = similarData.results;
    const similars: MovieProps[] = similarResult.map(
      (similar: MovieApiResponse) => {
        if (!similar.adult)
          return {
            id: similar.id,
            title: similar.title,
            description: similar.overview,
            releaseDate: similar.release_date,
            posterImage:
              similar.poster_path !== null
                ? `${MOVIE_BASE_URL}/t/p/w440_and_h660_face${similar.poster_path}`
                : undefined,
            link: `/movie/${similar.id}`,
            average: similar.vote_average,
            adult: similar.adult,
          };
      }
    );

    const videoUrl = `${MOVIE_API_URL}/movie/${movieId}/videos?language=ko-KR`;
    const videoResponse = await fetch(videoUrl, options);
    const videoData = await videoResponse.json();
    const videoResult = videoData.results;
    const videos: MediaVideoProps[] = videoResult.map(
      (video: {
        id: string;
        name: string;
        site: string;
        key: string;
        type: string;
        official: boolean;
        published_at: string;
      }) => {
        return {
          id: video.id,
          title: video.name,
          site: video.site,
          type: video.type,
          official: video.official,
          publishedDate: video.published_at,
          link:
            video.site === "YouTube"
              ? `https://youtu.be/${video.key}`
              : `${MOVIE_BASE_URL}/video/play?key=${video.key}`,
          backgroundImage: `https://i.ytimg.com/vi/${video.key}/hqdefault.jpg`,
        };
      }
    );

    videos.sort((a, b) => {
      const typeOrder = ["Teaser", "Trailer", "Clip", "Featurette"];
      return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
    });

    const result = {
      keywords,
      reviewData: {
        reviews: reviews,
        count: reviewsData.total_results,
      },
      recommendations,
      similars,
      videos,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
  }

  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
