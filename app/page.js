"use client";
import Image from "next/image";
import { Poppins } from "next/font/google";
import AssessmentFlow from "@/app/components/AssessmentFlow";

const poppins = Poppins({ subsets: ["latin"], weight: ["500", "700"], display: "swap" });

export default function Home() {
  return (
    <main className={`min-h-screen bg-neutral-50 text-black flex flex-col items-center justify-center p-6 ${poppins.className}`}>
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neutral-200 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative z-10 max-w-4xl w-full text-center space-y-12">
        <header className="flex flex-col items-center space-y-4">
          <Image
            src="/loogo.png"
            alt="I-Speak Logo"
            width={80}
            height={80}
            priority
            className="rounded-3xl shadow-lg ring-4 ring-white"
          />
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-black to-neutral-600">
              I-Speak
            </h1>
            <p className="text-lg md:text-xl text-neutral-500 font-medium">
              Automated Speech Assessment Platform
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          {/* Streamlit Option */}
          <a
            href="https://ispeak.streamlit.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center space-y-4 overflow-hidden"
          >
             <div className="absolute top-0 left-0 w-full h-1 bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
             </div>
             <div>
               <h3 className="text-xl font-bold">Streamlit Platform</h3>
               <p className="mt-2 text-neutral-500">Access the original, cloud-hosted version of I-Speak.</p>
             </div>
             <div className="mt-auto pt-4 flex items-center text-red-600 font-semibold gap-1">
                Launch External <span className="group-hover:translate-x-1 transition-transform">→</span>
             </div>
          </a>

          {/* Vercel Option */}
          <a
            href="/assessment"
            className="group relative bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center space-y-4 overflow-hidden"
          >
             <div className="absolute top-0 left-0 w-full h-1 bg-black opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
             </div>
             <div>
               <h3 className="text-xl font-bold">Vercel Version</h3>
               <p className="mt-2 text-neutral-500">Fast, local assessment with full feature set.</p>
             </div>
             <div className="mt-auto pt-4 flex items-center text-black font-semibold gap-1">
                Continue Here <span className="group-hover:translate-x-1 transition-transform">→</span>
             </div>
          </a>
        </div>

        <footer className="text-sm text-neutral-400 font-medium">
          Choose your preferred version to start the assessment.
        </footer>
      </div>
    </main>
  );
}
