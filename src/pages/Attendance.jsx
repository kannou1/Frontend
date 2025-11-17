import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Clock, TrendingUp, Calendar } from "lucide-react";

const TeacherAttendance = () => {
  const courses = [
    {
      id: 1,
      name: "Advanced JavaScript",
      code: "CS301",
      present: 28,
      absent: 2,
      total: 30,
      percentage: 93,
      color: "from-primary to-primary-light"
    },
    {
      id: 2,
      name: "Web Development",
      code: "CS101",
      present: 24,
      absent: 1,
      total: 25,
      percentage: 96,
      color: "from-primary to-secondary"
    },
    {
      id: 3,
      name: "Network Security",
      code: "SEC201",
      present: 26,
      absent: 4,
      total: 30,
      percentage: 87,
      color: "from-secondary to-accent"
    },
    {
      id: 4,
      name: "Machine Learning",
      code: "DS301",
      present: 22,
      absent: 3,
      total: 25,
      percentage: 88,
      color: "from-accent to-secondary"
    },
    {
      id: 5,
      name: "Cryptography",
      code: "SEC202",
      present: 27,
      absent: 1,
      total: 28,
      percentage: 96,
      color: "from-secondary to-primary"
    },
  ];

  const recentAttendance = [
    { date: "2025-10-28", course: "Advanced JavaScript", status: "Present", code: "CS301" },
    { date: "2025-10-27", course: "Web Development", status: "Present", code: "CS101" },
    { date: "2025-10-26", course: "Network Security", status: "Absent", code: "SEC201" },
    { date: "2025-10-25", course: "Machine Learning", status: "Present", code: "DS301" },
    { date: "2025-10-24", course: "Cryptography", status: "Present", code: "SEC202" },
  ];

  const overallPercentage = Math.round(
    (courses.reduce((acc, c) => acc + c.present, 0) / 
     courses.reduce((acc, c) => acc + c.total, 0)) * 100
  );

  const totalPresent = courses.reduce((acc, c) => acc + c.present, 0);
  const totalAbsent = courses.reduce((acc, c) => acc + c.absent, 0);
  const totalClasses = courses.reduce((acc, c) => acc + c.total, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto p-6 md:p-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            My Attendance
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your class attendance and presence record
          </p>
        </div>

        {/* Overall Stats Card */}
        <Card className="p-8 mb-8 animate-fade-in border-none overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Overall Attendance</h2>
                  <p className="text-sm text-muted-foreground">Academic Year 2024-2025</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                You're maintaining excellent attendance! Keep up the great work.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center border-none bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="text-4xl font-bold text-primary mb-1">{overallPercentage}%</div>
                <div className="text-xs text-muted-foreground font-medium">Total</div>
              </Card>
              <Card className="p-4 text-center border-none bg-gradient-to-br from-accent/10 to-accent/5">
                <div className="text-4xl font-bold text-accent mb-1">{totalPresent}</div>
                <div className="text-xs text-muted-foreground font-medium">Present</div>
              </Card>
              <Card className="p-4 text-center border-none bg-gradient-to-br from-secondary/10 to-secondary/5">
                <div className="text-4xl font-bold text-secondary mb-1">{totalAbsent}</div>
                <div className="text-xs text-muted-foreground font-medium">Absent</div>
              </Card>
            </div>
          </div>
        </Card>

        {/* Courses Attendance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {courses.map((course, index) => (
            <Card 
              key={course.id}
              style={{ animationDelay: `${index * 0.1}s` }}
              className="group p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-scale-in border-none overflow-hidden relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                      {course.name}
                    </h3>
                    <Badge variant="outline" className="font-mono text-xs">{course.code}</Badge>
                  </div>
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                    <span className="text-lg font-bold text-white">{course.percentage}%</span>
                  </div>
                </div>

                <Progress value={course.percentage} className="h-3 mb-4" />

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-accent">{course.present}</div>
                    <div className="text-xs text-muted-foreground">Present</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-destructive">{course.absent}</div>
                    <div className="text-xs text-muted-foreground">Absent</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-foreground">{course.total}</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Attendance */}
        <Card className="p-6 border-none animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Recent Attendance</h3>
              <p className="text-xs text-muted-foreground">Last 5 classes</p>
            </div>
          </div>

          <div className="space-y-3">
            {recentAttendance.map((record, index) => (
              <div 
                key={index}
                style={{ animationDelay: `${(index + 5) * 0.1}s` }}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors animate-fade-in-up"
              >
                <div className="flex items-center gap-3">
                  {record.status === "Present" ? (
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                      <XCircle className="h-5 w-5 text-destructive" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{record.course}</p>
                    <p className="text-xs text-muted-foreground">{record.code}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={record.status === "Present" ? "bg-accent text-white" : "bg-destructive text-white"}>
                    {record.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TeacherAttendance;
