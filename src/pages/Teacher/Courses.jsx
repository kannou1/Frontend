import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Users, Clock, Star, Plus } from 'lucide-react';

export default function TeacherCourses() {
  const [selectedTab, setSelectedTab] = useState('current');

  const currentCourses = [
    {
      id: 1,
      code: 'MATH101',
      name: 'Mathematics 101',
      students: 45,
      schedule: 'Mon, Wed 9:00 AM',
      room: 'Room 301',
      progress: 75,
      rating: 4.5
    },
    {
      id: 2,
      code: 'ALG201',
      name: 'Algebra II',
      students: 38,
      schedule: 'Tue, Thu 11:00 AM',
      room: 'Room 205',
      progress: 60,
      rating: 4.2
    }
  ];

  const pastCourses = [
    {
      id: 3,
      code: 'CALC101',
      name: 'Calculus I',
      students: 42,
      semester: 'Fall 2023',
      rating: 4.7
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="container mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              My Courses
            </h1>
            <p className="text-muted-foreground mt-1">Manage your teaching courses and assignments</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Course
          </Button>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList>
            <TabsTrigger value="current">Current Courses ({currentCourses.length})</TabsTrigger>
            <TabsTrigger value="past">Past Courses ({pastCourses.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-4">
            {currentCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{course.name}</CardTitle>
                      <CardDescription>{course.code} • {course.room}</CardDescription>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{course.students} students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{course.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{course.progress}% complete</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">{course.rating}/5.0</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Details</Button>
                    <Button variant="outline" size="sm">Manage Students</Button>
                    <Button variant="outline" size="sm">Assignments</Button>
                    <Button size="sm">Take Attendance</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastCourses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{course.name}</CardTitle>
                      <CardDescription>{course.code} • {course.semester}</CardDescription>
                    </div>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{course.students} students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">{course.rating}/5.0 rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">100% complete</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Report</Button>
                    <Button variant="outline" size="sm">Student Feedback</Button>
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
