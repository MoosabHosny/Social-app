import { Avatar, Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { useState } from "react";
import { Link } from "react-router";
import CommentsList from "../../Pages/CommentsList/CommentsList";

export default function CommentCard({ comment, PostId }) {
  const [showComments, setShowComments] = useState(false);

  const {
    commentCreator: { name, photo },
    content,
    image,
  } = comment;

  return (
    <>
      {/* Top Comment */}
      {!showComments && (
        <Card className="w-full bg-[#f0f2f5] border-none shadow-sm rounded-2xl p-2">
          <CardHeader className="pb-2 pt-2 px-4">
            <h4 className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">
              Top Comment
            </h4>
          </CardHeader>

          <CardBody className="flex flex-row gap-3 py-0 items-start">
            <Avatar
              radius="full"
              size="sm"
              src={photo}
              className="shrink-0 mt-1"
            />

            <div className="flex flex-col bg-white rounded-2xl overflow-hidden w-full shadow-sm border border-gray-100">
              <div className="px-4 py-2">
                <p className="text-[13px] font-bold text-black">{name}</p>
                <span className="text-[13px] text-slate-800">{content}</span>
              </div>

              {image && (
                <div className="px-2 pb-2">
                  <img
                    src={image}
                    alt="Comment Attachment"
                    className="w-full max-h-64 object-cover rounded-xl"
                  />
                </div>
              )}
            </div>
          </CardBody>
          {/* زر عرض كل الكومنتات */}
          <div className="mt-2 px-2">
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault();
                setShowComments(!showComments);
              }}
              className="text-blue-600 font-bold text-[13px] hover:underline"
            >
              {showComments ? "Hide comments" : "View all comments"}
            </Link>
          </div>
        </Card>
      )}

      {/* CommentsList */}
      {showComments && (
        <div className="w-full mt-3">
          <CommentsList PostId={PostId} />
        </div>
      )}
    </>
  );
}
