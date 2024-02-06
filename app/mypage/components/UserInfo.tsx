import DefaultImage from "@/app/components/DefaultImage";
import { User } from "@/types";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import githubIcon from "@/public/assets/github-icon.png";
import kakaoTalkIcon from "@/public/assets/kakaotalk-icon.png";
import naverIcon from "@/public/assets/naver-icon.png";
import Link from "next/link";
import { PencilSquareIcon } from "@heroicons/react/20/solid";

type Props = {
  user: User;
  onClickSignOut?: () => void;
};

const UserInfo = ({ user, onClickSignOut }: Props) => {
  return (
    <div className="relative pt-12 pb-6 w-full">
      <div className="relative">
        <div className="basic-border rounded pt-10 px-9 pb-6 shadow-sm">
          <div className="relative flex flex-col w-full ">
            <div className="absolute -top-6 -right-6">
              <button
                className="basic-border rounded px-2 py-1 text-xs"
                onClick={onClickSignOut}
              >
                로그아웃
              </button>
            </div>
            <div className="flex justify-center mx-2 mb-4">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  className="rounded-full"
                  width={100}
                  height={100}
                />
              ) : (
                <DefaultImage size="w-24 h-24">
                  <UserCircleIcon className="w-20 h-20" />
                </DefaultImage>
              )}
            </div>
            <div className="float-left">
              <div className="flex flex-col">
                <div className="flex flex-col items-center">
                  <div className="text-xl font-bold break-words break-all mb-1">
                    {user.name}
                  </div>
                  <div className="flex items-center pt-2 pb-2">
                    <Link href={"/mypage/users/edit"}>
                      <div className="basic-border rounded px-2.5 py-1.5 text-xs text-gray-500 hover:bg-gray-50 flex items-center">
                        <span>설정</span>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <span className="mr-2 text-xs text-gray-500">
                    연동된 SNS:
                  </span>
                  <Image
                    src={
                      user.loginType === "github"
                        ? githubIcon
                        : user.loginType === "kakao"
                        ? kakaoTalkIcon
                        : naverIcon
                    }
                    alt={user.loginType}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                </div>
                <div className="flex items-center justify-center pt-5 pb-2">
                  <Link href={"/mypage/reviews"}>
                    <div className="button-xs-blue flex items-center">
                      <PencilSquareIcon className="w-3.5 h-3.5 mr-1" />
                      <span>내가 작성한 리뷰</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
