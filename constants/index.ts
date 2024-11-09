import { IconType } from "react-icons/lib";
import { PiChalkboardTeacherBold, PiStudent } from "react-icons/pi";
import { SiGoogleclassroom } from "react-icons/si";

type NavType = {
  label: string;
  href: string;
  icon: IconType;
};

type NavListType = {
  label?: string;
  subtitle?: string;
  href?: string;
  icon?: IconType;
  sub?: NavType[];
};

export const navigations: NavListType[] = [
  {
    subtitle: "Workspace",
  },
  {
    label: "Classes",
    href: "/classes",
    icon: SiGoogleclassroom,
  },
  {
    subtitle: "Users",
  },
  {
    label: "Teachers",
    href: "/teachers",
    icon: PiChalkboardTeacherBold,
  },
  {
    label: "Students",
    href: "/students",
    icon: PiStudent,
  },
  // {
  //   label: "Users",
  //   icon: PiUser,
  //   sub: [
  //     {
  //       label: "Teachers",
  //       href: "/teachers",
  //       icon: PiChalkboardTeacherBold,
  //     },
  //     {
  //       label: "Students",
  //       href: "/students",
  //       icon: PiStudent,
  //     },
  //   ],
  // },
];
