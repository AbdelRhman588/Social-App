import { useForm } from 'react-hook-form'
import { FaCommentAlt } from "react-icons/fa"
import { FaImage } from "react-icons/fa6"
import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ImSpinner10 } from "react-icons/im";
type CommentForm = {
  content: string
  image: FileList | null
}

export default function CommentCreation({ postId }: { postId: string }) {
  const queryClient = useQueryClient()

  const { register, handleSubmit, reset, watch } = useForm<CommentForm>({
    defaultValues: { content: "", image: null },
  })

  const selectedImage = watch("image")

  function createComment(formdata: FormData) {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/comments`,
      formdata,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    )
  }

  const { isPending, mutate } = useMutation({
    mutationFn: createComment,
    onSuccess: (res) => {
      console.log("comment created", res.data)
      reset({ content: "", image: null })
      queryClient.invalidateQueries({ queryKey: ["getAllPosts"] })
      queryClient.invalidateQueries({ queryKey: ["GetPostDetails", postId] })
      queryClient.invalidateQueries({ queryKey: ["postComments", postId] })
    },
    onError: (err) => {
      console.log(err)
    },
  })

  function handleCreateComment(values: CommentForm) {
    const hasImage = values.image && values.image.length > 0
    if (!values.content && !hasImage) return

    const formdata = new FormData()

    if (values.content) {
      formdata.append("content", values.content)
    }
    if (hasImage) {
      formdata.append("image", values.image![0])
    }

    mutate(formdata)
  }

  return (
    <div className="bg-white p-3 my-4">
      <form
        className="max-w-md mx-auto"
        onSubmit={handleSubmit(handleCreateComment)}
      >
        <div className="relative">
          <input
            {...register("content")}
            type="text"
            className="block w-full rounded-lg p-3 ps-9 border text-sm shadow-xs"
            placeholder="Write a comment..."
          />
          <button
          disabled= {isPending}
            type="submit"
            className="absolute bg-blue-600 top-[50%] end-[10px] translate-y-[-50%] text-white cursor-pointer rounded text-xs px-3 py-1.5 disabled:opacity-50"
          >
        {isPending ? <ImSpinner10 />  :  <FaCommentAlt />}
          </button>
        </div>

        <label className="my-2 p-2 cursor-pointer flex justify-center items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white">
          <FaImage className="size-5" />
          {selectedImage && selectedImage.length > 0 && (
            <span className="text-sm">{selectedImage[0].name}</span>
          )}
          <input
            {...register("image")}
            type="file"
            accept="image/*"
            hidden
          />
        </label>
      </form>
    </div>
  )
}