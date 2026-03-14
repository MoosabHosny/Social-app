import { Outlet } from "react-router";
import AppNavbar from "../AppNavbar/AppNavbar";

export default function Layout() {
    return <main>
        <AppNavbar />
        <div className="min-h-screen bg-gray-100 overflow-auto">
            <Outlet />
        </div>
    </main>
}
