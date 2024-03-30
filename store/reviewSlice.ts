import { StateCreator } from "zustand";
import { CommonSlice } from "./commonSlice";
import { DashboardSlice } from "@/store/dashboardSlice";
import { ReviewDataProps, ReviewProps } from "@/types";

type State = {
  contentLikes: ReviewDataProps;
  myReviews: ReviewDataProps;
};

type Actions = {
  fetchMyReviews: (page: number) => void;
  fetchContetLikes: (page: number) => void;
  editReview: (modifiedReview: ReviewProps) => void;
  deleteReview: (reviewId: string, type: string) => void;

  insertReviewLike: (reviewId: string, contentId: string, page: number) => void;
  deleteReviewLike: (reviewId: string, page: number) => void;
  resetReviewData: () => void;
  setContentLikes: (item: ReviewDataProps) => void;
  setMyReviews: (item: ReviewDataProps) => void;
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
> = (set) => ({
  ...initialState,
  fetchMyReviews: async (page: number) => {
    try {
      const res = await fetch(`/api/mypage/reviews?page=${page}`);
      const data = await res.json();

      set({ myReviews: data });
    } catch (e) {
      console.error(e);
    }
  },
  fetchContetLikes: async (page: number) => {
    try {
      const res = await fetch(`/api/mypage/reviews/likes?page=${page}`);
      const data = await res.json();

      set({ contentLikes: data });
    } catch (e) {
      console.error(e);
    }
  },
  insertReviewLike: async (reviewId, contentId, page) => {
    try {
      const params = { reviewId, contentId };
      const response = await fetch(
        `/api/mypage/reviews/likes/${reviewId}?page=${page}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        }
      );
      const data = await response.json();

      if (data.status === 500) {
        alert(data.error);
        return;
      }
    } catch (e) {
      console.error(e);
    }
  },
  deleteReviewLike: async (reviewId, page) => {
    try {
      const response = await fetch(
        `/api/mypage/reviews/likes/${reviewId}?page=${page}`,
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
    } catch (e) {
      console.error(e);
    }
  },
  editReview: async (modifiedReview) => {
    try {
      const response = await fetch(
        `/api/mypage/reviews/${modifiedReview.type}/${modifiedReview.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(modifiedReview),
        }
      );
      const data = await response.json();

      if (data.status === 500) {
        alert(data.error);
        return;
      }
    } catch (e) {
      console.error(e);
    }
  },
  deleteReview: async (reviewId, type) => {
    try {
      const response = await fetch(`/api/mypage/reviews/${type}/${reviewId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (data.status === 500) {
        alert(data.error);
        return;
      }
    } catch (e) {
      console.error(e);
    }
  },
  resetReviewData: () => {
    set(initialState);
  },
  setContentLikes: (item) => {
    set({ contentLikes: item });
  },
  setMyReviews: (item) => {
    set({ myReviews: item });
  },
});

export type ReviewSlice = State & Actions;
export default createReviewSlice;
