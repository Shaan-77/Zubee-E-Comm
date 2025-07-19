import {  useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductDetails } from "../../redux/slices/productsSlice";

import axios from "axios";
import { updateProduct } from "../../redux/slices/adminProductSlice";



const EditProductPage = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {id} = useParams(); // Assuming you have the product ID in the URL params
  const {selectedProduct, loading , error} = useSelector((state) => state.products); // Assuming you have a selector to get the selected product details




    const [productData, setProductData] = useState({
      name : "",
      description:"",
      price : 0,
      countInStock : 0,
      sku:"",
      category:"",
      brand:"",
      sizes:[],
      colors : [],
      collections : "",
      material : "",
      gender:"",
      images:[]
    })

    const [uploading, setUploading] = useState(false);


    useEffect(()=>{
      if(id) {
        dispatch(fetchProductDetails(id)); // Fetch product details by ID
      }
    },[dispatch, id]);

    useEffect(()=>{
      if(selectedProduct){
        setProductData(selectedProduct)
      }
    },[selectedProduct])



    const handlechange = (e) =>{
      const {name,value} = e.target;
      setProductData((preData)=>({...preData,[name]:value}))
    }

    const handleImageUpload = async (e) =>{
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);

      try {
        setUploading(true);
        const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            
          }
        });
        setProductData((preData) => ({
          ...preData,
          images: [...preData.images, { url: data.imageUrl, altText: "" }]
        }));
        setUploading(false);
      } catch (error) {
        console.error(error);
        setUploading(false);
        
      }

      console.log(file);
      
    }

    const handleSubmit = (e) =>{
      e.preventDefault();
      // console.log(productData);
      dispatch(updateProduct({ id, productData }))
      navigate("/admin/products");
    }

    if(loading) return <div className="text-center text-2xl font-semibold">Loading...</div>
    if(error) return <div className="text-center text-red-500 font-semibold">Error: {error}</div>

  return (
    <div className=" max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className=" text-3xl font-bold mb-6">Edit Product</h2>
      <form onSubmit={handleSubmit} >
        {/* Name */}
        <div className=" mb-6">
          <label className=" block font-semibold mb-2">Product Name</label>
          <input type="text" name="name" value={productData.name} onChange={handlechange} className=" w-full border border-gray-300 rounded-md p-2" required />
        </div>

        {/* Description */}
        <div className=" mb-6">
          <label className=" block font-semibold mb-2">Description</label>
          <textarea name="description" value={productData.description} onChange={handlechange} className=" w-full border border-gray-300 rounded-md p-2" rows={4} required  />
        </div>

        {/* Count in Stock */}
        <div className=" mb-6">
          <label className=" block font-semibold mb-2"> Count in Stock </label>
          <input type="number" name="countInStock" value={productData.countInStock} onChange={handlechange} className=" w-full border border-gray-300 rounded-md p-2" required />
        </div>

        {/* sku */}
        <div className=" mb-6">
          <label className=" block font-semibold mb-2">SKU</label>
          <input type="text" name="sku" value={productData.sku} onChange={handlechange} className=" w-full border border-gray-300 rounded-md p-2" required />
        </div>


        {/* SIZES */}
        <div className=" mb-6">
          <label className=" block font-semibold mb-2">Sizes (comma-separated)</label>
          <input type="text" name="sizes" value={productData.sizes.join(", ")} onChange={(e) => setProductData({ ...productData, sizes: e.target.value.split(",").map((size) => size.trim()) })} className=" w-full border border-gray-300 rounded-md p-2" required />
        </div>

        {/* Colors */}
        <div className=" mb-6">
          <label className=" block font-semibold mb-2">Colors (comma-separated)</label>
          <input type="text" name="colors" value={productData.colors.join(", ")} onChange={(e) => setProductData({ ...productData, colors: e.target.value.split(",").map((col) => col.trim()) })} className=" w-full border border-gray-300 rounded-md p-2" required />
        </div>

        {/* Images upload*/}
        <div className="mb-6">
          <label className=" block font-semibold mb-2">Upload Image</label>
          <input type="file" onChange={handleImageUpload} />
          {uploading && <p className=" text-blue-500">Uploading image...</p>}
          <div className=" flex gap-4 mt-4">
            {productData.images.map((images,index)=>(
              <div key={index} className="">
                <img src={images.url} alt={images.altText || "Product Image"} className=" w-20 h-20 object-cover rounded-md shadow-md " />
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors">Update Product</button>
      </form>
    </div>
  )
}

export default EditProductPage