import { Badge } from "@/components/ui/badge";
import { Lock, EyeOff, ShieldAlert, FileText, Globe, Cookie } from "lucide-react";

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
            Last Updated: April 2024 // Network Status: Encrypted
          </p>
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-10 md:p-16 space-y-12">
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                <Lock className="h-5 w-5 text-gray-900" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Information Collection</h2>
            </div>
            <p className="text-gray-600 leading-relaxed font-normal">
              We collect information from you when you register on our site, subscribe to a newsletter, or interact with our editorial content. This includes identity data provided via Clerk and technical data collected automatically during your visit.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                <Cookie className="h-5 w-5 text-gray-900" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Cookies & Advertising</h2>
            </div>
            <div className="space-y-4 text-gray-600 leading-relaxed font-normal">
              <p>
                We use cookies to enhance your experience and serve personalized content. <strong>Google, as a third-party vendor, uses cookies to serve ads on your site.</strong> Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.
              </p>
              <p>
                Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" className="text-primary hover:underline">Ads Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="http://www.aboutads.info/choices/" target="_blank" className="text-primary hover:underline">www.aboutads.info</a>.
              </p>
            </div>
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

          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                <Globe className="h-5 w-5 text-gray-900" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Third-Party Links</h2>
            </div>
            <p className="text-gray-600 leading-relaxed font-normal">
              Occasionally, at our discretion, we may include or offer third-party products or services on our website. These third-party sites have separate and independent privacy policies. We therefore have no responsibility or liability for the content and activities of these linked sites.
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
