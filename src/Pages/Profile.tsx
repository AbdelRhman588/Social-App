
import { useRef, useState } from "react";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserProfile } from "../Types/ProfileType";
import type { PostType } from "../Types/Post.type";
import Loader from "../components/Loader/Loader";
import Post from "../components/protectedRoute/Post/Post";
import {
  FaCalendarAlt,
  FaEnvelope,
  FaUserFriends,
  FaUserPlus,
  FaBookmark,
  FaVenusMars,
  FaCamera,
  FaEdit,
  FaTimes,
} from "react-icons/fa";

export default function Profile() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const token = localStorage.getItem("userToken");

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getMyProfile"],
    queryFn: () =>
      axios.get("https://route-posts.routemisr.com/users/profile-data", {
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  const user: UserProfile | undefined = data?.data?.data?.user;

  const {
    data: postUserData,
    isLoading: loadingPostUser,
    isError: postsError,
  } = useQuery({
    queryKey: ["getUserPosts", user?._id],
    enabled: Boolean(user?._id),
    queryFn: () =>
      axios.get(
        `https://route-posts.routemisr.com/users/${user!._id}/posts`,
        { headers: { Authorization: `Bearer ${token}` } }
      ),
  });

  const posts: PostType[] = postUserData?.data?.data?.posts ?? [];

  function startEditing() {
    if (!user) return;
    setName(user.name);
    setUsername(user.username);
    setDateOfBirth(user.dateOfBirth?.slice(0, 10) ?? "");
    setGender(user.gender);
    setApiError("");
    setSuccessMessage("");
    setEditMode(true);
  }

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setApiError("Please choose a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setApiError("Image size must be less than 5 MB.");
      return;
    }

    if (previewImage) URL.revokeObjectURL(previewImage);
    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
    setApiError("");
    setSuccessMessage("");
  }

  async function handleUpdateProfile(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setIsUpdating(true);
    setApiError("");
    setSuccessMessage("");

    try {
      if (!selectedImage) {
        setApiError(
          "Profile details cannot be updated until the correct API endpoint is available."
        );
        return;
      }

      const formData = new FormData();
      formData.append("photo", selectedImage);

      const response = await axios.put(
        "https://route-posts.routemisr.com/users/upload-photo",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.success === false) {
        throw new Error(response.data?.message || "Photo upload failed.");
      }

      await queryClient.invalidateQueries({
        queryKey: ["getMyProfile"],
      });

      if (previewImage) URL.revokeObjectURL(previewImage);
      setSelectedImage(null);
      setPreviewImage(null);
      setEditMode(false);
      setSuccessMessage("Profile photo updated successfully.");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setApiError(
          err.response?.data?.message ||
            `Request failed (${err.response?.status ?? err.message}).`
        );
      } else {
        setApiError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      }
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="mx-auto mt-10 max-w-xl rounded-2xl bg-red-50 p-6 text-center text-red-600">
        {axios.isAxiosError(error)
          ? error.response?.data?.message ?? error.message
          : "Something went wrong"}
      </div>
    );
  }

  if (!user) {
    return <p className="mt-10 text-center text-slate-500">User profile not found.</p>;
  }

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const birthDate = new Date(user.dateOfBirth).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-white shadow-lg shadow-slate-200/70">
          <div className="relative h-48 bg-gradient-to-r from-indigo-600 via-violet-500 to-purple-400 sm:h-64">
            {user.cover && (
              <img src={user.cover} alt="Profile cover" className="h-full w-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          <div className="px-5 pb-8 sm:px-10">
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="relative -mt-16 h-32 w-32 sm:-mt-20 sm:h-40 sm:w-40">
                <img
                  src={previewImage ?? user.photo}
                  alt={user.name}
                  className="h-full w-full rounded-full border-4 border-white bg-white object-cover shadow-md"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
                  title="Change profile photo"
                >
                  <FaCamera />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={startEditing}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-700"
                >
                  <FaEdit /> Edit Profile
                </button>
                <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
                  <FaCalendarAlt className="mr-2 inline" /> Joined {joinedDate}
                </span>
              </div>
            </div>

            {selectedImage && (
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={startEditing}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                >
                  Save photo with profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (previewImage) URL.revokeObjectURL(previewImage);
                    setPreviewImage(null);
                    setSelectedImage(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-slate-700 hover:bg-slate-200"
                >
                  <FaTimes /> Cancel photo
                </button>
              </div>
            )}

            <div className="mt-5">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {user.name}
              </h1>
              <p className="mt-1 text-slate-500">@{user.username}</p>
              <p className="mt-4 max-w-2xl leading-7 text-slate-600">
                Welcome to my profile! Follow my activity and stay connected.
              </p>
            </div>

            {apiError && (
              <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {apiError}
              </p>
            )}

            {successMessage && (
              <p className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-700">
                {successMessage}
              </p>
            )}

            {editMode && (
              <form onSubmit={handleUpdateProfile} className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h2 className="text-lg font-bold text-slate-900">Edit your profile</h2>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Username</label>
                  <input
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Date of birth</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(event) => setDateOfBirth(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Gender</label>
                  <select
                    value={gender}
                    onChange={(event) => setGender(event.target.value as "male" | "female")}
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 outline-none focus:border-indigo-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(false);
                      setApiError("");
                    }}
                    disabled={isUpdating}
                    className="rounded-xl bg-slate-200 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl bg-slate-50 p-4 text-center hover:bg-indigo-50">
                <FaUserFriends className="mx-auto mb-2 text-xl text-indigo-600" />
                <p className="text-2xl font-bold text-slate-900">{user.followersCount}</p>
                <p className="mt-1 text-sm text-slate-500">Followers</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-center hover:bg-indigo-50">
                <FaUserPlus className="mx-auto mb-2 text-xl text-indigo-600" />
                <p className="text-2xl font-bold text-slate-900">{user.followingCount}</p>
                <p className="mt-1 text-sm text-slate-500">Following</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-center hover:bg-indigo-50">
                <FaBookmark className="mx-auto mb-2 text-xl text-indigo-600" />
                <p className="text-2xl font-bold text-slate-900">{user.bookmarksCount}</p>
                <p className="mt-1 text-sm text-slate-500">Bookmarks</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-center hover:bg-indigo-50">
                <FaVenusMars className="mx-auto mb-2 text-xl text-indigo-600" />
                <p className="text-lg font-bold capitalize text-slate-900">{user.gender}</p>
                <p className="mt-1 text-sm text-slate-500">Gender</p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-bold text-slate-900">Account Information</h2>
              <div className="mt-4 divide-y divide-slate-100 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-4 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <FaEnvelope />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-slate-500">Email address</p>
                    <p className="break-all font-medium text-slate-800">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <FaCalendarAlt />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Date of birth</p>
                    <p className="font-medium text-slate-800">{birthDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <FaUserFriends />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Username</p>
                    <p className="font-medium text-slate-800">@{user.username}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-4xl">
        <h2 className="mb-5 text-2xl font-bold text-slate-900">My Posts</h2>
        {loadingPostUser && <Loader />}
        {postsError && (
          <p className="rounded-xl bg-red-50 p-4 text-center text-red-600">
            Failed to load your posts.
          </p>
        )}
        {!loadingPostUser && !postsError && posts.length === 0 && (
          <p className="rounded-2xl bg-white p-8 text-center text-slate-500">
            You haven't posted anything yet.
          </p>
        )}
        <div className="space-y-5">
          {posts.map((currentPost) => (
            <Post key={currentPost._id} post={currentPost} />
          ))}
        </div>
      </div>
    </>
  );
}


 