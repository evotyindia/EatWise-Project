"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { LoaderCircle, History, FileText, CookingPot, BarChart3, Trash2, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// Define the structure of a report
interface Report {
  id: string;
  userId: string;
  type: 'label' | 'recipe' | 'nutrition';
  title: string;
  summary: string;
  createdAt: string; // ISO string
  // 'data' and 'userInput' will also be there but not needed for the list view
}

export default function HistoryPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    if (!loggedInUser.email) {
      router.replace(`/login?redirect=${pathname}`);
    } else {
      setUserEmail(loggedInUser.email);
      loadReports(loggedInUser.email);
      setIsCheckingAuth(false);
    }
  }, [router, pathname]);

  const loadReports = (email: string) => {
    const allUserReports = JSON.parse(localStorage.getItem("userReports") || "{}");
    const userReports = allUserReports[email] || [];
    // Sort by most recent first
    userReports.sort((a: Report, b: Report) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setReports(userReports);
  };
  
  const handleDeleteReport = (reportId: string) => {
    if (!userEmail) return;

    let allUserReports = JSON.parse(localStorage.getItem("userReports") || "{}");
    let userReports = allUserReports[userEmail] || [];
    
    // Filter out the report to be deleted
    const updatedReports = userReports.filter((report: Report) => report.id !== reportId);
    
    // Update the storage
    allUserReports[userEmail] = updatedReports;
    localStorage.setItem("userReports", JSON.stringify(allUserReports));
    
    // Update the state
    setReports(updatedReports);
    
    toast({ title: "Report Deleted", description: "The report has been removed from your history." });
  };

  const filterReports = (type: string) => {
    return reports.filter(report =>
      (type === 'all' || report.type === type) &&
      (report.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const ReportCard = ({ report }: { report: Report }) => {
    const icons = {
      label: <FileText className="h-6 w-6 text-primary" />,
      recipe: <CookingPot className="h-6 w-6 text-primary" />,
      nutrition: <BarChart3 className="h-6 w-6 text-primary" />,
    };

    return (
      <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
          <div className="mt-1">{icons[report.type]}</div>
          <div>
            <CardTitle>{report.title}</CardTitle>
            <CardDescription className="line-clamp-2">{report.summary}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex-grow"></CardContent>
        <CardFooter className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}</p>
          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon" className="h-8 w-8">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this report from your history.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeleteReport(report.id)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button asChild size="sm">
              <Link href={`/history/${report.id}`}>View Report</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  };
  
  const ReportList = ({ type }: { type: 'all' | 'label' | 'recipe' | 'nutrition' }) => {
      const filtered = filterReports(type);
      if (filtered.length === 0) {
          return <div className="text-center text-muted-foreground py-16">No reports found matching your criteria.</div>;
      }
      return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(report => <ReportCard key={report.id} report={report} />)}
          </div>
      );
  };


  if (isCheckingAuth) {
    return (
      <div className="container mx-auto py-8 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <LoaderCircle className="w-16 h-16 text-accent animate-spin mb-4" />
        <h1 className="text-2xl font-bold">Loading History...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 animate-fade-in-up">
      <div className="flex flex-col items-center mb-8 text-center">
        <History className="w-16 h-16 text-accent mb-4" />
        <h1 className="text-4xl font-bold tracking-tight">Your History</h1>
        <p className="mt-2 text-lg text-muted-foreground">Review your saved reports and recipes.</p>
      </div>

      <div className="relative mb-6 max-w-lg mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search reports by name..."
          className="pl-10 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="label">Label Reports</TabsTrigger>
          <TabsTrigger value="recipe">Recipes</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrients</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6"><ReportList type="all" /></TabsContent>
        <TabsContent value="label" className="mt-6"><ReportList type="label" /></TabsContent>
        <TabsContent value="recipe" className="mt-6"><ReportList type="recipe" /></TabsContent>
        <TabsContent value="nutrition" className="mt-6"><ReportList type="nutrition" /></TabsContent>
      </Tabs>
    </div>
  );
}
