import { type ClassValue, clsx } from "clsx";
import type { ReactElement, ReactNode } from "react";
import { Children, isValidElement } from "react";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getValidChildren = (children: ReactNode) => {
  return Children.toArray(children).filter((child) =>
    isValidElement(child)
  ) as ReactElement[];
};
