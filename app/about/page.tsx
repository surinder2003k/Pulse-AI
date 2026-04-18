import Logo from "@/components/Logo";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Target, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex flex-col items-center text-center space-y-8 mb-20">
          <Badge variant="outline" className="px-6 py-2 border-primary/20 text-primary bg-primary/5 uppercase font-bold tracking-widest text-[10px]">
            Protocol Overview
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 uppercase italic">
            Engineering <span className="text-slate-300">Stories</span>
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-gray-500 font-medium leading-relaxed">
            Pulse AI is a next-generation editorial engine designed to capture the spirit of global innovation with tactical precision and stylistic excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="h-14 w-14 bg-primary/5 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors duration-500">
               <Target className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 uppercase italic mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed font-medium">
              We bridge the gap between hard data and human narrative. Using advanced generative algorithms tuned for technical authoritative tone, we deliver news that doesn't just inform, but illuminates the "why" behind the "what".
            </p>
          </div>

          <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="h-14 w-14 bg-primary/5 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors duration-500">
               <Shield className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 uppercase italic mb-4">Tactical Integrity</h2>
            <p className="text-gray-600 leading-relaxed font-medium">
              Every asset deployed through the Pulse Network undergoes rigorous synthesis. We prioritize technical accuracy, editorial flow, and visual consistency to ensure a premium experience for an elite global audience.
            </p>
          </div>
        </div>

        <div className="bg-gray-900 text-white p-12 md:p-20 rounded-[4rem] relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -z-0" />
            <div className="relative z-10 space-y-8">
               <Logo size="lg" showText={false} className="justify-center grayscale invert opacity-50" />
               <h3 className="text-3xl md:text-4xl font-extrabold uppercase italic">The Frontier of Intelligence</h3>
               <p className="max-w-xl mx-auto text-gray-400 font-medium leading-relaxed uppercase tracking-widest text-xs">
                 Pulse AI represents the convergence of high-performance computing and world-class journalism.
               </p>
            </div>
        </div>
      </div>
    </div>
  );
}
