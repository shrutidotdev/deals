import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const CreateProductBtn = () => {
  return (
    <div>
      <Link href={"/dashboard/products/new"}>
        <Button>
          Create New Product
          <ArrowRight className="h-6 w-6 font-bold" />
        </Button>
      </Link>
    </div>
  );
};

export default CreateProductBtn;
