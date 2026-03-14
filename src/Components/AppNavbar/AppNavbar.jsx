import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import { Home2, User, Notification, Setting2, Logout, MessageMinus } from "iconsax-reactjs"; // تأكد من استيراد الأيقونات الصحيحة
import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { tokenContext } from "../../Context/AuthContextprovider/AuthContextprovider";
import logoImg from "/public/image/RoutePosts.png";

export default function AppNavbar() {
  const { userData, getUserData } = useContext(tokenContext);
  const router = useNavigate();

  function handleLogout() {
    localStorage.clear();
    getUserData();
    router("/Login");
  }

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-6 py-2 rounded-full transition-all text-sm font-semibold ${
      isActive 
      ? "bg-white text-blue-600 shadow-sm" 
      : "text-slate-600 hover:text-blue-500"
    }`;

  return (
    <Navbar 
      maxWidth="full" 
      className="py-2 bg-white border-b border-gray-100"
      height="4rem"
    >
      <NavbarBrand className="gap-2">
        <div>
          <img src={logoImg} className="h-10 w-10 rounded-2xl" alt="logo" />
        </div>
        <p className="font-bold text-black text-xl tracking-tight">Route Posts</p>
      </NavbarBrand>

      {/* 2. القائمة في المنتصف (بشكل كبسولة رمادية) */}
      {userData && (
        <NavbarContent className="hidden md:flex gap-1 bg-gray-50/80 border border-gray-100 p-1 rounded-full" justify="center">
          <NavbarItem>
            <NavLink to="/Feed" className={navLinkClass}>
              <Home2 size="18" variant="Outline" />
              Feed
            </NavLink>
          </NavbarItem>
          <NavbarItem>
            <NavLink to="/profile" className={navLinkClass}>
              <User size="18" variant="Outline" />
              Profile
            </NavLink>
          </NavbarItem>
          <NavbarItem>
            <NavLink to="/Notifications" className={navLinkClass}>
              <MessageMinus size="18" variant="Outline" />
              Notifications
            </NavLink>
          </NavbarItem>
        </NavbarContent>
      )}

      {/* 3. الجزء الأيمن (البروفايل) */}
      <NavbarContent justify="end">
        {userData ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <div className="flex items-center gap-3 bg-white border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer rounded-full py-1.5 pl-1.5 pr-4 shadow-sm">
                <Avatar
                  src={userData.photo}
                  name={userData.name}
                  size="sm"
                  className="w-8 h-8 text-tiny"
                />
                <span className="text-slate-700 font-semibold text-sm">
                  {userData.name}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-400">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem as={Link} to="Profile" key="profile" startContent={<User size="18"/>}>Profile</DropdownItem>
              <DropdownItem key="settings" startContent={<Setting2 size="18"/>}>Settings</DropdownItem>
              <DropdownItem 
                key="logout" 
                color="danger" 
                className="text-danger" 
                onClick={handleLogout}
                startContent={<Logout size="18"/>}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <Button as={Link} color="primary" to="/Register" radius="full" className="font-bold">
            Sign Up
          </Button>
        )}
      </NavbarContent>
    </Navbar>
  );
}