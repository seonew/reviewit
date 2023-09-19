import { replaceDateFormat } from "@/utils/common";
import { movieApiUrl, movieBaseUrl } from "@/utils/constants";
import { MediaVideoProps, MovieProps, ReviewProps } from "@/utils/types";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const movieId = params.id;

  try {
    const movie_api_key = process.env.MOVIE_READONLY_API_KEY;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${movie_api_key}`,
      },
    };

    const keywordsUrl = `${movieApiUrl}/movie/${movieId}/keywords`;
    const keywordsResponse = await fetch(keywordsUrl, options);
    const keywordsData = await keywordsResponse.json();
    const { keywords } = keywordsData;

    const reviewsUrl = `${movieApiUrl}/movie/${movieId}/reviews?language=ko-KR`;
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

    const recommendationsUrl = `${movieApiUrl}/movie/${movieId}/recommendations?language=ko-KR`;
    const recommendationsResponse = await fetch(recommendationsUrl, options);
    const recommendationsData = await recommendationsResponse.json();
    const recommendationsResult = recommendationsData.results;
    const recommendations: MovieProps[] = recommendationsResult.map(
      (recommendation: {
        id: string;
        title: string;
        overview: string;
        release_date: string;
        poster_path: string;
        vote_average: string;
        adult: boolean;
      }) => {
        if (!recommendation.adult)
          return {
            id: recommendation.id,
            title: recommendation.title,
            description: recommendation.overview,
            releaseDate: recommendation.release_date,
            posterImage:
              recommendation.poster_path !== null
                ? `${movieBaseUrl}/t/p/w440_and_h660_face${recommendation.poster_path}`
                : undefined,
            link: `/movie/${recommendation.id}`,
            average: recommendation.vote_average,
            adult: recommendation.adult,
          };
      }
    );

    const similarUrl = `${movieApiUrl}/movie/${movieId}/similar?language=ko-KR`;
    const similarResponse = await fetch(similarUrl, options);
    const similarData = await similarResponse.json();
    const similarResult = similarData.results;
    const similars: MovieProps[] = similarResult.map(
      (similar: {
        id: string;
        title: string;
        overview: string;
        release_date: string;
        poster_path: string;
        vote_average: string;
        adult: boolean;
      }) => {
        if (!similar.adult)
          return {
            id: similar.id,
            title: similar.title,
            description: similar.overview,
            releaseDate: similar.release_date,
            posterImage:
              similar.poster_path !== null
                ? `${movieBaseUrl}/t/p/w440_and_h660_face${similar.poster_path}`
                : undefined,
            link: `/movie/${similar.id}`,
            average: similar.vote_average,
            adult: similar.adult,
          };
      }
    );

    const videoUrl = `${movieApiUrl}/movie/${movieId}/videos?language=ko-KR`;
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
              : `${movieBaseUrl}/video/play?key=${video.key}`,
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
