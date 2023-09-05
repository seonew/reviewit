import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import createCommonSlice, { CommonSlice } from "./commonSlice";
import createDashboardSlice, { DashboardSlice } from "./dashboardSlice";
import createMovieSlice, { MovieSlice } from "./movieSlice";

export const useBoundStore = create<
  CommonSlice & DashboardSlice & MovieSlice
>()(
  devtools(
    persist(
      (...items) => ({
        ...createCommonSlice(...items),
        ...createDashboardSlice(...items),
        ...createMovieSlice(...items),
      }),
      {
        name: "item-storage",
      }
    )
  )
);
