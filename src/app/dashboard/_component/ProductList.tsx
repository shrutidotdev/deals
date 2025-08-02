import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  description: string;
  url: string;
}

const ProductList = ({ products }: { products: Product[] }) => {
  return (
    <div className="">
      {products.map((product: Product) => {
        return <ProductCard key={product.id} {...product} />;
      })}
    </div>
  );
};

export default ProductList;
