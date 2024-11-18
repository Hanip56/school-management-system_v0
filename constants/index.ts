import { IconType } from "react-icons/lib";
import {
  PiBookmarkLight,
  PiChalkboardTeacherBold,
  PiExamLight,
  PiNotebook,
  PiStudent,
  PiHouse,
} from "react-icons/pi";
import { GoPeople } from "react-icons/go";
import { SiGoogleclassroom } from "react-icons/si";
import { MdOutlineAssignment } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { AiOutlineProfile } from "react-icons/ai";
import { RiCalendarEventLine } from "react-icons/ri";
import { GrAnnounce } from "react-icons/gr";
import { BiMessageSquareDots } from "react-icons/bi";

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
    label: "Home",
    href: "/",
    icon: PiHouse,
  },
  {
    label: "Classes",
    href: "/classes",
    icon: SiGoogleclassroom,
  },
  {
    label: "Subjects",
    href: "/subjects",
    icon: PiBookmarkLight,
  },
  {
    label: "Lessons",
    href: "/lessons",
    icon: PiNotebook,
  },
  // {
  //   label: "Exams",
  //   href: "/exams",
  //   icon: PiExamLight,
  // },
  // {
  //   label: "Assignments",
  //   href: "/assignments",
  //   icon: MdOutlineAssignment,
  // },
  {
    label: "Results",
    href: "/results",
    icon: TbReportAnalytics,
  },
  {
    label: "Attendance",
    href: "/attendance",
    icon: AiOutlineProfile,
  },
  {
    label: "Events",
    href: "/events",
    icon: RiCalendarEventLine,
  },
  {
    label: "Announcement",
    href: "/announcement",
    icon: GrAnnounce,
  },
  {
    label: "Messages",
    href: "/messages",
    icon: BiMessageSquareDots,
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
  {
    label: "Parents",
    href: "/parents",
    icon: GoPeople,
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
