"use client";

import React, { ChangeEvent, FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useBoundStore as useStore } from "@/store";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import DefaultImage from "@/app/components/DefaultImage";
import { removeSpaces } from "@/utils/common";

const List = () => {
  const { user, updateUser } = useStore();
  const router = useRouter();
  const [name, setName] = useState<string>("");

  const [message, setMessage] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const show = isValid === false && message !== "";

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setMessage("");
    setIsValid(value.trim() !== "");
  };

  const handleClickCancel = () => {
    router.push("/mypage");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsValid(false);

    const nextName = removeSpaces(name);
    const length = nextName.length;
    if (length === 0) {
      setMessage("내용을 입력해 주세요.");
      return;
    } else if (user.name === nextName) {
      setMessage("변경 사항이 없어요.");
      return;
    } else if (length < 4) {
      setMessage("최소 4글자 이상 입력해주세요.");
      return;
    } else if (length > 10) {
      setMessage("최대 10글자 이하로 입력해주세요.");
      return;
    }
    updateUser(nextName);
    router.push("/mypage");
  };

  return (
    <div className="contents-container">
      <div className="relative pt-12 pb-6 w-full">
        <form onSubmit={handleSubmit}>
          <div className="basic-border rounded pt-10 px-9 pb-6 space-y-12">
            <div className="pb-10">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                회원 정보 수정
              </h2>
              <div className="mt-10">
                <div className="grid gap-4 grid-cols-8 py-6 items-start ">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    닉네임
                  </label>
                  <div className="col-span-7">
                    <div
                      className={`relative flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 max-w-md ${
                        show && "ring-1 ring-red-300 focus-within:ring-red-300"
                      }`}
                    >
                      <input
                        type="text"
                        name="name"
                        id="name"
                        autoComplete="name"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 text-sm leading-6"
                        placeholder={name === "" ? user.name : name}
                        onChange={handleChange}
                      />
                      {show && (
                        <div className="absolute top-0 bottom-0 right-0 flex items-center pr-3">
                          <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {show && (
                      <p className="text-sm mt-2 text-red-600">{message}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 grid-cols-8 py-6 items-start ">
                  <label
                    htmlFor="photo"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    이미지
                  </label>
                  <div className="col-span-7">
                    <div className="flex items-center gap-x-5">
                      {user.avatarUrl ? (
                        <Image
                          src={user.avatarUrl}
                          alt={user.name}
                          className="rounded-full"
                          width={60}
                          height={60}
                          priority
                        />
                      ) : (
                        <DefaultImage size="w-16 h-16">
                          <UserCircleIcon className="w-12 h-12" />
                        </DefaultImage>
                      )}
                      {/* <button
                        type="button"
                        className="rounded-md bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        Change
                      </button> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              onClick={handleClickCancel}
              className="rounded-md px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button className="rounded-md px-3 py-2 text-sm font-semibold text-white bg-ozip-blue hover:bg-sky-500 shadow-sm">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default List;
