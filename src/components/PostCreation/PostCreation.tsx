
import { FaFileImage } from "react-icons/fa";
import { IoCloseSharp, IoIosSend } from "react-icons/io";
import { useRef, useState, type ChangeEvent } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GiSpinalCoil } from "react-icons/gi";

export default function PostCreation() {
  const [isUploaded, setIsUploaded] = useState("");
  const [error, setError] = useState("");
  const query = useQueryClient();

  const textInput = useRef<HTMLTextAreaElement>(null);
  const imageInput = useRef<HTMLInputElement>(null);

  function clearForm() {
    if (textInput.current) textInput.current.value = "";
    if (imageInput.current) imageInput.current.value = "";
    if (isUploaded) URL.revokeObjectURL(isUploaded);
    setIsUploaded("");
    setError("");
  }

  function creatPost(formData: FormData) {
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

  const { isPending, mutate } = useMutation({
    mutationFn: creatPost,
    onSuccess: () => {
      clearForm();
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
    },
    onError: (err) => {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to create post."
          : "Something went wrong."
      );
    },
  });

  function handleCreatePost() {
    const text = textInput.current?.value.trim() ?? "";
    const image = imageInput.current?.files?.[0];

    if (!text && !image) return;

    const formData = new FormData();

    if (text) formData.append("body", text);
    if (image) formData.append("image", image);

    setError("");
    mutate(formData);
  }

  function handleImagePreview(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isUploaded) URL.revokeObjectURL(isUploaded);
    setIsUploaded(URL.createObjectURL(file));
  }

  function removeImage() {
    if (isUploaded) URL.revokeObjectURL(isUploaded);
    setIsUploaded("");
    if (imageInput.current) imageInput.current.value = "";
  }

  return (
    <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <textarea
        ref={textInput}
        rows={3}
        dir="auto"
        placeholder="What's on your mind?"
        className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
      />

      {isUploaded && (
        <div className="relative mt-3">
          <img
            src={isUploaded}
            alt="Preview"
            className="max-h-80 rounded-xl object-contain"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute right-2 top-2 rounded-full bg-white p-1 text-blue-700 shadow"
          >
            <IoCloseSharp className="size-6" />
          </button>
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

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
          disabled={isPending}
          onClick={handleCreatePost}
          type="button"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-900"
        >
          {isPending ? (
            <GiSpinalCoil className="animate-spin" />
          ) : (
            <IoIosSend />
          )}
          Post
        </button>
      </div>
    </div>
  );
}
