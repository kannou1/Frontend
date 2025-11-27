import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  Megaphone,
  Pin,
  Eye,
  CheckCircle2,
  XCircle,
  Loader2,
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Calendar,
  Settings,
  Clock,
} from "lucide-react";

import {
  getAllAnnouncements,
  markAnnouncementAsViewed,
} from "@/services/announcementService";
import { getUserAuth } from "@/services/userService";

export default function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [filter, setFilter] = useState("all"); // all, pinned, unread

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const getTypeIcon = (type) => {
    const icons = {
      info: Info,
      warning: AlertTriangle,
      urgent: AlertCircle,
      success: CheckCircle,
      event: Calendar,
      maintenance: Settings,
    };
    return icons[type] || Info;
  };

  const getTypeColor = (type) => {
    const colors = {
      info: "from-blue-500 to-blue-600",
      warning: "from-yellow-500 to-orange-500",
      urgent: "from-red-500 to-red-600",
      success: "from-green-500 to-green-600",
      event: "from-purple-500 to-purple-600",
      maintenance: "from-gray-500 to-gray-600",
    };
    return colors[type] || "from-blue-500 to-blue-600";
  };

  const getPriorityBadge = (priorite) => {
    const styles = {
      low: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
      normal: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
      urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    };
    return styles[priorite] || styles.normal;
  };

  async function fetchData() {
    try {
      setLoading(true);

      const userResponse = await getUserAuth();
      const userData = userResponse.data || userResponse;
      setUser(userData);

      const announcementsData = await getAllAnnouncements();

      const relevantAnnouncements = announcementsData.filter(announcement => {
        if (announcement.dateExpiration) {
          const expirationDate = new Date(announcement.dateExpiration);
          if (expirationDate < new Date()) return false;
        }

        if (announcement.destinataires === "all") return true;
        if (announcement.destinataires === "students") return true;

        if (announcement.destinataires === "specific_classes") {
          const studentClassId = userData.classe?._id || userData.classe;
          return announcement.classesSpecifiques?.some(
            c => (c._id || c) === studentClassId
          );
        }

        if (announcement.destinataires === "specific_users") {
          return announcement.utilisateursSpecifiques?.some(
            u => (u._id || u) === userData._id
          );
        }

        if (announcement.destinataires === "multiple_roles") {
          return announcement.rolesMultiples?.includes("etudiant");
        }

        return false;
      });

      const sorted = relevantAnnouncements.sort((a, b) => {
        if (a.estEpingle && !b.estEpingle) return -1;
        if (!a.estEpingle && b.estEpingle) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setAnnouncements(sorted);
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
      showToast("error", "Failed to load announcements");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();

    // Listen for global announcement update events
    const handleAnnouncementUpdate = () => fetchData();
    window.addEventListener("announcementUpdated", handleAnnouncementUpdate);

    return () => {
      window.removeEventListener("announcementUpdated", handleAnnouncementUpdate);
    };
  }, []);

  const handleViewAnnouncement = async (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowDetailDialog(true);

    const hasViewed = announcement.vuesPar?.some(
      v => (v.utilisateur?._id || v.utilisateur) === user._id
    );

    if (!hasViewed) {
      try {
        await markAnnouncementAsViewed(announcement._id);
        setAnnouncements(prev =>
          prev.map(a =>
            a._id === announcement._id
              ? {
                  ...a,
                  nombreVues: (a.nombreVues || 0) + 1,
                  vuesPar: [...(a.vuesPar || []), { utilisateur: user._id, dateVue: new Date() }]
                }
              : a
          )
        );
      } catch (err) {
        console.error("Failed to mark as viewed:", err);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      if (diffInHours < 1) return "Just now";
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    
    return date.toLocaleDateString();
  };

  const isUnread = (announcement) => {
    return !announcement.vuesPar?.some(
      v => (v.utilisateur?._id || v.utilisateur) === user?._id
    );
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    if (filter === "pinned") return announcement.estEpingle;
    if (filter === "unread") return isUnread(announcement);
    return true;
  });

  const unreadCount = announcements.filter(isUnread).length;
  const pinnedCount = announcements.filter(a => a.estEpingle).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto p-6 md:p-8">
        {/* Toast */}
        {toast && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5">
            <Alert
              className={`min-w-[300px] shadow-lg border-2 ${
                toast.type === "success"
                  ? "bg-green-50 dark:bg-green-950 border-green-500 text-green-900 dark:text-green-100"
                  : "bg-red-50 dark:bg-red-950 border-red-500 text-red-900 dark:text-red-100"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              )}
              <AlertDescription className="font-medium ml-2">
                {toast.message}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <Megaphone className="h-10 w-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Announcements
            </h1>
            {unreadCount > 0 && (
              <Badge className="bg-accent text-white text-lg px-3 py-1">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-lg">
            Stay updated with important information
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className="gap-2"
          >
            All ({announcements.length})
          </Button>
          <Button
            variant={filter === "pinned" ? "default" : "outline"}
            onClick={() => setFilter("pinned")}
            className="gap-2"
          >
            <Pin className="h-4 w-4" />
            Pinned ({pinnedCount})
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            onClick={() => setFilter("unread")}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            Unread ({unreadCount})
          </Button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-muted-foreground">Loading announcements...</p>
          </div>
        )}

        {/* No announcements */}
        {!loading && filteredAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <Megaphone className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">
              {filter === "unread" ? "No unread announcements" : 
               filter === "pinned" ? "No pinned announcements" : 
               "No announcements available"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Check back later for updates!
            </p>
          </div>
        )}

        {/* Announcements List */}
        <div className="space-y-4">
          {!loading &&
            filteredAnnouncements.map((announcement, index) => {
              const TypeIcon = getTypeIcon(announcement.type);
              const unread = isUnread(announcement);
              
              return (
                <Card
                  key={announcement._id}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  className={`group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-scale-in border-none overflow-hidden relative ${
                    unread ? "ring-2 ring-primary/50" : ""
                  }`}
                  onClick={() => handleViewAnnouncement(announcement)}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${getTypeColor(
                      announcement.type
                    )} opacity-5 group-hover:opacity-10 transition-opacity`}
                  />
                  <div
                    className={`h-2 bg-gradient-to-r ${getTypeColor(announcement.type)}`}
                  />
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-start gap-4">
                      <div
                        className={`h-12 w-12 rounded-xl bg-gradient-to-br ${getTypeColor(
                          announcement.type
                        )} flex items-center justify-center flex-shrink-0 shadow-lg`}
                      >
                        <TypeIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2 gap-4 flex-wrap">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-lg">{announcement.titre}</h3>
                            {announcement.estEpingle && (
                              <Pin className="h-4 w-4 text-primary flex-shrink-0" />
                            )}
                            {unread && (
                              <Badge className="bg-accent text-white">New</Badge>
                            )}
                            <Badge className={getPriorityBadge(announcement.priorite)}>
                              {announcement.priorite}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {announcement.contenu}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(announcement.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {announcement.nombreVues || 0} views
                          </span>
                          {announcement.dateExpiration && (
                            <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                              <Calendar className="h-3 w-3" />
                              Expires {new Date(announcement.dateExpiration).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>

        {/* Detail Dialog */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedAnnouncement && (
              <>
                <DialogHeader>
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`h-14 w-14 rounded-xl bg-gradient-to-br ${getTypeColor(
                        selectedAnnouncement.type
                      )} flex items-center justify-center flex-shrink-0 shadow-lg`}
                    >
                      {React.createElement(getTypeIcon(selectedAnnouncement.type), {
                        className: "h-7 w-7 text-white"
                      })}
                    </div>
                    <div className="flex-1">
                      <DialogTitle className="text-2xl mb-2 flex items-center gap-2 flex-wrap">
                        {selectedAnnouncement.titre}
                        {selectedAnnouncement.estEpingle && (
                          <Pin className="h-5 w-5 text-primary" />
                        )}
                      </DialogTitle>
                      <div className="flex gap-2 flex-wrap">
                        <Badge className={getPriorityBadge(selectedAnnouncement.priorite)}>
                          {selectedAnnouncement.priorite}
                        </Badge>
                        <Badge variant="outline">
                          {selectedAnnouncement.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-muted-foreground">
                      Message:
                    </h4>
                    <p className="text-base leading-relaxed">
                      {selectedAnnouncement.contenu}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Posted</p>
                      <p className="text-sm font-medium">
                        {new Date(selectedAnnouncement.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {selectedAnnouncement.dateExpiration && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Expires</p>
                        <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                          {new Date(selectedAnnouncement.dateExpiration).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      Viewed by {selectedAnnouncement.nombreVues || 0} student
                      {selectedAnnouncement.nombreVues !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}