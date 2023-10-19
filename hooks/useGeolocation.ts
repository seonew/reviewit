import { useState, useEffect } from "react";
import { useBoundStore as useStore } from "@/store";

interface locationType {
  loaded: boolean;
  coordinates?: { lat: number; lng: number };
  error?: { code: number; message: string };
}

const useGeolocation = () => {
  const [location, setLocation] = useState<locationType>({
    loaded: false,
    coordinates: { lat: 0, lng: 0 },
  });
  const { setCurrentLocation } = useStore();

  const onSuccess = (location: {
    coords: { latitude: number; longitude: number };
  }) => {
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;

    setLocation({
      loaded: true,
      coordinates: {
        lat: latitude,
        lng: longitude,
      },
    });
    setCurrentLocation([latitude, longitude]);
  };

  const onError = (error: { code: number; message: string }) => {
    setLocation({
      loaded: true,
      error,
    });
  };

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      onError({
        code: 0,
        message: "Geolocation not supported",
      });
    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }, []);

  return location;
};

export default useGeolocation;
