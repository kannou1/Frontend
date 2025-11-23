import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, AlertCircle, CheckCircle2, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';
import { forgotPassword as forgotPasswordService } from '@/services/passwordService';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Invalid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateEmail()) return;

    setLoading(true);
    try {
      const data = await forgotPasswordService(email.trim());
      setSuccess(data.message || 'Password reset link sent! Check your inbox.');
      setEmail('');
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => navigate('/login');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 relative overflow-hidden">
      {/* Background animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-600/30 via-blue-600/30 to-cyan-600/30 rounded-full blur-3xl animate-pulse opacity-40"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-tr from-pink-600/30 via-purple-600/30 to-blue-600/30 rounded-full blur-3xl animate-pulse opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>

      <Card className="w-full max-w-md border border-slate-800/50 backdrop-blur-xl bg-slate-900/60 shadow-2xl shadow-purple-900/20 relative z-10 overflow-hidden">
        <CardHeader className="space-y-4 text-center pb-8 relative">
          <div className="flex justify-center mb-2">
            <div className="relative group cursor-default">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-75 animate-pulse"></div>
              <div className="relative h-24 w-24 rounded-3xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex items-center justify-center shadow-2xl border border-white/20">
                <KeyRound className="h-12 w-12 text-white drop-shadow-lg" />
                <Sparkles className="absolute top-2 right-2 h-4 w-4 text-cyan-300 animate-pulse" />
              </div>
            </div>
          </div>

          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Reset Password
          </CardTitle>
          <CardDescription className="text-slate-400">
            Enter your email to receive a reset link
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 relative">
          {error && (
            <Alert className="bg-red-950/50 text-red-300 border-red-800/50">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-emerald-950/50 text-emerald-300 border-emerald-800/50">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                className="pl-10"
                disabled={loading}
              />
            </div>
            {emailError && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {emailError}
              </p>
            )}
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>

          <Button onClick={handleBackToLogin} variant="outline" className="w-full" disabled={loading}>
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Login
          </Button>

          <p className="text-xs text-center text-slate-500">
            You'll receive an email with reset instructions
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
