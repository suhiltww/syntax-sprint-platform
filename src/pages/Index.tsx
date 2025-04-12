
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Code, Brain, Trophy, BookOpen, Zap, Users } from 'lucide-react';

const Index = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-background to-secondary/30">
        <div className="container max-w-6xl mx-auto text-center">
          <div className="mb-8 inline-flex items-center justify-center gap-2 rounded-full bg-accent/10 px-3 py-1">
            <span className="text-sm font-medium text-accent">A new way to practice coding</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Master Programming<br /> Through <span className="text-accent">Practice</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Enhance your coding skills with hundreds of challenges. From algorithms to data structures, prepare for technical interviews and improve your problem-solving abilities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/problems">
                Start Practicing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/register">Create Account</Link>
            </Button>
          </div>
          
          <div className="mt-16 bg-card border rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
            <div className="text-left">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-lg">Two Sum Problem</h3>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Easy</span>
              </div>
              <p className="text-muted-foreground mb-4 text-sm">
                Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
              </p>
              <div className="bg-muted p-4 rounded-md mb-4 font-mono text-xs md:text-sm">
                <p>Input: nums = [2,7,11,15], target = 9</p>
                <p>Output: [0,1]</p>
                <p>Explanation: Because nums[0] + nums[1] == 9, we return [0, 1]</p>
              </div>
              <div className="flex justify-end">
                <Button size="sm" asChild>
                  <Link to="/problems/1">Solve Problem</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4 bg-card">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose SyntaxSprint?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform is designed to help you become a better programmer through regular practice and real-world problem-solving.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animated-list">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Curated Problems</h3>
                <p className="text-muted-foreground">
                  Hundreds of hand-picked coding challenges, organized by topic and difficulty level.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Skill Development</h3>
                <p className="text-muted-foreground">
                  Improve algorithmic thinking and problem-solving abilities through regular practice.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Interview Preparation</h3>
                <p className="text-muted-foreground">
                  Practice problems commonly asked in technical interviews at top tech companies.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">In-depth Solutions</h3>
                <p className="text-muted-foreground">
                  Detailed explanations and multiple approaches for each problem to enhance learning.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Real-time Feedback</h3>
                <p className="text-muted-foreground">
                  Instant evaluation of your code with performance metrics and test cases.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Community Learning</h3>
                <p className="text-muted-foreground">
                  Connect with other programmers, share solutions, and learn from different approaches.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 px-4 bg-accent/5">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to improve your coding skills?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are enhancing their programming abilities through consistent practice.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/register">Get Started for Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/problems">Browse Problems</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
