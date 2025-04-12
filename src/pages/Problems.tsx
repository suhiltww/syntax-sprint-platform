
import { useState } from 'react';
import ProblemCard from '@/components/problems/ProblemCard';
import ProblemFilter from '@/components/problems/ProblemFilter';
import { useProblems, useUserSolvedProblems, Problem } from '@/hooks/use-problems';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

const Problems = () => {
  const [filters, setFilters] = useState({
    search: '',
    difficulty: [] as ('easy' | 'medium' | 'hard')[],
    topics: [] as string[],
  });

  const { user } = useAuth();
  const { data: problems, isLoading } = useProblems(filters);
  const { data: solvedProblemIds = [] } = useUserSolvedProblems(user?.id);
  
  return (
    <div className="container py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Coding Problems</h1>
        <p className="text-muted-foreground">
          Practice your programming skills with these curated problems
        </p>
      </div>
      
      <div className="mb-6">
        <ProblemFilter onFilterChange={setFilters} />
      </div>
      
      <div className="space-y-4 animated-list">
        {isLoading ? (
          // Skeleton loading state
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-6 shadow-sm">
              <Skeleton className="h-6 w-1/3 mb-4" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          ))
        ) : problems && problems.length > 0 ? (
          problems.map((problem: Problem) => (
            <ProblemCard 
              key={problem.id} 
              problem={problem} 
              isSolved={solvedProblemIds.includes(problem.id)}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No problems match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Problems;
