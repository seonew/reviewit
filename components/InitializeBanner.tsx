import DefaultImage from "@/components/DefaultImage";

const InitializeBanner = () => {
  return (
    <div className="banner-container">
      <div className="relative pt-24 ml-16 z-10 text-white">
        <div className="float-left mr-10 w-52 h-80">
          <DefaultImage size="w-52 h-80" />
        </div>
      </div>
      <div className="banner-background opacity-50"></div>
    </div>
  );
};

export default InitializeBanner;
