import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, Users } from "lucide-react";

import { getAllCours, deleteCoursById } from "../../services/coursService";

export default function AdminCourses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all courses from server
  async function fetchCourses() {
    try {
      setLoading(true);
      const data = await getAllCours();

      // sanitize data to avoid undefined errors
      const sanitizedData = data.map((course) => ({
        id: course.id,
        name: course.name || "",
        code: course.code || "",
        department: course.department || "",
        teacher: course.teacher || "",
        students: course.students || 0,
       
      }));

      setCourses(sanitizedData);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  // Delete course
  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      await deleteCoursById(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete course:", err);
    }
  }

  // Filtering logic with safe checks
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      (course.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (course.code?.toLowerCase().includes(searchTerm.toLowerCase()) || false);

    const matchesDepartment =
      filterDepartment === "all" ||
      (course.department?.toLowerCase() === filterDepartment);

    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Course Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage all courses and their assignments
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Course
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Courses</CardTitle>
            <CardDescription>View and manage all system courses</CardDescription>
          </CardHeader>

          <CardContent>
            {/* Filters */}
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                  <SelectItem value="biology">Biology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Loading State */}
            {loading && <p className="text-center py-4">Loading courses...</p>}

            {/* Empty State */}
            {!loading && filteredCourses.length === 0 && (
              <p className="text-center py-4 text-muted-foreground">
                No courses found.
              </p>
            )}

            {/* Courses List */}
            <div className="space-y-3">
              {!loading &&
                filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-neutralLight transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                        {course.code.slice(0, 2)}
                      </div>

                      <div>
                        <p className="font-medium">{course.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {course.code} • {course.department}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <p className="text-sm font-medium">{course.teacher}</p>
                        <p className="text-xs text-muted-foreground">Teacher</p>
                      </div>

                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{course.students}</span>
                      </div>

                     
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(course.id)}
                      >
                        <Trash2 className="h-4 w-4 text-error" />
                      </Button>
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
