import {
  DETAIL_MOVIE_PATH,
  MOVIE_API_URL,
  MOVIE_BASE_URL,
  MOVIE_IMAGE_URL,
} from "@/utils/constants";
import {
  DetailMovieProps,
  MediaVideoProps,
  MovieApiResponse,
  MovieProps,
} from "@/types";

const movieApiKey = process.env.MOVIE_READONLY_API_KEY;
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${movieApiKey}`,
  },
};

export const loadMovieInfo = async (movieId: string) => {
  const url = `${MOVIE_API_URL}/movie/${movieId}?language=ko-KR`;
  const response = await fetch(url, options);

  if (response.status !== 200) {
    return null;
  }

  const data = await response.json();
  const movie: DetailMovieProps = {
    id: data.id,
    genres: data.genres,
    originalTitle: data.original_title,
    title: data.title,
    description: data.overview,
    tagline: data.tagline,
    releaseDate: data.release_date,
    budget: data.budget === 0 ? undefined : data.budget,
    revenue: data.revenue === 0 ? undefined : data.revenue,
    runtime: data.runtime === 0 ? undefined : data.runtime,
    average: data.vote_average === 0 ? undefined : data.vote_average,
    posterImage:
      data.poster_path !== null
        ? `${MOVIE_BASE_URL}/t/p/w440_and_h660_face${data.poster_path}`
        : undefined,
    backdropImage:
      data.backdrop_path !== null
        ? `${MOVIE_IMAGE_URL}/t/p/original${data.backdrop_path}`
        : undefined,
    adult: data.adult,
  };

  return movie;
};

export const loadMovieContents = async (movieId: string) => {
  const keywordsUrl = `${MOVIE_API_URL}/movie/${movieId}/keywords`;
  const keywordsResponse = await fetch(keywordsUrl, options);
  const keywordsData = await keywordsResponse.json();
  const { keywords } = keywordsData;

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
          link: `${DETAIL_MOVIE_PATH}/${recommendation.id}`,
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
          link: `${DETAIL_MOVIE_PATH}/${similar.id}`,
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

  return {
    keywords,
    recommendations,
    similars,
    videos,
  };
};
