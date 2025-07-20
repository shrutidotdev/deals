import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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
            <ArrowLeft className="h-6 w-6"  />
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

