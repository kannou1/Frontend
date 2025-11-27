import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCoursById } from "../../services/coursService";
import { getMaterialsByCourse } from "../../services/courseMaterialService";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Calendar,
  ArrowLeft,
  BookOpen,
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react";

// Toast Component
const Toast = ({ message, onClose }) => (
  <div className="fixed top-5 right-5 bg-destructive text-white px-4 py-2 rounded shadow-lg animate-slide-in z-50">
    <div className="flex items-center justify-between gap-2">
      <span>{message}</span>
      <button onClick={onClose} className="font-bold">
        ×
      </button>
    </div>
  </div>
);

const StudentCourseDetails = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [tabLoading, setTabLoading] = useState({
    chapters: true,
    assignments: true,
    exams: true,
  });
  const [activeTab, setActiveTab] = useState("chapters");
  const [showToast, setShowToast] = useState(null);

  useEffect(() => {
    if (!id) {
      setShowToast("Invalid course ID");
      setLoadingCourse(false);
      return;
    }

    const fetchCourseAndMaterials = async () => {
      try {
        setLoadingCourse(true);

        const data = await getCoursById(id);
        const materials = await getMaterialsByCourse(id, token);

        const instructorName =
          data.enseignant?.prenom && data.enseignant?.nom
            ? `${data.enseignant.prenom} ${data.enseignant.nom}`
            : data.enseignant?.name || "TBA";

        const courseName = data.title || data.nom || "Untitled Course";

        setCourse({
          ...data,
          title: courseName,
          instructorName,
          chapters: data.chapters || [],
          materials,
          assignments: data.assignments || [],
          exams: data.exams || data.examens || [],
          progress: data.progress || 0,
        });

        setTimeout(
          () =>
            setTabLoading({
              chapters: false,
              assignments: false,
              exams: false,
            }),
          500
        );
      } catch (err) {
        console.error(err);
        setShowToast(err.message || "Failed to load course");
      } finally {
        setLoadingCourse(false);
      }
    };

    fetchCourseAndMaterials();
  }, [id, token]);

  if (loadingCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <Card className="p-8 text-center m-8">
        <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
        <p className="mt-4">Course not found.</p>
        <Button className="mt-4" onClick={() => navigate("/student/courses")}>
          Back to Courses
        </Button>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {showToast && (
        <Toast message={showToast} onClose={() => setShowToast(null)} />
      )}

      {/* Header */}
      <div className="mb-6 sm:mb-8 md:mb-10">
        <Card className="border-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 shadow-lg rounded-xl">
          <CardContent className="p-6 sm:p-8 md:p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-2">
                  {course.title}
                </h1>
                <div className="flex items-center gap-4 text-muted-foreground flex-wrap mb-4">
                  <User className="h-4 w-4" /> {course.instructorName}
                  <span>•</span>
                  <Calendar className="h-4 w-4" /> {course.semestre || "TBA"}
                  <span>•</span>
                  {course.className || "General"}
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-4 items-center mb-4">
                  <Badge className="bg-white/90 text-gray-900">
                    {course.code || "N/A"}
                  </Badge>
                  <Badge className="bg-white/90 text-gray-900">
                    {course.credits || 3} Credits
                  </Badge>
                </div>
                <div className="max-w-2xl">
                  <Progress
                    value={course.progress}
                    className="h-2 bg-white/20"
                  />
                  <div className="text-sm mt-1">
                    {course.progress}% completed
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                className="text-foreground mt-4 sm:mt-0"
                onClick={() => navigate("/student/courses")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Courses
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:w-auto mb-4">
            <TabsTrigger value="chapters" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Chapters
            </TabsTrigger>
            <TabsTrigger
              value="assignments"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" /> Assignments
            </TabsTrigger>
            <TabsTrigger value="exams" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> Exams
            </TabsTrigger>
          </TabsList>

          {/* Chapters / Materials */}
          <TabsContent value="chapters">
            {tabLoading.chapters ? (
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mt-8" />
            ) : course.materials?.length > 0 ? (
              <div className="grid gap-6">
                {course.materials.map((m, i) => {
                  const fileExtension = m.fichier?.split(".").pop() || "";
                  return (
                    <Card
                      key={i}
                      className="p-6 shadow-md border border-primary/20 rounded-xl"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                            {m.titre || "Untitled"}
                          </h3>
                          <p className="text-muted-foreground mt-2">
                            {m.description || "No description available."}
                          </p>
                          <div className="flex flex-wrap gap-3 mt-4">
                            {m.type && (
                              <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                                {m.type.toUpperCase()}
                              </Badge>
                            )}
                            {m.uploadedAt && (
                              <Badge className="bg-gray-100 text-gray-800 px-3 py-1">
                                🗓 {new Date(m.uploadedAt).toLocaleDateString()}
                              </Badge>
                            )}
                          </div>
                        </div>
                        {m.fichier && (
                          <div className="flex items-center mt-4 sm:mt-0">
                            <a
                              href={`http://localhost:5000/materials/${m.fichier}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button className="bg-secondary text-white hover:bg-secondary/90">
                                📥 download
                              </Button>
                            </a>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No materials yet.</p>
              </Card>
            )}
          </TabsContent>

          {/* Assignments */}
          <TabsContent value="assignments">
            {tabLoading.assignments ? (
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mt-8" />
            ) : course.assignments.length > 0 ? (
              <div className="grid gap-4">
                {course.assignments.map((a, i) => (
                  <Card key={i} className="p-4">
                    <h3 className="font-semibold">{a.title || "Untitled"}</h3>
                    <p className="text-sm text-muted-foreground">
                      Due: {a.dueDate || "TBA"}
                    </p>
                    <Badge className="mt-2">{a.status || "Pending"}</Badge>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No assignments yet.</p>
              </Card>
            )}
          </TabsContent>

          {/* Exams */}
          <TabsContent value="exams">
            {tabLoading.exams ? (
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mt-8" />
            ) : course.exams.length > 0 ? (
              <div className="grid gap-6">
                {course.exams.map((e, i) => {
                  const date = e.date ? new Date(e.date) : null;
                  const formattedDate =
                    date?.toLocaleDateString("fr-FR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }) || "TBA";
                  const formattedTime =
                    date?.toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    }) || "TBA";
                  return (
                    <Card
                      key={i}
                      className="p-6 shadow-md border border-primary/20 rounded-xl"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-primary" />{" "}
                            {e.title || "Exam"}
                          </h3>
                          <p className="text-muted-foreground mt-1">
                            {e.description ||
                              "Exam details will be shared soon."}
                          </p>
                          <div className="flex flex-wrap gap-3 mt-4">
                            <Badge className="bg-primary/10 text-primary border border-primary/30 px-3 py-1">
                              📅 {formattedDate}
                            </Badge>
                            <Badge className="bg-secondary/10 text-secondary border border-secondary/30 px-3 py-1">
                              ⏰ {formattedTime}
                            </Badge>
                            <Badge className="bg-emerald-100 text-emerald-800">
                              {e.type || "Written Exam"}
                            </Badge>
                            {e.duration && (
                              <Badge className="bg-blue-100 text-blue-800">
                                🕒 {e.duration} min
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Badge
                            className={
                              e.status === "scheduled"
                                ? "bg-amber-500 text-white"
                                : e.status === "completed"
                                ? "bg-emerald-500 text-white"
                                : "bg-gray-400 text-white"
                            }
                          >
                            {e.status?.toUpperCase() || "SCHEDULED"}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No exams scheduled.</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentCourseDetails;
