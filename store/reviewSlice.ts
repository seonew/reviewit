import { StateCreator } from "zustand";
import { CommonSlice } from "./commonSlice";
import createDashboardSlice, { DashboardSlice } from "@/store/dashboardSlice";

type State = {
  contentLikes: [];
  myReviews: [];
};

type Actions = {
  fetchMyReview: () => void;

  insertReviewLike: (reviewId: string, contentId: string) => void;
  deleteReviewLike: (reviewId: string) => void;
};

const initialState: State = {
  contentLikes: [],
  myReviews: [],
};

const createReviewSlice: StateCreator<
  CommonSlice & ReviewSlice & DashboardSlice,
  [],
  [],
  ReviewSlice
> = (set, get, api) => ({
  ...initialState,
  fetchMyReview: async () => {
    const res = await fetch(`/mypage/reviews/api`);
    const data = await res.json();

    set((state) => ({
      contentLikes: data.contentLikes,
      myReviews: data.myReviews,
    }));
  },
  insertReviewLike: async (reviewId, contentId) => {
    try {
      const params = { reviewId, contentId };
      const response = await fetch(`/api/review/like`, {
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

      createDashboardSlice(set, get, api).updateBookReview(data);
    } catch (error) {
      console.log(error);
    }
  },
  deleteReviewLike: async (reviewId) => {
    try {
      const response = await fetch(`/api/review/like/${reviewId}`, {
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

      createDashboardSlice(set, get, api).updateBookReview(data);
    } catch (error) {
      console.log(error);
    }
  },
  reset: () => {
    set(initialState);
  },
});

export type ReviewSlice = State & Actions;
export default createReviewSlice;
