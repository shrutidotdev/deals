import BackButton from "@/app/dashboard/_component/BackButton";
import { env } from "@/lib/env/client";
import { getProductToEdit } from "@/server/queries/products";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DetailsTabs from "@/app/dashboard/_component/DetailsTabs";

interface EditProductPageProps {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{ tab: string }>;
}

const EditProductPage = async ({
  params,
  searchParams,
}: EditProductPageProps) => {

  const { productId } = await params;
  const { tab = "details" } = await searchParams;

  const { userId, redirectToSignIn } = await auth();
  if (userId == null) {
    redirectToSignIn();
    return 
  }

  const product = await getProductToEdit({ id: productId, userId });
  if (product == null) {
    return notFound();
  }
  return (
    <div className="flex flex-col gap-4 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
      <BackButton title="Edit Products" hrefTo="/dashboard/products">
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="country">Country</TabsTrigger>
            <TabsTrigger value="customization">Customization</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <DetailsTabs product={product} />
          </TabsContent>
          <TabsContent value="country">
            Country
          </TabsContent>
          <TabsContent value="customization">
            Customization
          </TabsContent>
          <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
      </BackButton>
    </div>
  );
};

export default EditProductPage;
