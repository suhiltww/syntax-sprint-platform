
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useProblems, useTopics, useCreateProblem } from '@/hooks/use-problems';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';

interface TestCase {
  id?: string;
  input: string;
  output: string;
  explanation?: string;
  is_sample: boolean;
}

const Admin = () => {
  const { user, userRole, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchUserTerm, setSearchUserTerm] = useState('');
  
  // New problem state
  const [newProblem, setNewProblem] = useState({
    title: '',
    description: '',
    difficulty: 'medium',
    input_format: '',
    output_format: '',
    constraints: '',
    time_limit: 1000,
    memory_limit: 256,
  });
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [testCases, setTestCases] = useState<TestCase[]>([
    { input: '', output: '', explanation: '', is_sample: true }
  ]);
  
  // Fetch data
  const { data: problems = [], isLoading: problemsLoading } = useProblems();
  const { data: topics = [], isLoading: topicsLoading } = useTopics();
  const createProblemMutation = useCreateProblem();
  
  // Redirect non-admin users
  if (!authLoading && (!user || userRole !== 'admin')) {
    return <Navigate to="/" />;
  }
  
  const handleNewProblemChange = (field: string, value: string | number) => {
    setNewProblem(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleTestCaseChange = (index: number, field: string, value: string | boolean) => {
    const newTestCases = [...testCases];
    newTestCases[index] = { ...newTestCases[index], [field]: value };
    setTestCases(newTestCases);
  };
  
  const addTestCase = () => {
    setTestCases([...testCases, { input: '', output: '', explanation: '', is_sample: true }]);
  };
  
  const handleTopicToggle = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };
  
  const handleCreateProblem = async () => {
    try {
      // Validate form
      if (!newProblem.title) {
        toast.error('Please enter a problem title');
        return;
      }
      if (!newProblem.description) {
        toast.error('Please enter a problem description');
        return;
      }
      if (testCases.length === 0 || !testCases[0].input || !testCases[0].output) {
        toast.error('Please add at least one test case with input and output');
        return;
      }
      
      // Create problem
      await createProblemMutation.mutateAsync({
        problem: newProblem,
        testCases,
        topics: selectedTopics
      });
      
      // Reset form
      setNewProblem({
        title: '',
        description: '',
        difficulty: 'medium',
        input_format: '',
        output_format: '',
        constraints: '',
        time_limit: 1000,
        memory_limit: 256,
      });
      setSelectedTopics([]);
      setTestCases([{ input: '', output: '', explanation: '', is_sample: true }]);
      
    } catch (error) {
      console.error('Error creating problem:', error);
    }
  };
  
  // Filter problems based on search term
  const filteredProblems = problems.filter(problem => 
    problem.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Loading state
  const isLoading = authLoading || problemsLoading || topicsLoading;
  
  if (isLoading) {
    return (
      <div className="container px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        
        <div className="space-y-6">
          <Skeleton className="h-12 w-full" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-64 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage problems and users</p>
      </div>
      
      <Tabs defaultValue="problems" className="space-y-6">
        <TabsList>
          <TabsTrigger value="problems">Problems</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="problems">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle>Problem Management</CardTitle>
                <div className="flex gap-3">
                  <Input
                    placeholder="Search problems..."
                    className="max-w-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Create Problem</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Create New Problem</DialogTitle>
                        <DialogDescription>
                          Add a new coding problem to the platform
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Problem Title</label>
                            <Input 
                              placeholder="Enter problem title" 
                              value={newProblem.title}
                              onChange={(e) => handleNewProblemChange('title', e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Difficulty</label>
                            <Select 
                              value={newProblem.difficulty}
                              onValueChange={(value) => handleNewProblemChange('difficulty', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select difficulty" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="easy">Easy</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="hard">Hard</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Problem Topics</label>
                          <div className="border rounded-md p-4 flex flex-wrap gap-2">
                            {topics.map((topic) => (
                              <div key={topic.id} className="flex items-center">
                                <Checkbox
                                  id={`topic-${topic.id}`}
                                  checked={selectedTopics.includes(topic.name)}
                                  onCheckedChange={() => handleTopicToggle(topic.name)}
                                  className="mr-2"
                                />
                                <label htmlFor={`topic-${topic.id}`} className="text-sm">
                                  {topic.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Problem Description</label>
                          <Textarea 
                            placeholder="Write the problem description" 
                            rows={6}
                            value={newProblem.description}
                            onChange={(e) => handleNewProblemChange('description', e.target.value)}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Input Format</label>
                            <Textarea 
                              placeholder="Describe the input format" 
                              rows={3}
                              value={newProblem.input_format}
                              onChange={(e) => handleNewProblemChange('input_format', e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Output Format</label>
                            <Textarea 
                              placeholder="Describe the output format" 
                              rows={3}
                              value={newProblem.output_format}
                              onChange={(e) => handleNewProblemChange('output_format', e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Constraints</label>
                          <Textarea 
                            placeholder="Specify constraints" 
                            rows={3}
                            value={newProblem.constraints}
                            onChange={(e) => handleNewProblemChange('constraints', e.target.value)}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Time Limit (ms)</label>
                            <Input 
                              type="number" 
                              min={100}
                              value={newProblem.time_limit}
                              onChange={(e) => handleNewProblemChange('time_limit', parseInt(e.target.value))}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Memory Limit (MB)</label>
                            <Input 
                              type="number"
                              min={64}
                              value={newProblem.memory_limit}
                              onChange={(e) => handleNewProblemChange('memory_limit', parseInt(e.target.value))}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <label className="text-sm font-medium">Sample Test Cases</label>
                          {testCases.map((testCase, index) => (
                            <div key={index} className="border rounded-md p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-2">
                                  <label className="text-xs font-medium">Input</label>
                                  <Textarea 
                                    placeholder="Sample input" 
                                    rows={3}
                                    value={testCase.input}
                                    onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-xs font-medium">Output</label>
                                  <Textarea 
                                    placeholder="Sample output" 
                                    rows={3}
                                    value={testCase.output}
                                    onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-medium">Explanation</label>
                                <Textarea 
                                  placeholder="Explanation for sample test case" 
                                  rows={2}
                                  value={testCase.explanation || ''}
                                  onChange={(e) => handleTestCaseChange(index, 'explanation', e.target.value)}
                                />
                              </div>
                            </div>
                          ))}
                          <Button variant="outline" type="button" onClick={addTestCase}>
                            Add Another Test Case
                          </Button>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => {}}>
                          Cancel
                        </Button>
                        <Button 
                          type="button" 
                          onClick={handleCreateProblem}
                          disabled={createProblemMutation.isPending}
                        >
                          {createProblemMutation.isPending ? 'Creating...' : 'Save Problem'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left py-3 px-4">ID</th>
                      <th className="text-left py-3 px-4">Title</th>
                      <th className="text-left py-3 px-4">Difficulty</th>
                      <th className="text-left py-3 px-4">Topics</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProblems.map((problem) => (
                      <tr key={problem.id} className="border-t">
                        <td className="py-3 px-4">{problem.id.substring(0, 8)}...</td>
                        <td className="py-3 px-4">{problem.title}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${
                              problem.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
                              problem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {problem.topics.slice(0, 2).map((topic) => (
                              <span 
                                key={topic} 
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-accent/10 text-accent-foreground"
                              >
                                {topic}
                              </span>
                            ))}
                            {problem.topics.length > 2 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground">
                                +{problem.topics.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => navigate(`/problems/${problem.id}`)}>View</Button>
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm" className="text-destructive">Delete</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle>User Management</CardTitle>
                <Input
                  placeholder="Search users..."
                  className="max-w-sm"
                  value={searchUserTerm}
                  onChange={(e) => setSearchUserTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">User management is available in the full version.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Total Problems</dt>
                    <dd className="font-bold">{problems.length}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Easy Problems</dt>
                    <dd className="font-bold">{problems.filter(p => p.difficulty === 'easy').length}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Medium Problems</dt>
                    <dd className="font-bold">{problems.filter(p => p.difficulty === 'medium').length}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Hard Problems</dt>
                    <dd className="font-bold">{problems.filter(p => p.difficulty === 'hard').length}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Topic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  {topics.slice(0, 10).map(topic => (
                    <div key={topic.id} className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">{topic.name}</dt>
                      <dd className="font-bold">
                        {problems.filter(p => p.topics.includes(topic.name)).length}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
