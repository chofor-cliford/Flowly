const Loader = ({ text }: { text: string }) => {
  return (
    <div className="transforming-loader">
      <img
        src="/assets/icons/spinner.svg"
        width={50}
        height={50}
        alt="spinner"
      />
      <p className="text-white/80">{text}</p>
    </div>
  );
};

export default Loader;
