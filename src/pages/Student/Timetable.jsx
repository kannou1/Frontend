import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { MapPin, Clock, User, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Timetable = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(0);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00",
  ];
  
  const schedule = {
    Monday: {
      "09:00": { 
        course: "Advanced JavaScript", 
        room: "Room 301", 
        duration: 2,
        instructor: "Dr. Sarah Johnson",
        type: "Lecture"
      },
      "11:00": { 
        course: "Network Security Fundamentals", 
        room: "Lab 202", 
        duration: 2,
        instructor: "Dr. James Wilson",
        type: "Lab"
      },
      "14:00": { 
        course: "Machine Learning Basics", 
        room: "Room 405", 
        duration: 2,
        instructor: "Dr. Robert Taylor",
        type: "Lecture"
      },
    },
    Tuesday: {
      "10:00": { 
        course: "Web Development Fundamentals", 
        room: "Room 210", 
        duration: 2,
        instructor: "Prof. Michael Chen",
        type: "Lecture"
      },
      "13:00": { 
        course: "Cryptography & Encryption", 
        room: "Room 115", 
        duration: 2,
        instructor: "Dr. Amanda Lee",
        type: "Lecture"
      },
    },
    Wednesday: {
      "09:00": { 
        course: "Advanced JavaScript", 
        room: "Room 301", 
        duration: 2,
        instructor: "Dr. Sarah Johnson",
        type: "Lecture"
      },
      "11:00": { 
        course: "Data Analytics with Python", 
        room: "Lab 202", 
        duration: 2,
        instructor: "Prof. Lisa Anderson",
        type: "Lab"
      },
      "14:00": { 
        course: "Machine Learning Basics", 
        room: "Room 405", 
        duration: 2,
        instructor: "Dr. Robert Taylor",
        type: "Lecture"
      },
    },
    Thursday: {
      "10:00": { 
        course: "Web Development Fundamentals", 
        room: "Room 210", 
        duration: 2,
        instructor: "Prof. Michael Chen",
        type: "Lecture"
      },
      "13:00": { 
        course: "Network Security Fundamentals", 
        room: "Room 115", 
        duration: 2,
        instructor: "Dr. James Wilson",
        type: "Lecture"
      },
    },
    Friday: {
      "09:00": { 
        course: "Advanced JavaScript", 
        room: "Room 301", 
        duration: 2,
        instructor: "Dr. Sarah Johnson",
        type: "Tutorial"
      },
      "11:00": { 
        course: "Cryptography & Encryption", 
        room: "Lab 202", 
        duration: 2,
        instructor: "Dr. Amanda Lee",
        type: "Lab"
      },
    },
  };

  const getCellClass = (course) => {
    const colorMap = {
      "Advanced JavaScript": "from-primary/90 to-primary-light/90 border-primary",
      "Web Development Fundamentals": "from-primary/80 to-secondary/80 border-primary",
      "Network Security Fundamentals": "from-secondary/90 to-accent/90 border-secondary",
      "Cryptography & Encryption": "from-secondary/80 to-primary/80 border-secondary",
      "Machine Learning Basics": "from-accent/90 to-secondary/90 border-accent",
      "Data Analytics with Python": "from-accent/80 to-primary/80 border-accent",
    };
    return colorMap[course] || "from-muted/80 to-muted/90 border-border";
  };

  const getTodayIndex = () => {
    const today = new Date().getDay();
    return today === 0 ? -1 : today - 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <div className="container mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Weekly Timetable
          </h1>
          <p className="text-muted-foreground text-lg">
            Your class schedule for this week
          </p>
        </div>

        {/* Week Navigation */}
        <Card className="p-4 mb-6 border-none animate-fade-in-up">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeek(currentWeek - 1)}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous Week
            </Button>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Current Week</p>
              <p className="font-semibold">Fall 2025 - Week {Math.abs(currentWeek) + 1}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeek(currentWeek + 1)}
              className="gap-2"
            >
              Next Week
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Schedule Grid */}
        <div className="animate-scale-in">
          <div className="w-full max-w-none">
            {/* Days Header */}
            <div className="grid grid-cols-6 gap-2 mb-4">
              <div className="font-semibold text-sm text-muted-foreground text-center">Time</div>
              {days.map((day, index) => (
                <div
                  key={day}
                  className={`text-center ${getTodayIndex() === index ? 'text-primary font-bold' : 'font-semibold'}`}
                >
                  <div className="text-sm mb-1">{day}</div>
                  {getTodayIndex() === index && (
                    <Badge className="bg-primary text-white text-xs">Today</Badge>
                  )}
                </div>
              ))}
            </div>

            {/* Time Slots */}
            {timeSlots.map((time) => (
              <div key={time} className="grid grid-cols-6 gap-2 items-start mb-2">
                <div className="font-medium text-sm text-muted-foreground text-center py-2">
                  {time}
                </div>
                {days.map((day) => {
                  const courseData = schedule[day]?.[time];
                  if (courseData) {
                    return (
                      <Card
                        key={`${day}-${time}`}
                        style={{ gridRow: `span ${courseData.duration}` }}
                        onClick={() => setSelectedCourse({ ...courseData, day, time })}
                        className={`group p-2 cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border overflow-hidden relative animate-fade-in min-h-[80px]`}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${getCellClass(courseData.course)} opacity-90 group-hover:opacity-100 transition-opacity`} />
                        
                        <div className="relative z-10 text-white">
                          <div className="flex items-start justify-between mb-2">
                            <BookOpen className="h-5 w-5 flex-shrink-0" />
                            <Badge className="bg-white/20 text-white text-xs backdrop-blur-sm">
                              {courseData.type}
                            </Badge>
                          </div>
                          <h4 className="font-bold mb-2 text-sm leading-tight">
                            {courseData.course}
                          </h4>
                          <div className="space-y-1 text-xs opacity-90">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{courseData.room}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{courseData.duration}h</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  }
                  return <div key={`${day}-${time}`} />;
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Course Details Dialog */}
        <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {selectedCourse?.course}
              </DialogTitle>
            </DialogHeader>

            {selectedCourse && (
              <div className="space-y-6 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 border-none bg-gradient-to-br from-primary/10 to-primary/5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <Clock className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Day & Time</p>
                        <p className="font-semibold">{selectedCourse.day}, {selectedCourse.time}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 border-none bg-gradient-to-br from-secondary/10 to-secondary/5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                        <Clock className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="font-semibold">{selectedCourse.duration} hours</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 border-none bg-gradient-to-br from-accent/10 to-accent/5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="font-semibold">{selectedCourse.room}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 border-none bg-gradient-to-br from-primary/10 to-accent/10">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Type</p>
                        <p className="font-semibold">{selectedCourse.type}</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <Card className="p-5 border-none bg-muted/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Instructor</p>
                      <p className="font-semibold text-lg">{selectedCourse.instructor}</p>
                    </div>
                  </div>
                </Card>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90">
                    View Course Details
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Set Reminder
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Timetable;
