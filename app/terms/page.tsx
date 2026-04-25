import { Badge } from "@/components/ui/badge";
import { FileText, Shield, Scale, Gavel } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="space-y-6 mb-16">
          <Badge variant="outline" className="px-6 py-2 border-primary/20 text-primary bg-primary/5 uppercase font-bold tracking-widest text-[10px]">
            Legal Framework
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 uppercase italic">
            Terms of <span className="text-slate-300">Service</span>
          </h1>
          <p className="text-gray-500 font-mono text-xs uppercase tracking-[0.2em]">
            Last Updated: April 2024 // Jurisdiction: Digital Network
          </p>
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-10 md:p-16 space-y-12">
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                <Scale className="h-5 w-5 text-gray-900" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Acceptance of Terms</h2>
            </div>
            <p className="text-gray-600 leading-relaxed font-normal">
              By accessing the Pulse AI platform, you agree to comply with and be bound by the following terms and conditions of use. If you disagree with any part of these terms, please do not use our services.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                <FileText className="h-5 w-5 text-gray-900" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Intellectual Property</h2>
            </div>
            <p className="text-gray-600 leading-relaxed font-normal">
              The content, features, and functionality of the Pulse AI network, including but not limited to the editorial synthesis, brand assets, and proprietary algorithms, are owned by Pulse AI and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                <Shield className="h-5 w-5 text-gray-900" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">User Conduct</h2>
            </div>
            <p className="text-gray-600 leading-relaxed font-normal">
              Users are prohibited from using the site in any way that causes, or may cause, damage to the platform or impairment of the availability or accessibility of Pulse AI. Unauthorized use of this website may give rise to a claim for damages and/or be a criminal offense.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                <Gavel className="h-5 w-5 text-gray-900" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Limitation of Liability</h2>
            </div>
            <p className="text-gray-600 leading-relaxed font-normal">
              Pulse AI and its editorial board shall not be held liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this platform. The "Intelligence Reports" are for informational purposes only.
            </p>
          </section>

          <section className="pt-10 border-t border-slate-100">
             <p className="text-xs text-gray-400 leading-relaxed italic">
               These terms are subject to change without prior notice. Continued use of the platform constitutes acceptance of the modified framework.
             </p>
          </section>
        </div>
      </div>
    </div>
  );
}
