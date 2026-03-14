import { Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import PostCard from "../../Components/PostCard/PostCard";
import { axiosInstance } from "../../shared/AxiosInterceptos/AxiosInterceptos";
import SuggestedFriends from "../../Components/SuggestedFriends/SuggestedFriends";
import LeftNavbar from "../../Components/LeftNavbar/LeftNavbar";
import CreatePost from "../../Components/CreatePost/CreatePost";

export default function GetSavedPosts() {
  const {
    data: savedPosts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["savedPosts"],
    queryFn: async () => {
      const response = await axiosInstance.get("/users/bookmarks");
      return response.data.data.bookmarks;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        <Spinner size="lg" label="Loading bookmarks..." color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500">Error loading saved posts</p>
    );
  }

  return (
    <>
      <div className="bg-[#f8f9fa] min-h-screen">
        <div className="mx-auto px-4 grid grid-cols-12 gap-6 pt-6">
          {/* Left Navbar */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="fixed top-30 left-[calc(60%-768px)] w-60 z-50">
              <LeftNavbar />
            </div>
          </div>

          {/* Posts Section */}
          <div className="col-span-12 lg:col-span-6">
            <div className="max-w-3xl mx-auto space-y-5 mt-6">
              <CreatePost />

              <div className="space-y-4 w-full mt-4">
                {savedPosts.length > 0 ? (
                  savedPosts.map((post) => {
                    const adaptedPost = {
                      ...post,
                      commentCreator: post.user,
                      content: post.body,
                    };

                    return (
                      <PostCard
                        key={post._id}
                        userPost={adaptedPost} 
                      />
                    );
                  })
                ) : (
                  <div className="text-center p-10 bg-white rounded-xl shadow-sm border border-dashed">
                    <p className="text-gray-400">No saved posts yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Suggested Friends */}
          <div className="hidden md:block md:col-span-4 lg:col-span-3">
            <SuggestedFriends />
          </div>
        </div>
      </div>
    </>
  );
}
