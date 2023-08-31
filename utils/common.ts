import { signIn } from "coco-people-client";

export const numberWithCommas = (number: number): string => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const replaceCaretWithComma = (str: string): string => {
  return str.replace(/\^/g, ",");
};

export const replaceBTagsWithEmptyString = (str: string): string => {
  return str.replace(/<\/?b>/g, "");
};

export const getTotalItems = (total: number): number => {
  let result = total;

  if (total > 1000) {
    result = 1000;
  }
  return result;
};

export const replaceDateFormat = (str: string): string => {
  const date = new Date(str);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const resultDate = `${year}.${month}.${day}`;

  return resultDate;
};

export const handleClickSignIn = () => {
  const signInParams = {
    clientId: process.env.NEXT_PUBLIC_SERVICE!,
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
    providerUrl: process.env.NEXT_PUBLIC_PROVIDER_URL!,
  };
  signIn(signInParams);
};
