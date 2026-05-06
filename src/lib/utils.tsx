import { scale } from 'chroma-js'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getPalette = (a: any[]) => scale(['#fafa6e', '#2A4858']).mode('lch').colors(a.length)
