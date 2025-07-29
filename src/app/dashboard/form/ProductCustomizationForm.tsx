"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { productCustomizationTableSchema } from "@/lib/zodvalidations/product";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import RequiredLabelIcon from "../_component/RequiredLabelIcon";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Banner } from "@/app/components/Banner";


export function ProductCustomizationForm({
  customization,
  canCustomizeBanner,
  canRemoveBranding,
}: {
  customization: {
    productId: string;
    locationMessage: string;
    backgroundColor: string;
    textColor: string;
    fontSize: string;
    bannerContainer: string;
    isSticky: boolean;
    classPrefix: string | null;
  };
  canRemoveBranding: boolean;
  canCustomizeBanner: boolean;
}) {
  const form = useForm<z.infer<typeof productCustomizationTableSchema>>({
    resolver: zodResolver(productCustomizationTableSchema),
    defaultValues: {
      ...customization,
      classPrefix: customization.classPrefix ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof productCustomizationTableSchema>) {
    console.log(values);
  }

  const formValue = form.watch()
  return (
    <>
      <Banner
      message={formValue.locationMessage}
      mappings={{
        country: "India",
        coupon: "HALJK",
        discount: "60%"
      }}
      customization={formValue}
      canRemoveBranding={canRemoveBranding}
    />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
            <FormField
              control={form.control}
              name="locationMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    PPP Discount Message
                    <RequiredLabelIcon />
                  </FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      disabled={!canCustomizeBanner}
                      className="p-3 text-sm min-h-20 resize-none"
                    />
                  </FormControl>
                  <FormDescription>
                    Data Parameters: {"{country}, {coupon}, {discount}"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="backgroundColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Background Color
                    <RequiredLabelIcon />
                  </FormLabel>
                  <FormControl>
                    <Input disabled={!canCustomizeBanner} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="textColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Text Color
                    <RequiredLabelIcon />
                  </FormLabel>
                  <FormControl>
                    <Input disabled={!canCustomizeBanner} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fontSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Font Size
                    <RequiredLabelIcon />
                  </FormLabel>
                  <FormControl>
                    <Input disabled={!canCustomizeBanner} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />



            <FormField
              control={form.control}
              name="isSticky"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Sticky?
                  </FormLabel>
                  <FormControl>
                    <Switch
                      className="block"
                      checked={field.onChange}
                      onCheckedChange={field.onChange}
                      disabled={!canCustomizeBanner}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="bannerContainer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Banner
                  </FormLabel>
                  <FormControl>
                    <Input disabled={!canCustomizeBanner} {...field} />
                  </FormControl>
                  <FormDescription>
                    HTML container selector where you want to place the banner. EX: #cpontainer
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="classPrefix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    CSS
                  </FormLabel>
                  <FormControl>
                    <Input disabled={!canCustomizeBanner} {...field} />
                  </FormControl>

                  <FormDescription>
                    An optional prefix added to all css classes to avoid conflicts
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />






          </div>

          {canCustomizeBanner && (
            <div className="mt-10">
              <Button disabled={form.formState.isSubmitting} type="submit">Save</Button>
            </div>
          )}

        </form>
      </Form>
    </>
  );
}

export default ProductCustomizationForm;
