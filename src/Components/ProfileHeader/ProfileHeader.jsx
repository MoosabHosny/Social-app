import { Image, Card, Chip } from "@heroui/react";
import { Sms, UserTick, People } from "iconsax-reactjs";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../shared/AxiosInterceptos/AxiosInterceptos";
import Loading from "../../Pages/Loading/Loading";

export default function ProfileHeader() {

  const { data, isLoading, isError } = useQuery({
    queryKey: ["profileData"],
    queryFn: async () => {

      const profileRes = await axiosInstance.get(`/users/profile-data`);
      const user = profileRes.data.data.user;

      const postsRes = await axiosInstance.get(`/users/${user._id}/posts`);

      return {
        ...profileRes.data.data,
        posts: postsRes.data.data.posts
      };
    },
  });

  if (isLoading) return <Loading />;
  if (isError) return <p>Error loading profile</p>;

  const user = data?.user;

  return (
    <div className="w-full max-w-7xl mx-auto mb-6">

      <div className="h-64 w-full rounded-t-[2.5rem] bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155]" />

      <Card className="shadow-xl border-none -mt-22 bg-white rounded-[2.5rem]">

        <div className="flex flex-col md:flex-row gap-8 items-start justify-between">

          {/* Avatar + Info */}
          <div className="flex items-start gap-6 flex-1">
            <div className="relative">
              <div className="p-1 bg-white rounded-full">
                <Image
                  src={user?.photo}
                  width={100}
                  height={100}
                  className="rounded-full shadow-lg object-cover"
                />
              </div>
            </div>

            <div className="pt-2">
              <h2 className="text-4xl font-extrabold text-[#1e293b]">
                {user?.name}
              </h2>

              <p className="text-slate-400 text-xl mb-3">
                @{user?.username}
              </p>

              <Chip
                variant="flat"
                className="bg-blue-50 text-blue-600 border-none px-4 py-1"
                startContent={<UserTick size="20" variant="Bold" />}
              >
                Route Posts member
              </Chip>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 w-full md:w-auto mt-8 me-18">

            <div className="border rounded-2xl px-10 py-4 text-center">
              <p className="text-slate-400 text-[10px] font-bold">FOLLOWERS</p>
              <p className="text-2xl font-bold">
                {data?.followers?.length || 0}
              </p>
            </div>

            <div className="border rounded-2xl px-10 py-4 text-center">
              <p className="text-slate-400 text-[10px] font-bold">FOLLOWING</p>
              <p className="text-2xl font-bold">
                {data?.following?.length || 0}
              </p>
            </div>

            <div className="border rounded-2xl px-10 py-4 text-center">
              <p className="text-slate-400 text-[10px] font-bold">BOOKMARKS</p>
              <p className="text-2xl font-bold">
                {data?.bookmarks?.length || 0}
              </p>
            </div>

          </div>
        </div>

        {/* Bottom */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">

          {/* About */}
          <div className="md:col-span-2 border border-slate-100 p-8 ms-9">
            <h3 className="text-slate-800 font-bold mb-6 text-xl">About</h3>

            <div className="space-y-5">
              <div className="flex items-center gap-4 text-slate-600">
                <Sms size="24" className="text-blue-400"/>
                <span>{user?.email}</span>
              </div>

              <div className="flex items-center gap-4 text-slate-600">
                <People size="24" className="text-blue-400"/>
                <span>Active on Route Posts</span>
              </div>
            </div>
          </div>

          {/* small stats */}
          <div className="flex flex-col gap-4 me-16 mb-6">

            <Card className="bg-slate-50 border rounded-3xl p-6 shadow-none">
              <p className="text-blue-600 text-[10px] font-bold uppercase">
                My Posts
              </p>
              <p className="text-3xl font-bold">
                {data?.posts?.length || 0}
              </p>
            </Card>

            <Card className="bg-slate-50 border rounded-3xl p-6 shadow-none">
              <p className="text-blue-600 text-[10px] font-bold uppercase">
                Saved Posts
              </p>
              <p className="text-3xl font-bold">
                {data?.savedPosts?.length || 0}
              </p>
            </Card>

          </div>

        </div>

      </Card>
    </div>
  );
}

