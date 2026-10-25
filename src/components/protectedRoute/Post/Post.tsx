import { AiFillLike } from "react-icons/ai";
import { FaCommentAlt, FaShare } from "react-icons/fa";
import type { PostType } from "../../../Types/Post.type";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../../Loader/Loader";
import ComentCreation from "../../ComentCreation/ComentCreation";
import { HiDotsVertical } from "react-icons/hi";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaFileImage } from "react-icons/fa";
import { useContext, useState, type ChangeEvent } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { ImSpinner9 } from "react-icons/im";

export default function Post({
  post,
  hideTopComment,
}: {
  post: PostType;
  hideTopComment?: boolean;
}) {
  const { body, image, user, createdAt, topComment, _id } = post;
  const { name, photo, _id: userId } = user;
  const auth = useContext(AuthContext);
  const loginUserId = auth?.userId;
  const [isOpen, setisOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

 
  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState(body ?? "");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState("");

  function getPostComment() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${_id}/comments?page=1&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
  }

  function handleDeletePost() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${_id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  function handleUpdatePost() {
    const formdata = new FormData();
    formdata.append("body", editBody);
    if (editImage) {
      formdata.append("image", editImage);
    }

    return axios.put(
      `https://route-posts.routemisr.com/posts/${_id}`,
      formdata,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
  }

  const { isLoading, isError, error } = useQuery({
    queryKey: ["postComments", _id],
    queryFn: getPostComment,
  });

  const { isPending, mutate } = useMutation({
    mutationFn: handleDeletePost,
    onSuccess: () => {
      setisOpen(false);
      queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
      navigate("/home");
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { isPending: isUpdating, mutate: updatePost } = useMutation({
    mutationFn: handleUpdatePost,
    onSuccess: () => {
      closeEdit();
      queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
      queryClient.invalidateQueries({ queryKey: ["GetPostDetails", _id] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  function openEdit() {
    setEditBody(body ?? "");
    setEditImage(null);
    setEditPreview("");
    setisOpen(false);
    setIsEditing(true);
  }

  function closeEdit() {
    setIsEditing(false);
    setEditImage(null);
    setEditPreview("");
  }

  function handleEditImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditImage(file);
    setEditPreview(URL.createObjectURL(file));
  }

  function handleSaveEdit() {
    // مفيش تغيير يتبعت
    if (!editBody.trim() && !editImage && !image) return;
    updatePost();
  }

  // ===== بعد كده الـ early returns =====
  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }

  return (
    <div className="w-full max-w-[600px] mx-auto bg-slate-300 p-4 rounded-lg my-6">
      <div className="flex gap-4 justify-between items-center">
        <div className="flex gap-4 items-center">
          <img
            src={photo}
            className="w-10 h-10 object-cover rounded-full border-2 border-white"
            alt={name}
          />

          <div>
            <p className="font-bold">{name}</p>
            <p className="text-sm text-slate-500">{createdAt}</p>
          </div>
        </div>

        <div className="relative">
          {loginUserId === userId && (
            <HiDotsVertical
              onClick={() => setisOpen(!isOpen)}
              className="font-bold text-2xl cursor-pointer"
            />
          )}

          {isOpen && (
            <div className="bg-white p-2 rounded-lg absolute top-[120%] end-[-80px] shadow-2xl border-slate-400 border-2">
              <ul className="flex flex-col gap-3">
                <li>
                  <button
                    onClick={openEdit}
                    className="flex gap-2 items-center cursor-pointer bg-slate-100 w-full p-2"
                  >
                    Edit <MdEdit />
                  </button>
                </li>

                <li>
                  <button
                    disabled={isPending}
                    onClick={() => {
                      if (window.confirm("Delete this post?")) mutate();
                    }}
                    className="flex disabled:bg-slate-900 disabled:cursor-not-allowed gap-2 items-center cursor-pointer bg-slate-100 disabled:text-white w-full p-2"
                  >
                    {isPending ? (
                      <ImSpinner9 className="animate-spin" />
                    ) : (
                      <>
                        Delete <RiDeleteBin6Line />
                      </>
                    )}
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <p className="mb-4">{body}</p>

        {image && <img src={image} alt="Post" className="w-full rounded-lg" />}
      </div>

      <div className="px-4 flex justify-between">
        <div className="font-bold flex gap-2 items-center">
          {post.likesCount} <AiFillLike /> Likes
        </div>

        <Link to={`/postdetails/${_id}`}>
          <div className="font-bold flex gap-2 items-center">
            {post.commentsCount} <FaCommentAlt /> Comments
          </div>
        </Link>

        <div className="font-bold flex gap-2 items-center">
          {post.sharesCount} <FaShare /> Share
        </div>
      </div>

      <ComentCreation postId={_id} />

      {topComment && !hideTopComment && (
        <div className="my-2 p-4 rounded-sm bg-slate-100">
          <div className="flex gap-4 items-center my-2 p-2 bg-slate-100">
            <img
              src={topComment?.commentCreator.photo}
              className="w-10 h-10 object-cover rounded-full border-2 border-white"
              alt={name}
            />

            <div>
              <p className="font-bold">{topComment?.commentCreator.name}</p>
              <p className="text-sm text-slate-500">{topComment?.createdAt}</p>
            </div>
          </div>

          <p className="px-4">{topComment?.content}</p>
          {topComment?.image && (
            <img
              src={topComment.image}
              alt=""
              className="w-40 rounded mt-2 mx-4"
            />
          )}
        </div>
      )}

   
      {isEditing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
          onClick={closeEdit}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-lg mb-3">Edit post</h3>

            <textarea
              rows={4}
              dir="auto"
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />

            {(editPreview || image) && (
              <img
                src={editPreview || image}
                alt=""
                className="w-full max-h-64 object-cover rounded-lg mt-3"
              />
            )}

            <div className="mt-3 flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-blue-600">
                <FaFileImage size={18} />
                {image || editPreview ? "Change image" : "Add image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleEditImage}
                />
              </label>

              <div className="flex gap-2">
                <button
                  onClick={closeEdit}
                  disabled={isUpdating}
                  className="rounded-lg px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isUpdating}
                  className="rounded-lg px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isUpdating ? (
                    <ImSpinner9 className="animate-spin" />
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
