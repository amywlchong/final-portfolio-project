import { Role } from "../types";
import DashboardPage from "../components/adminDashboard";
import ToursPage from "../components/tours/ToursPage";
import TourPage from "../components/tours/[tourId]/TourPage";
import MyBookingsPage from "../components/userSelfService/myBookings/MyBookingsPage";
import MyProfilePage from "../components/userSelfService/myProfile/MyProfilePage";
import UsersPage from "../components/userAdministration/UsersPage";
import SchedulesPage from "../components/schedules/SchedulesPage";
import BookingManagementPage from "../components/bookingManagement/BookingsPage";
import TourManagementPage from "../components/tourManagement/ToursPage";

interface RouteConfig {
  path: string;
  text: string;
  component: React.ComponentType;
  requiredRoles: Role[];
  showInDrawer: boolean;
}

const routeConfig: RouteConfig[] = [
  { path: "/", text: "Home", component: ToursPage, requiredRoles: [], showInDrawer: true },
  { path: "/tours/:id", text: "Tour", component: TourPage, requiredRoles: [], showInDrawer: false },
  { path: "/dashboard", text: "Dashboard", component: DashboardPage, requiredRoles: [Role.Admin], showInDrawer: true },
  { path: "/tours", text: "Tours", component: TourManagementPage, requiredRoles: [Role.LeadGuide, Role.Admin], showInDrawer: true },
  { path: "/bookings", text: "Bookings", component: BookingManagementPage, requiredRoles: [Role.LeadGuide, Role.Admin], showInDrawer: true },
  { path: "/tour-guide-schedules", text: "Schedules", component: SchedulesPage, requiredRoles: [Role.Guide, Role.LeadGuide, Role.Admin], showInDrawer: true },
  { path: "/users", text: "Users", component: UsersPage, requiredRoles: [Role.Admin], showInDrawer: true },
  { path: "/me/bookings", text: "My bookings", component: MyBookingsPage, requiredRoles: [Role.Customer], showInDrawer: true },
  { path: "/me/profile", text: "My profile", component: MyProfilePage, requiredRoles: [Role.Customer, Role.Guide, Role.LeadGuide, Role.Admin], showInDrawer: true },
];

export default routeConfig;
