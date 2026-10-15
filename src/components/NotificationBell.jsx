
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FiBell,
  FiTrash2,
  FiCheckCircle,
  FiFileText,
  FiClock,
  FiBookOpen,
  FiUserCheck,
  FiDollarSign,
  FiCheck,
} from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

export default function NotificationBell({ user }) {
  const router = useRouter();

  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef(null);
  const fetchNotifications = async () => {
    if (!user?.email || !user?.role) return;

    try {
      setLoading(true);

      const params = new URLSearchParams({
        email: user.email,
        role: user.role,
        studentClass: user.studentClass || "",
      });
      const { data: tokenData } = await authClient.token();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/notifications?${params.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${tokenData?.token}`
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await res.json();

      console.log("Notification data:", data);

      const list =
        data?.notifications ||
        (Array.isArray(data) ? data : []);

      // Newest → Oldest
      list.sort(
        (a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
      );

      setNotifications(list);
    } catch (err) {
      console.error("Notification fetch error:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!user?.email || !user?.role) return;

    fetchNotifications();

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [user?.email, user?.role, user?.studentClass]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;
  const handleNotificationClick = async (notification) => {
    // Mark as read
    if (!notification.isRead) {
      // Optimistic UI update
      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notification._id
            ? { ...item, isRead: true }
            : item
        )
      );

      try {
        const { data: tokenData } = await authClient.token();
        await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/notifications/${notification._id}/read`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${tokenData?.token}`
            },
          }
        );
      } catch (err) {
        console.error(
          "Error marking notification as read:",
          err
        );
      }
    }

    setIsOpen(false);
    // Navigate
    if (notification.link) {
      router.push(notification.link);
    }
  };
  const handleDelete = async (e, id) => {
    e.stopPropagation();

    // Optimistic UI update
    setNotifications((prev) =>
      prev.filter((notification) => notification._id !== id)
    );

    try {
      const { data: tokenData } = await authClient.token();
      await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/notifications/${id}`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${tokenData?.token}`
          }
        }
      );
    } catch (err) {
      console.error(
        "Error deleting notification:",
        err
      );
    }
  };
  const handleMarkAllRead = async () => {
    const unreadList = notifications.filter(
      (notification) => !notification.isRead
    );

    if (unreadList.length === 0) return;

    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );

    try {
      const { data: tokenData } = await authClient.token();
      await Promise.all(
        unreadList.map((notification) =>
          fetch(
            `${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/notifications/${notification._id}/read`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${tokenData?.token}`
              },
            }
          )
        )
      );
    } catch (err) {
      console.error(
        "Error marking all notifications as read:",
        err
      );
    }
  };
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();

    const seconds = Math.floor(
      (now - date) / 1000
    );

    if (seconds < 60) {
      return "Just now";
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);

    if (days === 1) {
      return "Yesterday";
    }

    return date.toLocaleDateString();
  };
  const getIcon = (type) => {
    switch (type) {
      case "routine":
        return <FiClock className="text-blue-400" />;

      case "assignment":
        return <FiBookOpen className="text-purple-400" />;

      case "mark":
        return <FiCheckCircle className="text-green-400" />;

      case "attendance":
        return <FiUserCheck className="text-yellow-400" />;

      case "fee":
      case "payment":
        return <FiDollarSign className="text-emerald-400" />;

      default:
        return <FiFileText className="text-gray-400" />;
    }
  };
  return (
    <div
      className="relative"
      ref={dropdownRef}
    >
      {/* Navbar Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-300 hover:text-white rounded-xl hover:bg-gray-800/60 transition focus:outline-none"
        aria-label="Notifications"
      >
        <FiBell className="text-xl sm:text-2xl" />

        {/* Unread Count */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse border border-gray-900">
            {unreadCount > 9
              ? "9+"
              : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#111827] border border-gray-800 rounded-2xl shadow-2xl p-4 z-50 text-gray-100">

          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <FiBell className="text-blue-500 text-base" />

              <h3 className="font-bold text-sm text-white">
                Notifications
              </h3>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
              >
                <FiCheck className="text-xs" />

                Mark all as read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="mt-3 space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-800">

            {/* Loading */}
            {loading && notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400 space-y-2">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

                <p>Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              
              /* Empty */
              <div className="py-8 text-center space-y-2">
                <FiBell className="text-3xl text-gray-600 mx-auto" />

                <p className="text-xs text-gray-400 font-medium">
                  No notifications yet
                </p>
              </div>
            ) : (

              /* Notifications */
              notifications.map((item) => (
                <div
                  key={item._id}
                  onClick={() =>
                    handleNotificationClick(item)
                  }
                  className={`group relative p-3 rounded-xl text-xs cursor-pointer transition-all duration-150 flex items-start gap-3 border ${
                    !item.isRead
                      ? "bg-blue-500/10 text-white border-blue-500/30 hover:bg-blue-500/20"
                      : "bg-gray-800/30 border-gray-800/60 text-gray-400 hover:bg-gray-800/60"
                  }`}
                >

                  {/* Unread Dot */}
                  {!item.isRead && (
                    <span className="absolute top-3 left-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}

                  {/* Icon */}
                  <div
                    className={`p-2 rounded-lg bg-gray-800/80 border border-gray-700/50 mt-0.5 ${
                      !item.isRead ? "ml-2" : ""
                    }`}
                  >
                    {getIcon(item.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pr-6">
                    <p
                      className={`font-semibold ${
                        !item.isRead
                          ? "text-blue-400"
                          : "text-gray-300"
                      }`}
                    >
                      {item.title}
                    </p>

                    <p className="text-gray-400 mt-1 leading-relaxed text-[11px]">
                      {item.message}
                    </p>

                    <span className="text-[10px] text-gray-500 mt-1.5 block">
                      {formatTimeAgo(item.createdAt)}
                    </span>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={(e) =>
                      handleDelete(e, item._id)
                    }
                    title="Delete Notification"
                    className="absolute top-3 right-2.5 p-1 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
