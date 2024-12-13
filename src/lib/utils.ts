import { DataType, Field } from "apache-arrow"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { scale } from "chroma-js"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const Field2Typed = (field: Field) => {
	if (DataType.isDate(field.type)) {
		return {
			key: field.name,
			title: `${field.name}${field.nullable && "?"}`,
			formatter: (v: unknown) => new Date(v as number).toLocaleDateString(),
			typed: (v: unknown) => new Date(v as number)
		}
	}
	if (DataType.isTimestamp(field.type)) {
		return {
			key: field.name,
			title: `${field.name}${field.nullable && "?"}`,
			formatter: (v: unknown) => new Date(v as number).toLocaleString(),
			typed: (v: unknown) => new Date(v as number)
		}
	}
	if (DataType.isInt(field.type)) {
		return {
			key: field.name,
			title: `${field.name}${field.nullable && "?"}`,
			formatter: (v: unknown) => Number(v),
			typed: (v: unknown) => Number(v)
		}
	}
	return {
		key: field.name,
		title: `${field.name}${field.nullable && "?"}`,
		formatter: (v: unknown) => v,
		typed: (v: unknown) => v
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getPalette = (a: any[]) =>
	scale(["#fafa6e", "#2A4858"]).mode("lch").colors(a.length)
