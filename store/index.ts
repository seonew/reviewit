import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import createCommonSlice, { CommonSlice } from "./commonSlice";
import createDashboardSlice, { DashboardSlice } from "./dashboardSlice";
import createMovieSlice, { MovieSlice } from "./movieSlice";
import createReviewSlice, { ReviewSlice } from "./reviewSlice";

export const useBoundStore = create<
  CommonSlice & DashboardSlice & MovieSlice & ReviewSlice
>()(
  devtools(
    persist(
      (...items) => ({
        ...createCommonSlice(...items),
        ...createDashboardSlice(...items),
        ...createMovieSlice(...items),
        ...createReviewSlice(...items),
      }),
      {
        name: "item-storage",
      }
    )
  )
);
