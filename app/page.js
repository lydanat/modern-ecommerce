"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Home() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")

      if (error) {
        console.log(error)
      } else {
        setProducts(data)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      {products.map((product) => (
        <div key={product.id} className="border p-4 mb-4 rounded">
          <h2 className="text-xl font-semibold">{product.product_name}</h2>
          <p>${product.price}</p>
          <p>{product.product_type}</p>
          <img
            src={product.image_urls[0] || "/placeholder.png"}
            alt={product.product_name}
            className="w-48 h-48 object-cover"
          />
          <p>Colors: {product.colors.join(", ")}</p>
          <p>Sizes: {product.sizes.join(", ")}</p>
        </div>
      ))}
    </div>
  )
}