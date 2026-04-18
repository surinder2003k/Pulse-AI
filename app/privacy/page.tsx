import { Badge } from "@/components/ui/badge";
import { Lock, EyeOff, ShieldAlert, FileText } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="space-y-6 mb-16">
          <Badge variant="outline" className="px-6 py-2 border-primary/20 text-primary bg-primary/5 uppercase font-bold tracking-widest text-[10px]">
            Data Protocol
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 uppercase italic">
            Privacy <span className="text-slate-300">Policy</span>
          </h1>
          <p className="text-gray-500 font-mono text-xs uppercase tracking-[0.2em]">
            Last Updated: March 2024 // Network Status: Encrypted
          </p>
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-10 md:p-16 space-y-12">
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                <Lock className="h-5 w-5 text-gray-900" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Data Encryption</h2>
            </div>
            <p className="text-gray-600 leading-relaxed font-normal">
              Pulse AI utilizes military-grade encryption protocols for all user authentication handled via Clerk. We do not store plain-text credentials locally. Your interaction data is used solely to tune the editorial synthesis engine for a personalized experience.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                <EyeOff className="h-5 w-5 text-gray-900" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Neural Privacy</h2>
            </div>
            <p className="text-gray-600 leading-relaxed font-normal">
              Prompts submitted to our Neural Assistant are processed via secure API layers. These inputs are used for real-time generation and are not publicly indexed. We respect the intellectual property of all contributors within the Pulse ecosystem.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                <ShieldAlert className="h-5 w-5 text-gray-900" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Identity Protection</h2>
            </div>
            <p className="text-gray-600 leading-relaxed font-normal">
              We do not sell, trade, or transfer your personally identifiable information to outside parties. This excludes trusted third parties who assist us in operating our platform, so long as those parties agree to keep this information confidential.
            </p>
          </section>

          <section className="pt-10 border-t border-slate-100">
             <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                <FileText className="h-4 w-4" />
                End of Protocol
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}
