import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCoursById } from "../../services/coursService";
import { getMaterialsByCourse } from "../../services/courseMaterialService";
import { submitAssignment } from "../../services/examenService"; // ✅ Only import submitAssignment
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
  CheckCircle,
  Download,
} from "lucide-react";

// Toast Component
const Toast = ({ message, onClose, type = "error" }) => (
  <div className={`fixed top-5 right-5 ${
    type === "success" ? "bg-green-500" : "bg-destructive"
  } text-white px-4 py-2 rounded shadow-lg animate-slide-in z-50`}>
    <div className="flex items-center justify-between gap-2">
      <span>{message}</span>
      <button onClick={onClose} className="font-bold">×</button>
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
  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState("error");
  const [submittingAssignment, setSubmittingAssignment] = useState(null);
  const [selectedFileMap, setSelectedFileMap] = useState({});

  const fileInputRefs = useRef({});

  const showToastMessage = (message, type = "error") => {
    setToast(message);
    setToastType(type);
    setTimeout(() => setToast(null), 5000);
  };

  // ✅ Fetch course and materials - USE BACKEND DATA DIRECTLY
  const fetchCourseAndMaterials = async () => {
    if (!id) {
      showToastMessage("Invalid course ID");
      setLoadingCourse(false);
      return;
    }

    try {
      setLoadingCourse(true);

      const [data, materials] = await Promise.all([
        getCoursById(id),
        getMaterialsByCourse(id, token)
      ]);

      console.log("📦 Raw course data from backend:", data);
      console.log("📦 Examens field:", data.examens);

      const instructorName =
        data.enseignant?.prenom && data.enseignant?.nom
          ? `${data.enseignant.prenom} ${data.enseignant.nom}`
          : data.enseignant?.name || "TBA";

      const courseName = data.title || data.nom || "Untitled Course";

      // ✅ Get exams directly from the course data (backend already populated them)
      const allExams = data.examens || data.exams || [];
      
      console.log("📝 All exams from backend:", allExams);
      console.log("📝 Number of exams:", allExams.length);

      // ✅ Separate by type field
      const assignments = allExams.filter(item => {
        const itemType = (item.type || "").toLowerCase();
        console.log(`Checking item: ${item.nom || item.title}, type: "${item.type}" -> normalized: "${itemType}"`);
        return itemType === "assignment";
      });
      
      const exams = allExams.filter(item => {
        const itemType = (item.type || "").toLowerCase();
        return itemType !== "assignment";
      });

      console.log("✅ Filtered assignments:", assignments.length, assignments.map(a => a.nom || a.title));
      console.log("✅ Filtered exams:", exams.length, exams.map(e => e.nom || e.title));

      setCourse({
        ...data,
        title: courseName,
        instructorName,
        chapters: data.chapters || [],
        materials: materials || [],
        assignments: assignments,
        exams: exams,
        progress: data.progress || 0,
        className: data.classe?.nom || "General"
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
      console.error("❌ Error fetching course:", err);
      showToastMessage(err.message || "Failed to load course");
    } finally {
      setLoadingCourse(false);
    }
  };

  useEffect(() => {
    fetchCourseAndMaterials();
  }, [id, token]);

  // Handle file selection
  const handleFileSelect = (e, assignmentId) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToastMessage("File size must be less than 10MB");
      return;
    }

    const validExtensions = ['.pdf', '.doc', '.docx', '.txt', '.zip', '.rar'];
    const fileName = file.name.toLowerCase();
    const isValidType = validExtensions.some(ext => fileName.endsWith(ext));

    if (!isValidType) {
      showToastMessage("Please upload a valid file type (PDF, DOC, DOCX, TXT, ZIP, RAR)");
      return;
    }

    setSelectedFileMap(prev => ({ ...prev, [assignmentId]: file }));
  };

  // Trigger file input
  const triggerFileInput = (assignmentId) => {
    const ref = fileInputRefs.current[assignmentId];
    if (ref) ref.click();
  };

  // ✅ Submit assignment
  const handleSubmitAssignment = async (assignmentId) => {
    const file = selectedFileMap[assignmentId];
    
    if (!file) {
      showToastMessage("Please select a file to submit");
      return;
    }

    try {
      setSubmittingAssignment(assignmentId);

      const response = await submitAssignment(assignmentId, file);

      showToastMessage("Assignment submitted successfully!", "success");

      console.log("✅ Submission successful:", response.data);

      // Clear selected file
      setSelectedFileMap(prev => {
        const copy = { ...prev };
        delete copy[assignmentId];
        return copy;
      });

      // Refresh course data
      await fetchCourseAndMaterials();

    } catch (error) {
      console.error("❌ Error submitting assignment:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to submit assignment";
      showToastMessage(errorMessage);
    } finally {
      setSubmittingAssignment(null);
    }
  };

  // Get submission status
  const getSubmissionStatus = (assignment) => {
    if (assignment.submissions && Array.isArray(assignment.submissions)) {
      const userSubmission = assignment.submissions.find(sub => {
        const subUserId = typeof sub.etudiant === 'object' 
          ? sub.etudiant?._id 
          : sub.etudiant;
        return subUserId === token;
      });

      if (userSubmission) {
        return {
          submitted: true,
          data: userSubmission
        };
      }
    }
    return { submitted: false, data: null };
  };

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
      {toast && (
        <Toast message={toast} onClose={() => setToast(null)} type={toastType} />
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
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{course.instructorName}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{course.semestre || "TBA"}</span>
                  </div>
                  <span>•</span>
                  <span>{course.className}</span>
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
                  <Progress value={course.progress} className="h-2 bg-white/20" />
                  <div className="text-sm mt-1">{course.progress}% completed</div>
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
            <TabsTrigger value="assignments" className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Assignments
              {course.assignments?.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {course.assignments.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="exams" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> Exams
              {course.exams?.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {course.exams.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Chapters */}
          <TabsContent value="chapters">
            {tabLoading.chapters ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : course.materials?.length > 0 ? (
              <div className="grid gap-6">
                {course.materials.map((m, i) => (
                  <Card
                    key={m._id || i}
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
                              <Download className="h-4 w-4 mr-2" /> Download
                            </Button>
                          </a>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
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
              <div className="flex justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : course.assignments?.length > 0 ? (
              <div className="grid gap-6">
                {course.assignments.map((a, i) => {
                  const now = new Date();
                  const dueDate = a.date ? new Date(a.date) : null;
                  const submissionInfo = getSubmissionStatus(a);

                  let status = "Pending";
                  if (submissionInfo.submitted) {
                    status = submissionInfo.data.note != null ? "Graded" : "Submitted";
                  } else if (dueDate && dueDate < now) {
                    status = "Overdue";
                  }

                  const formattedDate = dueDate?.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }) || "TBA";

                  const formattedTime = dueDate?.toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }) || "TBA";

                  return (
                    <Card
                      key={a._id || i}
                      className="p-6 shadow-md border border-primary/20 rounded-xl"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold flex items-center gap-2">
                              <FileText className="h-5 w-5 text-primary" />
                              {a.nom || a.title || "Assignment"}
                            </h3>
                            <p className="text-muted-foreground mt-1">
                              {a.description || "Assignment details will be shared soon."}
                            </p>
                            <div className="flex flex-wrap gap-3 mt-4">
                              <Badge className="bg-primary/10 text-primary border border-primary/30 px-3 py-1">
                                📅 {formattedDate}
                              </Badge>
                              <Badge className="bg-secondary/10 text-secondary border border-secondary/30 px-3 py-1">
                                ⏰ {formattedTime}
                              </Badge>
                              <Badge className="bg-purple-100 text-purple-800">
                                {a.type || "Assignment"}
                              </Badge>
                              {a.noteMax && (
                                <Badge className="bg-blue-100 text-blue-800">
                                  📝 Max Score: {a.noteMax}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <Badge
                              className={
                                status === "Pending"
                                  ? "bg-amber-500 text-white"
                                  : status === "Submitted"
                                  ? "bg-blue-500 text-white"
                                  : status === "Graded"
                                  ? "bg-emerald-500 text-white"
                                  : "bg-red-500 text-white"
                              }
                            >
                              {status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>

                        {/* Submission info */}
                        {submissionInfo.submitted && (
                          <div className="bg-muted/50 p-4 rounded-lg border border-muted">
                            <div className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                              <div className="flex-1">
                                <p className="font-medium text-sm">
                                  Submitted on {new Date(submissionInfo.data.dateSubmission).toLocaleString("fr-FR")}
                                </p>
                                {submissionInfo.data.note != null && (
                                  <p className="text-sm mt-1">
                                    <span className="font-semibold">Grade:</span> {submissionInfo.data.note}/{a.noteMax}
                                  </p>
                                )}
                                {submissionInfo.data.commentaire && (
                                  <p className="text-sm mt-1 text-muted-foreground">
                                    <span className="font-semibold">Feedback:</span> {submissionInfo.data.commentaire}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Submit form */}
                        {!submissionInfo.submitted && dueDate && dueDate > now && (
                          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-muted">
                            <div className="flex-1">
                              <input
                                ref={(el) => (fileInputRefs.current[a._id] = el)}
                                type="file"
                                className="hidden"
                                onChange={(e) => handleFileSelect(e, a._id)}
                                accept=".pdf,.doc,.docx,.txt,.zip,.rar"
                              />

                              <Button
                                type="button"
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => triggerFileInput(a._id)}
                              >
                                📎 {selectedFileMap[a._id] ? (
                                  selectedFileMap[a._id].name.length > 30
                                    ? selectedFileMap[a._id].name.substring(0, 30) + "..."
                                    : selectedFileMap[a._id].name
                                ) : "Choose File (PDF, DOC, TXT, ZIP)"}
                              </Button>
                            </div>

                            <Button
                              className="bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
                              onClick={() => handleSubmitAssignment(a._id)}
                              disabled={
                                submittingAssignment === a._id ||
                                !selectedFileMap[a._id]
                              }
                            >
                              {submittingAssignment === a._id ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Submitting...
                                </>
                              ) : (
                                "Submit Assignment"
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
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
              <div className="flex justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : course.exams?.length > 0 ? (
              <div className="grid gap-6">
                {course.exams.map((e, i) => {
                  const now = new Date();
                  const examDate = e.date ? new Date(e.date) : null;

                  let status = "TBA";
                  if (examDate) {
                    status = examDate > now ? "Upcoming" : "Completed";
                  }

                  const formattedDate = examDate?.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }) || "TBA";

                  const formattedTime = examDate?.toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }) || "TBA";

                  const studentGrade = e.notes?.find(note => {
                    const noteUserId = typeof note.etudiant === 'object'
                      ? note.etudiant?._id
                      : note.etudiant;
                    return noteUserId === token;
                  });

                  return (
                    <Card
                      key={e._id || i}
                      className="p-6 shadow-md border border-primary/20 rounded-xl"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-primary" />
                            {e.nom || e.title || "Exam"}
                          </h3>
                          <p className="text-muted-foreground mt-1">
                            {e.description || "Exam details will be shared soon."}
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

                          {studentGrade && (
                            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                              <p className="text-sm font-semibold text-green-800">
                                Your Grade: {studentGrade.note}/{e.noteMax}
                              </p>
                              {studentGrade.commentaire && (
                                <p className="text-sm text-green-700 mt-1">
                                  {studentGrade.commentaire}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex justify-end flex-col gap-2">
                          <Badge
                            className={
                              status === "Upcoming"
                                ? "bg-amber-500 text-white"
                                : status === "Completed"
                                ? "bg-emerald-500 text-white"
                                : "bg-gray-400 text-white"
                            }
                          >
                            {status.toUpperCase()}
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
