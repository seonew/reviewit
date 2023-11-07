import { StateCreator } from "zustand";
import { MovieProps, CurrentMovieProps, ReviewDataProps } from "@/types";
import { CommonSlice } from "./commonSlice";

type State = {
  dashboardMovies: MovieProps[];
  currentMovie: CurrentMovieProps;
  movieReviews: ReviewDataProps;
};

type Actions = {
  fetchDashboardMovies: (movies: MovieProps[]) => void;
  fetchMovieDetail: (id: string) => void;
  fetchCurrentMovie: (id: string) => void;
  fetchMovieReviews: (id: string, page: number) => void;
  insertMovieReview: ({
    content,
    contentId,
    contentImgUrl,
    contentTitle,
    like,
  }: {
    content: string;
    contentId: string;
    contentImgUrl: string;
    contentTitle: string;
    like: boolean;
  }) => void;

  initializeMovie: () => void;
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
      runtime: 0,
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
  movieReviews: {
    reviews: [],
    count: 0,
    stats: [],
  },
};

const createMovieSlice: StateCreator<
  CommonSlice & MovieSlice,
  [],
  [],
  MovieSlice
> = (set, get) => ({
  ...initialState,
  fetchMovieReviews: async (contentId, page) => {
    try {
      const response = await fetch(
        `/movie/${contentId}/reviews/api?page=${page}`
      );
      const data = await response.json();
      set({ movieReviews: data });
    } catch (error) {
      console.log(error);
    }
  },
  insertMovieReview: async (contentInfo) => {
    try {
      const { contentId } = contentInfo;
      const response = await fetch(`/movie/${contentId}/reviews/api`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contentInfo),
      });
      const data = await response.json();
      if (data.status === 500) {
        alert(data.error);
        return;
      }

      get().fetchMovieReviews(contentId, 1);
    } catch (error) {
      console.log(error);
    }
  },
  fetchCurrentMovie: async (id) => {
    try {
      const res = await fetch(`/movie/${id}/api`);
      const data = await res.json();

      set((state) => ({
        currentMovie: {
          ...state.currentMovie,
          movie: data.movie,
        },
      }));
    } catch (error) {
      console.log(error);
    }
  },
  fetchMovieDetail: async (id) => {
    try {
      const res = await fetch(`/movie/${id}/contents/api`);
      const data = await res.json();
      const { keywords, reviewData, recommendations, similars, videos } = data;

      set((state) => ({
        currentMovie: {
          ...state.currentMovie,
          keywords,
          reviewData,
          recommendations,
          similars,
          videos,
        },
      }));
    } catch (error) {
      console.log(error);
    }
  },
  fetchDashboardMovies: (movies) =>
    set(() => ({
      dashboardMovies: movies,
    })),
  initializeMovie: () => {
    set(() => ({
      currentMovie: initialState.currentMovie,
    }));
  },
  reset: () => {
    set(initialState);
  },
});

export type MovieSlice = State & Actions;
export default createMovieSlice;
