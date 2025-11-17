import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Clock, FileText } from 'lucide-react';

export default function TeacherGrading() {
  const [selectedCourse, setSelectedCourse] = useState('all');

  const pendingGrades = [
    { id: 1, student: 'John Doe', assignment: 'Midterm Exam', course: 'Mathematics 101', submitted: '2024-01-15', status: 'pending' },
    { id: 2, student: 'Jane Smith', assignment: 'Final Project', course: 'Algebra II', submitted: '2024-01-14', status: 'pending' },
    { id: 3, student: 'Bob Johnson', assignment: 'Lab Report #3', course: 'Physics 101', submitted: '2024-01-13', status: 'pending' },
  ];

  const gradedAssignments = [
    { id: 4, student: 'Alice Williams', assignment: 'Quiz #2', course: 'Mathematics 101', submitted: '2024-01-10', grade: 'A', score: '95/100' },
    { id: 5, student: 'Charlie Brown', assignment: 'Homework #5', course: 'Algebra II', submitted: '2024-01-09', grade: 'B+', score: '88/100' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="container mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Grading Center
          </h1>
          <p className="text-muted-foreground mt-1">Review and grade student submissions</p>
        </div>

        <div className="flex gap-4">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="math101">Mathematics 101</SelectItem>
              <SelectItem value="algebra2">Algebra II</SelectItem>
              <SelectItem value="physics101">Physics 101</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList>
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="h-4 w-4" />
              Pending ({pendingGrades.length})
            </TabsTrigger>
            <TabsTrigger value="graded" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Graded ({gradedAssignments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingGrades.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{item.assignment}</CardTitle>
                      <CardDescription>{item.course}</CardDescription>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.student}</p>
                      <p className="text-sm text-muted-foreground">Submitted: {item.submitted}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm">Grade Now</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="graded" className="space-y-4">
            {gradedAssignments.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{item.assignment}</CardTitle>
                      <CardDescription>{item.course}</CardDescription>
                    </div>
                    <Badge className="bg-accent text-white">{item.grade}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.student}</p>
                      <p className="text-sm text-muted-foreground">Score: {item.score}</p>
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
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
