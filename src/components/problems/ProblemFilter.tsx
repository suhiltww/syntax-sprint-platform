
import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';

interface ProblemFilterProps {
  onFilterChange: (filters: {
    search: string;
    difficulty: string[];
    topics: string[];
  }) => void;
}

const difficulties = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

const topics = [
  { value: 'arrays', label: 'Arrays' },
  { value: 'strings', label: 'Strings' },
  { value: 'hash-table', label: 'Hash Table' },
  { value: 'dynamic-programming', label: 'Dynamic Programming' },
  { value: 'math', label: 'Math' },
  { value: 'sorting', label: 'Sorting' },
  { value: 'greedy', label: 'Greedy' },
  { value: 'depth-first-search', label: 'Depth-First Search' },
  { value: 'binary-search', label: 'Binary Search' },
  { value: 'breadth-first-search', label: 'Breadth-First Search' },
  { value: 'tree', label: 'Tree' },
  { value: 'binary-tree', label: 'Binary Tree' },
  { value: 'matrix', label: 'Matrix' },
  { value: 'heap', label: 'Heap' },
  { value: 'graph', label: 'Graph' },
  { value: 'linked-list', label: 'Linked List' },
  { value: 'recursion', label: 'Recursion' },
  { value: 'stack', label: 'Stack' },
  { value: 'queue', label: 'Queue' },
];

const ProblemFilter: React.FC<ProblemFilterProps> = ({ onFilterChange }) => {
  const [search, setSearch] = useState('');
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [openDifficulty, setOpenDifficulty] = useState(false);
  const [openTopics, setOpenTopics] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    setSearch(newSearch);
    onFilterChange({
      search: newSearch,
      difficulty: selectedDifficulties,
      topics: selectedTopics,
    });
  };

  const toggleDifficulty = (value: string) => {
    const newDifficulties = selectedDifficulties.includes(value)
      ? selectedDifficulties.filter(x => x !== value)
      : [...selectedDifficulties, value];
    
    setSelectedDifficulties(newDifficulties);
    onFilterChange({
      search,
      difficulty: newDifficulties,
      topics: selectedTopics,
    });
  };

  const toggleTopic = (value: string) => {
    const newTopics = selectedTopics.includes(value)
      ? selectedTopics.filter(x => x !== value)
      : [...selectedTopics, value];
    
    setSelectedTopics(newTopics);
    onFilterChange({
      search,
      difficulty: selectedDifficulties,
      topics: newTopics,
    });
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedDifficulties([]);
    setSelectedTopics([]);
    onFilterChange({
      search: '',
      difficulty: [],
      topics: [],
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <Input
          placeholder="Search problems..."
          value={search}
          onChange={handleSearchChange}
          className="w-full sm:w-auto sm:flex-1"
        />
        
        <div className="flex gap-2">
          <Popover open={openDifficulty} onOpenChange={setOpenDifficulty}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-between w-full sm:w-auto">
                {selectedDifficulties.length > 0 
                  ? `${selectedDifficulties.length} Difficulties`
                  : 'Difficulty'}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search difficulty..." />
                <CommandEmpty>No difficulty found.</CommandEmpty>
                <CommandGroup>
                  {difficulties.map((difficulty) => (
                    <CommandItem
                      key={difficulty.value}
                      onSelect={() => toggleDifficulty(difficulty.value)}
                    >
                      <div className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border ${
                        selectedDifficulties.includes(difficulty.value)
                          ? 'bg-primary border-primary'
                          : 'border-muted-foreground'
                      }`}>
                        {selectedDifficulties.includes(difficulty.value) && (
                          <Check className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                      <span>{difficulty.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          
          <Popover open={openTopics} onOpenChange={setOpenTopics}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-between w-full sm:w-auto">
                {selectedTopics.length > 0 
                  ? `${selectedTopics.length} Topics`
                  : 'Topics'}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search topics..." />
                <CommandEmpty>No topic found.</CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-auto">
                  {topics.map((topic) => (
                    <CommandItem
                      key={topic.value}
                      onSelect={() => toggleTopic(topic.value)}
                    >
                      <div className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border ${
                        selectedTopics.includes(topic.value)
                          ? 'bg-primary border-primary'
                          : 'border-muted-foreground'
                      }`}>
                        {selectedTopics.includes(topic.value) && (
                          <Check className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                      <span>{topic.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        
        <Button variant="ghost" onClick={resetFilters} className="sm:self-end">
          Reset
        </Button>
      </div>
    </div>
  );
};

export default ProblemFilter;
