import { StateCreator } from "zustand";
import { MovieProps, ReviewDataProps } from "@/types";
import { CommonSlice } from "./commonSlice";

type State = {
  dashboardMovies: MovieProps[];
  movieReviews: ReviewDataProps;
};

type Actions = {
  setDashboardMovies: (movies: MovieProps[]) => void;
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
};

const initialState: State = {
  dashboardMovies: [],
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
  setDashboardMovies: (movies) =>
    set({
      dashboardMovies: movies,
    }),
  reset: () => {
    set(initialState);
  },
});

export type MovieSlice = State & Actions;
export default createMovieSlice;
