import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Users, BookOpen, Download, Calendar } from 'lucide-react';

export default function AdminReports() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const stats = [
    { title: 'Total Students', value: '1,234', change: '+12%', icon: Users, color: 'from-primary to-primaryLight' },
    { title: 'Total Teachers', value: '89', change: '+5%', icon: Users, color: 'from-secondary to-accent' },
    { title: 'Active Courses', value: '45', change: '+8%', icon: BookOpen, color: 'from-accent to-primary' },
    { title: 'Average Attendance', value: '94%', change: '+3%', icon: TrendingUp, color: 'from-primaryLight to-secondary' },
  ];

  const reports = [
    { id: 1, name: 'Student Enrollment Report', description: 'Monthly enrollment statistics', lastGenerated: '2024-01-15', type: 'enrollment' },
    { id: 2, name: 'Teacher Performance Report', description: 'Course completion and student feedback', lastGenerated: '2024-01-14', type: 'performance' },
    { id: 3, name: 'Attendance Summary', description: 'Overall attendance patterns', lastGenerated: '2024-01-13', type: 'attendance' },
    { id: 4, name: 'Course Analytics', description: 'Course popularity and completion rates', lastGenerated: '2024-01-12', type: 'analytics' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="container mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Reports & Analytics
            </h1>
            <p className="text-muted-foreground mt-1">View system reports and performance metrics</p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-accent mt-1">{stat.change} from last {selectedPeriod}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reports">Generated Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Enrollment Trends
                  </CardTitle>
                  <CardDescription>Student enrollment over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Chart placeholder - Enrollment trends visualization
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Course Performance
                  </CardTitle>
                  <CardDescription>Course completion and ratings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Chart placeholder - Course performance metrics
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{report.name}</CardTitle>
                      <CardDescription>{report.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{report.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Last generated: {report.lastGenerated}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Analytics</CardTitle>
                <CardDescription>In-depth system analytics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">95%</div>
                      <div className="text-sm text-muted-foreground">Student Satisfaction</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-secondary">87%</div>
                      <div className="text-sm text-muted-foreground">Course Completion Rate</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-accent">4.2</div>
                      <div className="text-sm text-muted-foreground">Average Rating</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
