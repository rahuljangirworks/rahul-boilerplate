import { Link } from "react-router";
import { useAuthUser } from "~/hooks/use-auth-user";
import { mockUsers, mockStats } from "~/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Users,
  UserCheck,
  Shield,
  UserPlus,
  ArrowRight,
} from "lucide-react";

import type { Route } from "./+types/dashboard";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Dashboard | Boilerplate" }];
}

export async function loader({}: Route.LoaderArgs) {
  return {};
}

export default function DashboardPage() {
  const user = useAuthUser();

  const stats = [
    {
      label: "Total Users",
      value: mockStats.totalUsers,
      icon: Users,
      color: "text-blue-500",
    },
    {
      label: "Active",
      value: mockStats.activeUsers,
      icon: UserCheck,
      color: "text-green-500",
    },
    {
      label: "Admins",
      value: mockStats.adminUsers,
      icon: Shield,
      color: "text-purple-500",
    },
    {
      label: "Invited",
      value: mockStats.invitedUsers,
      icon: UserPlus,
      color: "text-yellow-500",
    },
  ];

  const recentUsers = mockUsers.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {user.name.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Here&apos;s what&apos;s happening with your team today.
          </p>
        </div>
        <Button asChild size="sm">
          <Link to="/dashboard/users">
            <Users className="mr-1.5 size-3.5" />
            View Users
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <Icon className={`size-4 ${color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Users */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Users</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/users">
              View all
              <ArrowRight className="ml-1.5 size-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentUsers.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="size-8 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                </div>
                <Badge
                  variant={
                    u.status === "active"
                      ? "default"
                      : u.status === "invited"
                      ? "secondary"
                      : "outline"
                  }
                  className="text-xs"
                >
                  {u.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
