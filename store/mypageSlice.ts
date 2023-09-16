import { StateCreator } from "zustand";
import { CommonSlice } from "./commonSlice";

type State = {
  contentLikes: [];
};

type Actions = {
  fetchContentLikes: () => void;
};

const initialState: State = {
  contentLikes: [],
};

const createMypageSlice: StateCreator<
  CommonSlice & MypageSlice,
  [],
  [],
  MypageSlice
> = (set, get, api) => ({
  ...initialState,
  fetchContentLikes: async () => {
    const res = await fetch(`/mypage/api`);
    const data = await res.json();

    set((state) => ({
      contentLikes: data,
    }));
  },
  reset: () => {
    set(initialState);
  },
});

export type MypageSlice = State & Actions;
export default createMypageSlice;
