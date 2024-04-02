import { signIn } from "coco-people-auth";
import Resizer from "react-image-file-resizer";

export const validateContentEditable = (text: string) => {
  if (text.length < 10) {
    return "입력 내용은 최소 10글자 이상이어야 합니다.";
  }

  if (text.length > 400) {
    return "입력 내용은 최대 400글자 이하여야 합니다.";
  }

  return null;
};

export const resizeFile = (file: File) =>
  new Promise<string | File | Blob | ProgressEvent<FileReader>>((resolve) => {
    Resizer.imageFileResizer(
      file,
      200,
      200,
      "JPEG",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "base64"
    );
  });

export const removeSpaces = (str: string): string => {
  return str.replace(/\s/g, "");
};

export const generateId = (): string => {
  return Date.now().toString();
};

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

export const replaceDateFormat8Digits = (date: string): string => {
  if (date.length !== 8) {
    throw new Error("입력은 8자리 숫자여야 합니다.");
  }

  const year = date.substring(0, 4);
  const month = date.substring(4, 6);
  const day = date.substring(6, 8);

  return `${year}.${month}.${day}`;
};

export const handleClickSignIn = () => {
  const signInParams = {
    clientId: process.env.NEXT_PUBLIC_SERVICE!,
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URL!,
    providerUrl: process.env.NEXT_PUBLIC_PROVIDER_URL!,
  };
  signIn(signInParams);
};

export const deleteCookie = (name: string) => {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};
