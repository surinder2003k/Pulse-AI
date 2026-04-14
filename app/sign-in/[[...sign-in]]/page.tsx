import { SignIn } from "@clerk/nextjs";
import Logo from "@/components/Logo";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#030303]">
      {/* Cinematic Background Architecture */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(229,9,20,0.05),transparent_40%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -z-10" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none" />

      <div className="flex flex-col items-center gap-12 z-10 w-full max-w-md px-6">
        <div className="flex flex-col items-center gap-6">
           <Logo size="lg" />
           <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-3 mb-2">
                 <span className="h-[1px] w-6 bg-primary" />
                 <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary italic">Access Control</span>
              </div>
              <h2 className="text-3xl font-black tracking-tighter uppercase italic text-white">
                Authorization <span className="text-white/20">Protocol.</span>
              </h2>
           </div>
        </div>

        <SignIn 
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-black/40 backdrop-blur-3xl border border-white/5 shadow-premium rounded-[2.5rem] p-4",
              headerTitle: "hidden",
              headerSubtitle: "text-white/40 text-[11px] font-black uppercase tracking-widest text-center",
              socialButtonsBlockButton: "bg-white/[0.03] border-white/5 hover:bg-white/5 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl h-14",
              socialButtonsBlockButtonText: "text-white font-black uppercase tracking-widest",
              formButtonPrimary: "bg-primary hover:glow-red-strong text-white text-[10px] font-black uppercase tracking-widest rounded-2xl h-14 shadow-glow-red transition-all",
              formFieldInput: "bg-white/[0.03] border-white/5 text-white rounded-xl h-12 focus:border-primary/50 transition-all",
              formFieldLabel: "text-white/40 text-[9px] font-black uppercase tracking-[0.2em]",
              footerActionLink: "text-primary hover:text-glow-red font-black uppercase tracking-widest text-[10px]",
              identityPreviewText: "text-white",
              formResendCodeLink: "text-primary",
              dividerLine: "bg-white/5",
              dividerText: "text-white/20 text-[9px] font-black uppercase tracking-widest",
              formFieldSuccessText: "text-green-400",
              formFieldErrorText: "text-primary",
              alertText: "text-primary",
            }
          }}
        />
        
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10 mt-6">
          System: Pulse AI // Protocol: v4.0.2-Auth
        </p>
      </div>
    </div>
  );
}
