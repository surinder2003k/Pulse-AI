import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ghost, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 px-6">
      <div className="relative">
        <Ghost className="h-32 w-32 text-primary opacity-20 animate-bounce" />
        <h1 className="text-9xl font-extrabold tracking-tighter absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50">404</h1>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">Arre Yaar! Galti Ho Gayi.</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          The page you are looking for has either been deleted by the passionate Punjabi Admin or it never existed in the first place.
        </p>
      </div>

      <Link href="/">
        <Button size="lg" className="rounded-full px-8 h-12 shadow-purple">
          <Home className="h-4 w-4 mr-2" /> Back to Home Base
        </Button>
      </Link>
    </div>
  );
}
