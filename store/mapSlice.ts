import { StateCreator } from "zustand";
import { Coordinates, LocalCompany, LocalPlace } from "@/utils/types";
import { CommonSlice } from "./commonSlice";

type State = {
  localCompanys: LocalCompany[] | null;
  localPlaces: LocalPlace[] | null;
  currentLocation: Coordinates | null;
};

type Actions = {
  fetchLocalPlaces: (keyword: string, { lat, lng }: any) => void;
  fetchLocalCompanys: (keyword: string) => void;
  setCurrentLocation: ([]: Coordinates) => void;
  initializeMap: () => void;
};

const initialState: State = {
  localCompanys: null,
  localPlaces: null,
  currentLocation: null,
};

const createMapSlice: StateCreator<CommonSlice & MapSlice, [], [], MapSlice> = (
  set
) => ({
  ...initialState,
  setCurrentLocation: (current) => {
    set({ currentLocation: current });
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
  initializeMap: () => {
    set(initialState);
  },
  reset: () => {
    set(initialState);
  },
});

export type MapSlice = State & Actions;
export default createMapSlice;
