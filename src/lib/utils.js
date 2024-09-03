import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
//this is the utils file for shadcn
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
