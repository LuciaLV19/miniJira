import { Outlet } from "react-router-dom";
import Header from "./Header";

function Layout() {
  return (
    <div className="flex flex-col h-screen w-full bg-[#0a0d14]">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
