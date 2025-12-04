import React, { useState } from 'react';
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
  TrendingUp,
  Award,
  PieChart
} from 'lucide-react';

const mockExams = [
  {
    _id: '1',
    titre: 'Midterm Exam - Web Development',
    description: 'Comprehensive exam covering React, Node.js, and database fundamentals.',
    date: '2024-12-10T09:00:00Z',
    duree: 120,
    note: 100,
    type: 'exam',
    salle: 'Room A101',
    results: [
      { studentId: 's1', studentName: 'Alice Johnson', grade: 88, status: 'graded', attendance: 'present' },
      { studentId: 's2', studentName: 'Bob Smith', grade: 76, status: 'graded', attendance: 'present' },
      { studentId: 's3', studentName: 'Carol White', grade: 92, status: 'graded', attendance: 'present' },
      { studentId: 's4', studentName: 'David Brown', grade: null, status: 'absent', attendance: 'absent' },
      { studentId: 's5', studentName: 'Emma Davis', grade: 85, status: 'graded', attendance: 'present' },
      { studentId: 's6', studentName: 'Frank Wilson', grade: 79, status: 'graded', attendance: 'present' },
    ]
  },
  {
    _id: '2',
    titre: 'Final Exam - Advanced JavaScript',
    description: 'Final examination covering async programming, ES6+ features, and modern frameworks.',
    date: '2024-12-20T14:00:00Z',
    duree: 180,
    note: 150,
    type: 'exam',
    salle: 'Room B205',
    results: [
      { studentId: 's1', studentName: 'Alice Johnson', grade: null, status: 'pending', attendance: null },
      { studentId: 's2', studentName: 'Bob Smith', grade: null, status: 'pending', attendance: null },
      { studentId: 's3', studentName: 'Carol White', grade: null, status: 'pending', attendance: null },
    ]
  },
  {
    _id: '3',
    titre: 'Quiz - Database Systems',
    description: 'Short quiz on SQL queries and database normalization.',
    date: '2024-11-28T10:00:00Z',
    duree: 30,
    note: 25,
    type: 'exam',
    salle: 'Room C302',
    results: [
      { studentId: 's1', studentName: 'Alice Johnson', grade: 23, status: 'graded', attendance: 'present' },
      { studentId: 's2', studentName: 'Bob Smith', grade: 19, status: 'graded', attendance: 'present' },
      { studentId: 's3', studentName: 'Carol White', grade: 25, status: 'graded', attendance: 'present' },
      { studentId: 's4', studentName: 'David Brown', grade: 21, status: 'graded', attendance: 'present' },
    ]
  }
];

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

export default function TeacherExams() {
  const [view, setView] = useState('list');
  const [selectedExam, setSelectedExam] = useState(null);
  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState("success");
  const [gradingStudent, setGradingStudent] = useState(null);
  const [gradeInput, setGradeInput] = useState('');
  const [showStats, setShowStats] = useState(false);

  const showToast = (message, type = "success") => {
    setToast(message);
    setToastType(type);
    setTimeout(() => setToast(null), 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'graded': return 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/50';
      case 'pending': return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/50';
      case 'absent': return 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'graded': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'absent': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const calculateStats = (exam) => {
    const total = exam.results.length;
    const graded = exam.results.filter(r => r.status === 'graded').length;
    const pending = exam.results.filter(r => r.status === 'pending').length;
    const absent = exam.results.filter(r => r.status === 'absent').length;
    
    const grades = exam.results.filter(r => r.grade !== null).map(r => r.grade);
    const average = grades.length > 0 ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1) : 0;
    const highest = grades.length > 0 ? Math.max(...grades) : 0;
    const lowest = grades.length > 0 ? Math.min(...grades) : 0;
    
    return { total, graded, pending, absent, average, highest, lowest };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleGradeSubmit = () => {
    if (gradingStudent && gradeInput) {
      showToast(`Grade ${gradeInput} saved for ${gradingStudent.studentName}`);
      setGradingStudent(null);
      setGradeInput('');
    }
  };

  const getGradeColor = (grade, total) => {
    const percentage = (grade / total) * 100;
    if (percentage >= 90) return 'text-green-600 dark:text-green-400';
    if (percentage >= 75) return 'text-blue-600 dark:text-blue-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (view === 'details' && selectedExam) {
    const stats = calculateStats(selectedExam);
    
    return (
      <div className="min-h-screen bg-background p-6">
        {toast && <Toast message={toast} onClose={() => setToast(null)} type={toastType} />}
        
        <div className="max-w-7xl mx-auto space-y-6">
          <Button 
            variant="ghost" 
            onClick={() => {
              setSelectedExam(null);
              setView('list');
              setShowStats(false);
            }}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Exams
          </Button>

          <Card className="border-2">
            <CardHeader className="border-b bg-muted/50">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <CardTitle className="text-2xl">{selectedExam.titre}</CardTitle>
                  <CardDescription className="text-base">
                    {selectedExam.description}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={showStats ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setShowStats(!showStats)}
                  >
                    <BarChart className="h-4 w-4 mr-1" />
                    {showStats ? 'Hide Stats' : 'Show Stats'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="space-y-1 p-4 border rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Exam Date</p>
                  <p className="font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    {formatDate(selectedExam.date)}
                  </p>
                </div>
                <div className="space-y-1 p-4 border rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-semibold text-xl">{formatDuration(selectedExam.duree)}</p>
                </div>
                <div className="space-y-1 p-4 border rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Total Points</p>
                  <p className="font-semibold text-xl">{selectedExam.note}</p>
                </div>
                <div className="space-y-1 p-4 border rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Room</p>
                  <p className="font-semibold">{selectedExam.salle}</p>
                </div>
                <div className="space-y-1 p-4 border rounded-lg bg-green-500/10">
                  <p className="text-sm text-muted-foreground">Graded</p>
                  <p className="font-semibold text-xl text-green-600 dark:text-green-400">{stats.graded}/{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {showStats && stats.graded > 0 && (
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Exam Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-6 border rounded-lg bg-blue-500/10">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.average}</p>
                    <p className="text-sm text-muted-foreground mt-1">Average Score</p>
                  </div>
                  <div className="text-center p-6 border rounded-lg bg-green-500/10">
                    <Award className="h-8 w-8 mx-auto mb-2 text-green-600 dark:text-green-400" />
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.highest}</p>
                    <p className="text-sm text-muted-foreground mt-1">Highest Score</p>
                  </div>
                  <div className="text-center p-6 border rounded-lg bg-yellow-500/10">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-yellow-600 dark:text-yellow-400" />
                    <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.lowest}</p>
                    <p className="text-sm text-muted-foreground mt-1">Lowest Score</p>
                  </div>
                  <div className="text-center p-6 border rounded-lg bg-red-500/10">
                    <XCircle className="h-8 w-8 mx-auto mb-2 text-red-600 dark:text-red-400" />
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.absent}</p>
                    <p className="text-sm text-muted-foreground mt-1">Absent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Student Results</CardTitle>
                  <CardDescription>Grade and manage exam results</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export Results
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedExam.results.map((result) => (
                  <div 
                    key={result.studentId}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <p className="font-semibold text-lg">{result.studentName}</p>
                          <p className="text-sm text-muted-foreground">
                            {result.attendance === 'present' ? 'Present' : 
                             result.attendance === 'absent' ? 'Absent' : 'Pending'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {result.grade !== null ? (
                        <div className="text-center">
                          <p className={`text-3xl font-bold ${getGradeColor(result.grade, selectedExam.note)}`}>
                            {result.grade}
                          </p>
                          <p className="text-sm text-muted-foreground">/ {selectedExam.note}</p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Not graded</span>
                      )}
                      <Badge className={`${getStatusColor(result.status)} border`}>
                        {result.status}
                      </Badge>
                      {result.status === 'pending' && result.attendance !== 'absent' && (
                        <Button size="sm" onClick={() => setGradingStudent(result)}>
                          Grade Now
                        </Button>
                      )}
                      {result.status === 'graded' && (
                        <Button variant="outline" size="sm" onClick={() => {
                          setGradingStudent(result);
                          setGradeInput(result.grade.toString());
                        }}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit Grade
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
                  <CardTitle>
                    {gradingStudent.grade ? 'Edit Grade' : 'Enter Grade'}
                  </CardTitle>
                  <CardDescription>
                    Grading {gradingStudent.studentName}'s exam
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Grade (out of {selectedExam.note})
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={selectedExam.note}
                      value={gradeInput}
                      onChange={(e) => setGradeInput(e.target.value)}
                      className="w-full p-3 border rounded-md text-lg bg-background"
                      placeholder="Enter grade"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Comments (optional)</label>
                    <textarea
                      className="w-full p-3 border rounded-md bg-background"
                      rows="4"
                      placeholder="Enter comments or feedback..."
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => {
                      setGradingStudent(null);
                      setGradeInput('');
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={handleGradeSubmit}>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Save Grade
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
              Exams
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Manage exams, quizzes, and grade student performance
            </p>
          </div>
          <Button size="lg">
            <FileText className="h-4 w-4 mr-2" />
            Create Exam
          </Button>
        </div>

        <div className="grid gap-6">
          {mockExams.map((exam) => {
            const stats = calculateStats(exam);
            const examDate = new Date(exam.date);
            const isUpcoming = examDate > new Date();
            const isPast = examDate < new Date();
            
            return (
              <Card key={exam._id} className="hover:shadow-lg transition-all border">
                <CardHeader className="border-b bg-muted/50">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-2xl">{exam.titre}</CardTitle>
                        {isUpcoming && (
                          <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/50">
                            Upcoming
                          </Badge>
                        )}
                        {isPast && stats.graded === stats.total && (
                          <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/50">
                            Completed
                          </Badge>
                        )}
                        {isPast && stats.graded < stats.total && (
                          <Badge className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/50">
                            Grading In Progress
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-base">
                        {exam.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                      <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                        <Calendar className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Date</p>
                          <p className="text-sm font-semibold">{examDate.toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                        <Clock className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Duration</p>
                          <p className="text-sm font-semibold">{formatDuration(exam.duree)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Points</p>
                          <p className="text-sm font-semibold">{exam.note}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 border rounded-lg bg-blue-500/10">
                        <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="text-xs text-muted-foreground">Students</p>
                          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{stats.total}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 border rounded-lg bg-green-500/10">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <div>
                          <p className="text-xs text-muted-foreground">Graded</p>
                          <p className="text-sm font-semibold text-green-600 dark:text-green-400">{stats.graded}/{stats.total}</p>
                        </div>
                      </div>
                      {stats.average > 0 && (
                        <div className="flex items-center gap-2 p-3 border rounded-lg bg-primary/10">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">Average</p>
                            <p className="text-sm font-semibold text-primary">{stats.average}%</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        onClick={() => {
                          setSelectedExam(exam);
                          setView('details');
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Results
                      </Button>
                      <Button variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" onClick={() => showToast('Exporting results...')}>
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                      {stats.graded > 0 && (
                        <Button variant="outline" onClick={() => showToast('Generating statistics report...')}>
                          <BarChart className="h-4 w-4 mr-1" />
                          Statistics
                        </Button>
                      )}
                      <Button variant="outline" onClick={() => showToast('Exam deleted', 'error')}>
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

        {mockExams.length === 0 && (
          <Card className="p-12 text-center border-2 border-dashed">
            <FileText className="h-20 w-20 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Exams Scheduled</h3>
            <p className="text-muted-foreground mb-6">
              Create your first exam to assess student knowledge
            </p>
            <Button size="lg">
              <FileText className="h-4 w-4 mr-2" />
              Create First Exam
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}