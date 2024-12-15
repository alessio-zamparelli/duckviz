import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { scale } from "chroma-js"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getPalette = (a: any[]) =>
	scale(["#fafa6e", "#2A4858"]).mode("lch").colors(a.length)
