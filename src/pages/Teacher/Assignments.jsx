import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Calendar, 
  Clock, 
  Users, 
  Download, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ArrowLeft,
  Eye,
  Edit,
  Trash2,
  BarChart,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { getAllExamen, deleteExamenById, createExamen, updateExamen } from '../../services/examenService';
import { getAllNotes, createNote, updateNoteById } from '../../services/noteService';
import { getEtudiants } from '../../services/userService';

const Toast = ({ message, onClose, type = "success" }) => (
  <div className={`fixed top-5 right-5 ${
    type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500"
  } text-white px-4 py-2 rounded shadow-lg z-50 animate-in slide-in-from-top`}>
    <div className="flex items-center justify-between gap-2">
      <span>{message}</span>
      <button onClick={onClose} className="font-bold hover:opacity-80">×</button>
    </div>
  </div>
);

export default function TeacherAssignments() {
  const [view, setView] = useState('list');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState("success");
  const [gradingStudent, setGradingStudent] = useState(null);
  const [gradeInput, setGradeInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    dateFin: '',
    note: '',
    type: 'assignment'
  });

  const showToast = (message, type = "success") => {
    setToast(message);
    setToastType(type);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [examsRes, usersRes, notesRes] = await Promise.all([
        getAllExamen(),
        getEtudiants(),
        getAllNotes()
      ]);

      const examsData = examsRes.data;
      const allUsers = usersRes.data;
      const notesData = notesRes.data;

      // Filter for students only
      const studentsData = allUsers.filter(user => user.role === 'etudiant');

      // Filter for assignment type exams
      const assignmentExams = examsData.filter(exam => exam.type === 'assignment');
      
      setAssignments(assignmentExams);
      setStudents(studentsData);
      setNotes(notesData);
      
      if (assignmentExams.length > 0) {
        showToast(`Loaded ${assignmentExams.length} assignment(s)`);
      } else {
        showToast('No assignments found', 'info');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('Failed to load data: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getSubmissions = (assignment) => {
    return students.map(student => {
      const note = notes.find(n => 
        n.examen === assignment._id && 
        n.etudiant === student._id
      );

      return {
        studentId: student._id,
        studentName: `${student.nom} ${student.prenom}`,
        submittedAt: note?.submittedAt || null,
        grade: note?.note || null,
        status: note?.note !== null && note?.note !== undefined ? 'graded' : 
                note?.submittedAt ? 'submitted' : 'pending',
        file: note?.file || null,
        noteId: note?._id || null
      };
    });
  };

  const handleGradeSubmit = async () => {
    if (!gradingStudent || !gradeInput) {
      showToast('Please enter a grade', 'error');
      return;
    }

    const grade = parseFloat(gradeInput);
    if (isNaN(grade) || grade < 0 || grade > selectedAssignment.note) {
      showToast(`Grade must be between 0 and ${selectedAssignment.note}`, 'error');
      return;
    }

    setSubmitting(true);
    try {
      const noteData = {
        examen: selectedAssignment._id,
        etudiant: gradingStudent.studentId,
        note: grade,
        feedback: feedbackInput || undefined
      };

      if (gradingStudent.noteId) {
        await updateNoteById(gradingStudent.noteId, noteData);
      } else {
        await createNote(noteData);
      }

      showToast(`Grade ${grade} saved for ${gradingStudent.studentName}`);
      setGradingStudent(null);
      setGradeInput('');
      setFeedbackInput('');
      
      await fetchData();
    } catch (error) {
      showToast('Failed to save grade: ' + error.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;

    try {
      await deleteExamenById(assignmentId);
      showToast('Assignment deleted successfully');
      await fetchData();
    } catch (error) {
      showToast('Failed to delete assignment: ' + error.message, 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      titre: '',
      description: '',
      dateFin: '',
      note: '',
      type: 'assignment'
    });
    setEditingAssignment(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleOpenEdit = (assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      titre: assignment.titre,
      description: assignment.description,
      dateFin: assignment.dateFin ? new Date(assignment.dateFin).toISOString().slice(0, 16) : '',
      note: assignment.note,
      type: 'assignment'
    });
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    resetForm();
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    
    if (!formData.titre || !formData.description || !formData.dateFin || !formData.note) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const assignmentData = {
        ...formData,
        note: parseFloat(formData.note),
        dateFin: new Date(formData.dateFin).toISOString()
      };

      if (editingAssignment) {
        await updateExamen(editingAssignment._id, assignmentData);
        showToast('Assignment updated successfully');
      } else {
        await createExamen(assignmentData);
        showToast('Assignment created successfully');
      }

      handleCloseModal();
      await fetchData();
    } catch (error) {
      showToast(`Failed to ${editingAssignment ? 'update' : 'create'} assignment: ${error.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'graded': return 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/50';
      case 'submitted': return 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/50';
      case 'pending': return 'bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/50';
      case 'late': return 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'graded': return <CheckCircle className="h-4 w-4" />;
      case 'submitted': return <AlertCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <XCircle className="h-4 w-4" />;
    }
  };

  const calculateStats = (submissions) => {
    const total = submissions.length;
    const submitted = submissions.filter(s => s.status === 'submitted' || s.status === 'graded').length;
    const graded = submissions.filter(s => s.status === 'graded').length;
    const pending = submissions.filter(s => s.status === 'pending').length;
    
    return { total, submitted, graded, pending };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading assignments...</p>
        </div>
      </div>
    );
  }

  if (view === 'details' && selectedAssignment) {
    const submissions = getSubmissions(selectedAssignment);
    const stats = calculateStats(submissions);
    
    return (
      <div className="min-h-screen bg-background p-6">
        {toast && <Toast message={toast} onClose={() => setToast(null)} type={toastType} />}
        
        <div className="max-w-7xl mx-auto space-y-6">
          <Button 
            variant="ghost" 
            onClick={() => {
              setSelectedAssignment(null);
              setView('list');
            }}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assignments
          </Button>

          <Card className="border-2">
            <CardHeader className="border-b bg-muted/50">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <CardTitle className="text-2xl">{selectedAssignment.titre}</CardTitle>
                  <CardDescription className="text-base">
                    {selectedAssignment.description}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenEdit(selectedAssignment)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => showToast('Export feature coming soon', 'info')}>
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => showToast('Stats feature coming soon', 'info')}>
                    <BarChart className="h-4 w-4 mr-1" />
                    Stats
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-1 p-4 border rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    {formatDate(selectedAssignment.dateFin)}
                  </p>
                </div>
                <div className="space-y-1 p-4 border rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Total Points</p>
                  <p className="font-semibold text-2xl">{selectedAssignment.note}</p>
                </div>
                <div className="space-y-1 p-4 border rounded-lg bg-blue-500/10">
                  <p className="text-sm text-muted-foreground">Submissions</p>
                  <p className="font-semibold text-2xl text-blue-600 dark:text-blue-400">{stats.submitted}/{stats.total}</p>
                </div>
                <div className="space-y-1 p-4 border rounded-lg bg-green-500/10">
                  <p className="text-sm text-muted-foreground">Graded</p>
                  <p className="font-semibold text-2xl text-green-600 dark:text-green-400">{stats.graded}/{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Student Submissions</CardTitle>
                  <CardDescription>Review and grade student work</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => showToast('Download all feature coming soon', 'info')}>
                  <Download className="h-4 w-4 mr-1" />
                  Download All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {submissions.map((submission) => (
                  <div 
                    key={submission.studentId}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(submission.status)}
                        <div>
                          <p className="font-semibold text-lg">{submission.studentName}</p>
                          <p className="text-sm text-muted-foreground">
                            {submission.submittedAt 
                              ? `Submitted: ${formatDate(submission.submittedAt)}`
                              : 'Not submitted yet'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {submission.grade !== null ? (
                        <Badge variant="secondary" className="text-lg px-4 py-2 font-bold">
                          {submission.grade}/{selectedAssignment.note}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">Not graded</span>
                      )}
                      <Badge className={`${getStatusColor(submission.status)} border`}>
                        {submission.status}
                      </Badge>
                      {submission.file && (
                        <Button variant="outline" size="sm" onClick={() => showToast('File download feature coming soon', 'info')}>
                          <Download className="h-4 w-4 mr-1" />
                          File
                        </Button>
                      )}
                      {(submission.status === 'submitted' || submission.status === 'graded') && (
                        <Button size="sm" onClick={() => {
                          setGradingStudent(submission);
                          setGradeInput(submission.grade?.toString() || '');
                          setFeedbackInput('');
                        }}>
                          {submission.status === 'graded' ? 'Update Grade' : 'Grade Now'}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {gradingStudent && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Grade Submission</CardTitle>
                  <CardDescription>
                    Grading {gradingStudent.studentName}'s work
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Grade (out of {selectedAssignment.note})</label>
                    <input
                      type="number"
                      min="0"
                      max={selectedAssignment.note}
                      value={gradeInput}
                      onChange={(e) => setGradeInput(e.target.value)}
                      className="w-full p-2 border rounded-md bg-background"
                      placeholder="Enter grade"
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Feedback (optional)</label>
                    <textarea
                      value={feedbackInput}
                      onChange={(e) => setFeedbackInput(e.target.value)}
                      className="w-full p-2 border rounded-md bg-background"
                      rows="4"
                      placeholder="Enter feedback for student..."
                      disabled={submitting}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setGradingStudent(null);
                        setGradeInput('');
                        setFeedbackInput('');
                      }}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleGradeSubmit} disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Grade'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      {toast && <Toast message={toast} onClose={() => setToast(null)} type={toastType} />}
      
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Assignments
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Manage and grade student assignments
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="lg" onClick={fetchData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="lg" onClick={handleOpenCreate}>
              <FileText className="h-4 w-4 mr-2" />
              Create Assignment
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {assignments.map((assignment) => {
            const submissions = getSubmissions(assignment);
            const stats = calculateStats(submissions);
            const isOverdue = new Date(assignment.dateFin) < new Date();
            
            return (
              <Card key={assignment._id} className="hover:shadow-lg transition-all border">
                <CardHeader className="border-b bg-muted/50">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-2xl">{assignment.titre}</CardTitle>
                        {isOverdue && (
                          <Badge variant="destructive" className="animate-pulse">Overdue</Badge>
                        )}
                      </div>
                      <CardDescription className="text-base">
                        {assignment.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                        <Calendar className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Due Date</p>
                          <p className="text-sm font-semibold">{new Date(assignment.dateFin).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Points</p>
                          <p className="text-sm font-semibold">{assignment.note}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 border rounded-lg bg-blue-500/10">
                        <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="text-xs text-muted-foreground">Submitted</p>
                          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{stats.submitted}/{stats.total}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 border rounded-lg bg-green-500/10">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <div>
                          <p className="text-xs text-muted-foreground">Graded</p>
                          <p className="text-sm font-semibold text-green-600 dark:text-green-400">{stats.graded}/{stats.total}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Pending</p>
                          <p className="text-sm font-semibold">{stats.pending}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setView('details');
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Submissions
                      </Button>
                      <Button variant="outline" onClick={() => handleOpenEdit(assignment)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" onClick={() => showToast('Download all feature coming soon', 'info')}>
                        <Download className="h-4 w-4 mr-1" />
                        Download All
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleDeleteAssignment(assignment._id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {assignments.length === 0 && (
          <Card className="p-12 text-center border-2 border-dashed">
            <FileText className="h-20 w-20 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Assignments Yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first assignment to get started with tracking student work
            </p>
            <Button size="lg" onClick={handleOpenCreate}>
              <FileText className="h-4 w-4 mr-2" />
              Create First Assignment
            </Button>
          </Card>
        )}

        {/* Create/Edit Assignment Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>{editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}</CardTitle>
                <CardDescription>
                  {editingAssignment ? 'Update assignment details' : 'Fill in the details to create a new assignment'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitAssignment} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="titre"
                      value={formData.titre}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded-md bg-background"
                      placeholder="Enter assignment title"
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded-md bg-background"
                      rows="4"
                      placeholder="Enter assignment description"
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Due Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        name="dateFin"
                        value={formData.dateFin}
                        onChange={handleFormChange}
                        className="w-full p-2 border rounded-md bg-background"
                        required
                        disabled={submitting}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Total Points <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="note"
                        value={formData.note}
                        onChange={handleFormChange}
                        className="w-full p-2 border rounded-md bg-background"
                        placeholder="e.g., 100"
                        min="1"
                        required
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-4">
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={handleCloseModal}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {editingAssignment ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        editingAssignment ? 'Update Assignment' : 'Create Assignment'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}