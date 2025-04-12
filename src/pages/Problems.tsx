
import { useState, useMemo } from 'react';
import ProblemCard from '@/components/problems/ProblemCard';
import ProblemFilter from '@/components/problems/ProblemFilter';
import { mockProblems, mockUserProgress } from '@/data/mockData';

const Problems = () => {
  const [filters, setFilters] = useState({
    search: '',
    difficulty: [] as string[],
    topics: [] as string[],
  });

  const solvedProblemIds = mockUserProgress['2']?.solved || [];
  
  const filteredProblems = useMemo(() => {
    return mockProblems.filter(problem => {
      // Filter by search term
      if (filters.search && !problem.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // Filter by difficulty
      if (filters.difficulty.length > 0 && !filters.difficulty.includes(problem.difficulty)) {
        return false;
      }
      
      // Filter by topics
      if (filters.topics.length > 0 && !problem.topics.some(topic => filters.topics.includes(topic))) {
        return false;
      }
      
      return true;
    });
  }, [filters]);

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
        {filteredProblems.length > 0 ? (
          filteredProblems.map(problem => (
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
