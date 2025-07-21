import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import BackButton from "../../_component/BackButton";
import ProductDetailsForm from "../../form/ProductDetailsForm";

export default function NewProductPage() {
  return (
    <main className="min-h-screen flex flex-col max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
      <BackButton title="Create Product" hrefTo="/dashboard/products">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductDetailsForm />
          </CardContent>
        </Card>
      </BackButton>
    </main>
  );
}
