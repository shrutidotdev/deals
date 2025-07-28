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
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { productConutryGroupDiscountSchema } from "@/lib/zodvalidations/product";
import { Card, CardContent } from "@/components/ui/card";
import ReactCountryFlag from "react-country-flag";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateCountryDiscounts } from "@/server/actions/product";

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

  async function onSubmit(values: z.infer<typeof productConutryGroupDiscountSchema>) {
    const data = await updateCountryDiscounts(productId, values)

    if (data?.error) {
      toast.error("Message")
    }
    else {
      toast.success("Got county discount")
    }
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
              <div className="flex flex-col gap-5">
                <h2 className="text-2xl font-bold">{group.name}</h2>

                <section className="w-[50%]">
                  <div className="flex flex-wrap  gap-2 ">
                    {group.countries.map((country) => (
                      <ReactCountryFlag
                        key={country.code}
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
                </section>
              </div>
              <input
                type="hidden"
                {...form.register(`groups.${index}.countryGroupId`)}
              />

              {/* Discount and Coupon Section */}
              <div className="flex gap-4 mt-6">
                <FormField
                  control={form.control}
                  name={`groups.${index}.discountPercentage`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount In (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="w-48"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                          min="0"
                          max="100"
                          placeholder="Enter discount percentage"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`groups.${index}.coupon`}
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

              {/* Form Error Messages */}
              <FormMessage>
                {form.formState.errors.groups?.[index]?.root?.message}
              </FormMessage>
            </CardContent>
          </Card>
        ))}
        <Button disabled={form.formState.isSubmitting} type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default CountryDiscountsForm;