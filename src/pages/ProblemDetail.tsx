
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import CodeEditor from '@/components/code/CodeEditor';
import { ArrowLeft, Clock, Database, Send, Play } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProblem, useUserSolvedProblems } from '@/hooks/use-problems';
import { useUserProblemSubmissions, useCreateSubmission } from '@/hooks/use-submissions';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const codeTemplates = {
  python: '# Write your code here\n\ndef solution():\n    # Your solution logic\n    pass\n\n# Test your solution\nsolution()',
  javascript: '// Write your code here\n\nfunction solution() {\n  // Your solution logic\n}\n\n// Test your solution\nsolution();',
  cpp: '#include <iostream>\nusing namespace std;\n\n// Write your code here\n\nint main() {\n  // Your solution logic\n  return 0;\n}'
};

const ProblemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('description');
  const [code, setCode] = useState(codeTemplates.python);
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  
  const { data: problem, isLoading, error } = useProblem(id);
  const { data: submissions = [] } = useUserProblemSubmissions(user?.id, id);
  const { data: solvedProblemIds = [] } = useUserSolvedProblems(user?.id);
  const createSubmission = useCreateSubmission();
  
  const isSolved = solvedProblemIds.includes(id || '');

  const handleRun = () => {
    if (!user) {
      toast.error('Please log in to run code');
      return;
    }
    
    setIsRunning(true);
    setOutput('');
    
    // Simulate code execution with timeout
    setTimeout(() => {
      // In a real app, this would send the code to a backend for execution
      setOutput('Output will appear here...\n\nThis is a simulation. In a real app, the code would be executed on the server.\n\nStatus: Success');
      setIsRunning(false);
    }, 1500);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please log in to submit solutions');
      return;
    }
    
    if (!id) return;
    
    try {
      // In a real app, the backend would evaluate the solution against test cases
      // Here we'll just simulate success with a random chance of failure
      const isSuccessful = Math.random() > 0.3;
      
      await createSubmission.mutateAsync({
        problemId: id,
        language,
        code,
        status: isSuccessful ? 'accepted' : 'wrong_answer',
      });
      
      setActiveTab('submissions');
    } catch (error) {
      console.error('Error submitting solution:', error);
    }
  };
  
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setCode(codeTemplates[lang as keyof typeof codeTemplates]);
  };
  
  if (error) {
    return (
      <div className="container py-12 text-center">
        <p className="text-xl">Problem not found</p>
        <Button asChild className="mt-4">
          <Link to="/problems">Back to Problems</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/problems">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Problems
          </Link>
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-64 mb-2" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{problem?.title}</h1>
                  {isSolved && <span className="text-green-500 text-xl">✓</span>}
                </div>
                
                <div className="flex flex-wrap mt-2 gap-2">
                  <Badge variant="outline" className={
                    problem?.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    problem?.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {problem?.difficulty?.charAt(0).toUpperCase() + problem?.difficulty?.slice(1)}
                  </Badge>
                  
                  {problem?.topics?.map(topic => (
                    <Badge variant="outline" key={topic}>
                      {topic}
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </div>
          
          {!isLoading && (
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{problem?.time_limit} ms</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Database className="h-4 w-4" />
                <span>{problem?.memory_limit} MB</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="solution">Solution</TabsTrigger>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
            </TabsList>
            
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <>
                <TabsContent value="description" className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Problem Statement</h3>
                    <p className="whitespace-pre-line">{problem?.description}</p>
                  </div>
                  
                  {problem?.constraints && (
                    <>
                      <Separator />
                      
                      <div>
                        <h3 className="font-semibold mb-2">Constraints</h3>
                        <pre className="text-sm font-mono bg-muted p-3 rounded overflow-x-auto">
                          {problem.constraints}
                        </pre>
                      </div>
                    </>
                  )}
                  
                  <Separator />
                  
                  {problem?.input_format && (
                    <div>
                      <h3 className="font-semibold mb-2">Input Format</h3>
                      <p>{problem.input_format}</p>
                    </div>
                  )}
                  
                  {problem?.output_format && (
                    <div>
                      <h3 className="font-semibold mb-2">Output Format</h3>
                      <p>{problem.output_format}</p>
                    </div>
                  )}
                  
                  {problem?.sampleTestCases && problem.sampleTestCases.length > 0 && (
                    <>
                      <Separator />
                      
                      <div>
                        <h3 className="font-semibold mb-2">Examples</h3>
                        <div className="space-y-4">
                          {problem.sampleTestCases.map((testCase, index) => (
                            <div key={index} className="space-y-2">
                              <h4 className="font-medium">Example {index + 1}</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Input:</p>
                                  <pre className="bg-muted p-2 rounded text-sm font-mono overflow-x-auto">
                                    {testCase.input}
                                  </pre>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Output:</p>
                                  <pre className="bg-muted p-2 rounded text-sm font-mono overflow-x-auto">
                                    {testCase.output}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </TabsContent>
                
                <TabsContent value="solution">
                  {isSolved ? (
                    <div className="space-y-4">
                      <h3 className="font-semibold mb-2">Official Solution</h3>
                      <p>Congratulations on solving this problem! Here's the official solution:</p>
                      
                      <pre className="bg-muted p-4 rounded text-sm font-mono overflow-x-auto">
                        # This would contain the official solution code
                        # In a real app, this would be a well-commented,
                        # efficient solution to the problem.
                      </pre>
                      
                      <h3 className="font-semibold mt-4 mb-2">Explanation</h3>
                      <p>
                        This is where the explanation for the solution would go,
                        including time and space complexity analysis.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        Solutions will be available after you solve the problem or in the premium version.
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="submissions">
                  {!user ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground mb-4">
                        Please log in to see your submissions.
                      </p>
                      <Button onClick={() => navigate('/login')}>
                        Log In
                      </Button>
                    </div>
                  ) : submissions.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="font-semibold mb-2">Your Submissions</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b text-sm">
                              <th className="text-left py-2 px-3">Date</th>
                              <th className="text-left py-2 px-3">Status</th>
                              <th className="text-left py-2 px-3">Language</th>
                              <th className="text-left py-2 px-3">Runtime</th>
                              <th className="text-left py-2 px-3">Memory</th>
                            </tr>
                          </thead>
                          <tbody>
                            {submissions.map(submission => (
                              <tr key={submission.id} className="border-b hover:bg-muted/50">
                                <td className="py-2 px-3 text-sm">
                                  {new Date(submission.created_at).toLocaleString()}
                                </td>
                                <td className="py-2 px-3">
                                  <span className={`inline-flex items-center text-xs px-2 py-1 rounded ${
                                    submission.status === 'accepted' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {submission.status === 'accepted' ? 'Accepted' : 'Failed'}
                                  </span>
                                </td>
                                <td className="py-2 px-3 text-sm">{submission.language}</td>
                                <td className="py-2 px-3 text-sm">{submission.execution_time} ms</td>
                                <td className="py-2 px-3 text-sm">{submission.memory_used} MB</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        You haven't submitted any solutions yet.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
        
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Code Editor</h2>
            <div className="flex items-center gap-2">
              <select 
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="text-sm border rounded px-2 py-1 bg-background"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="cpp">C++</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4 h-[400px] border rounded">
            <CodeEditor 
              value={code}
              onChange={setCode}
              language={language}
            />
          </div>
          
          <div className="flex justify-between">
            <div className="flex gap-3">
              <Button 
                onClick={handleRun} 
                variant="outline"
                disabled={isRunning || isLoading}
              >
                <Play className="mr-1 h-4 w-4" />
                Run
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isRunning || isLoading || createSubmission.isPending || !user}
              >
                <Send className="mr-1 h-4 w-4" />
                Submit
              </Button>
            </div>
            
            {!user && (
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Log in to submit
              </Button>
            )}
          </div>
          
          {output && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Output:</h3>
              <div className="bg-muted p-3 rounded font-mono text-sm whitespace-pre-wrap overflow-auto max-h-[200px]">
                {output}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;
