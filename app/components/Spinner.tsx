const Spinner = () => {
  return (
    <div
      className="fixed w-full h-full top-0 left-0 flex items-center justify-center z-50"
      style={{ background: `rgba(255, 255, 255, 0.7)` }}
    >
      <div className="relative w-14 h-14">
        <div className="animate-spin w-12 h-12 rounded-full border-t-sky-400 border-solid border-4"></div>
      </div>
    </div>
  );
};

export default Spinner;
