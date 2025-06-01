"use client";

import { ReactNode } from "react";

interface ButtonProps {
  variant: "primary" | "outlined" | "secondary";
  className?: string;
  onClick: () => void;
  size: "sm" | "lg";
  children: ReactNode;
}

export const Button = ({ variant, className, onClick, size, children }: ButtonProps) => {
  return (
    <button
      className={className}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
