import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, CheckCircle, XCircle, Users } from 'lucide-react';

export default function TeacherAttendance() {
  const [selectedCourse, setSelectedCourse] = useState('math101');
  const [selectedDate, setSelectedDate] = useState('2024-01-15');

  const courses = [
    { id: 'math101', name: 'Mathematics 101', code: 'MATH101' },
    { id: 'alg201', name: 'Algebra II', code: 'ALG201' },
    { id: 'calc301', name: 'Calculus I', code: 'CALC301' }
  ];

  const students = [
    { id: 1, name: 'John Doe', rollNo: 'ST001', status: 'present' },
    { id: 2, name: 'Jane Smith', rollNo: 'ST002', status: 'present' },
    { id: 3, name: 'Bob Johnson', rollNo: 'ST003', status: 'absent' },
    { id: 4, name: 'Alice Williams', rollNo: 'ST004', status: 'present' },
    { id: 5, name: 'Charlie Brown', rollNo: 'ST005', status: 'late' },
  ];

  const attendanceStats = {
    total: students.length,
    present: students.filter(s => s.status === 'present').length,
    absent: students.filter(s => s.status === 'absent').length,
    late: students.filter(s => s.status === 'late').length
  };

  const handleStatusChange = (studentId, status) => {
    // Update attendance logic here
    console.log(`Student ${studentId} marked as ${status}`);
  };

  const handleSaveAttendance = () => {
    // Save attendance logic here
    console.log('Attendance saved');
  };

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
                    <SelectItem key={course.id} value={course.id}>
                      {course.name} ({course.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{selectedDate}</span>
              </div>
            </div>

            <div className="space-y-3">
              {students.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">Roll No: {student.rollNo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={student.status === 'present' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleStatusChange(student.id, 'present')}
                    >
                      Present
                    </Button>
                    <Button
                      variant={student.status === 'absent' ? 'destructive' : 'outline'}
                      size="sm"
                      onClick={() => handleStatusChange(student.id, 'absent')}
                    >
                      Absent
                    </Button>
                    <Button
                      variant={student.status === 'late' ? 'secondary' : 'outline'}
                      size="sm"
                      onClick={() => handleStatusChange(student.id, 'late')}
                    >
                      Late
                    </Button>
                  </div>
                </div>
              ))}
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
              {[
                { date: '2024-01-15', course: 'Mathematics 101', present: 42, total: 45 },
                { date: '2024-01-12', course: 'Mathematics 101', present: 44, total: 45 },
                { date: '2024-01-10', course: 'Mathematics 101', present: 43, total: 45 },
              ].map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{record.course}</p>
                      <p className="text-sm text-muted-foreground">{record.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{record.present}/{record.total}</p>
                    <p className="text-sm text-muted-foreground">
                      {Math.round((record.present / record.total) * 100)}% attendance
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
