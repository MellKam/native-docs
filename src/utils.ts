import { twMerge } from "tailwind-merge";
import { cx, type CxOptions } from "class-variance-authority";

export const cn = (...inputs: CxOptions) => twMerge(cx(inputs));

export type { ClassValue } from "class-variance-authority/types";
