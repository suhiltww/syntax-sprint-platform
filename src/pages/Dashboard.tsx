
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BookOpen, Award, Clock, Flag } from 'lucide-react';
import { mockProblems, mockSubmissions, mockUserProgress } from '@/data/mockData';

const Dashboard = () => {
  const userProgress = mockUserProgress['2']; // Using the student user
  
  // Calculate stats
  const totalProblems = mockProblems.length;
  const solvedCount = userProgress?.solved.length || 0;
  const attemptedCount = userProgress?.attempted.length || 0;
  const solvedPercent = Math.round((solvedCount / totalProblems) * 100);
  
  // Calculate difficulty distribution
  const difficultyDistribution = [
    { name: 'Easy', value: mockProblems.filter(p => p.difficulty === 'easy' && userProgress?.solved.includes(p.id)).length },
    { name: 'Medium', value: mockProblems.filter(p => p.difficulty === 'medium' && userProgress?.solved.includes(p.id)).length },
    { name: 'Hard', value: mockProblems.filter(p => p.difficulty === 'hard' && userProgress?.solved.includes(p.id)).length },
  ];
  
  // Total counts by difficulty
  const totalByDifficulty = [
    { name: 'Easy', total: mockProblems.filter(p => p.difficulty === 'easy').length },
    { name: 'Medium', total: mockProblems.filter(p => p.difficulty === 'medium').length },
    { name: 'Hard', total: mockProblems.filter(p => p.difficulty === 'hard').length },
  ];

  // Recent activity
  const recentSubmissions = [...mockSubmissions]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  // Topic performance
  const topicPerformance = [
    { name: 'Arrays', solved: 2, total: 3 },
    { name: 'Strings', solved: 1, total: 1 },
    { name: 'Dynamic Programming', solved: 0, total: 1 },
    { name: 'Trees', solved: 0, total: 1 },
  ];

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="container px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Your Dashboard</h1>
        <p className="text-muted-foreground">Track your progress and performance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animated-list">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Solved</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{solvedCount} / {totalProblems}</div>
            <p className="text-xs text-muted-foreground">
              {solvedPercent}% of all problems
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 days</div>
            <p className="text-xs text-muted-foreground">
              Best: 7 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time per Problem</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22 min</div>
            <p className="text-xs text-muted-foreground">
              Last problem: 18 min
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acceptance Rate</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <p className="text-xs text-muted-foreground">
              3 accepted of 4 submissions
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Problems by Difficulty</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={totalByDifficulty.map((item, index) => ({
                    ...item,
                    solved: difficultyDistribution[index].value,
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" name="Total" fill="#8884d8" opacity={0.4} />
                  <Bar dataKey="solved" name="Solved" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Topic Performance</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topicPerformance}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 70, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="total" name="Total" fill="#8884d8" opacity={0.4} />
                  <Bar dataKey="solved" name="Solved" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {recentSubmissions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left py-3 px-4">Problem</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Language</th>
                      <th className="text-left py-3 px-4">Time</th>
                      <th className="text-left py-3 px-4">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSubmissions.map((submission) => {
                      const problem = mockProblems.find(p => p.id === submission.problemId);
                      return (
                        <tr key={submission.id} className="border-t">
                          <td className="py-3 px-4">
                            <Link 
                              to={`/problems/${problem?.id}`}
                              className="hover:text-accent hover:underline"
                            >
                              {problem?.title}
                            </Link>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${submission.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                                submission.status === 'wrong_answer' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {submission.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-4">{submission.language}</td>
                          <td className="py-3 px-4">{submission.runtime} ms</td>
                          <td className="py-3 px-4">
                            {new Date(submission.submittedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No submissions yet</p>
                <Button asChild className="mt-4">
                  <Link to="/problems">Solve Problems</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Difficulty Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={difficultyDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {difficultyDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              {['Easy', 'Medium', 'Hard'].map((name, index) => (
                <div key={name} className="flex items-center">
                  <div 
                    className="w-3 h-3 mr-1 rounded-full" 
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-sm">{name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
