export const HeroSection = () => {
  return (
    <div className="flex-grow p-24">
      <div className="flex flex-col gap-6">
        <h1 className="text-7xl font-black uppercase italic text-pink-500">
          Namukilke
        </h1>
        <div className="flex w-2/3 flex-col gap-2 text-pink-400">
          <p className="font-semibold italic">
            Namukilke users have bought a total of 65 products this week,
            costing 93,53€
          </p>
          <p>
            For more statistics, see the{" "}
            <span className="italic underline">stats</span> page
          </p>
        </div>
      </div>
    </div>
  );
};
