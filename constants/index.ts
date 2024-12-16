import { IconType } from "react-icons/lib";
import {
  PiBookmarkLight,
  PiChalkboardTeacherBold,
  PiNotebook,
  PiStudent,
  PiHouse,
  PiExamLight,
  PiExamFill,
} from "react-icons/pi";
import { GoPeople } from "react-icons/go";
import { SiGoogleclassroom } from "react-icons/si";
import { TbPoint, TbReportAnalytics } from "react-icons/tb";
import { AiOutlineProfile } from "react-icons/ai";
import {
  RiCalendarEventLine,
  RiDashboardLine,
  RiSettings2Line,
} from "react-icons/ri";
import { GrAnnounce, GrSchedule } from "react-icons/gr";
import { BiMessageSquareDots } from "react-icons/bi";
import { HiOutlineUserPlus, HiMiniPencilSquare } from "react-icons/hi2";
import { GrGroup } from "react-icons/gr";
import { FaInfo, FaAngleDoubleUp } from "react-icons/fa";
import { CiViewList } from "react-icons/ci";
import {
  MdAccountBalance,
  MdCalendarMonth,
  MdCategory,
  MdMoney,
  MdViewTimeline,
} from "react-icons/md";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { BiSolidReport } from "react-icons/bi";

export const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

type NavType = {
  label: string;
  href: string;
  icon: IconType;
};

type NavListType = {
  type: "subtitle" | "single" | "multiple";
  label?: string;
  subtitle?: string;
  href?: string;
  icon?: IconType;
  sub?: NavType[];
};

export const navigations: NavListType[] = [
  {
    type: "subtitle",
    subtitle: "Workspace",
  },
  {
    type: "single",
    label: "Dashboard",
    href: "/",
    icon: RiDashboardLine,
  },
  {
    type: "multiple",
    label: "Admission",
    href: "/admission",
    icon: HiOutlineUserPlus,
    sub: [
      {
        label: "Admit student",
        href: "/admission/admit-student",
        icon: PiStudent,
      },
      {
        label: "Admit bulk student",
        href: "/admission/admit-bulk-student",
        icon: GrGroup,
      },
    ],
  },
  {
    type: "multiple",
    label: "Students",
    href: "/students",
    icon: PiStudent,
    sub: [
      {
        label: "Student information",
        href: "/students",
        icon: FaInfo,
      },
      {
        label: "Student promotion",
        href: "/students/promotion",
        icon: FaAngleDoubleUp,
      },
    ],
  },
  {
    type: "single",
    label: "Classes",
    href: "/classes",
    icon: SiGoogleclassroom,
  },
  {
    type: "single",
    label: "Subjects",
    href: "/subjects",
    icon: PiBookmarkLight,
  },
  {
    type: "multiple",
    label: "Lessons",
    href: "/lessons",
    icon: PiNotebook,
    sub: [
      {
        label: "List lesson",
        href: "/lessons",
        icon: PiNotebook,
      },
      {
        label: "Schedule",
        href: "/lessons/schedule",
        icon: GrSchedule,
      },
    ],
  },
  {
    type: "multiple",
    label: "Attendance",
    href: "/attendance",
    icon: CiViewList,
    sub: [
      {
        label: "Set attendance",
        href: "/attendance",
        icon: HiMiniPencilSquare,
      },
      {
        label: "View attendance",
        href: "/attendance/view",
        icon: MdViewTimeline,
      },
    ],
  },
  {
    type: "multiple",
    label: "Exams",
    href: "/exams",
    icon: PiExamLight,
    sub: [
      {
        label: "Exam list",
        href: "/exams",
        icon: PiExamFill,
      },
      {
        label: "Exam grades",
        href: "/exams/grades",
        icon: TbPoint,
      },
      {
        label: "Marks entry",
        href: "/exams/marks",
        icon: IoCheckmarkDoneSharp,
      },
      {
        label: "Tabulation sheet",
        href: "/exams/tabulation",
        icon: BiSolidReport,
      },
    ],
  },
  {
    type: "multiple",
    label: "Accounting",
    href: "/accounting",
    icon: MdAccountBalance,
    sub: [
      {
        label: "Generate monthly fee",
        href: "/accounting/generate-monthly-fee",
        icon: MdCalendarMonth,
      },
      {
        label: "Generate custom fee",
        href: "/accounting/generate-custom-fee",
        icon: MdMoney,
      },
      {
        label: "Fee category",
        href: "/accounting/fee-category",
        icon: MdCategory,
      },
    ],
  },
  // {
  //   label: "Assignments",
  //   href: "/assignments",
  //   icon: MdOutlineAssignment,
  // },
  // {
  //   label: "Results",
  //   href: "/results",
  //   icon: TbReportAnalytics,
  // },
  // {
  //   label: "Attendance",
  //   href: "/attendance",
  //   icon: AiOutlineProfile,
  // },
  // {
  //   label: "Events",
  //   href: "/events",
  //   icon: RiCalendarEventLine,
  // },
  // {
  //   label: "Announcement",
  //   href: "/announcement",
  //   icon: GrAnnounce,
  // },
  // {
  //   label: "Messages",
  //   href: "/messages",
  //   icon: BiMessageSquareDots,
  // },
  {
    type: "subtitle",
    subtitle: "Users",
  },
  {
    type: "single",
    label: "Teachers",
    href: "/teachers",
    icon: PiChalkboardTeacherBold,
  },
  {
    type: "single",
    label: "Parents",
    href: "/parents",
    icon: GoPeople,
  },
  {
    type: "single",
    label: "Settings",
    href: "/settings",
    icon: RiSettings2Line,
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
