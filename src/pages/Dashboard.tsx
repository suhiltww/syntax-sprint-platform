
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserSubmissions, useProblems, useUserSolvedProblems } from "@/hooks/use-problems";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

const Dashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { data: submissions = [], isLoading: submissionsLoading } = useUserSubmissions(user?.id);
  const { data: problems = [], isLoading: problemsLoading } = useProblems();
  const { data: solvedProblemIds = [], isLoading: solvedLoading } = useUserSolvedProblems(user?.id);
  
  const [activeTab, setActiveTab] = useState("overview");
  
  // Redirect to login if not authenticated
  if (!authLoading && !user) {
    return <Navigate to="/login" />;
  }
  
  // Calculate statistics
  const totalSolved = solvedProblemIds?.length || 0;
  const totalProblems = problems?.length || 0;
  const solvedPercentage = totalProblems ? Math.round((totalSolved / totalProblems) * 100) : 0;
  
  // Count problems by difficulty
  const problemsByDifficulty = {
    easy: problems?.filter(p => p.difficulty === 'easy').length || 0,
    medium: problems?.filter(p => p.difficulty === 'medium').length || 0,
    hard: problems?.filter(p => p.difficulty === 'hard').length || 0,
  };
  
  // Count solved problems by difficulty
  const solvedByDifficulty = {
    easy: 0,
    medium: 0,
    hard: 0,
  };
  
  // Calculate solved problems by difficulty
  if (!solvedLoading && !problemsLoading) {
    problems?.forEach(problem => {
      if (solvedProblemIds?.includes(problem.id)) {
        solvedByDifficulty[problem.difficulty as keyof typeof solvedByDifficulty]++;
      }
    });
  }
  
  // Get recent submissions
  const recentSubmissions = submissions?.slice(0, 5) || [];
  
  // Loading state
  const isLoading = authLoading || submissionsLoading || problemsLoading || solvedLoading;
  
  return (
    <div className="container px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Your Dashboard</h1>
        <p className="text-muted-foreground">Track your progress and performance</p>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Problems Solved
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-3xl font-bold">
                    {totalSolved} <span className="text-sm font-normal text-muted-foreground">/ {totalProblems}</span>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-3xl font-bold">{solvedPercentage}%</div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Submissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-3xl font-bold">{submissions.length}</div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Problem Difficulty Breakdown</CardTitle>
                <CardDescription>Your progress by difficulty level</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Easy</span>
                        <span>{solvedByDifficulty.easy} / {problemsByDifficulty.easy}</span>
                      </div>
                      <div className="h-2 bg-muted rounded overflow-hidden">
                        <div 
                          className="h-full bg-green-500" 
                          style={{ 
                            width: `${problemsByDifficulty.easy ? (solvedByDifficulty.easy / problemsByDifficulty.easy) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Medium</span>
                        <span>{solvedByDifficulty.medium} / {problemsByDifficulty.medium}</span>
                      </div>
                      <div className="h-2 bg-muted rounded overflow-hidden">
                        <div 
                          className="h-full bg-yellow-500" 
                          style={{ 
                            width: `${problemsByDifficulty.medium ? (solvedByDifficulty.medium / problemsByDifficulty.medium) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Hard</span>
                        <span>{solvedByDifficulty.hard} / {problemsByDifficulty.hard}</span>
                      </div>
                      <div className="h-2 bg-muted rounded overflow-hidden">
                        <div 
                          className="h-full bg-red-500" 
                          style={{ 
                            width: `${problemsByDifficulty.hard ? (solvedByDifficulty.hard / problemsByDifficulty.hard) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Submissions</CardTitle>
                <CardDescription>Your latest activity</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : recentSubmissions.length > 0 ? (
                  <div className="space-y-4">
                    {recentSubmissions.map((submission: any) => (
                      <div key={submission.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">{submission.problems.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(submission.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className={`inline-flex items-center text-xs px-2 py-1 rounded ${
                            submission.status === 'accepted' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {submission.status === 'accepted' ? 'Accepted' : 'Failed'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No submissions yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>Your Submissions</CardTitle>
              <CardDescription>History of all your code submissions</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : submissions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-sm">
                        <th className="text-left py-2 px-3">Problem</th>
                        <th className="text-left py-2 px-3">Status</th>
                        <th className="text-left py-2 px-3">Language</th>
                        <th className="text-left py-2 px-3">Runtime</th>
                        <th className="text-left py-2 px-3">Memory</th>
                        <th className="text-left py-2 px-3">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((submission: any) => (
                        <tr key={submission.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-3">
                            <div>
                              <p className="font-medium">{submission.problems.title}</p>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                                ${
                                  submission.problems.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
                                  submission.problems.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {submission.problems.difficulty.charAt(0).toUpperCase() + submission.problems.difficulty.slice(1)}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`inline-flex items-center text-xs px-2 py-1 rounded ${
                              submission.status === 'accepted' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {submission.status === 'accepted' ? 'Accepted' : 'Failed'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-sm">{submission.language}</td>
                          <td className="py-3 px-3 text-sm">{submission.execution_time} ms</td>
                          <td className="py-3 px-3 text-sm">{submission.memory_used} MB</td>
                          <td className="py-3 px-3 text-sm">{new Date(submission.created_at).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">You haven't submitted any solutions yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>Your coding performance over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Performance analytics will be available after more submissions.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
