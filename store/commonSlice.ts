import { StateCreator } from "zustand";
import { User } from "@/types";
import { DashboardSlice } from "./dashboardSlice";
import { ReviewSlice } from "./reviewSlice";
import { MovieSlice } from "./movieSlice";
import { deleteCookie, goToSignIn } from "@/utils/common";

type State = {
  user: User;
  isSignedIn: boolean;
  isOpen: boolean;
  spinner: boolean;
  isCommentModalOpen: boolean;
  modalMessage: string;

  isConfirmModalOpen: boolean;
  confirmCallback: (() => void) | null;
  cancelCallback: (() => void) | null;

  isAlertModalOpen: boolean;
  alertCallback: (() => void) | null;
};

type Actions = {
  fetchUserInfo: (token: string) => void;
  updateUser: (name?: string, imageUrl?: string) => void;
  setIsOpen: (item: boolean) => void;
  setIsSignedIn: (item: boolean) => void;
  setSpinner: (item: boolean) => void;
  setIsCommentModalOpen: (item: boolean) => void;

  setAlertModalData: (
    open: boolean,
    message: string,
    confirmCallback?: (() => void) | null
  ) => void;
  initializeAlertModalData: () => void;

  setConfirmModalData: (
    open: boolean,
    message: string,
    confirmCallback?: (() => void) | null,
    cancelCallback?: (() => void) | null
  ) => void;
  initializeConfirmModalData: () => void;

  checkTokenExpiration: () => Promise<boolean>;
  checkLoginStatus: () => Promise<boolean>;
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
  spinner: false,

  isAlertModalOpen: false,
  alertCallback: null,

  modalMessage: "",

  isConfirmModalOpen: false,
  isCommentModalOpen: false,
  confirmCallback: null,
  cancelCallback: null,
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
    } catch (error) {
      console.log(error);
    }
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
  checkTokenExpiration: async () => {
    try {
      const res = await fetch(`/api/auth`);
      const data = await res.json();

      return data;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  checkLoginStatus: async () => {
    const isTokenExpired = await get().checkTokenExpiration();
    if (!isTokenExpired) {
      get().setConfirmModalData(
        true,
        "로그인이 필요한 서비스입니다.\n로그인 하시겠습니까?",
        async () => {
          await get().signOut();
          await goToSignIn();
        }
      );
      return false;
    } else {
      return true;
    }
  },
  signOut: async () => {
    deleteCookie("token");
    get().resetReviewData();
    get().resetCommonData();
    get().setLikedMovies([]);
    get().setLikedBooks([]);
  },
  resetCommonData: () => {
    set(initialState);
  },
  setIsOpen: (item) => set({ isOpen: item }),
  setIsSignedIn: (item: boolean) => set({ isSignedIn: item }),
  setSpinner: (item) => set({ spinner: item }),
  setIsCommentModalOpen: (item) => set({ isCommentModalOpen: item }),

  setAlertModalData: (isAlertModalOpen, modalMessage, alertCallback) =>
    set({
      isAlertModalOpen,
      modalMessage,
      alertCallback,
    }),
  initializeAlertModalData: () =>
    set({
      isAlertModalOpen: false,
      modalMessage: "",
      alertCallback: null,
    }),

  setConfirmModalData: (
    isConfirmModalOpen,
    modalMessage,
    confirmCallback,
    cancelCallback
  ) =>
    set({
      isConfirmModalOpen,
      modalMessage,
      confirmCallback,
      cancelCallback,
    }),
  initializeConfirmModalData: () =>
    set({
      isConfirmModalOpen: false,
      modalMessage: "",
      confirmCallback: null,
      cancelCallback: null,
    }),
});

export type CommonSlice = State & Actions;
export default createCommonSlice;
