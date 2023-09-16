import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import createCommonSlice, { CommonSlice } from "./commonSlice";
import createDashboardSlice, { DashboardSlice } from "./dashboardSlice";
import createMovieSlice, { MovieSlice } from "./movieSlice";
import createMypageSlice, { MypageSlice } from "./mypageSlice";

export const useBoundStore = create<
  CommonSlice & DashboardSlice & MovieSlice & MypageSlice
>()(
  devtools(
    persist(
      (...items) => ({
        ...createCommonSlice(...items),
        ...createDashboardSlice(...items),
        ...createMovieSlice(...items),
        ...createMypageSlice(...items),
      }),
      {
        name: "item-storage",
      }
    )
  )
);
