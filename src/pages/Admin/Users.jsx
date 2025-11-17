import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Search, Edit, Trash2, Mail } from 'lucide-react';
import { ROLES, ROLE_LABELS } from '@/constants/roles';

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // Mock data
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: ROLES.STUDENT, status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: ROLES.TEACHER, status: 'active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: ROLES.ADMIN, status: 'active' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: ROLES.STUDENT, status: 'inactive' },
  ];

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case ROLES.ADMIN: return 'bg-error text-white';
      case ROLES.TEACHER: return 'bg-secondary text-white';
      case ROLES.STUDENT: return 'bg-accent text-white';
      default: return 'bg-neutralDark text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="container mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-muted-foreground mt-1">Manage students, teachers, and administrators</p>
          </div>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>View and manage all system users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value={ROLES.ADMIN}>Admin</SelectItem>
                  <SelectItem value={ROLES.TEACHER}>Teacher</SelectItem>
                  <SelectItem value={ROLES.STUDENT}>Student</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-neutralLight transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {ROLE_LABELS[user.role]}
                    </Badge>
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
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
