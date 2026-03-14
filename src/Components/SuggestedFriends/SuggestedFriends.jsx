import { useQuery } from "@tanstack/react-query";
import { Input, Card, Avatar } from "@heroui/react";
import { SearchNormal1 } from "iconsax-reactjs";
import { useState, useEffect } from "react";
import { axiosInstance } from "../../shared/AxiosInterceptos/AxiosInterceptos";
import FollowButton from "../FollowButton/FollowButton";

export default function SuggestedFriends() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: friends, isLoading, error } = useQuery({
    queryKey: ["suggestedFriends", debouncedSearch],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/users/suggestions?limit=10&search=${debouncedSearch}`
      );

      return response.data.data.suggestions;
    },
  });

  return (
    <Card className="p-5 border-none shadow-sm sticky top-24 bg-white rounded-2xl w-full max-w-sm">
      <h3 className="font-bold text-gray-800 mb-4">Suggested Friends</h3>

      <Input
        placeholder="Search friends..."
        size="sm"
        variant="bordered"
        startContent={<SearchNormal1 size="16" className="text-gray-400" />}
        className="mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="flex flex-col gap-4">
        {isLoading && (
          <p className="text-gray-500 text-sm italic">
            Loading suggestions...
          </p>
        )}

        {error && (
          <p className="text-red-500 text-sm">
            Failed to load suggestions
          </p>
        )}

        {!isLoading && friends?.length === 0 && (
          <p className="text-gray-500 text-sm">No friends found.</p>
        )}

        {friends?.map((friend) => (
          <div
            key={friend.id}
            className="flex items-center justify-between bg-gray-50 p-2 rounded-xl hover:bg-gray-100 transition"
          >
            <div className="flex items-center gap-3">
              <Avatar src={friend.photo} size="sm" />

              <div className="flex flex-col">
                <span className="text-sm font-semibold">
                  {friend.name}
                </span>

                <span className="text-[10px] text-gray-500">
                  @{friend.username}
                </span>
              </div>
            </div>
            <FollowButton userId={friend._id} />
          </div>
        ))}
      </div>
    </Card>
  );
}