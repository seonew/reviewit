import { StateCreator } from "zustand";
import { MovieProps, CurrentMovieProps, MovieReviewProps } from "@/utils/types";
import { replaceDateFormat } from "@/utils/common";
import { CommonSlice } from "./commonSlice";

type State = {
  dashboardMovies: MovieProps[];
  currentMovie: CurrentMovieProps;
};

type Actions = {
  fetchDashboardMovies: (movies: MovieProps[]) => void;
  fetchMovieDetail: (id: string) => void;
  insertMovieReview: ({
    review,
    movieId,
  }: {
    review: string;
    movieId: string;
  }) => void;
};

const initialState: State = {
  dashboardMovies: [],
  currentMovie: {
    movie: {
      id: "",
      title: "",
      releaseDate: "",
      genres: [],
      originalTitle: "",
      tagline: "",
      budget: 0,
      revenue: 0,
      runtime: "",
      average: 0,
      adult: false,
    },
    keywords: [],
    recommendations: [],
    reviewData: {
      reviews: [],
      count: 0,
    },
    similars: [],
    videos: [],
  },
};

const createMovieSlice: StateCreator<
  CommonSlice & MovieSlice,
  [],
  [],
  MovieSlice
> = (set) => ({
  ...initialState,
  insertMovieReview: ({ review, movieId }) =>
    set((state) => {
      const response: MovieReviewProps = {
        id: Date.now().toString(),
        movieId: movieId,
        userName: state.user.name,
        // userId: state.user.id,
        content: review,
        updateDate: replaceDateFormat(new Date().toString()),
      };

      return {
        currentMovie: {
          ...state.currentMovie,
          reviewData: {
            ...state.currentMovie.reviewData,
            reviews: [response, ...state.currentMovie.reviewData.reviews],
            count: state.currentMovie.reviewData.count + 1,
          },
        },
      };
    }),
  fetchMovieDetail: async (id) => {
    try {
      const res = await fetch(`/movie/${id}/api`);
      const data = await res.json();

      set(() => ({ currentMovie: data }));
    } catch (error) {
      console.log(error);
    }
  },
  fetchDashboardMovies: (movies) =>
    set(() => ({
      dashboardMovies: movies,
    })),
  reset: () => {
    set(initialState);
  },
});

export type MovieSlice = State & Actions;
export default createMovieSlice;
