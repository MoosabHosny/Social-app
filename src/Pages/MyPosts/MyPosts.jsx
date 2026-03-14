import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../shared/AxiosInterceptos/AxiosInterceptos";

import CreatePost from "../../Components/CreatePost/CreatePost";
import PostCard from "../../Components/PostCard/PostCard";
import Loading from "../Loading/Loading";

import LeftNavbar from "../../Components/LeftNavbar/LeftNavbar";
import SuggestedFriends from "../../Components/SuggestedFriends/SuggestedFriends";

export default function MyPosts() {

  const {
    data: posts = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myPosts"],
    queryFn: async () => {

      const res = await axiosInstance.get(`/users/profile-data`);
      const userId = res.data.data.user._id;

      const response = await axiosInstance.get(`/users/${userId}/posts`);

      return response.data.data.posts;
    },
  });

  if (isLoading) {
    return (
      <div className="text-center mt-10">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return <h1 className="text-center mt-10">Error loading posts</h1>;
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <div className="mx-auto px-4 grid grid-cols-12 gap-6 pt-6">

        {/* Left Navbar */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="fixed top-30 left-[calc(60%-768px)] w-60 z-50">
            <LeftNavbar />
          </div>
        </div>

        {/* Posts */}
        <div className="col-span-12 md:col-span-8 lg:col-span-6 space-y-5">

          <CreatePost />

          {posts.length === 0 ? (
            <h2 className="text-center text-gray-500">No posts yet</h2>
          ) : (
            posts.map((post) => (
              <PostCard key={post._id} userPost={post} />
            ))
          )}

        </div>

        {/* Suggested Friends */}
        <div className="hidden md:block md:col-span-4 lg:col-span-3">
          <div className="sticky top-24">
            <SuggestedFriends />
          </div>
        </div>

      </div>
    </div>
  );
}