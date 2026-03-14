import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../shared/AxiosInterceptos/AxiosInterceptos";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, User } from "@heroui/react";
import { Share } from "iconsax-reactjs";

export default function ShareButton({ userPost }) {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const shareMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/posts/${userPost._id}/share`, { 
        body: comment 
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onOpenChange(false); 
      setComment("");
    },
    onError: (err) => {
      console.log("Full Error details:", err.response?.data);
      alert(err.response?.data?.message || "Please write something before sharing");
    },
  });

  return (
    <>
      <button
        onClick={onOpen}
        className="flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-lg w-full text-gray-600 font-medium"
      >
        <Share size="22" />
        Share
      </button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Share post</ModalHeader>
              <ModalBody className="py-6">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="You must say something about this..." 
                  className={`w-full min-h-[120px] p-3 text-lg border-2 rounded-xl focus:border-blue-500 outline-none resize-none transition-all ${!comment.trim() ? 'border-red-100' : 'border-blue-100'}`}
                />
                {!comment.trim() && <p className="text-red-500 text-xs mt-1">Comment is required by the server</p>}

                <div className="border border-gray-200 rounded-xl p-4 mt-2 bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <User
                      name={userPost.user?.name}
                      avatarProps={{ src: userPost.user?.photo, size: "sm" }}
                    />
                  </div>
                  <p className="text-gray-700 mb-3 text-sm">{userPost.body}</p>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button variant="flat" color="danger" onPress={onClose}>
                  Cancel
                </Button>
                <Button 
                  color="primary" 
                  className="bg-blue-600 font-bold px-8"
                  isLoading={shareMutation.isPending}
                  
                  isDisabled={!comment.trim()} 
                  onPress={() => shareMutation.mutate()}
                >
                  Share now
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}