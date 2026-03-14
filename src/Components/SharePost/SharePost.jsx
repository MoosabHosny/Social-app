import { Button } from "@heroui/react";
import { Share } from "iconsax-reactjs";
// import { axiosInstance } from "../../shared/AxiosInterceptos/AxiosInterceptos";
import { useState } from "react";
import { axiosInstance } from "../../shared/AxiosInterceptos/AxiosInterceptos";

export default function SharePost({ postId }) {
  const [loading, setLoading] = useState(false);

  async function handleShare() {
    try {
      setLoading(true);

      const res = await axiosInstance.post(`/posts/${postId}/share`);

      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      isIconOnly
      variant="light"
      isLoading={loading}
      onClick={handleShare}
    >
      <Share size="20" />
    </Button>
  );
}