
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loader from "../../components/Loader/Loader";
import { useParams } from "react-router-dom";
import Post from "../../components/protectedRoute/Post/Post";

export default function PostDetails() {
  const { id } = useParams();

  function GetPostDetails() {
    return axios
      .get(`https://route-posts.routemisr.com/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        return res.data;
      });
  }

  const {
    data: postDetails,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["GetPostDetails", id],
    queryFn: GetPostDetails,
    enabled: !!id,
    retry: 3,
    staleTime: 8000,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }
return (
  <>
    {postDetails?.data?.post && (
      <Post post={postDetails.data.post} />
    )}
  </>
);
}
