import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../shared/AxiosInterceptos/AxiosInterceptos";
import CreatePost from "../../Components/CreatePost/CreatePost";
import PostCard from "../../Components/PostCard/PostCard";
import Loading from "../Loading/Loading";
import LeftNavbar from "../../Components/LeftNavbar/LeftNavbar";
import SuggestedFriends from "../../Components/SuggestedFriends/SuggestedFriends";

export default function Feed() {

  const { data: posts = [], isLoading, isError } = useQuery({
    queryKey: ["feedPosts"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/posts/feed?only=following&limit=10`);
      return res.data.data.posts;
    },
  });

  if (isLoading) return <Loading />;
  if (isError) return <h1>Error loading posts</h1>;

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

          {posts.map((post) => (
            <PostCard key={post._id} userPost={post} />
          ))}

        </div>

        {/* Suggested Friends */}
        <div className="hidden md:block md:col-span-4 lg:col-span-3">
          <SuggestedFriends />
        </div>

      </div>
    </div>
  );
}