import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../shared/AxiosInterceptos/AxiosInterceptos";
import {
  ArchiveMinus,
  Edit,
  Like1,
  MessageMinus,
  More,
  Trash,
} from "iconsax-reactjs";
import { Link } from "react-router";
import CommentCard from "../CommentCard/CommentCard";
import CommentsList from "../../Pages/CommentsList/CommentsList";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Image,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import ShareButton from "../ShareButton/ShareButton";
import DeletePost from "../DeletePost/DeletePost";
import toast from "react-hot-toast";

export default function PostCard({ userPost }) {
  const queryClient = useQueryClient();

  const [showAllComments, setShowAllComments] = useState(false);
  const [likesCount, setLikesCount] = useState(userPost.likesCount);
  const [liked, setLiked] = useState(userPost.isLiked);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [myId, setMyId] = useState(null);

  async function getMyId() {
    try {
      const profileRes = await axiosInstance.get(`/users/profile-data`);
      const user = profileRes.data.data.user;
      setMyId(user._id);
    } catch (error) {
      console.error("Error fetching profile data", error);
    }
  }

  useEffect(() => {
    getMyId();
  }, []);

  const isMyPost = userPost.user?._id === myId;

  // -------------------- Like Mutation --------------------
  const likeMutation = useMutation({
    mutationFn: async () => axiosInstance.put(`/posts/${userPost._id}/like`),
    onSuccess: () => {
      const newLiked = !liked;
      setLiked(newLiked);
      setLikesCount((prev) => (newLiked ? prev + 1 : prev - 1));
      queryClient.invalidateQueries(["posts"]);
    },
  });

  // -------------------- Save Post Mutation --------------------
  const saveMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.put(
        `/posts/${userPost._id}/bookmark`,
      );
      return data;
    },
    onSuccess: () => {
      toast.success(userPost.bookmarked ? "Post unsaved" : "Post saved");
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["savedPosts"]);
    },
    onError: (error) => {
      console.error("Save post error:", error);
      toast.error("Something went wrong while saving post");
    },
  });

  function handleSavePost() {
    saveMutation.mutate();
  }

  // -------------------- Time Ago --------------------
  function timeAgo(dateString) {
    const now = new Date();
    const createdDate = new Date(dateString);
    const diff = Math.floor((now - createdDate) / 1000);

    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  }

  const {
    createdAt,
    image,
    body,
    content,
    user,
    topComment,
    commentsCount,
    sharesCount,
    _id,
    sharedPost,
  } = userPost;

  return (
    <>
      <Card className="mx-auto shadow-md rounded-xl mb-6 border border-gray-100">
        <CardHeader className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <Image
                alt={user?.name}
                src={user?.photo}
                width={45}
                height={45}
                className="rounded-full object-cover"
              />

              <div className="flex flex-col text-left">
                <p className="font-semibold capitalize">{user?.name}</p>
                <p className="text-sm text-gray-500">
                  @{user?.name?.split(" ")[0]} • {timeAgo(createdAt)}
                </p>
              </div>
            </div>

            {userPost.bookmarked && (
              <span
                className="inline-flex items-center gap-1 w-18  p-1 text-xs font-semibold text-white bg-blue-500 rounded-full">
                <ArchiveMinus size="15" />
                Saved
              </span>
            )}
          </div>

          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button isIconOnly variant="light" radius="full" size="sm">
                <More size="20" className="text-gray-500" />
              </Button>
            </DropdownTrigger>

            <DropdownMenu aria-label="Post actions">
              <DropdownItem
                key="save"
                startContent={<ArchiveMinus size="20" />}
                onPress={handleSavePost}
                className={
                  saveMutation.isPending ? "opacity-50 pointer-events-none" : ""
                }
              >
                {userPost.bookmarked ? "Unsave Post" : "Save Post"}
              </DropdownItem>

              {isMyPost && (
                <>
                  <DropdownItem key="edit" startContent={<Edit size="20" />}>
                    Edit Post
                  </DropdownItem>

                  <DropdownItem
                    key="delete"
                    color="danger"
                    startContent={<Trash size="20" />}
                    onPress={() => setDeleteOpen(true)}
                  >
                    Delete Post
                  </DropdownItem>
                </>
              )}
            </DropdownMenu>
          </Dropdown>
        </CardHeader>
        {/* Divider */}
        <div className="border-t border-gray-200 my-2"></div>

        <CardBody className="gap-3">
          <p className="text-gray-700">{content || body}</p>

          {sharedPost ? (
            <div className="border rounded-xl p-4 bg-gray-50 border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={sharedPost.user?.photo}
                  className="w-6 h-6 rounded-full"
                />
                <span className="font-bold text-xs">
                  {sharedPost.user?.name}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-2">{sharedPost.body}</p>

              {sharedPost.image && (
                <img
                  src={sharedPost.image}
                  className="w-full rounded-lg max-h-60 object-cover"
                />
              )}
            </div>
          ) : (
            image && (
              <img
                src={image}
                alt="post"
                className="w-full rounded-lg object-cover"
              />
            )
          )}

          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span className="flex gap-2 items-center">
              <Like1
                size="18"
                color="white"
                variant="Bold"
                className="bg-blue-500 rounded-full p-0.5"
              />
              {likesCount} Likes
            </span>

            <div className="flex gap-3">
              <span>{sharesCount} shares</span>
              <span>{commentsCount} Comments</span>

              <Link
                to={`/PostDetails/${_id}`}
                className="text-blue-600 font-semibold hover:underline"
              >
                View details
              </Link>
            </div>
          </div>
        </CardBody>

        {/* Divider */}
        <div className="border-t border-gray-200 my-2"></div>

        <CardFooter className="grid grid-cols-3 text-center p-1">
          <button
            onClick={() => likeMutation.mutate()}
            className={`flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-lg ${
              liked ? "text-blue-600 font-semibold" : ""
            }`}
          >
            <Like1 size="22" variant={liked ? "Bold" : "Linear"} />
            Like
          </button>

          <button
            onClick={() => setShowAllComments(!showAllComments)}
            className="flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-lg"
          >
            <MessageMinus size="22" />
            Comment
          </button>

          <ShareButton userPost={userPost} />
        </CardFooter>

        <div className="px-4 pb-2">
          {topComment && !showAllComments && (
            <CommentCard comment={topComment} PostId={_id} />
          )}

          {showAllComments && <CommentsList PostId={_id} />}
        </div>
      </Card>

      {/* Delete modal */}
      <DeletePost
        postId={_id}
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
      />
    </>
  );
}
