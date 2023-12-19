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
  fetchUserInfo: async (token: string) => {
    try {
      const res = await fetch(`/api/user?token=${token}`);
      const data = await res.json();

      set({ user: data });
    } catch (error) {
      console.log(error);
    }
  },
  signOut: async () => {
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    get().resetReviewData();
    get().resetCommonData();

    set((state) => {
      return { isSignedIn: false, user: initialState.user };
    });
  },
  resetCommonData: () => {
    set(initialState);
  },
  setIsOpen: (item) => set({ isOpen: item }),
  setIsSignedIn: (item: boolean) => set((state) => ({ isSignedIn: item })),
});

export type CommonSlice = State & Actions;
export default createCommonSlice;
