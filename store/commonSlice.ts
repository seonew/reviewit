import { StateCreator } from "zustand";
import { User } from "@/types";
import { DashboardSlice } from "./dashboardSlice";
import { ReviewSlice } from "./reviewSlice";
import { MovieSlice } from "./movieSlice";

type State = {
  user: User;
  isSignedIn: boolean;
  isOpen: boolean;
};

type Actions = {
  fetchUserInfo: (token: string) => void;
  updateUser: (name?: string, imageUrl?: string) => void;
  setIsOpen: (item: boolean) => void;
  setIsSignedIn: (item: boolean) => void;
  signOut: () => void;
  resetCommonData: () => void;
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
  CommonSlice & DashboardSlice & ReviewSlice & MovieSlice,
  [],
  [],
  CommonSlice
> = (set, get, api) => ({
  ...initialState,
  updateUser: async (name, avatarUrl) => {
    try {
      const params = { name, avatarUrl };
      const res = await fetch(`/api/mypage/users`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      const data = await res.json();

      set((state) => {
        let nextUser = { ...state.user };
        if (data.hasOwnProperty("name")) {
          nextUser = { ...nextUser, name: data.name };
        }
        if (data.hasOwnProperty("avatarUrl")) {
          nextUser = { ...nextUser, avatarUrl: data.avatarUrl };
        }

        return { user: nextUser };
      });
    } catch (error) {}
  },
  fetchUserInfo: async (token: string) => {
    try {
      const res = await fetch(`/api/user?token=${token}`);
      const data = await res.json();

      const userRes = await fetch(`/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const userData = await userRes.json();

      set({ user: userData });
    } catch (error) {
      console.log(error);
    }
  },
  signOut: async () => {
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    get().resetReviewData();
    get().resetCommonData();
    get().resetDashboardData();
    get().resetMovieData();
  },
  resetCommonData: () => {
    set(initialState);
  },
  setIsOpen: (item) => set({ isOpen: item }),
  setIsSignedIn: (item: boolean) => set((state) => ({ isSignedIn: item })),
});

export type CommonSlice = State & Actions;
export default createCommonSlice;
