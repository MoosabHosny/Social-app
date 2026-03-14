import { useState } from "react";
import { useParams } from "react-router";
import { Avatar, Image } from "@heroui/react";
import Loading from "../Loading/Loading";
import { axiosInstance } from "../../shared/AxiosInterceptos/AxiosInterceptos";
import CreateComment from "../../Components/CreateComment/CreateComment";
import RepliesList from "../../Components/RepliesList/RepliesList";
import { useQuery } from "@tanstack/react-query";

// دالة الوقت النسبي
function timeAgo(dateString) {
  const now = new Date();
  const created = new Date(dateString);
  const diff = Math.floor((now - created) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function CommentsList({ PostId }) {

  const { id: paramId } = useParams();

  // لو الكومبوننت جاي من البوست يستخدم PostId
  // لو جاي من صفحة يستخدم paramId
  const id = PostId || paramId;

  const [showReplies, setShowReplies] = useState({});

  const toggleReplies = (commentId) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/posts/${id}/comments`);
      return response.data.data.comments || [];
    },
    enabled: !!id,
  });

  const comments = data || [];

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <div className="flex justify-center mt-10">
        <p className="text-red-500">
          Error: {error?.message || "Failed to load comments"}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full my-5 px-4">

      {/* قائمة الكومنتات */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-4">

        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Comments
        </h2>

        <div className="flex flex-col gap-8">

          {comments.length === 0 ? (
            <p className="text-center text-gray-400 italic py-4">
              No comments yet.
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="flex flex-col gap-2">

                {/* الكومنت */}
                <div className="flex gap-3 items-start">

                  <Avatar
                    src={comment.commentCreator?.photo}
                    name={comment.commentCreator?.name}
                    size="md"
                    className="mt-1"
                  />

                  <div className="flex flex-col w-full">

                    <div className="bg-[#f0f2f5] px-4 py-2 rounded-[20px] inline-block max-w-full shadow-sm">

                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[14px] text-black">
                          {comment.commentCreator?.name}
                        </span>
                      </div>

                      <div className="text-[12px] text-gray-500 mb-1">
                        <span>
                          @
                          {comment.commentCreator?.name
                            ?.replace(/\s+/g, "")
                            .toLowerCase()}
                        </span>

                        <span className="mx-1">·</span>

                        <span>
                          {timeAgo(comment.createdAt)}
                        </span>
                      </div>

                      <p className="text-[15px] text-gray-800 leading-snug mb-2">
                        {comment.content}
                      </p>

                      {comment.image && (
                        <div className="mt-2">
                          <Image
                            src={comment.image}
                            alt="Comment image"
                            className="rounded-xl max-h-80 object-cover"
                          />
                        </div>
                      )}

                    </div>

                    {/* أزرار الكومنت */}
                    <div className="flex gap-4 ml-2 mt-1 text-[12px] font-bold text-gray-500">

                      <span>
                        {timeAgo(comment.createdAt)}
                      </span>

                      <button className="hover:underline">
                        Like (0)
                      </button>

                      <button
                        className="hover:underline"
                        onClick={() => toggleReplies(comment._id)}
                      >
                        Reply
                      </button>

                    </div>

                  </div>
                </div>

                {/* الردود */}
                {showReplies[comment._id] && (
                  <div className="ml-12 mt-2">
                    <RepliesList commentId={comment._id} />
                  </div>
                )}

              </div>
            ))
          )}

        </div>
      </div>

      {/* إضافة كومنت */}
      <div className="sticky bottom-4 z-10">
        <CreateComment id={id} refetchComments={refetch} />
      </div>

    </div>
  );
}