import { SignIn } from "@clerk/nextjs";
import Logo from "@/components/Logo";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-white">
      {/* Cinematic Background Architecture */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(229,9,20,0.02),transparent_40%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-primary/2 rounded-full blur-[150px] -z-10" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] pointer-events-none" />

      <div className="flex flex-col items-center gap-12 z-10 w-full max-w-md px-6">
        <div className="flex flex-col items-center gap-6">
           <Logo size="lg" />
           <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-3 mb-2">
                 <span className="h-[1px] w-6 bg-primary" />
                 <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary italic">Access Control</span>
              </div>
              <h2 className="text-3xl font-black tracking-tighter uppercase italic text-gray-900">
                Authorization <span className="text-gray-300">Protocol.</span>
              </h2>
           </div>
        </div>

        <SignIn 
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-white border border-gray-100 shadow-xl rounded-[2.5rem] p-4",
              headerTitle: "hidden",
              headerSubtitle: "text-gray-400 text-[11px] font-black uppercase tracking-widest text-center",
              socialButtonsBlockButton: "bg-gray-50 border-gray-100 hover:bg-gray-100 text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-2xl h-14 transition-all",
              socialButtonsBlockButtonText: "text-gray-900 font-black uppercase tracking-widest",
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl h-14 shadow-md transition-all",
              formFieldInput: "bg-gray-50 border-gray-100 text-gray-900 rounded-xl h-12 focus:border-primary/50 transition-all",
              formFieldLabel: "text-gray-400 text-[9px] font-black uppercase tracking-[0.2em]",
              footerActionLink: "text-primary hover:text-primary/80 font-black uppercase tracking-widest text-[10px]",
              identityPreviewText: "text-gray-900",
              formResendCodeLink: "text-primary",
              dividerLine: "bg-gray-100",
              dividerText: "text-gray-300 text-[9px] font-black uppercase tracking-widest",
              formFieldSuccessText: "text-green-600",
              formFieldErrorText: "text-primary",
              alertText: "text-primary",
            }
          }}
        />
        
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300 mt-6">
          System: Pulse AI // Protocol: v4.0.2-Auth
        </p>
      </div>
    </div>
  );
}
