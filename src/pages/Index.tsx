
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { CodeIcon, BookOpenIcon, AwardIcon, BarChartIcon } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="container px-4 mx-auto">
      {/* Hero Section */}
      <div className="py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Master Coding with SyntaxSprint</h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Practice programming problems, improve your skills, and track your progress with our interactive platform
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild>
            <Link to="/problems">Start Coding</Link>
          </Button>
          {!user && (
            <Button variant="outline" size="lg" asChild>
              <Link to="/register">Create Account</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg border shadow-sm">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <CodeIcon className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Diverse Problem Set</h2>
          <p className="text-muted-foreground">
            Practice with a wide range of coding challenges across different topics and difficulty levels
          </p>
        </div>
        
        <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg border shadow-sm">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <BookOpenIcon className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Interactive Code Editor</h2>
          <p className="text-muted-foreground">
            Write, run, and test your code directly in the browser with syntax highlighting
          </p>
        </div>
        
        <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg border shadow-sm">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <AwardIcon className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Progress Tracking</h2>
          <p className="text-muted-foreground">
            Monitor your performance, see your solved problems, and track your improvement
          </p>
        </div>
        
        <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg border shadow-sm">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <BarChartIcon className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Get insights into your coding patterns, strengths, and areas for improvement
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 text-center bg-muted rounded-xl p-8 mb-16">
        <h2 className="text-3xl font-bold mb-4">Ready to improve your coding skills?</h2>
        <p className="text-xl text-muted-foreground max-w-xl mx-auto mb-6">
          Join thousands of developers who are solving problems and building their skills on SyntaxSprint
        </p>
        <Button size="lg" asChild>
          <Link to={user ? "/problems" : "/register"}>
            {user ? "Start Practicing" : "Sign Up for Free"}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
