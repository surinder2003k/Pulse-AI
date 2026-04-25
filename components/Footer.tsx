import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="relative z-10 py-12 md:py-16 border-t border-gray-100 bg-gray-50 mt-auto">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-5">
            <Logo size="md" />
            <div className="flex items-center gap-4 text-gray-400">
              <div className="w-12 h-[1px] bg-gray-200" />
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Pulse AI Protocol 2.0</p>
              <div className="w-12 h-[1px] bg-gray-200" />
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-14">
            {[
              { name: "About", href: "/about" },
              { name: "Editorial", href: "/blog" },
              { name: "Archive", href: "/blog" },
              { name: "Privacy", href: "/privacy" },
              { name: "Terms", href: "/terms" },
              { name: "Contact", href: "/contact" },
            ].map(link => (
              <Link 
                key={link.name} 
                href={link.href} 
                title={link.name} 
                className="text-sm font-semibold tracking-wider text-gray-500 hover:text-gray-900 transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="text-center pt-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              © {new Date().getFullYear()} PULSE AI NETWORK. ALL RIGHTS RESERVED.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
