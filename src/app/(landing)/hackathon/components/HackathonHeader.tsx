import Image from 'next/image';
import heroImage from '@/assets/hero-3.jpg';

export function HackathonHeader({ onRegisterClick }: { onRegisterClick: () => void }) {
  return (
    <div className="relative overflow-hidden bg-[#F8F8F8] py-24 sm:py-32 border-b border-[#E0E0E0]">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={heroImage}
          alt="Hackathon Event"
          fill
          className="object-cover opacity-20 grayscale"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-[#F8F8F8]/80 to-[#F8F8F8]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 flex items-center justify-center gap-x-4">
            <span className="inline-flex items-center uppercase bg-[#E8F5EB] px-3 py-1 text-xs font-semibold text-[#137333] border border-[#137333]/20 shadow-sm">
              Registration Open
            </span>
            <span className="text-sm font-medium text-solid-matte-gray">20 days to go</span>
          </div>
          <h2 className="text-4xl font-normal leading-tight text-blackout sm:text-6xl">
            Build with Gemma 4 Hackathon Sprint
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-solid-matte-gray">
            Welcome to the Gemma 4 Hackathon Sprint, a fast-paced sprint where you'll get hands-on with the most capable open models from Google DeepMind. Build cool and innovative solutions with Google Gemma.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {/* <button
              onClick={onRegisterClick}
            >
              Register for Hackathon
            </button> */}
            <Link              className="rounded bg-[#4285F4] px-8 py-3.5 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(66,133,244,0.35)]"
 href="https://www.kaggle.com/competitions/build-with-gemma-gdgunn/">Register for Hackathon</Link>
            <a href="#details" className="text-sm font-medium leading-6 text-blackout hover:text-[#4285F4] transition-colors">
              View Details <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
