import { Avatar, Button, Textarea } from "@heroui/react";
import { useContext, useRef, useState } from "react";
import { tokenContext } from "../../Context/AuthContextprovider/AuthContextprovider";
import { Gallery, EmojiHappy, Send2 } from "iconsax-reactjs";
import { useForm } from "react-hook-form";
import { axiosInstance } from "../../shared/AxiosInterceptos/AxiosInterceptos";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EmojiPicker from "emoji-picker-react";

export default function CreateComment({ id }) {
  const { userData } = useContext(tokenContext);
  const queryClient = useQueryClient();

  const { handleSubmit, register, reset, setValue, watch } = useForm({
    defaultValues: { content: "" },
  });

  const content = watch("content");

  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);

  const { mutate, isPending } = useMutation({
mutationFn: (data) => {
  const formData = new FormData();

  if (data.content) {
    formData.append("content", data.content);
  }

  if (image) {
    formData.append("image", image);
  }

  return axiosInstance.post(`/posts/${id}/comments`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
},
    onSuccess: () => {
      reset();
      setImage(null);
      queryClient.invalidateQueries(["comments", id]);
    },

    onError: (error) => {
      console.log(error.response?.data);
    },
  });

  function onEmojiClick(emojiData) {
    setValue("content", (content || "") + emojiData.emoji, {
      shouldDirty: true,
    });
  }

  return (
    <div className="max-w-2xl mx-auto w-full py-4">
      <form
        onSubmit={handleSubmit((data) => mutate(data))}
        className="flex gap-3 items-start"
      >
        <Avatar
          src={userData?.photo}
          name={userData?.name}
          size="sm"
          className="mt-1"
        />

        <div className="flex-1 bg-[#f0f2f5] rounded-[20px] border border-gray-200 px-4 py-2 relative group">

          <Textarea
            variant="flat"
            value={content}
            {...register("content")}
            placeholder={`Comment as ${
              userData?.name?.split(" ")[0] || "user"
            }...`}
            minRows={1}
            maxRows={4}
            classNames={{
              base: "w-full",
              input: "text-[15px] text-gray-800 bg-transparent py-2 px-0",
              inputWrapper:
                "bg-transparent shadow-none border-none p-0 min-h-unit-10",
            }}
          />

          {/* preview image */}
          {image && (
            <div className="mt-2 relative w-fit">
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                className="w-32 rounded-lg border"
              />

              <button
                type="button"
                onClick={() => setImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2"
              >
                ×
              </button>
            </div>
          )}

          <div className="flex justify-between items-center mt-2 pb-1">
            <div className="flex gap-3 text-gray-500">

              {/* upload image */}
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="hover:text-blue-500 transition-colors"
              >
                <Gallery size="20" variant="Outline" />
              </button>

              <input
                type="file"
                hidden
                ref={fileInputRef}
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />

              {/* emoji button */}
              <button
                type="button"
                onClick={() => setShowEmoji(!showEmoji)}
                className="hover:text-yellow-500 transition-colors"
              >
                <EmojiHappy size="20" variant="Outline" />
              </button>

            </div>

            <Button
              isIconOnly
              type="submit"
              isLoading={isPending}
              className={`min-w-8 w-9 h-9 rounded-full shadow-md transition-all ${
                isPending
                  ? "bg-[#1b74e4]"
                  : "bg-[#1b74e4] text-white"
              }`}
            >
              {!isPending && (
                <Send2 size="18" variant="Bold" className="ml-0.5" />
              )}
            </Button>
          </div>

          {/* emoji picker */}
          {showEmoji && (
            <div className="absolute bottom-16 left-0 z-50">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>
      </form>
    </div>
  );
}