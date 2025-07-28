import BackButton from "@/app/dashboard/_component/BackButton";
import { getProductToEdit } from "@/server/queries/products";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DetailsTabs from "@/app/dashboard/_component/DetailsTabs";
import CountryTab from "@/app/dashboard/_component/CountryTab";
import CustomizationTab from "@/app/dashboard/_component/CustomizationTab";

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
    <div className="flex flex-col gap-4 mx-auto">
      <BackButton title="Edit Products" hrefTo="/dashboard/products">

        <div className="w-full max-w-4xl mx-auto">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="country">Country</TabsTrigger>
              <TabsTrigger value="customization">Customization</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6">
              <DetailsTabs product={product} />
            </TabsContent>
            <TabsContent value="country" className="mt-6">
              <CountryTab productId={product.id} userId={userId} />
            </TabsContent>
            <TabsContent value="customization" className="mt-6">
              <CustomizationTab productId={product.id} userId={userId} />
            </TabsContent>
          </Tabs>
        </div>
      </BackButton>
    </div>
  );
};

export default EditProductPage;