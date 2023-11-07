import { StateCreator } from "zustand";
import {
  Coordinates,
  LocalPlace,
  PlaceReviewsWithKeywordDataProps,
  PlaceReviewDataProps,
} from "@/types";
import { CommonSlice } from "./commonSlice";
import { INITIAL_CENTER } from "@/hooks/useMap";

type State = {
  localPlaces: LocalPlace[] | null;
  currentLocation: Coordinates | null;
  currentPlace: LocalPlace | null;
  placeReviews: PlaceReviewDataProps;
  keywordReviews: PlaceReviewsWithKeywordDataProps;
  selectedMarkerId: string;
  selectedCategory: string;
  searchKeyword: string;

  openModal: boolean;
};

type Actions = {
  fetchLocalPlaces: (keyword: string) => void;
  insertPlaceReview: (review: string, like: boolean) => void;
  fetchPlaceReviews: (page: number) => void;
  fetchPlaceReviewsWithKeyword: (name: string) => void;
  fetchLocalPlacesByCode: (code: string) => void;

  setCurrentPlace: (item: LocalPlace) => void;
  setCurrentLocation: ([]: Coordinates) => void;
  setSelectedMarkerId: (id: string) => void;
  setSelectedCategory: (code: string) => void;
  setSearchKeyword: (keyword: string) => void;
  setLocalPlaces: (item: LocalPlace[] | null) => void;
  setPlaceReviews: (item: PlaceReviewDataProps) => void;

  setOpenModal: (open: boolean) => void;
  initializeMap: () => void;
};

const initialState: State = {
  localPlaces: null,
  currentLocation: null,
  selectedMarkerId: "",
  selectedCategory: "",
  searchKeyword: "",
  currentPlace: null,

  placeReviews: {
    data: [],
    locals: [],
    count: 0,
  },
  keywordReviews: {
    data: [],
    locals: [],
  },
  openModal: false,
};

const createMapSlice: StateCreator<CommonSlice & MapSlice, [], [], MapSlice> = (
  set,
  get
) => ({
  ...initialState,
  fetchLocalPlacesByCode: async (code) => {
    const location = get().currentLocation;
    const lat = location ? location[0] : INITIAL_CENTER[0];
    const lng = location ? location[1] : INITIAL_CENTER[1];
    const params = { lat, lng, code };

    try {
      const res = await fetch(`/place-reviews/api/search/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      get().setLocalPlaces(data);
      get().setSearchKeyword("");
    } catch (error) {
      console.log(error);
    }
  },
  fetchPlaceReviewsWithKeyword: async (name) => {
    try {
      get().setSearchKeyword(name);

      const res = await fetch(`/place-reviews/api/search/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(name),
      });
      const data = await res.json();
      get().setPlaceReviews({
        data: [],
        locals: [],
        count: 0,
      });
      set({ keywordReviews: data });
    } catch (error) {
      console.log(error);
    }
  },
  fetchPlaceReviews: async (page: number) => {
    try {
      const res = await fetch(`/place-reviews/api/search/review?page=${page}`);
      const data = await res.json();
      set({
        keywordReviews: {
          data: [],
          locals: [],
        },
      });
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
      const res = await fetch(`/place-reviews/api/search/review/${id}`, {
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
  fetchLocalPlaces: async (keyword: string) => {
    const location = get().currentLocation;
    const lat = location ? location[0] : INITIAL_CENTER[0];
    const lng = location ? location[1] : INITIAL_CENTER[1];
    const params = { lat, lng, keyword };

    try {
      const res = await fetch(`/place-reviews/api/search/${keyword}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      get().setLocalPlaces(data);
    } catch (error) {
      console.log(error);
    }
  },
  setPlaceReviews: (item) => {
    set({ placeReviews: item });
  },
  setLocalPlaces: (item) => {
    set({ localPlaces: item });
  },
  setSearchKeyword: (keyword) => {
    set({ searchKeyword: keyword });
  },
  setSelectedCategory: (code) => {
    set({ selectedCategory: code });
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
