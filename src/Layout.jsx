import AppBarComponent from "./components/Appbar";
import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <AppBarComponent />
      <Sidebar />
      <Outlet />
    </>
  );
};

export default Layout;
