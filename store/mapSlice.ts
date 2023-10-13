import { StateCreator } from "zustand";
import {
  Coordinates,
  LocalCompany,
  LocalPlace,
  ReviewDataProps,
} from "@/utils/types";
import { CommonSlice } from "./commonSlice";

type State = {
  localCompanys: LocalCompany[] | null;
  localPlaces: LocalPlace[] | null;
  currentLocation: Coordinates | null;
  currentPlace: LocalPlace | null;
  placeReviews: ReviewDataProps;
  selectedMarkerId: string;

  openModal: boolean;
};

type Actions = {
  fetchLocalPlaces: (keyword: string, { lat, lng }: any) => void;
  fetchLocalCompanys: (keyword: string) => void;
  insertPlaceReview: (review: string, like: boolean) => void;
  fetchPlaceReview: (id: string) => void;

  setCurrentPlace: (item: LocalPlace) => void;
  setCurrentLocation: ([]: Coordinates) => void;
  setSelectedMarkerId: (id: string) => void;
  setOpenModal: (open: boolean) => void;
  initializeMap: () => void;
};

const initialState: State = {
  localCompanys: null,
  localPlaces: null,
  currentLocation: null,
  selectedMarkerId: "",
  currentPlace: null,

  placeReviews: {
    reviews: [],
    count: 0,
    stats: [],
  },
  openModal: false,
};

const createMapSlice: StateCreator<CommonSlice & MapSlice, [], [], MapSlice> = (
  set,
  get
) => ({
  ...initialState,
  fetchPlaceReview: async (id) => {
    try {
      const res = await fetch(`/map/api/review/${id}`);
      const data = await res.json();
      set({ placeReviews: data });
    } catch (error) {
      console.log(error);
    }
  },
  insertPlaceReview: async (review, like) => {
    const item = get().currentPlace;
    const id = item?.id;
    const params = { review, like, item };

    try {
      const res = await fetch(`/map/api/review/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      const data = await res.json();
    } catch (error) {
      console.log(error);
    }
  },
  fetchLocalPlaces: async (keyword: string, params) => {
    try {
      const res = await fetch(`/map/api/${keyword}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      const data = await res.json();

      set({ localPlaces: data });
    } catch (error) {
      console.log(error);
    }
  },
  fetchLocalCompanys: async (keyword: string) => {
    try {
      const res = await fetch(`/map/api/naver/${keyword}`);
      const data = await res.json();

      set({ localCompanys: data });
    } catch (error) {
      console.log(error);
    }
  },
  setSelectedMarkerId: (id) => {
    set({ selectedMarkerId: id });
  },
  setCurrentPlace: (item) => {
    set({ currentPlace: item });
  },
  setCurrentLocation: (current) => {
    set({ currentLocation: current });
  },
  setOpenModal: (openModal) => {
    set({ openModal });
  },
  initializeMap: () => {
    set(initialState);
  },
  reset: () => {
    set(initialState);
  },
});

export type MapSlice = State & Actions;
export default createMapSlice;
