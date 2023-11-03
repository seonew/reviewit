import { StateCreator } from "zustand";
import { CommonSlice } from "./commonSlice";
import { DashboardSlice } from "@/store/dashboardSlice";
import { ReviewProps } from "@/utils/types";

type State = {
  contentLikes: { reviews: ReviewProps[]; count: number };
  myReviews: { reviews: ReviewProps[]; count: number };
};

type Actions = {
  fetchMyReviews: (page: number) => void;
  fetchContetLikes: (page: number) => void;

  insertReviewLike: (reviewId: string, contentId: string, page: number) => void;
  deleteReviewLike: (reviewId: string, page: number) => void;
  resetReviewData: () => void;
};

const initialState: State = {
  contentLikes: {
    reviews: [],
    count: 0,
  },
  myReviews: { reviews: [], count: 0 },
};

const createReviewSlice: StateCreator<
  CommonSlice & ReviewSlice & DashboardSlice,
  [],
  [],
  ReviewSlice
> = (set, get) => ({
  ...initialState,
  fetchMyReviews: async (page: number) => {
    const res = await fetch(`/mypage/reviews/api?page=${page}`);
    const data = await res.json();

    set((state) => ({
      myReviews: data,
    }));
  },
  fetchContetLikes: async (page: number) => {
    const res = await fetch(`/mypage/reviews/likes/api?page=${page}`);
    const data = await res.json();

    set((state) => ({
      contentLikes: data,
    }));
  },
  insertReviewLike: async (reviewId, contentId, page) => {
    try {
      const params = { reviewId, contentId };
      const response = await fetch(`/api/review/like?page=${page}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      const data = await response.json();

      if (data.status === 500) {
        alert(data.error);
        return;
      }
      get().updateBookReview(data);
    } catch (error) {
      console.log(error);
    }
  },
  deleteReviewLike: async (reviewId, page) => {
    try {
      const response = await fetch(
        `/api/review/like/${reviewId}?page=${page}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (data.status === 500) {
        alert(data.error);
        return;
      }
      get().updateBookReview(data);
    } catch (error) {
      console.log(error);
    }
  },
  resetReviewData: () => {
    set(initialState);
  },
});

export type ReviewSlice = State & Actions;
export default createReviewSlice;
