"use client";

import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare, Globe, Send, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

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
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-6 animate-in zoom-in duration-500">
               <div className="h-24 w-24 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
               </div>
               <div className="text-center">
                  <h2 className="text-2xl font-black uppercase italic tracking-tighter">Transmission Received</h2>
                  <p className="text-slate-500 text-sm font-medium mt-2">Your message has been logged in our system. We will reach out shortly.</p>
               </div>
               <Button 
                onClick={() => setStatus("idle")}
                variant="outline" 
                className="rounded-xl px-10 border-slate-200"
               >
                 Send Another Message
               </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Full Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="John Doe" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email Address</label>
                  <input 
                    required
                    type="email" 
                    placeholder="john@example.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Subject</label>
                <input 
                  type="text" 
                  placeholder="Inquiry about Editorial Services" 
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Message</label>
                <textarea 
                  required
                  rows={5} 
                  placeholder="Tell us more about your inquiry..." 
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none text-slate-900"
                ></textarea>
              </div>
              
              {status === "error" && (
                <p className="text-red-500 text-xs font-bold uppercase tracking-widest text-center">Encryption Error: Failed to transmit message. Please try again.</p>
              )}

              <Button 
                disabled={status === "loading"}
                className="w-full py-8 rounded-2xl text-xs font-black uppercase tracking-[0.4em] gap-4"
              >
                {status === "loading" ? (
                  <>Transmitting... <Loader2 className="h-4 w-4 animate-spin" /></>
                ) : (
                  <>Send Message <Send className="h-4 w-4" /></>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
