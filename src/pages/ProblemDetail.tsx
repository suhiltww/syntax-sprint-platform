
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
import { ArrowLeft, Clock, Database } from 'lucide-react';
import { mockProblems, mockUserProgress } from '@/data/mockData';

const ProblemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const problem = mockProblems.find(p => p.id === id);
  
  const [activeTab, setActiveTab] = useState('description');
  
  if (!problem) {
    return (
      <div className="container py-12 text-center">
        <p className="text-xl">Problem not found</p>
        <Button asChild className="mt-4">
          <Link to="/problems">Back to Problems</Link>
        </Button>
      </div>
    );
  }

  const isSolved = mockUserProgress['2']?.solved.includes(problem.id) || false;

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
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{problem.title}</h1>
              {isSolved && <span className="text-syntax-success text-xl">✓</span>}
            </div>
            
            <div className="flex flex-wrap mt-2 gap-2">
              <Badge variant="outline" className={
                problem.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                problem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }>
                {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
              </Badge>
              
              {problem.topics.map(topic => (
                <Badge variant="outline" key={topic}>
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{problem.timeLimit} ms</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Database className="h-4 w-4" />
              <span>{problem.memoryLimit} MB</span>
            </div>
          </div>
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
            
            <TabsContent value="description" className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Problem Statement</h3>
                <p className="whitespace-pre-line">{problem.description}</p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-2">Constraints</h3>
                <pre className="text-sm font-mono bg-muted p-3 rounded overflow-x-auto">
                  {problem.constraints}
                </pre>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-2">Input Format</h3>
                <p>{problem.inputFormat}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Output Format</h3>
                <p>{problem.outputFormat}</p>
              </div>
              
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
                      {testCase.explanation && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Explanation:</p>
                          <p className="text-sm">{testCase.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="solution">
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Solutions will be available after you solve the problem or in the premium version.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="submissions">
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  You haven't submitted any solutions yet.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Code Editor</h2>
          <CodeEditor />
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;
