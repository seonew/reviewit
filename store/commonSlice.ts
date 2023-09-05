import { StateCreator } from "zustand";
import { User } from "@/utils/types";

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

const createCommonSlice: StateCreator<CommonSlice, [], [], CommonSlice> = (
  set
) => ({
  ...initialState,
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
