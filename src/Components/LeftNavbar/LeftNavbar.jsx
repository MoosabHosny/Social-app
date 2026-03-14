import { Card } from '@heroui/react'
import { ArchiveAdd, ClipboardText, DocumentText, Global, Home2, MagicStar, People, Save2 } from 'iconsax-reactjs'
import { NavLink } from 'react-router'

export default function LeftNavbar() {
    const sideLinkStyle = ({ isActive }) => 
        `flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
          isActive 
          ? "bg-blue-50 text-blue-600 font-bold" 
          : "text-slate-600 hover:bg-gray-50 hover:text-blue-500" 
        }`;

    return (
        <Card className="p-2 border-none shadow-sm sticky top-24 bg-white rounded-3xl">
            <nav className="flex flex-col gap-1">
                <NavLink to="/Feed" className={sideLinkStyle}>
                    <ClipboardText  size="22"/> 
                    <span className="text-sm">Feed</span>
                </NavLink>

                <NavLink to="/MyPosts" className={sideLinkStyle}>
                    <MagicStar size="22"/> 
                    <span className="text-sm">My Posts</span>
                </NavLink>

                <NavLink to="/post" className={sideLinkStyle}>
                    <Global size="22"/> 
                    <span className="text-sm">Community</span>
                </NavLink>

                <NavLink to="/GetSavedPosts" className={sideLinkStyle}>
                    <ArchiveAdd size="22"/> 
                    <span className="text-sm">Saved</span>
                </NavLink>
            </nav>
        </Card>
    );
}