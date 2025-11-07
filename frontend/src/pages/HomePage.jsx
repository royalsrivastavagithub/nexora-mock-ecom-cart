import React from 'react';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  return (
    <div className="border rounded-lg p-4 flex flex-col">
      <img src={product.imageUrl || 'https://via.placeholder.com/150'} alt={product.name} className="rounded-md mb-4 h-48 w-full object-cover"/>
      <h2 className="text-lg font-bold">{product.name}</h2>
      <p className="text-gray-500 flex-grow">{product.description}</p>
      <div className="flex justify-between items-center mt-4">
        <p className="text-xl font-semibold">₹{product.price}</p>
        <button onClick={() => addToCart(product._id, 1)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

const HomePage = () => {
  const { products, loading } = useProducts();

  if (loading) {
    return <div className="text-center p-8">Loading products...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
