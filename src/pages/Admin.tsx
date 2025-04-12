
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateProblem, useTopics } from '@/hooks/use-problems';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

const Admin = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { data: topics = [], isLoading: topicsLoading } = useTopics();
  const createProblem = useCreateProblem();
  
  const [activeTab, setActiveTab] = useState('problems');
  
  // Problem form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    input_format: '',
    output_format: '',
    constraints: '',
    time_limit: 1000,
    memory_limit: 256,
  });
  
  // Selected topics
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  
  // Test cases
  const [testCases, setTestCases] = useState([
    { input: '', output: '', is_sample: true }
  ]);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'time_limit' || name === 'memory_limit' ? Number(value) : value
    }));
  };
  
  // Handle difficulty select change
  const handleDifficultyChange = (value: 'easy' | 'medium' | 'hard') => {
    setFormData(prev => ({ ...prev, difficulty: value }));
  };
  
  // Handle topic selection
  const handleTopicChange = (topicName: string) => {
    setSelectedTopics(prev => 
      prev.includes(topicName)
        ? prev.filter(t => t !== topicName)
        : [...prev, topicName]
    );
  };
  
  // Handle test case changes
  const handleTestCaseChange = (index: number, field: 'input' | 'output', value: string) => {
    const updatedTestCases = [...testCases];
    updatedTestCases[index] = { ...updatedTestCases[index], [field]: value };
    setTestCases(updatedTestCases);
  };
  
  // Add new test case
  const addTestCase = () => {
    setTestCases([...testCases, { input: '', output: '', is_sample: true }]);
  };
  
  // Remove test case
  const removeTestCase = (index: number) => {
    if (testCases.length > 1) {
      setTestCases(testCases.filter((_, i) => i !== index));
    }
  };
  
  // Submit new problem
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      toast.error('Please provide at least a title and description');
      return;
    }
    
    if (testCases.some(tc => !tc.input || !tc.output)) {
      toast.error('Please fill out all test cases or remove empty ones');
      return;
    }
    
    try {
      await createProblem.mutateAsync({
        problem: formData,
        testCases,
        topics: selectedTopics
      });
      
      // Reset form
      setFormData({
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
      setTestCases([{ input: '', output: '', is_sample: true }]);
    } catch (error) {
      // Error is handled in the mutation
    }
  };
  
  // Redirect if not an admin
  if (!authLoading && !user) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="container py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage problems, users, and platform settings
        </p>
      </div>
      
      <Tabs defaultValue="problems" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="problems">Problems</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="problems">
          <Card>
            <CardHeader>
              <CardTitle>Create New Problem</CardTitle>
              <CardDescription>
                Add a new coding problem to the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Problem Title</Label>
                      <Input 
                        id="title" 
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Reverse a String"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Problem Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Write a function that reverses a string..."
                        required
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty Level</Label>
                      <Select 
                        value={formData.difficulty} 
                        onValueChange={handleDifficultyChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="time_limit">Time Limit (ms)</Label>
                      <Input 
                        id="time_limit"
                        name="time_limit"
                        type="number"
                        min={100}
                        max={10000}
                        value={formData.time_limit}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="memory_limit">Memory Limit (MB)</Label>
                      <Input 
                        id="memory_limit"
                        name="memory_limit"
                        type="number"
                        min={16}
                        max={1024}
                        value={formData.memory_limit}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>Topics</Label>
                    {topicsLoading ? (
                      <div className="flex items-center space-x-2">
                        <Spinner size="sm" />
                        <span>Loading topics...</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {topics.map((topic: any) => (
                          <div key={topic.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`topic-${topic.id}`}
                              checked={selectedTopics.includes(topic.name)}
                              onCheckedChange={() => handleTopicChange(topic.name)}
                            />
                            <Label htmlFor={`topic-${topic.id}`} className="cursor-pointer">
                              {topic.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="input_format">Input Format</Label>
                    <Textarea
                      id="input_format"
                      name="input_format"
                      value={formData.input_format}
                      onChange={handleChange}
                      rows={3}
                      placeholder="The input consists of a string s..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="output_format">Output Format</Label>
                    <Textarea
                      id="output_format"
                      name="output_format"
                      value={formData.output_format}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Return the reversed string..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="constraints">Constraints</Label>
                    <Textarea
                      id="constraints"
                      name="constraints"
                      value={formData.constraints}
                      onChange={handleChange}
                      rows={3}
                      placeholder="1 <= s.length <= 10^5"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Test Cases</Label>
                      <Button type="button" size="sm" onClick={addTestCase}>
                        Add Test Case
                      </Button>
                    </div>
                    
                    {testCases.map((testCase, index) => (
                      <div key={index} className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">Test Case {index + 1}</h3>
                          {testCases.length > 1 && (
                            <Button 
                              type="button" 
                              variant="destructive" 
                              size="sm"
                              onClick={() => removeTestCase(index)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor={`input-${index}`}>Input</Label>
                            <Textarea
                              id={`input-${index}`}
                              value={testCase.input}
                              onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                              placeholder="Example input"
                              rows={2}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`output-${index}`}>Expected Output</Label>
                            <Textarea
                              id={`output-${index}`}
                              value={testCase.output}
                              onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                              placeholder="Example output"
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={createProblem.isPending}
                >
                  {createProblem.isPending ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Creating Problem...
                    </>
                  ) : 'Create Problem'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                View and manage user accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">User management features will be implemented soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Platform Analytics</CardTitle>
              <CardDescription>
                View platform usage statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Analytics features will be implemented soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
