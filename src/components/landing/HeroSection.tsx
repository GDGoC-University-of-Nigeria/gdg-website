export const HeroSection = () => {
  return (
    <section className="relative mx-auto flex min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden px-6 pt-20 text-center text-white md:pt-32">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 bg-[#121212]" />

      {/* 1. Subheader */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-base font-medium text-gray-400 md:text-xl">
          Google Developer Groups
        </span>
      </div>

      {/* 2. Main Title - Responsive sizing */}
      <h1 className="text-4xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl">
        On Campus <br />
        <span className="text-[#4285F4]">University of Nigeria</span>
      </h1>

      {/* 3. Description */}
      <p className="mt-6 max-w-md text-sm leading-relaxed text-gray-300 md:max-w-2xl md:text-lg">
        Empowering students to build for their community using Google technologies. 
        All skill levels are welcome to join the movement.
      </p>

      {/* 4. CTA Buttons - Stack on mobile */}
      <div className="mt-10 flex flex-col gap-4 w-full sm:w-auto sm:flex-row">
        <button className="w-full rounded-full bg-[#4285F4] px-8 py-3 font-semibold text-white transition-all hover:bg-blue-600 sm:w-auto">
          Join Us
        </button>
        <button className="w-full rounded-full border border-white px-8 py-3 font-semibold text-white transition-all hover:bg-white hover:text-black sm:w-auto">
          Learn More
        </button>
      </div>
    </section>
  );
};