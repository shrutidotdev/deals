import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import BackButton from "../../_component/BackButton";
import ProductDetailsForm from "../../form/ProductDetailsForm";
import HasPermission from "@/app/components/HasPermission";
import { canCreateProduct } from "@/server/permission";

export default function NewProductPage() {
  return (
    <main className="min-h-screen mt-10 flex flex-col max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
      <BackButton title="Create Product" hrefTo="/dashboard/products">

      <HasPermission 
      permission={canCreateProduct} 
      renderFallback
      fallbackText="You have create too many products. Please upgrade your account to create more products."
      >


        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductDetailsForm />
          </CardContent>
        </Card>
      </HasPermission>
      </BackButton>
    </main>
  );
}
