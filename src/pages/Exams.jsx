import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Award, TrendingUp, Clock, MapPin, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Exams = () => {
  const [filterStatus, setFilterStatus] = useState("all");

  const exams = [
    {
      id: 1,
      course: "Advanced JavaScript",
      code: "CS301",
      date: "2025-11-15",
      time: "09:00 AM",
      room: "Room 301",
      status: "Upcoming",
      type: "Midterm",
      color: "from-primary to-primary-light"
    },
    {
      id: 2,
      course: "Network Security",
      code: "SEC201",
      date: "2025-11-08",
      status: "Completed",
      grade: "A",
      score: 92,
      type: "Quiz",
      color: "from-secondary to-accent"
    },
    {
      id: 3,
      course: "Machine Learning",
      code: "DS301",
      date: "2025-11-20",
      time: "14:00 PM",
      room: "Room 405",
      status: "Upcoming",
      type: "Final",
      color: "from-accent to-secondary"
    },
    {
      id: 4,
      course: "Web Development",
      code: "CS101",
      date: "2025-10-30",
      status: "Completed",
      grade: "A-",
      score: 88,
      type: "Midterm",
      color: "from-primary to-secondary"
    },
    {
      id: 5,
      course: "Cryptography",
      code: "SEC202",
      date: "2025-11-12",
      time: "11:00 AM",
      room: "Lab 202",
      status: "Upcoming",
      type: "Midterm",
      color: "from-secondary to-primary"
    },
  ];

  const stats = [
    { label: "Current GPA", value: "3.85", icon: Award, color: "from-accent to-secondary" },
    { label: "Average Score", value: "90%", icon: TrendingUp, color: "from-primary to-accent" },
    { label: "Exams Taken", value: "24", icon: FileText, color: "from-secondary to-primary" },
    { label: "Upcoming", value: "3", icon: Calendar, color: "from-accent to-primary" },
  ];

  const filteredExams = filterStatus === "all" 
    ? exams 
    : exams.filter(e => e.status.toLowerCase() === filterStatus);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto p-6 md:p-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Exams & Grades
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your exam schedule and academic performance
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in-up">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={index}
                style={{ animationDelay: `${index * 0.1}s` }}
                className="group p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-none overflow-hidden relative animate-scale-in"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                
                <div className="relative z-10">
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Filter Tabs */}
        <Tabs value={filterStatus} onValueChange={setFilterStatus} className="mb-6">
          <TabsList className="grid w-full md:w-auto grid-cols-3 h-12">
            <TabsTrigger value="all" className="gap-2">
              <Filter className="h-4 w-4" />
              All Exams
            </TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Exams List */}
        <div className="space-y-4">
          {filteredExams.map((exam, index) => (
            <Card 
              key={exam.id}
              style={{ animationDelay: `${index * 0.1}s` }}
              className="group p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-scale-in border-none overflow-hidden relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${exam.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${exam.color} flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0 shadow-lg`}>
                    <FileText className="h-7 w-7 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {exam.course}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge variant="outline" className="font-mono">{exam.code}</Badge>
                      <Badge variant="secondary">{exam.type}</Badge>
                      <Badge 
                        className={exam.status === "Completed" ? "bg-accent text-white" : "bg-muted"}
                      >
                        {exam.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      {exam.time && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{exam.time}</span>
                        </div>
                      )}
                      {exam.room && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{exam.room}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {exam.status === "Completed" && (
                  <Card className="p-4 border-none bg-gradient-to-br from-accent/10 to-accent/5">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent mb-1">{exam.grade}</div>
                      <div className="text-sm text-muted-foreground">{exam.score}%</div>
                    </div>
                  </Card>
                )}

                {exam.status === "Upcoming" && (
                  <Button className="bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90">
                    Study Now
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Exams;
