import DefaultImage from "@/components/DefaultImage";
import { User } from "@/utils/types";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import githubIcon from "@/public/assets/github-icon.svg";
import kakaoTalkIcon from "@/public/assets/kakaotalk-icon.png";
import googleIcon from "@/public/assets/google-icon.png";
import Link from "next/link";

type Props = {
  user: User;
  onClickSignOut?: () => void;
};

const UserInfo = ({ user, onClickSignOut }: Props) => {
  return (
    <div className="relative pt-12 pb-6 w-full">
      <div className="relative">
        <div className="basic-border rounded pt-10 px-9 pb-6">
          <div className="relative flex w-full">
            <div className="absolute top-0 right-0">
              <button
                className="basic-border rounded px-2 py-1 text-xs"
                onClick={onClickSignOut}
              >
                로그아웃
              </button>
            </div>
            <div className="mr-5">
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
              <div>
                <div className="text-xl	font-bold	break-words break-all mb-1">
                  {user.name}
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-sm text-gray-500">
                    연동된 SNS:
                  </span>
                  <Image
                    src={
                      user.loginType === "github"
                        ? githubIcon
                        : user.loginType === "kakao"
                        ? kakaoTalkIcon
                        : googleIcon
                    }
                    alt={user.loginType}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                </div>
              </div>
              <Link href={"/mypage/reviews"}>
                <span className="inline-flex items-center leading-4 font-medium text-sm py-5">
                  <span>내가 작성한 리뷰</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
