import { StateCreator } from "zustand";
import { LikedContent, LikedMovie, MovieProps, ReviewDataProps } from "@/types";
import { CommonSlice } from "./commonSlice";
import { DashboardSlice } from "./dashboardSlice";

type State = {
  dashboardMovies: MovieProps[];
  movieReviews: ReviewDataProps;

  likedMovies: LikedContent[];
};

type Actions = {
  addLikedMovie: (movie: LikedMovie) => void;
  deleteLikedMovie: (id: string) => void;

  setSearchedMovies: (id: string, checked: boolean) => void;
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
  resetMovieData: () => void;
};

const initialState: State = {
  dashboardMovies: [],
  movieReviews: {
    reviews: [],
    count: 0,
    stats: [],
  },
  likedMovies: [],
};

const createMovieSlice: StateCreator<
  CommonSlice & MovieSlice & DashboardSlice,
  [],
  [],
  MovieSlice
> = (set, get) => ({
  ...initialState,
  addLikedMovie: async (movie) => {
    try {
      const contentType = "movie";
      const params = {
        contentId: movie.id,
        contentTitle: movie.title,
        contentImgUrl: movie.posterImage ?? "",
        contentType,
      };
      const nextChecked: boolean = await get().insertLikedContent(
        contentType,
        params
      );

      get().setSearchedMovies(movie.id, nextChecked);
      set((state) => {
        const nextLikedMovies: LikedContent[] = [
          ...state.likedMovies,
          {
            id: movie.id,
            imgUrl: movie.posterImage ?? "",
            title: movie.title,
            link: movie.link ?? "",
            type: contentType,
          },
        ];
        return {
          likedMovies: nextLikedMovies,
        };
      });
    } catch (e) {
      console.error(e);
    }
  },
  deleteLikedMovie: async (id) => {
    try {
      const contentType = "movie";
      const nextChecked: boolean = await get().deleteLikeContent(
        contentType,
        id
      );
      get().setSearchedMovies(id, nextChecked);

      set((state) => {
        const nextLikedMovies: LikedContent[] = state.likedMovies.filter(
          (current) => current.id !== id
        );
        return {
          likedMovies: nextLikedMovies,
        };
      });
    } catch (e) {
      console.error(e);
    }
  },

  fetchMovieReviews: async (contentId, page) => {
    try {
      const response = await fetch(
        `/api/movies/${contentId}/reviews?page=${page}`
      );
      const data = await response.json();
      set({ movieReviews: data });
      get().setSpinner(false);
    } catch (error) {
      console.log(error);
    }
  },
  insertMovieReview: async (contentInfo) => {
    try {
      get().setSpinner(true);
      const { contentId } = contentInfo;
      const response = await fetch(`/api/movies/${contentId}/reviews`, {
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
  setSearchedMovies: (id, checked) => {
    set((state) => {
      const modifiedMovies = state.searchedMovies.map((item) => {
        return id === item.id ? { ...item, checked } : item;
      });

      return {
        searchedMovies: modifiedMovies,
      };
    });
  },
  setDashboardMovies: (movies) =>
    set({
      dashboardMovies: movies,
    }),
  resetMovieData: () => {
    set(initialState);
  },
});

export type MovieSlice = State & Actions;
export default createMovieSlice;
