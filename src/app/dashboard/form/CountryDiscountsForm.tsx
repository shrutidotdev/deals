"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { file, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { productConutryGroupDiscountSchema } from "@/lib/zodvalidations/product";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import ReactCountryFlag from "react-country-flag";
import { Input } from "@/components/ui/input";

const CountryDiscountsForm = ({
  productId,
  countryGroups,
}: {
  productId: string;
  countryGroups: {
    id: string;
    name: string;
    recommendedDiscountPercentage: number | null;
    countries: {
      name: string;
      code: string;
    }[];
    discount?: {
      coupon: string;
      discountPercentage: number;
    };
  }[];
}) => {
  const form = useForm<z.infer<typeof productConutryGroupDiscountSchema>>({
    resolver: zodResolver(productConutryGroupDiscountSchema),
    defaultValues: {
      groups: countryGroups.map((group) => {
        const discount =
          group.discount?.discountPercentage ??
          group.recommendedDiscountPercentage;
        return {
          countryGroupId: group.id,
          coupon: group.discount?.coupon ?? "",
          discountPercentage: discount != null ? discount * 100 : undefined,
        };
      }),
    },
  });

  function onSubmit(values: z.infer<typeof productConutryGroupDiscountSchema>) {
    console.log(values, "values of the form");
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {countryGroups.map((group, index) => (
          <Card key={group.id}>
            <CardContent>
              <div>
                <h2>{group.name}</h2>

                <div>
                  {group.countries.map((country) => (
                    <ReactCountryFlag
                      svg
                      countryCode={country.code}
                      style={{
                        fontSize: "2em",
                        lineHeight: "2em",
                      }}
                      aria-label={country.name}
                    />
                  ))}
                </div>
              </div>
              <Input
                type="hidden"
                {...form.register(`groups.${index}.countryGroupId`)}
              />

              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name={`group.${index}.coupon`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount %</FormLabel>
                      <FormControl>
                        <Input className="w-48" 
                        {...field} value={field.value ?? ""} 
                        onChange={e => field.onChange(e.target.valueAsNumber)} 
                        min="0"
                        max="100"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                <FormField
                  control={form.control}
                  name={`group.${index}.discountPercentage`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coupon</FormLabel>
                      <FormControl>
                        <Input className="w-48" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormMessage>
                {form.formState.errors.groups?.[index]?.root?.message}
              </FormMessage>
            </CardContent>
          </Card>
        ))}
      </form>
    </Form>
  );
};

export default CountryDiscountsForm;
