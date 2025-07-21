import { auth } from "@clerk/nextjs/server";
import { getProducts } from "../../server/queries/products";
import NoProductPage from "../components/NoProductPage";
import CreateProductBtn from "./_component/CreateProductBtn";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductList from "./_component/ProductList";

interface Product {
  id: string;
  name: string;
  description: string;
  url: string;
}

export default async function DashBoardPage() {
  const { userId } = await auth();
  //console.log(userSession, "User session ")
  if (!userId) return <div>You must be logged in to view this page</div>;

  const products: Product[] = await getProducts(userId, { limit: 16 });
  if (products.length === 0) return <NoProductPage />;

  return (
    <main className="min-h-screen flex flex-col max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
      <div className="mt-10 flex justify-between items-center ">
        <Link href={"/dashboard"} className="flex items-center gap-2">
           <p>Products</p>
           <ArrowRight className="h-6 w-6 font-bold" />
        </Link>
        <CreateProductBtn />
      </div>

      <div className="mt-20 text-center">
        <ProductList products={products} />
      </div>
    </main>
  );
}
