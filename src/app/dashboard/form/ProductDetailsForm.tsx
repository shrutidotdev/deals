"use client";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  CreateProductFormData,
  createProductSchema,
} from "@/lib/zodvalidations/product";
import { toast } from "sonner";
import axios from "axios";

const ProductDetailsForm = () => {
  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      url: "",
      image: "",
      basePrice: "",
      currency: "INR",
      enableParityPricing: false,
      discountPercentage: 10,
      isActive: true,
      isPublished: false,
    },
  });

  function ResetForm() {
    form.reset();
  }

  async function onSubmit(values: CreateProductFormData) {
    console.log("🎉 FORM SUBMITTED SUCCESSFULLY!");

    try {
      const response = await axios.post("/api/products", values);
      const result = response.data;
      
      if (result.error) {
        toast.error(result.message, {
          duration: 3000,
        });
      } else {
        toast.success(result.message, {
          duration: 3000,
        });
        console.log("Form values:", values);
        
        // Reset form after successful submission
        ResetForm();
        
        if (result.redirect) {
          window.location.href = result.redirect;
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
      
      // Handle axios errors
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "Something went wrong";
        toast.error(errorMessage, {
          duration: 3000,
        });
      } else {
        toast.error("Network error. Please try again.", {
          duration: 3000,
        });
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
        onInvalid={(e) => {
          console.log("Form is invalid:", e);
          console.log("Form errors:", form.formState.errors);
        }}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormDescription>
                This is your product's display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormDescription>
                The URL where customers can access your product.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="basePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Price</FormLabel>
              <FormControl>
                <Input placeholder="29.99" {...field} />
              </FormControl>
              <FormDescription>
                The base price of your product.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Product description" {...field} />
              </FormControl>
              <FormDescription>
                A brief description of your product.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="button" onClick={ResetForm} variant="outline">
            Reset
          </Button>
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? "Creating..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductDetailsForm;