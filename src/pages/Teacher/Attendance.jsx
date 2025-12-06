import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, CheckCircle, XCircle, Users, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { getAllCours } from '@/services/coursService';
import { getAllSeances } from '@/services/seanceService';
import { getAllUsers, getUserAuth, getEtudiants } from '@/services/userService';
import { createPresence, getPresenceBySeance, getTauxPresenceParSeance } from '@/services/presenceService';

export default function TeacherAttendance() {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSeance, setSelectedSeance] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [courses, setCourses] = useState([]);
  const [seances, setSeances] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [courseStats, setCourseStats] = useState(null);
  const [recentAttendanceRecords, setRecentAttendanceRecords] = useState([]);

  // Toast state
  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState("success");

  const showToast = (message, type = "success") => {
    setToast(message);
    setToastType(type);
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch current user, courses, seances, and students
      const [userData, coursesData, seancesData, studentsData] = await Promise.all([
        getUserAuth(),
        getAllCours(),
        getAllSeances(),
        getEtudiants()
      ]);

      setCurrentUser(userData);

      // Filter courses taught by current teacher
      const teacherCourses = coursesData.filter(course =>
        course.enseignant?._id === userData._id || course.enseignant === userData._id
      );
      setCourses(teacherCourses);

      // Filter seances taught by current teacher
      const teacherSeances = seancesData.filter(seance =>
        seance.enseignant?._id === userData._id || seance.enseignant === userData._id
      );
      setSeances(teacherSeances);



      // Filter students - handle different response formats
      let studentUsers = [];
      if (Array.isArray(studentsData)) {
        studentUsers = studentsData.filter(user => user.role === 'etudiant');
      } else if (studentsData && Array.isArray(studentsData.data)) {
        studentUsers = studentsData.data.filter(user => user.role === 'etudiant');
      } else if (studentsData && typeof studentsData === 'object') {
        // If it's a single object, wrap it in an array
        const studentsArray = Array.isArray(studentsData) ? studentsData : [studentsData];
        studentUsers = studentsArray.filter(user => user.role === 'etudiant');
      }
      setStudents(studentUsers);

      // Set default seance if available
      if (teacherSeances.length > 0) {
        setSelectedSeance(teacherSeances[0]._id);
        await loadSeanceData(teacherSeances[0]._id);
      }

    } catch (error) {
      console.error('Error fetching initial data:', error);
      setError('Failed to load data. Please try again.');
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadSeanceData = async (seanceId) => {
    try {
      // Fetch existing attendance records for this seance and date
      const attendanceData = await getPresenceBySeance(seanceId);

      // Filter records for selected date
      const todaysRecords = attendanceData.filter(record =>
        new Date(record.date).toISOString().split('T')[0] === selectedDate
      );

      setAttendanceRecords(todaysRecords);

      // Calculate stats
      const seanceStudents = students.filter(student =>
        // Check if student is enrolled in this seance
        true // For now, assume all students are in all seances
      );

      const stats = {
        total: seanceStudents.length,
        present: todaysRecords.filter(r => r.statut === 'présent').length,
        absent: todaysRecords.filter(r => r.statut === 'absent').length,
        late: todaysRecords.filter(r => r.statut === 'retard').length
      };
      setAttendanceStats(stats);

      // Fetch seance attendance statistics
      try {
        const statsData = await getTauxPresenceParSeance(seanceId);
        setCourseStats(statsData);
      } catch (statsError) {
        console.warn('Could not fetch seance stats:', statsError);
      }

      // Load recent attendance records for this seance
      await loadRecentAttendanceRecords(seanceId);

    } catch (error) {
      console.error('Error loading seance data:', error);
      showToast('Failed to load seance attendance data', 'error');
    }
  };

  const loadRecentAttendanceRecords = async (courseId) => {
    try {
      // Fetch all attendance records for this course
      const allRecords = await getPresenceByCours(courseId);

      // Group by date and calculate attendance stats
      const recordsByDate = {};
      allRecords.forEach(record => {
        const dateKey = new Date(record.date).toISOString().split('T')[0];
        if (!recordsByDate[dateKey]) {
          recordsByDate[dateKey] = {
            date: dateKey,
            total: 0,
            present: 0,
            absent: 0,
            late: 0
          };
        }
        recordsByDate[dateKey].total++;
        if (record.statut === 'présent') recordsByDate[dateKey].present++;
        else if (record.statut === 'absent') recordsByDate[dateKey].absent++;
        else if (record.statut === 'retard') recordsByDate[dateKey].late++;
      });

      // Convert to array and sort by date (most recent first)
      const recentRecords = Object.values(recordsByDate)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5); // Show last 5 days

      setRecentAttendanceRecords(recentRecords);

    } catch (error) {
      console.error('Error loading recent attendance records:', error);
      // Don't show error toast for this, just use empty array
      setRecentAttendanceRecords([]);
    }
  };

  // Load seance data when seance or date changes
  useEffect(() => {
    if (selectedSeance && students.length > 0) {
      loadSeanceData(selectedSeance);
    }
  }, [selectedSeance, selectedDate, students]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceRecords(prev => {
      const existing = prev.find(r => r.etudiant === studentId);
      if (existing) {
        // Update existing record
        return prev.map(r =>
          r.etudiant === studentId
            ? { ...r, statut: status }
            : r
        );
      } else {
        // Add new record
        const newRecord = {
          etudiant: studentId,
          statut: status,
          seance: selectedSeance,
          date: selectedDate,
          enseignant: currentUser?._id
        };
        return [...prev, newRecord];
      }
    });
  };

  const handleSaveAttendance = async () => {
    if (!selectedSeance || attendanceRecords.length === 0) {
      showToast('No attendance data to save', 'error');
      return;
    }

    try {
      setSaving(true);

      // Save each attendance record
      const savePromises = attendanceRecords.map(async (record) => {
        const attendanceData = {
          date: selectedDate,
          statut: record.statut,
          seance: selectedSeance,
          etudiant: record.etudiant,
          enseignant: currentUser._id
        };

        // Check if record already exists in database
        if (record._id) {
          // Update existing record (if we had an update API)
          return record;
        } else {
          // Create new record
          return await createPresence(attendanceData);
        }
      });

      await Promise.all(savePromises);

      showToast('Attendance saved successfully!');
      await loadSeanceData(selectedSeance); // Refresh data

    } catch (error) {
      console.error('Error saving attendance:', error);
      showToast('Failed to save attendance', 'error');
    } finally {
      setSaving(false);
    }
  };

  const getStudentAttendanceStatus = (studentId) => {
    const record = attendanceRecords.find(r => r.etudiant === studentId);
    return record?.statut || null;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'présent': return 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/50';
      case 'absent': return 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/50';
      case 'retard': return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/50';
      default: return 'bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'présent': return <CheckCircle className="h-4 w-4" />;
      case 'absent': return <XCircle className="h-4 w-4" />;
      case 'retard': return <Clock className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchInitialData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="container mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Attendance Management
            </h1>
            <p className="text-muted-foreground mt-1">Take and manage student attendance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceStats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Present</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{attendanceStats.present}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Absent</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{attendanceStats.absent}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Take Attendance</CardTitle>
            <CardDescription>Mark attendance for today's class</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course._id} value={course._id}>
                      {course.nom} ({course.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-[150px]"
                />
              </div>
            </div>

            <div className="space-y-3">
              {students.map((student) => {
                const studentStatus = getStudentAttendanceStatus(student._id);
                return (
                  <div key={student._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                        {(student.prenom || student.nom || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">
                          {student.prenom && student.nom ? `${student.prenom} ${student.nom}` : student.nom || student.prenom || 'Unknown Student'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {student.email || 'No email'}
                        </p>
                      </div>
                      {studentStatus && (
                        <Badge className={`${getStatusColor(studentStatus)} border`}>
                          {getStatusIcon(studentStatus)}
                          <span className="ml-1 capitalize">{studentStatus}</span>
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={studentStatus === 'présent' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleStatusChange(student._id, 'présent')}
                      >
                        Present
                      </Button>
                      <Button
                        variant={studentStatus === 'absent' ? 'destructive' : 'outline'}
                        size="sm"
                        onClick={() => handleStatusChange(student._id, 'absent')}
                      >
                        Absent
                      </Button>
                      <Button
                        variant={studentStatus === 'retard' ? 'secondary' : 'outline'}
                        size="sm"
                        onClick={() => handleStatusChange(student._id, 'retard')}
                      >
                        Late
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={handleSaveAttendance} className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Save Attendance
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance Records</CardTitle>
            <CardDescription>View attendance history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAttendanceRecords.length > 0 ? (
                recentAttendanceRecords.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {courses.find(c => c._id === selectedCourse)?.nom || 'Course'}
                        </p>
                        <p className="text-sm text-muted-foreground">{formatDate(record.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{record.present}/{record.total}</p>
                      <p className="text-sm text-muted-foreground">
                        {record.total > 0 ? Math.round((record.present / record.total) * 100) : 0}% attendance
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No attendance records found for this course</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
