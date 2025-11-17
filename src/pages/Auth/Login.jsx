import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ROUTES } from '@/constants/routes';
import { ROLES } from '@/constants/roles';
import { GraduationCap, Lock, Mail } from 'lucide-react';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function Login() {
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  const { role, loading: roleLoading } = useRole();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user && !roleLoading && role) {
      redirectByRole(role);
    }
  }, [user, role, roleLoading]);

  const redirectByRole = (userRole) => {
    switch (userRole) {
      case ROLES.ADMIN:
        navigate(ROUTES.ADMIN_DASHBOARD);
        break;
      case ROLES.TEACHER:
        navigate(ROUTES.TEACHER_DASHBOARD);
        break;
      case ROLES.STUDENT:
        navigate(ROUTES.STUDENT_DASHBOARD);
        break;
      default:
        navigate(ROUTES.LOGIN);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setErrors({});
    setLoading(true);

    try {
      const validated = loginSchema.parse({ email, password });
      
      const { data, error: signInError } = await signIn(validated.email, validated.password);

      if (signInError) {
        if (signInError.message.includes('Invalid')) {
          setError('Invalid email or password');
        } else {
          setError(signInError.message);
        }
        setLoading(false);
        return;
      }

      // Navigation handled by useEffect
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors = {};
        err.errors.forEach((error) => {
          fieldErrors[error.path[0]] = error.message;
        });
        setErrors(fieldErrors);
      } else {
        setError('An unexpected error occurred');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            EduNex Portal
          </CardTitle>
          <CardDescription>Sign in to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-error">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-error">{errors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-neutralLight rounded-lg">
            <p className="text-sm font-medium mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><strong>Admin:</strong> admin@edunex.com</p>
              <p><strong>Teacher:</strong> teacher@edunex.com</p>
              <p><strong>Student:</strong> student@edunex.com</p>
              <p className="mt-2"><strong>Password:</strong> password123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
