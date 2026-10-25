import { FaFileImage } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { useRef, useState, type ChangeEvent } from "react";
import { IoIosSend } from "react-icons/io";
import  axios  from 'axios';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GiSpinalCoil } from "react-icons/gi";


export default function PostCreation() {
  const [isUploaded, setIsUploaded] = useState("");
  const query =useQueryClient()



const textInput = useRef(null);
const imageInput = useRef(null);



  const formData = new FormData();

  function clearForm() {
  textInput.current.value = "" ;
  imageInput.current.value = "" ;
  setIsUploaded("");
  }

function creatPost() {
  return axios.post(
    "https://route-posts.routemisr.com/posts",
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    }
  );
}

const {data , isPending , mutate  } = useMutation({
mutationFn : creatPost,
onSuccess : () => {
  clearForm();
  query.invalidateQueries({ queryKey: ['getAllPosts'] });
},



})



  function handleCreatePost() {

if( textInput.current.value=== "" &&  imageInput.current.value === "") return;

if(textInput.current!.value){

formData.append("body" , textInput.current!.value)
}

if( imageInput.current.value){
formData.append("image" , imageInput.current?.files[0])
}


mutate()

  }

  function handleImagePreview(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    const path = URL.createObjectURL(file);
    setIsUploaded(path);
  }


  return <>
  
  
<div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

  <textarea
  ref={textInput}
    rows={3}
    dir="auto"
    placeholder="What's on your mind?"
    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
  />
 
{isUploaded && <div className="relative">
  <img src={isUploaded} alt="" />
  <IoCloseSharp    onClick={ ()=> setIsUploaded("")} className="absolute top-2.5 inset-e-2.5 size-8 cursor-pointer text-blue-700" />
</div>}



  <div className="mt-3 flex items-center justify-between">
   
    <label className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-blue-600">
      <FaFileImage size={18} />
      Add image

      <input
      ref={imageInput}
        type="file"
        accept="image/*"
        className="hidden" 
        onChange={handleImagePreview}
      />
    </label>

    <button
    
    disabled ={isPending}
    onClick={handleCreatePost}
      type="submit"
      className="  disabled:bg-blue-900 disabled:cursor-not-allowed flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
    >

        {isPending ? (<GiSpinalCoil  className="animate-spin "/>) :( <> <IoIosSend /> </> )}

    </button>
  </div>
</div>

  
  
  
  
  
  
  
  
  
  
  
  </>
}









