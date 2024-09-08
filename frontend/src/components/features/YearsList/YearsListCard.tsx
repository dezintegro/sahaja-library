"use client";

import { Card } from "flowbite-react";

export interface IYearCardProps {
  title: string;
  content: string;

}
export function YearCard({title, content}: IYearCardProps) {
  return (
    <Card href="#" className="max-w-sm">
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {title}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {content}
      </p>
    </Card>
  );
}
