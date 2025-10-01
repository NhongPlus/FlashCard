import App from "@/App";
import DefaultLayout from "@/components/Layout/LayoutTypes/DefaultLayout";
import AddFlashCard from "@/pages/AddCard/AddFlashCard";
import Login from "@/pages/Auth/Login/Login";
import Register from "@/pages/Auth/Register/Register";
import Mission from "@/pages/Mission/Mission";
import SettingAcount from "@/pages/Setting/Setting";
import Learning from "@/pages/Learning/Learning";

export const protectedRoutes = [
  {
    key: "dashboard",
    path: "/dashboard",
    component: App,
  },
  {
    key: "settings",
    path: "/settings",
    component: SettingAcount,
  },
  {
    key: "add",
    path: "/add",
    component: AddFlashCard,
  },
  {
    key: "learning",
    path: "/learning/:id",
    component: Learning,
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
