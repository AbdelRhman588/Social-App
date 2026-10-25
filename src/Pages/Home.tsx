
import axios from "axios";
import type { PostType } from "../Types/Post.type";
import Post from "../components/protectedRoute/Post/Post";
import Loader from "../components/Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import PostDetails from './PostDetails/PostDetails';
import PostCreation from './../components/PostCreation/PostCreation';


export default function Home() {
  function GetAllPosts() {
    return axios
      .get("https://route-posts.routemisr.com/posts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      })
      .then((res) => {
        console.log(res.data.data.posts);
        return res.data.data.posts as PostType[];
      })
      .catch((err) => {
        console.log(err.response?.data || err.message);
        throw err;
      });
  }

  const {
    data: allProducts,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["getAllPosts"],
    queryFn: GetAllPosts,

  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <h1 className="text-center text-red-600 my-8">
        {error.message}
      </h1>
    );
  }

  return (

    <div className="my-8">

<div className="w-[600px] mx-auto"> <PostCreation/>  </div>   



{allProducts?.map((post: PostType) => (

  <Post post={post} key={post.id} />
) )}

    </div>
  );
}
