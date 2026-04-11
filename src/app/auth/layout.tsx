"use client";
import Image from "next/image";
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import bottome from '@/assets/bottom-e.png';
import topleft from '@/assets/top-left-e.png';
import righte from '@/assets/right-e.png';
import PillCanvas from "@/components/auth/PillCanvas";


export default function  AuthLayout({children} : {children: React.ReactNode}) {
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") || "signup";
  const text = mode === "login" ? " Welcome Back, Builder. " : " Let's Build Together. "
  return <div className="relative z-10 border-red-500 border-4 lg:p-3 p-0 h-screen overflow-hidden">
    <section className="relative z-20 border-red-500 border-4 w-full h-screen shrink-0 bg-[#F9AB00] flex flex-col items-center justify-center overflow-y-auto pt-12 px-4">
    {/* ellipses that show blotches */}
    <Image src={topleft} className="absolute top-0 right-0 w-1/3 md:w-2/3" alt="top-left ellipse"/>
    <Image src={bottome} className="absolute -bottom-4 md:bottom-0 w-1/2 right-1/2 translate-x-1/2 md:w-auto" alt="bottom ellipse"/>
    <Image src={righte} className="absolute left-0 w-1/3 md:w-1/2 top-1/2 -translate-y-1/2" alt="right ellipse"/>
    <div className="absolute z-20 inset-0 w-full h-full "><PillCanvas/></div>
    {/* main centre text */}
    <div className="text-black z-30 max-w-4/5 mx-auto space-y-2 text-center mb-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={text}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-2xl md:text-3xl mb-2">
            <span className="text-[#EA4335]">{`{`}</span>
            {text}
            <span className="text-[#EA4335]">{`}`}</span>
          </h2>
          <p className="text-sm md:text-base sm:max-w-10/12 mx-auto">
            Access exclusive mentorship, submit your projects, and become part of UNN's core tech network. It starts here.
          </p>
        </motion.div>
        </AnimatePresence>
    </div>
    <div className="relative z-30 w-full flex justify-center">
      {children}
    </div>
    </section>
  </div>
}