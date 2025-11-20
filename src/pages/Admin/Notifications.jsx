import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle2, AlertCircle, Info, Users, Settings, TrendingUp } from "lucide-react";

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      type: "warning",
      title: "System Maintenance Scheduled",
      message: "Server maintenance scheduled for this weekend. System will be unavailable from 2 AM to 4 AM.",
      date: "2025-10-28 14:30",
      unread: true,
      icon: Settings,
      color: "from-secondary to-accent"
    },
    {
      id: 2,
      type: "info",
      title: "New User Registrations",
      message: "15 new students have registered this week. Please review their applications.",
      date: "2025-10-28 10:00",
      unread: true,
      icon: Users,
      color: "from-primary to-secondary"
    },
    {
      id: 3,
      type: "success",
      title: "Course Enrollment Complete",
      message: "Fall semester course enrollment has reached 95% capacity.",
      date: "2025-10-27 16:20",
      unread: false,
      icon: CheckCircle2,
      color: "from-accent to-primary"
    },
    {
      id: 4,
      type: "info",
      title: "Performance Report Available",
      message: "Monthly system performance and usage report is now available in the Reports section.",
      date: "2025-10-27 09:15",
      unread: false,
      icon: TrendingUp,
      color: "from-primary to-accent"
    },
    {
      id: 5,
      type: "alert",
      title: "Security Alert",
      message: "Multiple failed login attempts detected from IP 192.168.1.100. Account temporarily locked.",
      date: "2025-10-26 23:45",
      unread: false,
      icon: AlertCircle,
      color: "from-red-500 to-orange-500"
    },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto p-6 md:p-8">
        <div className="mb-8 animate-fade-in flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <Badge className="bg-accent text-white">{unreadCount} new</Badge>
              )}
            </div>
            <p className="text-muted-foreground text-lg">
              Monitor system activities, user registrations, and important alerts
            </p>
          </div>
          <Button variant="outline">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>

        <div className="space-y-4">
          {notifications.map((notif, index) => {
            const Icon = notif.icon;
            return (
              <Card
                key={notif.id}
                style={{ animationDelay: `${index * 0.1}s` }}
                className="group p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-scale-in border-none overflow-hidden relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${notif.color} opacity-5 group-hover:opacity-10 transition-opacity`} />

                <div className="relative z-10 flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${notif.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg">{notif.title}</h3>
                      {notif.unread && <Badge className="bg-accent text-white">New</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{notif.message}</p>
                    <p className="text-xs text-muted-foreground">{notif.date}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
