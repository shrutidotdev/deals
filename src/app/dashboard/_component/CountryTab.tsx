import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CountryDiscountsForm from "../form/CountryDiscountsForm";
import { getProductCountryGroup } from "@/server/queries/products";

const CountryTab = async ({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) => {
  const countryGroups = await getProductCountryGroup({
    productId,
    userId,
  });


  return (
    <Card>
      <CardHeader>
        <CardTitle>Country Discounts</CardTitle>
        <CardDescription>
          Leave the discount field blank if you do not want to display deals for
          any specific parity group.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CountryDiscountsForm
          productId={productId}
          countryGroups={countryGroups}
        />
      </CardContent>

    </Card>
  );
};

export default CountryTab;
