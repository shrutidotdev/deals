import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

interface Props {
  children: React.ReactNode;
  title: string;
  hrefTo: string;
}

const BackButton = ({ children, title, hrefTo }: Props) => {
  return (
    <div className="flex flex-col gap-4 ">
      <section className="flex gap-4 items-center">
        <Link href={hrefTo}>
          <Button variant="default" size="lg">
            <ArrowLeftIcon className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold ">{title}</h1>
      </section>

      
      <div className="mt-10">
        <h1 className="text-2xl">{children}</h1>
      </div>
    </div>
  );
};

export default BackButton;

function ArrowLeftIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 19L5 12L12 5" />
      <path d="M19 12H5" />
    </svg>
  );
}
