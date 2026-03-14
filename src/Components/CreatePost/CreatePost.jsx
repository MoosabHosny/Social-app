import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Form,
  Image,
  Textarea,
} from "@heroui/react";
import { useContext, useRef, useState } from "react";
import { tokenContext } from "../../Context/AuthContextprovider/AuthContextprovider";
import { ArrowDown2, EmojiHappy, Gallery, Send2 } from "iconsax-reactjs";
import { useForm } from "react-hook-form";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";

export default function CreatePost() {
  const { userData } = useContext(tokenContext);

  const { handleSubmit, register, reset } = useForm({
    defaultValues: {
      body: "",
    },
  });

  const imageUseRef = useRef();

  const [postImage, setPostImage] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [feeling, setFeeling] = useState("");

  function handleImage(e) {
    const file = e.target.files[0];
    if (file) {
      setPostImage(file);
    }
  }

  async function sendPost(data) {
    const formData = new FormData();

    formData.append("body", data.body||" ");

    if (postImage) {
      formData.append("image", postImage);
    }

    if (feeling) {
      formData.append("feeling", feeling);
    }

    try {
      const response = await axios.post(
        "https://route-posts.routemisr.com/posts",
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      );

      console.log("Success:", response);
      reset();
      setPostImage(null);
      setFeeling("");
    } catch (error) {
      console.error("Error details:", error.response?.data);
    }
  }

  return (
    <Card>
      <CardHeader className="flex gap-3">
        <Image
          alt="user"
          height={50}
          width={50}
          src={userData.photo}
          className="rounded-full"
        />

        <div className="flex flex-col">
          <p className="text-black font-bold">{userData.name}</p>

          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered">
                Public <ArrowDown2 size={16} />
              </Button>
            </DropdownTrigger>

            <DropdownMenu aria-label="Privacy">
              <DropdownItem key="public">Public</DropdownItem>
              <DropdownItem key="followers">Followers</DropdownItem>
              <DropdownItem key="onlyme">Only me</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </CardHeader>

      <Divider />

      <CardBody>
        <Form onSubmit={handleSubmit(sendPost)} className="flex flex-col gap-3">
          <Textarea
            placeholder={`What's on your mind, ${
              userData?.name?.split(" ")[0] || "there"
            }?`}
            {...register("body")}
            classNames={{
              base: "w-full",
              input: "min-h-[120px] text-lg",
              inputWrapper: "rounded-2xl border-2 border-blue-400 bg-gray-100",
            }}
          />

          {postImage && (
            <img
              src={URL.createObjectURL(postImage)}
              alt="preview"
              className="rounded-xl mt-2"
            />
          )}

          <div className="flex justify-between px-3 mt-2 w-full">
            <div className="flex gap-x-4 items-center">
              <span
                onClick={() => imageUseRef.current.click()}
                className="flex items-center gap-x-1 cursor-pointer"
              >
                <Gallery size="32" color="#37d67a" />
                Photo/video
              </span>

              <div className="relative">
                <span
                  onClick={() => setShowEmoji(!showEmoji)}
                  className="flex items-center gap-x-1 cursor-pointer"
                >
                  <EmojiHappy size="32" color="#dce775" />
                  Feeling/activity {feeling}
                </span>

                {showEmoji && (
                  <div className=" Emoji top-[60%] bottom-24 left-1/2  -translate-x-1/2">
                    <EmojiPicker
                      onEmojiClick={(emojiData) => {
                        setFeeling(emojiData.emoji);
                        setShowEmoji(false);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <Button color="primary" type="submit">
              Post
              <Send2 size="20" />
            </Button>
          </div>
        </Form>
      </CardBody>

      <Divider />

      <input
        type="file"
        className="hidden"
        ref={imageUseRef}
        onChange={handleImage}
      />
    </Card>
  );
}
