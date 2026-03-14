import { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Image,
  Button,
} from "@heroui/react";
import {
  Like1,
  MessageMinus,
  Share,
  Timer1,
  UserAdd,
} from "iconsax-reactjs";
import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../shared/AxiosInterceptos/AxiosInterceptos";
import Loading from "../Loading/Loading";
import ProfileHeader from "../../Components/ProfileHeader/ProfileHeader";
import FollowButton from "../../Components/FollowButton/FollowButton";

export default function Profile() {
  const { userId } = useParams();

  // Query لجلب بيانات المستخدم
  const { data: profileUser, isLoading: profileLoading, isError: profileError } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      const endpoint = userId ? `/users/${userId}/profile` : `/users/profile-data`;
      const response = await axiosInstance.get(endpoint);
      console.log("Profile Data:", response.data);
      return response.data.data.user || response.data.data;
    },
  });

  // توحيد المتغير user
  const user = profileUser;

  // Query لجلب بوستات المستخدم
  const { data: posts = [], isLoading: postsLoading, isError: postsError } = useQuery({
    queryKey: ["feedPosts", userId],
    queryFn: async () => {
      let finalUserId = userId;

      if (!userId) {
        const res = await axiosInstance.get(`/users/profile-data`);
        finalUserId = res.data.data.user._id;
      }

      const response = await axiosInstance.get(`/users/${finalUserId}/posts`);
      console.log("Posts Data:", response.data.data);
      return response.data.data.posts;
    },
  });

  // دالة تنسيق الوقت
  function formatPostDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  if (profileLoading || postsLoading)
    return (
      <div className="text-center mt-10">
        <Loading />
      </div>
    );

  if (profileError || postsError)
    return <h1 className="text-center mt-10">Error loading profile or posts</h1>;

  return (
    <>
      {/* الهيدر */}
      {!userId ? (
        <ProfileHeader />
      ) : (
        <div className="w-full max-w-7xl mx-auto mb-10 px-4">
          <div className="h-38 md:h-44 w-full rounded-t-[2rem] bg-gradient-to-r from-[#0a192f] via-[#112240] to-[#233554]" />

          <Card className="shadow-sm border-none bg-white  rounded-b-[1.5rem] rounded-t-none p-6 md:p-10 relative">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-24 md:-mt-28">
              <div className="relative group">
                <div className="p-1.5 bg-white rounded-full shadow-md">
                  <Image
                    src={user?.photo}
                    width={140}
                    height={140}
                    className="rounded-full object-cover border-4 mt-20 border-white"
                    alt={user?.name}
                  />
                </div>
              </div>

              <div className="flex-1 flex flex-col md:flex-row justify-between items-center md:items-end w-full pb-2">
                <div className="text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a]">
                    {user?.name || "User Name"}
                  </h2>
                  <p className="text-slate-500 font-medium">
                    @{user?.username || "username"}
                  </p>
                </div>

                <div className="mt-4 md:mt-0">
                  {/* <Button
                    color="primary"
                    className="bg-[#1b76f2] font-bold px-8 rounded-xl"
                    startContent={<UserAdd size="20" variant="Bold" />}
                  >
                    Follow
                  </Button> */}
                    <FollowButton userId={userId} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Posts Section */}
      <div className="bg-[#f0f2f5] min-h-screen py-8">
        <div className="max-w-full mx-auto flex flex-col gap-5 px-12">
          {posts.map((post) => {
            const { _id, body, image, createdAt, user, commentsCount, shares, likes } = post;

            return (
              <Card
                key={_id}
                className="shadow-sm border border-gray-200 rounded-lg bg-white overflow-hidden"
              >
                <CardHeader className="flex justify-between p-3">
                  <div className="flex items-center gap-3">
                    <Image
                      alt={user?.name}
                      src={user?.photo}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <p className="font-bold text-[15px] text-gray-900 leading-tight capitalize">
                        {user?.name}
                      </p>
                      <p className="text-[13px] text-gray-500">@{user?.username}</p>
                    </div>
                  </div>
                  <Link
                    to={`/PostDetails/${_id}`}
                    className="text-[#4f46e5] text-sm font-medium hover:underline"
                  >
                    View details
                  </Link>
                </CardHeader>

                <CardBody className="bg-white">
                  <p className="text-[15px] text-gray-800 mb-3">{body || "No text content"}</p>
                  {image && (
                    <div className="rounded-md overflow-hidden border border-gray-100 bg-[#0F1323]">
                      <img
                        src={image}
                        alt="post"
                        className="w-full max-w-[50%] mx-auto h-auto object-cover"
                      />
                    </div>
                  )}
                </CardBody>

                <Divider className="opacity-50" />

                <div className="flex justify-between items-center px-4 py-3 bg-white">
                  <div className="flex items-center gap-4 text-gray-500">
                    <div className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600 transition-colors">
                      <Like1 size="18" />
                      <span className="text-[13px]">{likes?.length || 0} likes</span>
                    </div>
                    <div className="flex items-center gap-1.5 cursor-pointer hover:text-green-600 transition-colors">
                      <Share size="18" />
                      <span className="text-[13px]">{shares?.length || 0} shares</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors">
                      <MessageMinus size="18" />
                      <span className="text-[13px]">{commentsCount || 0} comments</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Timer1 size="16" />
                    <span className="text-[12px]">{formatPostDate(createdAt)}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}

