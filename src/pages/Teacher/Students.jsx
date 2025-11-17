import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Mail, Phone, Calendar, BookOpen, TrendingUp } from 'lucide-react';

export default function TeacherStudents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');

  const courses = [
    { id: 'all', name: 'All Courses' },
    { id: 'math101', name: 'Mathematics 101' },
    { id: 'alg201', name: 'Algebra II' },
    { id: 'calc301', name: 'Calculus I' }
  ];

  const students = [
    {
      id: 1,
      name: 'John Doe',
      rollNo: 'ST001',
      email: 'john.doe@student.edu',
      phone: '+1 234 567 8901',
      courses: ['Mathematics 101', 'Physics 101'],
      grade: 'A',
      attendance: 95,
      lastActive: '2024-01-15'
    },
    {
      id: 2,
      name: 'Jane Smith',
      rollNo: 'ST002',
      email: 'jane.smith@student.edu',
      phone: '+1 234 567 8902',
      courses: ['Algebra II', 'Chemistry 101'],
      grade: 'B+',
      attendance: 88,
      lastActive: '2024-01-14'
    },
    {
      id: 3,
      name: 'Bob Johnson',
      rollNo: 'ST003',
      email: 'bob.johnson@student.edu',
      phone: '+1 234 567 8903',
      courses: ['Mathematics 101', 'Calculus I'],
      grade: 'A-',
      attendance: 92,
      lastActive: '2024-01-13'
    },
    {
      id: 4,
      name: 'Alice Williams',
      rollNo: 'ST004',
      email: 'alice.williams@student.edu',
      phone: '+1 234 567 8904',
      courses: ['Algebra II'],
      grade: 'B',
      attendance: 85,
      lastActive: '2024-01-12'
    }
  ];

  const getGradeColor = (grade) => {
    switch (grade.charAt(0)) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-orange-100 text-orange-800';
      case 'F': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="container mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              My Students
            </h1>
            <p className="text-muted-foreground mt-1">View and manage your students</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Student Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {students.map((student) => (
              <Card key={student.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{student.name}</CardTitle>
                      <CardDescription>Roll No: {student.rollNo}</CardDescription>
                    </div>
                    <Badge className={getGradeColor(student.grade)}>
                      Grade: {student.grade}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{student.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{student.attendance}% attendance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Last active: {student.lastActive}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Courses: {student.courses.join(', ')}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Profile</Button>
                    <Button variant="outline" size="sm">Send Message</Button>
                    <Button variant="outline" size="sm">View Grades</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            {students.map((student) => (
              <Card key={student.id}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{student.name}</CardTitle>
                      <CardDescription>{student.rollNo}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Contact Information</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{student.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{student.phone}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Academic Information</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Current Grade: {student.grade}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Attendance: {student.attendance}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Enrolled Courses</h4>
                        <div className="space-y-2">
                          {student.courses.map((course, index) => (
                            <Badge key={index} variant="secondary">{course}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Recent Activity</h4>
                        <p className="text-sm text-muted-foreground">
                          Last active: {student.lastActive}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-6">
                    <Button variant="outline">Edit Student</Button>
                    <Button variant="outline">View Assignments</Button>
                    <Button variant="outline">Contact Parent</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
