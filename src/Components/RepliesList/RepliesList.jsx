import { Avatar, Image } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../shared/AxiosInterceptos/AxiosInterceptos";

function timeAgo(dateString) {
  const now = new Date();
  const created = new Date(dateString);
  const diff = Math.floor((now - created) / 1000); 
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function RepliesList({ commentId }) {
    const { data, isLoading, isError, error } = useQuery({
  queryKey: ["replies", commentId],
  queryFn: async () => {
    const response = await axiosInstance.get(
      `/posts/comments/replies?commentId=${commentId}&page=1&limit=10`
    );
    
    console.log("API Response:", response.data);
    
    return response.data.replies || []; 
  },
  enabled: !!commentId, 
});
    
  if (isLoading) return <p className="text-gray-400 text-sm ml-12">Loading replies...</p>;

  if (isError) {
    return (
      <p className="text-red-500 text-sm ml-12">
        Error loading replies: {error?.message || "Failed to load"}
      </p>
    );
  }

  if (data.length === 0) return null; 

  return (
    <div className="flex flex-col gap-4 ml-12 mt-2">
      {data.map((reply) => (
        <div key={reply._id} className="flex gap-3 items-start">
          <Avatar
            src={reply.commentCreator?.photo}
            name={reply.commentCreator?.name}
            size="sm"
            className="mt-1"
          />

          <div className="flex flex-col w-full">
            <div className="bg-[#f0f2f5] px-3 py-2 rounded-[20px] max-w-full inline-block shadow-sm">
              <div className="flex items-center gap-1">
                <span className="font-bold text-[13px] text-black">
                  {reply.commentCreator?.name}
                </span>
              </div>

              <div className="text-[11px] text-gray-500 mb-1">
                <span>
                  @{reply.commentCreator?.name?.replace(/\s+/g, "").toLowerCase()}
                </span>
                <span className="mx-1">·</span>
                <span>{timeAgo(reply.createdAt)}</span>
              </div>

              <p className="text-[14px] text-gray-800 leading-snug mb-1">
                {reply.content}
              </p>

              {reply.image && (
                <Image
                  src={reply.image}
                  alt="Reply image"
                  className="rounded-xl max-h-60 object-cover mt-1"
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}