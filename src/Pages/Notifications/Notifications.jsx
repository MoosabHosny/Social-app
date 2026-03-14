import { useState } from "react";
import { Card, CardBody, Button, Avatar, Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../shared/AxiosInterceptos/AxiosInterceptos";
import { useNavigate } from "react-router";

export default function Notifications() {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("unread");

  const {
    data: notifications = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        "/notifications?unread=false&page=1&limit=10"
      );
      return response.data.data.notifications;
    },
  });

  // فلترة الإشعارات
  const filteredNotifications = notifications.filter(
    (n) => activeTab === "all" || (activeTab === "unread" && !n.isRead)
  );

  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        <Spinner size="lg" label="Loading notifications..." color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500">Error loading notifications</p>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Notifications
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Realtime updates for likes, comments, shares, and follows.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8">

          <Button
            onClick={() => setActiveTab("all")}
            size="sm"
            className={`rounded-full px-6 font-bold ${
              activeTab === "all"
                ? "bg-[#1d75ff] text-white"
                : "bg-white text-slate-600 border border-slate-100"
            }`}
          >
            All
          </Button>

          <Button
            onClick={() => setActiveTab("unread")}
            size="sm"
            className={`rounded-full px-6 font-bold flex gap-2 ${
              activeTab === "unread"
                ? "bg-[#1d75ff] text-white"
                : "bg-[#eff6ff] text-[#1d75ff]"
            }`}
          >
            Unread
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-white text-[#1d75ff]">
              {notifications.filter((n) => !n.isRead).length}
            </span>
          </Button>

        </div>

        {/* Notifications List */}
        <div className="space-y-4">

          {filteredNotifications.length > 0 ? (

            filteredNotifications.map((noti) => (

              <Card
                key={noti._id}
                className="shadow-sm border border-slate-100 rounded-2xl bg-[#f0f7ff]/40"
              >
                <CardBody className="p-5">

                  <div className="flex gap-4">

                    {/* صورة الشخص */}
                    <Avatar
                      className="w-12 h-12 cursor-pointer"
                      src={noti.actor?.photo}
                      name={noti.actor?.name}
                      onClick={() =>
                        navigate(`/profile/${noti.actor?._id}`)
                      }
                    />

                    <div className="flex-1">

                      <div className="flex justify-between items-start">

                        <div>

                          <p className="text-sm text-slate-800">

                            {/* اسم الشخص قابل للضغط */}
                            <span
                              className="font-bold cursor-pointer"
                              onClick={() =>
                                navigate(`/profile/${noti.actor?._id}`)
                              }
                            >
                              {noti.actor?.name}
                            </span>{" "}

                            {noti.content}

                          </p>

                        </div>

                        <div className="flex items-center gap-3">

                          <span className="text-xs text-slate-400">
                            {new Date(noti.createdAt).toLocaleDateString()}
                          </span>

                          {!noti.isRead && (
                            <div className="w-2 h-2 bg-[#1d75ff] rounded-full"></div>
                          )}

                        </div>

                      </div>

                    </div>

                  </div>

                </CardBody>
              </Card>

            ))

          ) : (

            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-400 text-sm italic">
                {activeTab === "unread"
                  ? "No unread notifications yet."
                  : "Your notification history is empty."}
              </p>
            </div>

          )}

        </div>

      </div>
    </div>
  );
}