// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import toast from "react-hot-toast";
// import { axiosInstance } from "../../shared/AxiosInterceptos/AxiosInterceptos";

// export default function FollowButton({ userId }) {
//   const queryClient = useQueryClient();

//   const followMutation = useMutation({
//     mutationFn: async () => {
//           const { data } = await axiosInstance.put(`/users/${userId}/follow`);
//           console.log("data",data)
//       return data;
//     },

//     onSuccess: () => {
//       toast.success("Follow sent successfully");

//       // تحديث الكاش لو عندك بيانات مستخدمين
//       queryClient.invalidateQueries(["users"]);
//     },

//     onError: (error) => {
//       console.log(error);
//       toast.error("Something went wrong");
//     },
//   });

//   return (
//     <button
//       onClick={() => followMutation.mutate()}
//       disabled={followMutation.isPending}
//       className={`px-4 py-2 rounded-lg font-medium transition-all
//       bg-blue-600 text-white hover:bg-blue-700
//       ${followMutation.isPending ? "opacity-50 cursor-not-allowed" : ""}`}
//     >
//       {followMutation.isPending ? "Loading..." : "Follow"}
//     </button>
//   );
// }
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "../../shared/AxiosInterceptos/AxiosInterceptos";

export default function FollowButton({ userId, isFollowing }) {
  const queryClient = useQueryClient();

  // state محلي لتغيير الزرار فوراً
  const [following, setFollowing] = useState(isFollowing);

  const followMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.put(`/users/${userId}/follow`);
      return data;
    },

    onSuccess: () => {
      const newState = !following;
      setFollowing(newState);

      const message = newState
        ? "Followed successfully"
        : "Unfollowed successfully";

      toast.success(message);

      queryClient.invalidateQueries(["users"]);
      queryClient.invalidateQueries(["user", userId]);
    },

    onError: (error) => {
      console.error(error);
      toast.error("Something went wrong");
    },
  });

  const buttonStyles = following
    ? "bg-gray-400 text-white hover:bg-gray-500"
    : "bg-blue-600 text-white hover:bg-blue-700";

  return (
    <button
      onClick={() => followMutation.mutate()}
      disabled={followMutation.isPending}
      className={`px-4 py-2 rounded-lg font-medium transition-all ${buttonStyles}
      ${followMutation.isPending ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {followMutation.isPending ? (
        "Loading..."
      ) : following ? (
        "Following"
      ) : (
        "Follow"
      )}
    </button>
  );
}