import { StateCreator } from "zustand";
import { User } from "@/utils/types";
import createDashboardSlice, { DashboardSlice } from "@/store/dashboardSlice";

type State = {
  user: User;
  isSignedIn: boolean;
  isOpen: boolean;
};

type Actions = {
  fetchUserInfo: (token: string) => void;
  setIsOpen: (item: boolean) => void;
  setIsSignedIn: (item: boolean) => void;
  signOut: () => void;

  insertReviewLike: ({
    reviewId,
    user,
  }: {
    reviewId: string;
    contentId: string;
    user: User;
  }) => void;
  deleteReviewLike: ({ reviewId }: { reviewId: string }) => void;
};

const initialState: State = {
  user: {
    id: "",
    name: "",
    loginType: "",
    avatarUrl: "",
  },
  isSignedIn: false,
  isOpen: false,
};

const createCommonSlice: StateCreator<
  CommonSlice & DashboardSlice,
  [],
  [],
  CommonSlice
> = (set, get, api) => ({
  ...initialState,
  insertReviewLike: async ({ reviewId, contentId, user }) => {
    try {
      const params = { reviewId, contentId, user };
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
  deleteReviewLike: async ({ reviewId }) => {
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
  fetchUserInfo: async (token: string) => {
    try {
      const res = await fetch(`/api/user?token=${token}`);
      const data = await res.json();

      set((state) => ({ user: data }));
    } catch (error) {
      console.log(error);
    }
  },
  signOut: () => {
    const storage = localStorage.getItem("item-storage");
    if (storage) {
      try {
        const object = JSON.parse(storage);
        delete object.user;

        localStorage.setItem("item-storage", JSON.stringify(object));
      } catch (error) {}
    }

    set((state) => {
      return { isSignedIn: false, user: initialState.user };
    });
  },
  reset: () => {
    set(initialState);
  },
  setIsOpen: (item) => set({ isOpen: item }),
  setIsSignedIn: (item: boolean) => set((state) => ({ isSignedIn: item })),
});

export type CommonSlice = State & Actions;
export default createCommonSlice;
