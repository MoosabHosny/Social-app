import axios from "axios";
import { useEffect, useState } from "react";

import Loading from "../Loading/Loading";
import PostCard from "../../Components/PostCard/PostCard";
import CreatePost from "../../Components/CreatePost/CreatePost";
import LeftNavbar from "../../Components/LeftNavbar/LeftNavbar";

import { SearchNormal1, UserAdd } from "iconsax-reactjs";
import { Button, Input, Card, User } from "@heroui/react";
import SuggestedFriends from "../../Components/SuggestedFriends/SuggestedFriends";

export default function Post() {
  const [allPost, setAllPost] = useState([]);

  async function getAllPost() {
    try {
      const {
        data: {
          data: { posts },
        },
      } = await axios.get("https://route-posts.routemisr.com/posts", {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      console.log("posts", posts);
      setAllPost(posts);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllPost();
  }, []);

  return (
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

            {allPost.length > 0 ? (
              allPost.map((post) => <PostCard key={post._id} userPost={post} />)
            ) : (
              <Loading />
            )}
          </div>
        </div>

        {/* Suggested Friends */}
        <div className="hidden md:block md:col-span-4 lg:col-span-3 h-full">
          <div className="sticky top-20">
            <SuggestedFriends />
          </div>
        </div>
      </div>
    </div>
  );
}
