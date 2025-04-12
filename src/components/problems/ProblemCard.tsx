
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Problem } from '@/data/mockData';

interface ProblemCardProps {
  problem: Problem;
  isSolved?: boolean;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ problem, isSolved = false }) => {
  const difficultyColor = {
    easy: 'bg-green-100 text-green-800 hover:bg-green-200',
    medium: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    hard: 'bg-red-100 text-red-800 hover:bg-red-200'
  };
  
  return (
    <Link 
      to={`/problems/${problem.id}`}
      className="block p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium flex items-center gap-2">
            {problem.title}
            {isSolved && (
              <span className="text-syntax-success">✓</span>
            )}
          </h3>
          <div className="mt-1 flex flex-wrap gap-2">
            <Badge variant="outline" className={difficultyColor[problem.difficulty]}>
              {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
            </Badge>
            {problem.topics.slice(0, 3).map((topic) => (
              <Badge variant="outline" key={topic}>
                {topic}
              </Badge>
            ))}
          </div>
        </div>
        <div className="text-right">
          <span className="text-sm text-muted-foreground">
            {problem.acceptanceRate.toFixed(1)}% acceptance
          </span>
        </div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
        {problem.description}
      </p>
    </Link>
  );
};

export default ProblemCard;
