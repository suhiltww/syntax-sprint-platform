
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import { mockProblems, mockUsers } from '@/data/mockData';

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
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
                  <Button>Create Problem</Button>
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
                      <th className="text-left py-3 px-4">Acceptance</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockProblems.filter(problem => 
                      problem.title.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((problem) => (
                      <tr key={problem.id} className="border-t">
                        <td className="py-3 px-4">{problem.id}</td>
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
                        <td className="py-3 px-4">{problem.acceptanceRate.toFixed(1)}%</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
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
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Create New Problem</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Problem Title</label>
                    <Input placeholder="Enter problem title" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Difficulty</label>
                    <Select>
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
                  <label className="text-sm font-medium">Problem Description</label>
                  <Textarea placeholder="Write the problem description" rows={6} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Input Format</label>
                    <Textarea placeholder="Describe the input format" rows={3} />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Output Format</label>
                    <Textarea placeholder="Describe the output format" rows={3} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Constraints</label>
                  <Textarea placeholder="Specify constraints" rows={3} />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sample Test Cases</label>
                  <div className="border rounded-md p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium">Input</label>
                        <Textarea placeholder="Sample input" rows={3} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium">Output</label>
                        <Textarea placeholder="Sample output" rows={3} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Explanation</label>
                      <Textarea placeholder="Explanation for sample test case" rows={2} />
                    </div>
                    <Button className="mt-4" variant="outline" type="button">Add Another Test Case</Button>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={() => toast.success('Problem saved successfully!')}>Save Problem</Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </form>
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
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left py-3 px-4">ID</th>
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Role</th>
                      <th className="text-left py-3 px-4">Joined</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockUsers.map((user) => (
                      <tr key={user.id} className="border-t">
                        <td className="py-3 px-4">{user.id}</td>
                        <td className="py-3 px-4">{user.name}</td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}
                          >
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">View</Button>
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
        
        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Total Users</dt>
                    <dd className="font-bold">{mockUsers.length}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Total Problems</dt>
                    <dd className="font-bold">{mockProblems.length}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Total Submissions</dt>
                    <dd className="font-bold">4</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Average Acceptance Rate</dt>
                    <dd className="font-bold">75%</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Problem Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Easy Problems</dt>
                    <dd className="font-bold">{mockProblems.filter(p => p.difficulty === 'easy').length}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Medium Problems</dt>
                    <dd className="font-bold">{mockProblems.filter(p => p.difficulty === 'medium').length}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Hard Problems</dt>
                    <dd className="font-bold">{mockProblems.filter(p => p.difficulty === 'hard').length}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Topics Covered</dt>
                    <dd className="font-bold">
                      {new Set(mockProblems.flatMap(p => p.topics)).size}
                    </dd>
                  </div>
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
