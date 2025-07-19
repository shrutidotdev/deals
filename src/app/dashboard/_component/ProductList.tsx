import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  description: string;
  url: string;
}

const ProductList = ({ products }: { products: Product[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product: Product) => {
        return <ProductCard key={product.id} {...product} />;
      })}
    </div>
  );
};

export default ProductList;
