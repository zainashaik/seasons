import Chatbot from "@/components/chatbot";
import Image from "next/image";
import { Satisfy } from 'next/font/google';

const satisfy = Satisfy({
  weight: '400',
  subsets: ['latin'],
});

export default function Home() {
  return (
    <div className="min-h-screen relative bg-[#2E1C2B] overflow-hidden">
      {/* Heart-shaped gradient background */}
      <div className="absolute inset-0 w-full h-full" 
        style={{
          background: `
            radial-gradient(
              circle at center,
              #FFFFFF 0%,
              #E9C8E7 15%,
              #E1AFD1 30%,
              #AD88C6 50%,
              #7469B6 70%,
              #7469B6 100%
            )
          `,
          transform: 'scale(1.3)',
        }}
      >
        {/* Add a subtle glow overlay */}
        <div className="absolute inset-0"
          style={{
            background: `
              radial-gradient(
                circle at center,
                #FFFFFF 0%,
                transparent 50%
              )
            `,
            opacity: 0.1,
          }}
        />
      </div>

      {/* Hanger Image */}
      {/*<div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
        <Image
          src="/hanger.png"
          alt="Hanger icon"
          width={80}
          height={80}
          className="opacity-80 hover:opacity-100 transition-opacity"
        />
      </div>*/}

      {/* Logo Image */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20 h-[72px] md:h-[86px]">
        <Image
          src="/seasonsbow.png"
          alt="Seasons logo"
          width={72}
          height={72}
          className="opacity-90 hover:opacity-100 transition-opacity duration-300 h-full w-auto"
          priority
        />
      </div>

      {/* Content */}
      <main className="container mx-auto p-4 md:p-8 flex flex-col gap-6 relative z-10">
        <h1 className={`text-5xl md:text-6xl font-bold text-center text-[#EAEAEA] ${satisfy.className}`}>
          Seasons
        </h1>

        <div className="flex-1 mb-4 md:mb-6">
          <Chatbot />
        </div>
      </main>
    </div>
  );
}