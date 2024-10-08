'use client'
import {Layout,ProductForm} from "@/components";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import axios from "axios";

export default function EditProductPage() {
  const [productInfo, setProductInfo] = useState(null);
  const {id} = useParams() // getting id from the useParams
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/api/products?id='+id).then(response => { //fetching the product details
      setProductInfo(response.data);
    });
  }, [id]);
  return (
    <Layout>
      <h1>Edit product</h1>
      {productInfo && (
        <ProductForm {...productInfo} />
      )}
    </Layout>
  );
}