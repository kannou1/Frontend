import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import {
  getAllEmplois,
  createEmploi,
  updateEmploi,
  deleteEmploi,
} from "@/services/emploiDuTempsService";
import {
  getAllSeances,
  createSeance,
  updateSeance,
  deleteSeance,
} from "@/services/seanceService";
import { getAllClasses } from "@/services/classeService";
import { getAllCours } from "@/services/coursService";

export default function AdminTimetable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClasse, setFilterClasse] = useState("all");
  const [emplois, setEmplois] = useState([]);
  const [seances, setSeances] = useState([]);
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [showCreateEmploiDialog, setShowCreateEmploiDialog] = useState(false);
  const [showCreateSeanceDialog, setShowCreateSeanceDialog] = useState(false);
  const [showUpdateEmploiDialog, setShowUpdateEmploiDialog] = useState(false);
  const [showUpdateSeanceDialog, setShowUpdateSeanceDialog] = useState(false);
  
  const [selectedEmploi, setSelectedEmploi] = useState(null);
  const [editingEmploi, setEditingEmploi] = useState(null);
  const [editingSeance, setEditingSeance] = useState(null);
  const [expandedEmplois, setExpandedEmplois] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    id: null,
    type: null,
  });

  const [emploiFormData, setEmploiFormData] = useState({
    titre: "",
    description: "",
    classe: "",
    dateDebut: "",
    dateFin: "",
  });

  const [seanceFormData, setSeanceFormData] = useState({
    jourSemaine: "",
    heureDebut: "",
    heureFin: "",
    salle: "",
    typeCours: "",
    cours: "",
    classe: "",
    emploiDuTemps: "",
    notes: "",
  });

  // ---------------------------
  // Fetch data from API
  // ---------------------------
  async function fetchData() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("error", "Authentication required");
        return;
      }

      const [emploisData, seancesData, classesData, coursesData] =
        await Promise.all([
          getAllEmplois(token),
          getAllSeances(token),
          getAllClasses(),
          getAllCours(),
        ]);

      setEmplois(emploisData);
      setSeances(seancesData);
      setClasses(classesData);
      setCourses(coursesData);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      showToast("error", "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // ---------------------------
  // Form handlers
  // ---------------------------
  const handleEmploiChange = (e) => {
    setEmploiFormData({ ...emploiFormData, [e.target.name]: e.target.value });
  };

  const handleSeanceChange = (e) => {
    setSeanceFormData({ ...seanceFormData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name, value, formType) => {
    if (formType === "emploi") {
      setEmploiFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setSeanceFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const getClassName = (classeRef) => {
    if (!classeRef) return "Not assigned";
    let id = classeRef;
    if (typeof classeRef === "object") id = classeRef._id || classeRef.id;
    const classe =
      classes.find(
        (c) => c._id === id || c.id === id || c._id === String(id)
      ) || null;
    return classe ? classe.nom : "Not assigned";
  };

  const getCourseName = (coursId) => {
    if (!coursId) return "Not assigned";
    const course = courses.find((c) => (c.id || c._id) === coursId);
    return course ? course.nom : "Not assigned";
  };

  // ---------------------------
  // Seances for emploi
  // ---------------------------
  const getSeancesForEmploi = (emploiId) => {
    return seances.filter((seance) => {
      const eId = seance.emploiDuTemps?._id || seance.emploiDuTemps;
      return eId === emploiId;
    });
  };

  const toggleEmploiExpansion = (emploiId) => {
    const newExpanded = new Set(expandedEmplois);
    if (newExpanded.has(emploiId)) newExpanded.delete(emploiId);
    else newExpanded.add(emploiId);
    setExpandedEmplois(newExpanded);
  };

  // ---------------------------
  // Create Emploi Handlers
  // ---------------------------
  const openCreateEmploiDialog = () => {
    setEmploiFormData({
      titre: "",
      description: "",
      classe: "",
      dateDebut: "",
      dateFin: "",
    });
    setShowCreateEmploiDialog(true);
  };

  const handleCreateEmploi = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      if (!token) return showToast("error", "Authentication required");

      if (
        !emploiFormData.titre ||
        !emploiFormData.classe ||
        !emploiFormData.dateDebut ||
        !emploiFormData.dateFin
      )
        return showToast(
          "error",
          "Please fill in required fields (Title, Class, Start Date, End Date)"
        );

      const newEmploi = await createEmploi(emploiFormData, token);
      setEmplois((prev) => [...prev, newEmploi]);
      showToast("success", "Timetable created successfully!");
      setShowCreateEmploiDialog(false);
    } catch (err) {
      console.error(err);
      showToast(
        "error",
        err.response?.data?.message || "Failed to create timetable"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------
  // Update Emploi Handlers
  // ---------------------------
  const openUpdateEmploiDialog = (emploi) => {
    setEditingEmploi(emploi);
    
    // Extract classe ID if it's an object
    const classeId = typeof emploi.classe === 'object' 
      ? (emploi.classe?._id || emploi.classe?.id)
      : emploi.classe;
    
    setEmploiFormData({
      titre: emploi.titre || "",
      description: emploi.description || "",
      classe: classeId || "",
      dateDebut: emploi.dateDebut ? emploi.dateDebut.split('T')[0] : "",
      dateFin: emploi.dateFin ? emploi.dateFin.split('T')[0] : "",
    });
    setShowUpdateEmploiDialog(true);
  };

  const handleUpdateEmploi = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      if (!token) return showToast("error", "Authentication required");

      if (
        !emploiFormData.titre ||
        !emploiFormData.classe ||
        !emploiFormData.dateDebut ||
        !emploiFormData.dateFin
      )
        return showToast(
          "error",
          "Please fill in required fields"
        );

      const emploiId = editingEmploi._id || editingEmploi.id;
      const updatedEmploi = await updateEmploi(emploiId, emploiFormData, token);
      
      setEmplois((prev) =>
        prev.map((e) => ((e._id || e.id) === emploiId ? updatedEmploi : e))
      );
      
      showToast("success", "Timetable updated successfully!");
      setShowUpdateEmploiDialog(false);
      setEditingEmploi(null);
    } catch (err) {
      console.error(err);
      showToast(
        "error",
        err.response?.data?.message || "Failed to update timetable"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------
  // Create Seance Handlers
  // ---------------------------
  const openCreateSeanceDialog = (emploi) => {
    setSelectedEmploi(emploi);
    setSeanceFormData({
      jourSemaine: "",
      heureDebut: "",
      heureFin: "",
      salle: "",
      typeCours: "",
      cours: "",
      classe: emploi.classe,
      emploiDuTemps: emploi._id,
      notes: "",
    });
    setShowCreateSeanceDialog(true);
  };

  const handleCreateSeance = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      if (!token) return showToast("error", "Authentication required");

      if (
        !seanceFormData.jourSemaine ||
        !seanceFormData.heureDebut ||
        !seanceFormData.heureFin ||
        !seanceFormData.salle ||
        !seanceFormData.typeCours ||
        !seanceFormData.cours
      )
        return showToast("error", "Please fill in all required fields");

      const emploi = emplois.find(
        (e) => e._id === seanceFormData.emploiDuTemps
      );
      if (!emploi) return showToast("error", "Associated timetable not found");

      const dayMap = {
        Dimanche: 0,
        Lundi: 1,
        Mardi: 2,
        Mercredi: 3,
        Jeudi: 4,
        Vendredi: 5,
        Samedi: 6,
      };

      const startDate = new Date(emploi.dateDebut);
      const dayOffset =
        (dayMap[seanceFormData.jourSemaine] + 7 - startDate.getDay()) % 7;

      const dateDebut = new Date(startDate);
      dateDebut.setDate(startDate.getDate() + dayOffset);
      dateDebut.setHours(parseInt(seanceFormData.heureDebut.split(":")[0]));
      dateDebut.setMinutes(parseInt(seanceFormData.heureDebut.split(":")[1]));

      const dateFin = new Date(startDate);
      dateFin.setDate(startDate.getDate() + dayOffset);
      dateFin.setHours(parseInt(seanceFormData.heureFin.split(":")[0]));
      dateFin.setMinutes(parseInt(seanceFormData.heureFin.split(":")[1]));

      const seanceData = { ...seanceFormData, dateDebut, dateFin };
      const newSeance = await createSeance(seanceData, token);
      setSeances((prev) => [...prev, newSeance]);
      showToast("success", "Session created successfully!");
      setShowCreateSeanceDialog(false);
    } catch (err) {
      console.error(err);
      showToast(
        "error",
        err.response?.data?.message || "Failed to create session"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------
  // Update Seance Handlers
  // ---------------------------
  const openUpdateSeanceDialog = (seance) => {
    setEditingSeance(seance);
    
    // Extract IDs if they're objects
    const coursId = typeof seance.cours === 'object' 
      ? (seance.cours?._id || seance.cours?.id)
      : seance.cours;
    
    const classeId = typeof seance.classe === 'object' 
      ? (seance.classe?._id || seance.classe?.id)
      : seance.classe;
    
    const emploiId = typeof seance.emploiDuTemps === 'object'
      ? (seance.emploiDuTemps?._id || seance.emploiDuTemps?.id)
      : seance.emploiDuTemps;
    
    // Find the emploi for this seance
    const emploi = emplois.find(e => (e._id || e.id) === emploiId);
    setSelectedEmploi(emploi);
    
    setSeanceFormData({
      jourSemaine: seance.jourSemaine || "",
      heureDebut: seance.heureDebut || "",
      heureFin: seance.heureFin || "",
      salle: seance.salle || "",
      typeCours: seance.typeCours || "",
      cours: coursId || "",
      classe: classeId || "",
      emploiDuTemps: emploiId || "",
      notes: seance.notes || "",
    });
    setShowUpdateSeanceDialog(true);
  };

  const handleUpdateSeance = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      if (!token) return showToast("error", "Authentication required");

      if (
        !seanceFormData.jourSemaine ||
        !seanceFormData.heureDebut ||
        !seanceFormData.heureFin ||
        !seanceFormData.salle ||
        !seanceFormData.typeCours ||
        !seanceFormData.cours
      )
        return showToast("error", "Please fill in all required fields");

      const emploi = emplois.find(
        (e) => (e._id || e.id) === seanceFormData.emploiDuTemps
      );
      if (!emploi) return showToast("error", "Associated timetable not found");

      const dayMap = {
        Dimanche: 0,
        Lundi: 1,
        Mardi: 2,
        Mercredi: 3,
        Jeudi: 4,
        Vendredi: 5,
        Samedi: 6,
      };

      const startDate = new Date(emploi.dateDebut);
      const dayOffset =
        (dayMap[seanceFormData.jourSemaine] + 7 - startDate.getDay()) % 7;

      const dateDebut = new Date(startDate);
      dateDebut.setDate(startDate.getDate() + dayOffset);
      dateDebut.setHours(parseInt(seanceFormData.heureDebut.split(":")[0]));
      dateDebut.setMinutes(parseInt(seanceFormData.heureDebut.split(":")[1]));

      const dateFin = new Date(startDate);
      dateFin.setDate(startDate.getDate() + dayOffset);
      dateFin.setHours(parseInt(seanceFormData.heureFin.split(":")[0]));
      dateFin.setMinutes(parseInt(seanceFormData.heureFin.split(":")[1]));

      const seanceData = { ...seanceFormData, dateDebut, dateFin };
      const seanceId = editingSeance._id || editingSeance.id;
      
      const updatedSeance = await updateSeance(seanceId, seanceData, token);
      
      setSeances((prev) =>
        prev.map((s) => ((s._id || s.id) === seanceId ? updatedSeance : s))
      );
      
      showToast("success", "Session updated successfully!");
      setShowUpdateSeanceDialog(false);
      setEditingSeance(null);
    } catch (err) {
      console.error(err);
      showToast(
        "error",
        err.response?.data?.message || "Failed to update session"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Get courses for selected emploi's class
  const getCoursesForSelectedClass = () => {
    if (!selectedEmploi) return [];
    
    const classeId = typeof selectedEmploi.classe === 'object' 
      ? (selectedEmploi.classe?._id || selectedEmploi.classe?.id)
      : selectedEmploi.classe;
    
    return courses.filter((cours) => {
      const coursClasseId = typeof cours.classe === 'object'
        ? (cours.classe?._id || cours.classe?.id)
        : cours.classe;
      return coursClasseId === classeId;
    });
  };

  // ---------------------------
  // Delete handlers
  // ---------------------------
  const handleDeleteEmploi = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return showToast("error", "Authentication required");

      await deleteEmploi(id, token);
      setEmplois((prev) => prev.filter((e) => e._id !== id && e.id !== id));
      setSeances((prev) =>
        prev.filter((s) => (s.emploiDuTemps?._id || s.emploiDuTemps) !== id)
      );
      showToast("success", "Timetable deleted successfully!");
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to delete timetable");
    }
  };

  const handleDeleteSeance = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return showToast("error", "Authentication required");

      await deleteSeance(id, token);
      setSeances((prev) => prev.filter((s) => s._id !== id && s.id !== id));
      showToast("success", "Session deleted successfully!");
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to delete session");
    }
  };

  // ---------------------------
  // Filter emplois
  // ---------------------------
  const filteredEmplois = emplois.filter((emploi) => {
    const matchesSearch = emploi.titre
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const emploiClasseId = typeof emploi.classe === 'object' 
      ? (emploi.classe?._id || emploi.classe?.id)
      : emploi.classe;
    
    const matchesClasse =
      filterClasse === "all" || emploiClasseId === filterClasse;
    return matchesSearch && matchesClasse;
  });

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="container mx-auto space-y-6">
        {/* Toast */}
        {toast && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5">
            <Alert
              className={`min-w-[300px] shadow-lg border-2 ${
                toast.type === "success"
                  ? "bg-green-50 border-green-500 text-green-900"
                  : "bg-red-50 border-red-500 text-red-900"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <AlertDescription className="font-medium ml-2">
                {toast.message}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Timetable Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage timetables and schedule sessions
            </p>
          </div>
          <Button className="gap-2" onClick={openCreateEmploiDialog}>
            <Plus className="h-4 w-4" />
            Create Timetable
          </Button>
        </div>

        {/* Timetable List */}
        <Card>
          <CardHeader>
            <CardTitle>All Timetables</CardTitle>
            <CardDescription>
              View and manage all system timetables and their sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search timetables..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterClasse} onValueChange={setFilterClasse}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map((classe) => (
                    <SelectItem
                      key={classe._id || classe.id}
                      value={classe._id || classe.id}
                    >
                      {classe.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="mt-4 text-muted-foreground">
                  Loading timetables...
                </p>
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredEmplois.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No timetables found.</p>
              </div>
            )}

            {/* Timetables */}
            <div className="space-y-4">
              {!loading &&
                filteredEmplois.map((emploi) => {
                  const emploiId = emploi._id || emploi.id;
                  const emploiSeances = getSeancesForEmploi(emploiId);
                  const isExpanded = expandedEmplois.has(emploiId);

                  return (
                    <div
                      key={emploiId}
                      className="border rounded-lg overflow-hidden"
                    >
                      {/* Emploi Header */}
                      <div className="flex items-center justify-between p-4 bg-muted/50">
                        <div className="flex items-center gap-4 flex-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleEmploiExpansion(emploiId)}
                            className="p-1 h-6 w-6"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-lg">
                            {emploi.titre?.slice(0, 2).toUpperCase() || "TT"}
                          </div>
                          <div>
                            <p className="font-medium text-lg">
                              {emploi.titre}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {getClassName(emploi.classe)} •{" "}
                              {emploi.dateDebut
                                ? new Date(
                                    emploi.dateDebut
                                  ).toLocaleDateString()
                                : "N/A"}{" "}
                              -{" "}
                              {emploi.dateFin
                                ? new Date(emploi.dateFin).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {emploiSeances.length} sessions
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openCreateSeanceDialog(emploi)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Session
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openUpdateEmploiDialog(emploi)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setDeleteConfirm({
                                open: true,
                                id: emploiId,
                                type: "emploi",
                              })
                            }
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>

                      {/* Sessions */}
                      {isExpanded && (
                        <div className="border-t bg-background">
                          {emploiSeances.length === 0 ? (
                            <p className="p-4 text-muted-foreground text-center">
                              No sessions for this timetable.
                            </p>
                          ) : (
                            emploiSeances.map((seance) => {
                              const seanceId = seance._id || seance.id;
                              return (
                                <div
                                  key={seanceId}
                                  className="p-4 border-b last:border-none rounded-md hover:bg-muted/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                                >
                                  {/* Session Info */}
                                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2">
                                    <div>
                                      <p className="text-sm text-muted-foreground">
                                        Course
                                      </p>
                                      <p className="font-medium">
                                        {getCourseName(seance.cours?._id || seance.cours)}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">
                                        Class
                                      </p>
                                      <p className="font-medium">
                                        {getClassName(seance.classe)}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">
                                        Type & Room
                                      </p>
                                      <p className="font-medium">
                                        {seance.typeCours} • {seance.salle}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">
                                        Day & Time
                                      </p>
                                      <p className="font-medium">
                                        {seance.jourSemaine} •{" "}
                                        {seance.heureDebut} - {seance.heureFin}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Optional Notes */}
                                  {seance.notes && (
                                    <div className="mt-2 md:mt-0 md:flex-1">
                                      <p className="text-sm text-muted-foreground">
                                        Notes
                                      </p>
                                      <p className="text-sm">{seance.notes}</p>
                                    </div>
                                  )}

                                  {/* Action Buttons */}
                                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => openUpdateSeanceDialog(seance)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        setDeleteConfirm({
                                          open: true,
                                          id: seanceId,
                                          type: "seance",
                                        })
                                      }
                                    >
                                      <Trash2 className="h-4 w-4 text-red-600" />
                                    </Button>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* ============================= */}
        {/* Create Timetable Dialog */}
        {/* ============================= */}
        <Dialog
          open={showCreateEmploiDialog}
          onOpenChange={setShowCreateEmploiDialog}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Timetable</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new timetable
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  name="titre"
                  value={emploiFormData.titre}
                  onChange={handleEmploiChange}
                  placeholder="Timetable title"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  name="description"
                  value={emploiFormData.description}
                  onChange={handleEmploiChange}
                  placeholder="Optional description"
                />
              </div>
              <div>
                <Label>Class</Label>
                <Select
                  value={emploiFormData.classe}
                  onValueChange={(value) =>
                    handleSelectChange("classe", value, "emploi")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((classe) => (
                      <SelectItem key={classe._id} value={classe._id}>
                        {classe.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    name="dateDebut"
                    value={emploiFormData.dateDebut}
                    onChange={handleEmploiChange}
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    name="dateFin"
                    value={emploiFormData.dateFin}
                    onChange={handleEmploiChange}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateEmploi} disabled={submitting}>
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ============================= */}
        {/* Update Timetable Dialog */}
        {/* ============================= */}
        <Dialog
          open={showUpdateEmploiDialog}
          onOpenChange={setShowUpdateEmploiDialog}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Update Timetable</DialogTitle>
              <DialogDescription>
                Modify the timetable details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  name="titre"
                  value={emploiFormData.titre}
                  onChange={handleEmploiChange}
                  placeholder="Timetable title"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  name="description"
                  value={emploiFormData.description}
                  onChange={handleEmploiChange}
                  placeholder="Optional description"
                />
              </div>
              <div>
                <Label>Class</Label>
                <Select
                  value={emploiFormData.classe}
                  onValueChange={(value) =>
                    handleSelectChange("classe", value, "emploi")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((classe) => (
                      <SelectItem key={classe._id} value={classe._id}>
                        {classe.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    name="dateDebut"
                    value={emploiFormData.dateDebut}
                    onChange={handleEmploiChange}
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    name="dateFin"
                    value={emploiFormData.dateFin}
                    onChange={handleEmploiChange}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline"
                onClick={() => {
                  setShowUpdateEmploiDialog(false);
                  setEditingEmploi(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateEmploi} disabled={submitting}>
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Edit className="h-4 w-4 mr-2" />
                )}
                Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ============================= */}
        {/* Create Session Dialog */}
        {/* ============================= */}
        <Dialog
          open={showCreateSeanceDialog}
          onOpenChange={setShowCreateSeanceDialog}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Session</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new session
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Course</Label>
                <Select
                  value={seanceFormData.cours}
                  onValueChange={(value) =>
                    handleSelectChange("cours", value, "seance")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCoursesForSelectedClass().length === 0 ? (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        No courses available for this class
                      </div>
                    ) : (
                      getCoursesForSelectedClass().map((cours) => (
                        <SelectItem key={cours._id} value={cours._id}>
                          {cours.nom}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Type</Label>
                <Select
                  value={seanceFormData.typeCours}
                  onValueChange={(value) =>
                    handleSelectChange("typeCours", value, "seance")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CM">CM</SelectItem>
                    <SelectItem value="TD">TD</SelectItem>
                    <SelectItem value="TP">TP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Day</Label>
                  <Select
                    value={seanceFormData.jourSemaine}
                    onValueChange={(value) =>
                      handleSelectChange("jourSemaine", value, "seance")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Dimanche",
                        "Lundi",
                        "Mardi",
                        "Mercredi",
                        "Jeudi",
                        "Vendredi",
                        "Samedi",
                      ].map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Room</Label>
                  <Input
                    name="salle"
                    value={seanceFormData.salle}
                    onChange={handleSeanceChange}
                    placeholder="Room number"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    name="heureDebut"
                    value={seanceFormData.heureDebut}
                    onChange={handleSeanceChange}
                  />
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    name="heureFin"
                    value={seanceFormData.heureFin}
                    onChange={handleSeanceChange}
                  />
                </div>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  name="notes"
                  value={seanceFormData.notes}
                  onChange={handleSeanceChange}
                  placeholder="Optional notes"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateSeance} disabled={submitting}>
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Create Session
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ============================= */}
        {/* Update Session Dialog */}
        {/* ============================= */}
        <Dialog
          open={showUpdateSeanceDialog}
          onOpenChange={setShowUpdateSeanceDialog}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Update Session</DialogTitle>
              <DialogDescription>
                Modify the session details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Course</Label>
                <Select
                  value={seanceFormData.cours}
                  onValueChange={(value) =>
                    handleSelectChange("cours", value, "seance")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCoursesForSelectedClass().length === 0 ? (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        No courses available for this class
                      </div>
                    ) : (
                      getCoursesForSelectedClass().map((cours) => (
                        <SelectItem key={cours._id} value={cours._id}>
                          {cours.nom}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Type</Label>
                <Select
                  value={seanceFormData.typeCours}
                  onValueChange={(value) =>
                    handleSelectChange("typeCours", value, "seance")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CM">CM</SelectItem>
                    <SelectItem value="TD">TD</SelectItem>
                    <SelectItem value="TP">TP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Day</Label>
                  <Select
                    value={seanceFormData.jourSemaine}
                    onValueChange={(value) =>
                      handleSelectChange("jourSemaine", value, "seance")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Dimanche",
                        "Lundi",
                        "Mardi",
                        "Mercredi",
                        "Jeudi",
                        "Vendredi",
                        "Samedi",
                      ].map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Room</Label>
                  <Input
                    name="salle"
                    value={seanceFormData.salle}
                    onChange={handleSeanceChange}
                    placeholder="Room number"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    name="heureDebut"
                    value={seanceFormData.heureDebut}
                    onChange={handleSeanceChange}
                  />
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    name="heureFin"
                    value={seanceFormData.heureFin}
                    onChange={handleSeanceChange}
                  />
                </div>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  name="notes"
                  value={seanceFormData.notes}
                  onChange={handleSeanceChange}
                  placeholder="Optional notes"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline"
                onClick={() => {
                  setShowUpdateSeanceDialog(false);
                  setEditingSeance(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateSeance} disabled={submitting}>
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Edit className="h-4 w-4 mr-2" />
                )}
                Update Session
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ============================= */}
        {/* Delete Confirmation */}
        {/* ============================= */}
        <Dialog
          open={deleteConfirm.open}
          onOpenChange={(open) =>
            setDeleteConfirm((prev) => ({ ...prev, open }))
          }
        >
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this {deleteConfirm.type}?
                {deleteConfirm.type === "emploi" && " This will also delete all associated sessions."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() =>
                  setDeleteConfirm({ open: false, id: null, type: null })
                }
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (deleteConfirm.type === "emploi")
                    handleDeleteEmploi(deleteConfirm.id);
                  if (deleteConfirm.type === "seance")
                    handleDeleteSeance(deleteConfirm.id);
                  setDeleteConfirm({ open: false, id: null, type: null });
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
