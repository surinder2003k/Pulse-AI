"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

interface VButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary";
  href?: string;
  className?: string;
  children: React.ReactNode;
}

export default function VButton({
  variant = "primary",
  href,
  className,
  children,
  ...props
}: VButtonProps) {
  const baseStyles = "px-7 py-3 rounded-full font-medium text-sm transition-all duration-300 whitespace-nowrap inline-flex items-center justify-center active:scale-95";
  
  const variants = {
    primary: "bg-[#000000] text-white hover:bg-[#111111] v-shadow-primary",
    secondary: "bg-white text-black bg-white v-shadow-secondary hover:bg-gray-50",
    tertiary: "bg-white text-black v-shadow-secondary v-shadow-inset hover:bg-gray-50",
  };

  const combinedClasses = cn(baseStyles, variants[variant], className);

  if (href) {
    return (
      <Link href={href} className={combinedClasses} target={href.startsWith("http") ? "_blank" : undefined}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
