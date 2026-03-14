import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../shared/AxiosInterceptos/AxiosInterceptos";
import { Trash } from "iconsax-reactjs";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

export default function DeletePost({ postId, isOpen, onClose }) {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: async () => axiosInstance.delete(`/posts/${postId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      onClose();
    },
  });

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} backdrop="blur" placement="center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-black">Confirm Action</ModalHeader>
            <ModalBody>
              <div className="flex items-start gap-4 p-2">
                <div className="bg-danger-50 p-3 rounded-full">
                  <Trash size="24" className="text-danger" variant="Bold" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-black">Delete this post?</h4>
                  <p className="text-gray-500 text-sm">
                    This post will be permanently removed from your profile and feed.
                  </p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>Cancel</Button>
              <Button color="danger" isLoading={isLoading} onPress={() => mutate()}>
                Delete post
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}