import App from "@/App";
import DefaultLayout from "@/components/Layout/LayoutTypes/DefaultLayout";
import AddFlashCard from "@/pages/AddCard/AddFlashCard";
import Login from "@/pages/Auth/Login/Login";
import Register from "@/pages/Auth/Register/Register";
import Mission from "@/pages/Mission/Mission";
import SettingAcount from "@/pages/Setting/Setting";
import Learning from "@/pages/Learning/Learning";
import FolderPage from "@/pages/Folder/FolderPage";
import ExplorePage from "@/pages/Explore/ExplorePage";

export const protectedRoutes = [
  {
    key: "dashboard",
    path: "/dashboard",
    component: App,
  },
  {
    key: "explore",
    path: "/explore",
    component: ExplorePage,
  },
  {
    key: "settings",
    path: "/settings",
    component: SettingAcount,
  },
  {
    key: "add-set", 
    path: "/add-set", 
    component: AddFlashCard,
  },
  {
    key: "edit-set",
    path: "/edit-set/:id", 
    component: AddFlashCard,
  },
  {
    key: "learning",
    path: "/learning/:id",
    component: Learning,
  },
  {
    key: "folder",
    path: "folder",
    component: FolderPage,
  },
];

export const publicRoutes = [
  {
    key: "about",
    path: "/about",
    component: DefaultLayout,
  },
  {
    key: "mission",
    path: "/mission",
    component: Mission,
  },
  {
    key: "login",
    path: "/login",
    component: Login,
  },
  {
    key: "register",
    path: "/register",
    component: Register,
  },
];
