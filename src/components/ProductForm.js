// 'use client'
// import {useEffect, useState} from "react";
// import {useRouter} from "next/navigation";
// import axios from "axios";
// import Spinner from "@/components/Spinner";
// import {ReactSortable} from "react-sortablejs";

// export default function ProductForm({
//   _id,
//   title:existingTitle,
//   description:existingDescription,
//   price:existingPrice,
//   images:existingImages,
//   category:assignedCategory,
//   properties:assignedProperties,
// }) {
//   const [title,setTitle] = useState(existingTitle || '');
//   const [description,setDescription] = useState(existingDescription || '');
//   const [category,setCategory] = useState(assignedCategory || '');
//   const [productProperties,setProductProperties] = useState(assignedProperties || {});
//   const [price,setPrice] = useState(existingPrice || '');
//   const [images,setImages] = useState(existingImages || []);
//   const [goToProducts,setGoToProducts] = useState(false);
//   const [isUploading,setIsUploading] = useState(false);
//   const [categories,setCategories] = useState([]);
//   const router = useRouter();
//   useEffect(() => {
//     axios.get('/api/categories').then(result => {
//       setCategories(result.data);
//     })
//   }, []);
//   async function saveProduct(ev) {
//     ev.preventDefault();
//     const data = {
//       title,description,price,images,category,
//       properties:productProperties
//     };
//     if (_id) {
//       //update
//       await axios.put('/api/products', {...data,_id});
//     } else {
//       //create
//       await axios.post('/api/products', data);
//     }
//     setGoToProducts(true);
//   }
//   if (goToProducts) {
//     router.push('/products');
//   }
//   async function uploadImages(ev) {
//     const files = ev.target?.files;
//     if (files?.length > 0) {
//       setIsUploading(true);
//       const data = new FormData();
//       for (const file of files) {
//         data.append('file', file);
//         console.log(file)
//       }
//       const res = await axios.post('/api/upload', data);
//       setImages(oldImages => {
//         return [...oldImages, ...res.data.links];
//       });
//       setIsUploading(false);
//     }
//   }
//   function updateImagesOrder(images) {
//     setImages(images);
//   }
//   function setProductProp(propName,value) {
//     setProductProperties(prev => {
//       const newProductProps = {...prev};
//       newProductProps[propName] = value;
//       return newProductProps;
//     });
//   }

//   const propertiesToFill = [];
//   if (categories.length > 0 && category) {
//     let catInfo = categories.find(({_id}) => _id === category);
//     propertiesToFill.push(...catInfo.properties);
//     while(catInfo?.parent?._id) {
//       const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
//       propertiesToFill.push(...parentCat.properties);
//       catInfo = parentCat;
//     }
//   }

//   return (
//       <form onSubmit={saveProduct}>
//         <label>Product name</label>
//         <input
//           type="text"
//           placeholder="product name"
//           value={title}
//           onChange={ev => setTitle(ev.target.value)}/>
//         <label>Category</label>
//         <select value={category}
//                 onChange={ev => setCategory(ev.target.value)}>
//           <option value="">Uncategorized</option>
//           {categories.length > 0 && categories.map(c => (
//             <option key={c._id} value={c._id}>{c.name}</option>
//           ))}
//         </select>
//         {propertiesToFill.length > 0 && propertiesToFill.map(p => (
//           <div key={p.name} className="">
//             <label>{p.name[0].toUpperCase()+p.name.substring(1)}</label>
//             <div>
//               <select value={productProperties[p.name]}
//                       onChange={ev =>
//                         setProductProp(p.name,ev.target.value)
//                       }
//               >
//                 {p.values.map(v => (
//                   <option key={v} value={v}>{v}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         ))}
//         <label>
//           Photos
//         </label>
//         <div className="mb-2 flex flex-wrap gap-1">
//           <ReactSortable
//             list={images}
//             className="flex flex-wrap gap-1"
//             setList={updateImagesOrder}>
//             {!!images?.length && images.map(link => (
//               <div key={link} className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
//                 <img src={link} alt="" className="rounded-lg"/>
//               </div>
//             ))}
//           </ReactSortable>
//           {isUploading && (
//             <div className="h-24 flex items-center">
//               <Spinner />
//             </div>
//           )}
//           <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
//             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
//             </svg>
//             <div>
//               Add image
//             </div>
//             <input type="file" onChange={uploadImages} className="hidden"/>
//           </label>
//         </div>
//         <label>Description</label>
//         <textarea
//           placeholder="description"
//           value={description}
//           onChange={ev => setDescription(ev.target.value)}
//         />
//         <label>Price (in USD)</label>
//         <input
//           type="number" placeholder="price"
//           value={price}
//           onChange={ev => setPrice(ev.target.value)}
//         />
//         <button
//           type="submit"
//           className="">
//           Save
//         </button>
//       </form>
//   );
// }
'use client'
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import Spinner from "@/components/Spinner";
import {ReactSortable} from "react-sortablejs";

export default function ProductForm({
  _id,
  title:existingTitle,
  description:existingDescription,
  price:existingPrice,
  images:existingImages,
  category:assignedCategory,
  properties:assignedProperties,
}) {
  //setting the initial values if received in the props
  const [title,setTitle] = useState(existingTitle || '');
  const [description,setDescription] = useState(existingDescription || '');
  const [category,setCategory] = useState(assignedCategory || '');
  const [productProperties,setProductProperties] = useState(assignedProperties || {});
  const [price,setPrice] = useState(existingPrice || '');
  const [images,setImages] = useState(existingImages || []);
  const [goToProducts,setGoToProducts] = useState(false);
  const [isUploading,setIsUploading] = useState(false);
  const [categories,setCategories] = useState([]);
  const router = useRouter();
  //fetching categories
  useEffect(() => {
    axios.get('/api/categories').then(result => {
      setCategories(result.data.category);
    })
  }, []);
  // save prod func
  async function saveProduct(ev) {
    ev.preventDefault();
    // setting data obj 
    const data = {
      title,description,price,images,category,
      properties:productProperties
    };
    //if id is given than update the product in th db else add the new prod
    if (_id) {
      //update
      await axios.put('/api/products', {...data,_id});
    } else {
      //create
      await axios.post('/api/products', data);
    }
    setGoToProducts(true);
  }
  //once the opertion is done than route to products
  if (goToProducts) {
    router.push('/products');
  }
  //function to uplaod img
  async function uploadImages(ev) {
    const files = ev.target?.files; //getting the files
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        // add new file
        data.append('file', file);
      }
      //send to upload the files
      const res = await axios.post('/api/upload', data);
      setImages(oldImages => {
        return [...oldImages, ...res.data.links]; //add new image in the Images
      });
      setIsUploading(false);
    }
  }
  function updateImagesOrder(images) {
    setImages(images);
  }
  //
  function setProductProp(propName,value) {
    setProductProperties(prev => {
      const newProductProps = {...prev};
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({_id}) => _id === category);
    // console.log(catInfo)
    if(catInfo){

      propertiesToFill.push(...catInfo.properties);
    }
    while(catInfo?.parent?._id) {
      const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }

  return (
      <form onSubmit={saveProduct}>
        <label>Product name</label>
        <input
          type="text"
          placeholder="product name"
          value={title}
          onChange={ev => setTitle(ev.target.value)}/>
        <label>Category</label>
        <select value={category}
                onChange={ev => setCategory(ev.target.value)}>
          <option value="">Uncategorized</option>
          {categories.length > 0 && categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        {propertiesToFill.length > 0 && propertiesToFill.map(p => (
          <div key={p.name} className="">
            <label>{p.name[0].toUpperCase()+p.name.substring(1)}</label>
            <div>
              <select value={productProperties[p.name]}
                      onChange={ev =>
                        setProductProp(p.name,ev.target.value)
                      }
              >
                {p.values.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
        <label>
          Photos
        </label>
        <div className="mb-2 flex flex-wrap gap-1">
          <ReactSortable
            list={images}
            className="flex flex-wrap gap-1"
            setList={updateImagesOrder}>
            {!!images?.length && images.map(link => (
              <div key={link} className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
                <img src={link} alt="" className="rounded-lg"/>
              </div>
            ))}
          </ReactSortable>
          {isUploading && (
            <div className="h-24 flex items-center">
              <Spinner />
            </div>
          )}
          <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <div>
              Add image
            </div>
            <input type="file" onChange={uploadImages} className="hidden"/>
          </label>
        </div>
        <label>Description</label>
        <textarea
          placeholder="description"
          value={description}
          onChange={ev => setDescription(ev.target.value)}
        />
        <label>Price (in USD)</label>
        <input
          type="number" placeholder="price"
          value={price}
          onChange={ev => setPrice(ev.target.value)}
        />
        <button
          type="submit"
          className="">
          Save
        </button>
      </form>
  );
}
