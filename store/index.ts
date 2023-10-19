import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import createCommonSlice, { CommonSlice } from "./commonSlice";
import createDashboardSlice, { DashboardSlice } from "./dashboardSlice";
import createMovieSlice, { MovieSlice } from "./movieSlice";
import createReviewSlice, { ReviewSlice } from "./reviewSlice";
import createMapSlice, { MapSlice } from "./mapSlice";

export const useBoundStore = create<
  CommonSlice & DashboardSlice & MovieSlice & ReviewSlice & MapSlice
>()(
  devtools(
    persist(
      (...items) => ({
        ...createCommonSlice(...items),
        ...createDashboardSlice(...items),
        ...createMovieSlice(...items),
        ...createReviewSlice(...items),
        ...createMapSlice(...items),
      }),
      {
        name: "item-storage",
      }
    )
  )
);
