import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, XCircle, Clock, Calendar, Plus, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Requests = () => {
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [requestType, setRequestType] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const requests = [
    {
      id: 1,
      type: "Certificate Request",
      description: "Transcript for graduate school application",
      date: "2025-10-25",
      status: "Pending",
      color: "from-primary to-primary-light"
    },
    {
      id: 2,
      type: "Stage Request",
      description: "Summer internship at Tech Corp",
      date: "2025-10-20",
      status: "Approved",
      color: "from-accent to-secondary"
    },
    {
      id: 3,
      type: "Leave Request",
      description: "Medical appointment on Nov 5",
      date: "2025-10-22",
      status: "Pending",
      color: "from-secondary to-primary"
    },
    {
      id: 4,
      type: "Grade Appeal",
      description: "Review of Midterm Exam - CS101",
      date: "2025-10-18",
      status: "Rejected",
      color: "from-destructive to-red-600"
    },
    {
      id: 5,
      type: "Course Change",
      description: "Switch from Section A to Section B",
      date: "2025-10-15",
      status: "Approved",
      color: "from-primary to-accent"
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle2 className="h-4 w-4" />;
      case "Rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleSubmitRequest = () => {
    if (!requestType || !subject || !description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before submitting.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Request Submitted",
      description: "Your request has been submitted successfully and is pending review.",
    });

    setShowNewRequest(false);
    setRequestType("");
    setSubject("");
    setDescription("");
  };

  const stats = [
    { label: "Total", value: requests.length, color: "primary" },
    { label: "Pending", value: requests.filter(r => r.status === "Pending").length, color: "secondary" },
    { label: "Approved", value: requests.filter(r => r.status === "Approved").length, color: "accent" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <div className="container mx-auto p-6 md:p-8">
        <div className="mb-8 animate-fade-in flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              My Requests
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your academic and administrative requests
            </p>
          </div>
          <Button 
            className="bg-gradient-to-r from-primary via-secondary to-accent text-white hover:opacity-90 transition-opacity shadow-lg h-12 px-6"
            onClick={() => setShowNewRequest(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            New Request
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-in-up">
          {stats.map((stat, index) => (
            <Card 
              key={index}
              style={{ animationDelay: `${index * 0.1}s` }}
              className="p-6 border-none bg-gradient-to-br from-card to-muted/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-scale-in"
            >
              <div className="text-center">
                <div className={`text-4xl font-bold text-${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {requests.map((request, index) => (
            <Card 
              key={request.id}
              style={{ animationDelay: `${index * 0.1}s` }}
              className="group p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-scale-in border-none overflow-hidden relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${request.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${request.color} flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0 shadow-lg`}>
                    {getStatusIcon(request.status)}
                    <span className="sr-only">{request.type}</span>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {request.type}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {request.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(request.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

                <Badge 
                  className={`
                    ${request.status === "Approved" ? "bg-accent text-white" : ""}
                    ${request.status === "Rejected" ? "bg-destructive text-white" : ""}
                    ${request.status === "Pending" ? "bg-muted text-foreground" : ""}
                    text-sm px-4 py-2
                  `}
                >
                  {getStatusIcon(request.status)}
                  <span className="ml-2">{request.status}</span>
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        {/* New Request Dialog */}
        <Dialog open={showNewRequest} onOpenChange={setShowNewRequest}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Submit New Request
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              <div className="space-y-2">
                <Label htmlFor="type">Request Type</Label>
                <Select value={requestType} onValueChange={setRequestType}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select request type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="certificate">Certificate Request</SelectItem>
                    <SelectItem value="stage">Stage Request</SelectItem>
                    <SelectItem value="leave">Leave Request</SelectItem>
                    <SelectItem value="grade">Grade Appeal</SelectItem>
                    <SelectItem value="course">Course Change</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Brief description of your request"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about your request"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  className="flex-1 bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90"
                  onClick={handleSubmitRequest}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Request
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowNewRequest(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Requests;
