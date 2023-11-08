import { StatsProps } from "@/types";

type Props = {
  stats?: StatsProps[];
};

const PreferenceStatSection = ({ stats }: Props) => {
  return (
    <div className="bg-gray-100 rounded-lg my-10">
      <div className="pt-3 pb-8">
        <div className="mx-auto max-w-7xl px-6">
          <legend className="text-base font-semibold leading-4 text-gray-900 py-5">
            콘텐츠에 대한 선호도
          </legend>
          <dl className="grid gap-x-8 gap-y-16 text-center grid-cols-3">
            {stats &&
              stats.map((stat) => (
                <div
                  key={stat.id}
                  className="mx-auto flex flex-col gap-y-1 rounded-lg shadow p-4 w-full bg-white"
                >
                  <dt className="text-sm leading-3 text-gray-400">
                    {stat.displayText}
                  </dt>
                  <dd className="text-lg font-semibold tracking-tight text-gray-900">
                    {stat.percentText}
                  </dd>
                </div>
              ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default PreferenceStatSection;
