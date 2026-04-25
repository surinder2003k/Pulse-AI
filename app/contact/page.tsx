import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare, Globe, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="space-y-6 mb-16 text-center">
          <Badge variant="outline" className="px-6 py-2 border-primary/20 text-primary bg-primary/5 uppercase font-bold tracking-widest text-[10px]">
            Transmission Channel
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 uppercase italic">
            Contact <span className="text-slate-300">Us</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Have a lead, a technical query, or looking for a collaboration? Open a line of communication with our editorial board.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-4">
            <div className="h-12 w-12 bg-primary/5 rounded-2xl flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Email</h3>
              <p className="text-gray-500 text-sm mt-1">editorial@pulse-ai.network</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-4">
            <div className="h-12 w-12 bg-primary/5 rounded-2xl flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Support</h3>
              <p className="text-gray-500 text-sm mt-1">help.pulse-ai.network</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-4">
            <div className="h-12 w-12 bg-primary/5 rounded-2xl flex items-center justify-center">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Global</h3>
              <p className="text-gray-500 text-sm mt-1">Available 24/7 Digital</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-10 md:p-16">
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email Address</label>
                <input 
                  type="email" 
                  placeholder="john@example.com" 
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Subject</label>
              <input 
                type="text" 
                placeholder="Inquiry about Editorial Services" 
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Message</label>
              <textarea 
                rows={5} 
                placeholder="Tell us more about your inquiry..." 
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none"
              ></textarea>
            </div>
            <Button className="w-full py-8 rounded-2xl text-xs font-black uppercase tracking-[0.4em] gap-4">
              Send Message <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
