export default function ShadowBars() {
  return (
    <>
      <div className="absolute -left-[60px] w-[60px] top-0 h-[100vh] md:shadow-[0_0_2rem_2rem_#01FF39] shadow-[0_0_1rem_1rem_#01FF39]"></div>
      <div className="absolute right-[-60px] top-0 h-[100vh] w-[60px] md:shadow-[0_0_2rem_2rem_#01FF39] shadow-[0_0_1rem_1rem_#01FF39]"></div>
    </>
  );
}
