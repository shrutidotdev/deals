'use client'
import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { productConutryGroupDiscountSchema } from '@/lib/zodvalidations/product'
import { Card, CardContent, CardDescription } from '@/components/ui/card'

const CountryDiscountsForm = ({
    productId,
    countryGroups
}: {
    productId: string,
    countryGroups: {
        id: string,
        name: string,
        recommendedDiscountPercentage: number | null,
        countries: {
            name: string,
            code : string
        }[],
        discount? : {
            coupon: string,
            discountPercentage: number
        } 
    }[]
}) => {
    
    const form = useForm<z.infer<typeof productConutryGroupDiscountSchema>>({
        resolver: zodResolver(productConutryGroupDiscountSchema),
        defaultValues: {
            groups: countryGroups.map(group => {
                const discount = group.discount?.discountPercentage ?? group.recommendedDiscountPercentage
                return{
                    countryGroupId: group.id,
                    coupon: group.discount?.coupon ?? "",
                    discountPercentage: discount != null ? discount * 100 : undefined,
                }
            })
        }
    })
    function onSubmit(values: z.infer<typeof productConutryGroupDiscountSchema>){
        console.log(values, "values of the form")
    }
  return (
   <Form {...form}>
    <form 
    onSubmit={form.handleSubmit(onSubmit)}
    className='flex flex-col gap-4'
    >
        {countryGroups.map(group => (
                <Card key={group.id}>
                    <CardContent>{group.name}</CardContent>
                </Card>
            )
        )}
    </form>
   </Form>
  )
}

export default CountryDiscountsForm