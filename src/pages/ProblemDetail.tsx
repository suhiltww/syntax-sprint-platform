import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProblem } from '@/hooks/use-problems';
import { useCreateSubmission, useUserProblemSubmissions } from '@/hooks/use-submissions';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import CodeEditor from '@/components/code/CodeEditor';
import { format } from 'date-fns';

const ProblemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: problem, isLoading } = useProblem(id);
  const { user } = useAuth();
  const { data: submissions, isLoading: submissionsLoading } = 
    useUserProblemSubmissions(user?.id, id);
  const submitMutation = useCreateSubmission();
  
  const [activeTab, setActiveTab] = useState('description');
  const [code, setCode] = useState('// Write your code here');
  const [language, setLanguage] = useState('javascript');
  
  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
          <div className="space-y-2 mt-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!problem) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Problem not found</h1>
          <Link to="/problems">
            <Button>Back to Problems</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const renderDifficultyBadge = (difficulty: string) => {
    const colorMap = {
      easy: 'bg-green-100 text-green-800 hover:bg-green-100',
      medium: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
      hard: 'bg-red-100 text-red-800 hover:bg-red-100',
    };
    
    const color = colorMap[difficulty as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
    
    return (
      <Badge variant="outline" className={color}>
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </Badge>
    );
  };
  
  const handleSubmit = () => {
    if (!user) {
      toast.error('You must be logged in to submit a solution');
      return;
    }
    
    if (!code.trim()) {
      toast.error('Please write some code before submitting');
      return;
    }
    
    submitMutation.mutate({
      problemId: problem.id,
      code,
      language,
    });
  };
  
  return (
    <div className="container max-w-5xl py-8 px-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{problem.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            {renderDifficultyBadge(problem.difficulty)}
            
            <div className="flex flex-wrap gap-2">
              {problem.topics && problem.topics.map(topic => (
                <Badge key={topic} variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button onClick={handleSubmit} disabled={submitMutation.isPending}>
            {submitMutation.isPending ? 'Submitting...' : 'Submit Solution'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
              <TabsTrigger value="submissions" className="flex-1">My Submissions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Problem Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p>{problem.description}</p>
                  </div>
                </CardContent>
              </Card>
              
              {problem.input_format && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Input Format</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p>{problem.input_format}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {problem.output_format && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Output Format</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p>{problem.output_format}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {problem.constraints && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Constraints</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p>{problem.constraints}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {problem.sampleTestCases && problem.sampleTestCases.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Example Test Cases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {problem.sampleTestCases.map((testCase: any, index: number) => (
                        <div key={testCase.id} className="space-y-3">
                          <div>
                            <p className="font-semibold mb-1">Example {index + 1}:</p>
                            <div className="bg-muted p-3 rounded-md">
                              <p className="font-semibold text-sm">Input:</p>
                              <pre className="mt-1 text-sm whitespace-pre-wrap">{testCase.input}</pre>
                            </div>
                          </div>
                          <div>
                            <div className="bg-muted p-3 rounded-md">
                              <p className="font-semibold text-sm">Output:</p>
                              <pre className="mt-1 text-sm whitespace-pre-wrap">{testCase.output}</pre>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="submissions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Submissions</CardTitle>
                  <CardDescription>History of your submissions for this problem</CardDescription>
                </CardHeader>
                <CardContent>
                  {!user ? (
                    <p className="text-muted-foreground">Please log in to view your submissions</p>
                  ) : submissionsLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : submissions && submissions.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="text-left p-2">Status</th>
                            <th className="text-left p-2">Language</th>
                            <th className="text-left p-2">Time</th>
                            <th className="text-left p-2">Memory</th>
                            <th className="text-left p-2">Submitted</th>
                          </tr>
                        </thead>
                        <tbody>
                          {submissions.map((submission: any) => (
                            <tr key={submission.id} className="border-t hover:bg-muted/50">
                              <td className="p-2">
                                <span 
                                  className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                    submission.status === 'accepted' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {submission.status === 'accepted' ? 'Accepted' : 'Failed'}
                                </span>
                              </td>
                              <td className="p-2">{submission.language}</td>
                              <td className="p-2">{submission.execution_time} ms</td>
                              <td className="p-2">{submission.memory_used} MB</td>
                              <td className="p-2">
                                {format(new Date(submission.created_at), 'MMM d, yyyy HH:mm')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">You haven't submitted any solutions for this problem yet.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Solution</CardTitle>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="text-sm border rounded p-1"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="h-[600px] border rounded-md">
                <CodeEditor 
                  value={code}
                  onChange={setCode}
                  language={language}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;
