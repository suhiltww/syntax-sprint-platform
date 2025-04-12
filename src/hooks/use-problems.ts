
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  time_limit: number;
  memory_limit: number;
  constraints: string | null;
  input_format: string | null;
  output_format: string | null;
  created_at: string;
  topics?: string[];
  acceptanceRate?: number;
}

export interface TestCase {
  id: string;
  problem_id: string;
  input: string;
  output: string;
  is_sample: boolean;
}

// Fetch all problems
export function useProblems(filters: {
  search?: string;
  difficulty?: string[];
  topics?: string[];
} = {}) {
  return useQuery({
    queryKey: ['problems', filters],
    queryFn: async () => {
      let query = supabase
        .from('problems')
        .select(`
          *,
          problem_topic_mapping!inner(
            problem_topics(name)
          )
        `);

      // Apply filters
      if (filters.search) {
        query = query.ilike('title', `%${filters.search}%`);
      }
      
      if (filters.difficulty && filters.difficulty.length > 0) {
        query = query.in('difficulty', filters.difficulty);
      }

      const { data, error } = await query;
      
      if (error) {
        toast.error('Failed to load problems');
        throw error;
      }

      // Process results to extract topics
      const processedData = data.map(item => {
        const topics = item.problem_topic_mapping.map(
          (mapping: any) => mapping.problem_topics.name
        );
        
        // Calculate fake acceptance rate for now
        // In a real app, this would come from actual submission data
        const acceptanceRate = Math.floor(Math.random() * 40) + 60;
        
        return {
          ...item,
          topics,
          acceptanceRate,
          problem_topic_mapping: undefined,
        };
      });

      // Filter by topics if needed
      const filteredData = filters.topics && filters.topics.length > 0
        ? processedData.filter(problem => 
            problem.topics.some(topic => filters.topics?.includes(topic))
          )
        : processedData;

      return filteredData;
    }
  });
}

// Fetch a single problem by ID
export function useProblem(id: string | undefined) {
  return useQuery({
    queryKey: ['problem', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data: problem, error: problemError } = await supabase
        .from('problems')
        .select(`
          *,
          problem_topic_mapping(
            problem_topics(name)
          )
        `)
        .eq('id', id)
        .single();
      
      if (problemError) {
        toast.error('Failed to load problem');
        throw problemError;
      }

      // Get test cases
      const { data: testCases, error: testCasesError } = await supabase
        .from('test_cases')
        .select('*')
        .eq('problem_id', id)
        .eq('is_sample', true);
      
      if (testCasesError) {
        toast.error('Failed to load test cases');
        throw testCasesError;
      }

      // Format topics
      const topics = problem.problem_topic_mapping.map(
        (mapping: any) => mapping.problem_topics.name
      );
      
      return {
        ...problem,
        topics,
        problem_topic_mapping: undefined,
        sampleTestCases: testCases
      };
    },
    enabled: !!id
  });
}

// Fetch all topics
export function useTopics() {
  return useQuery({
    queryKey: ['topics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('problem_topics')
        .select('*');
      
      if (error) {
        toast.error('Failed to load topics');
        throw error;
      }
      
      return data;
    }
  });
}

// Create a new problem
export function useCreateProblem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      problem, 
      testCases, 
      topics 
    }: { 
      problem: Omit<Problem, 'id' | 'created_at'>, 
      testCases: Omit<TestCase, 'id' | 'problem_id'>[], 
      topics: string[]
    }) => {
      // Insert the problem
      const { data: newProblem, error: problemError } = await supabase
        .from('problems')
        .insert([problem])
        .select()
        .single();
      
      if (problemError) {
        toast.error('Failed to create problem');
        throw problemError;
      }
      
      // Get topic IDs
      const { data: topicsData, error: topicsError } = await supabase
        .from('problem_topics')
        .select('id, name')
        .in('name', topics);
      
      if (topicsError) {
        toast.error('Failed to fetch topics');
        throw topicsError;
      }
      
      // Create topic mappings
      const topicMappings = topicsData.map((topic: any) => ({
        problem_id: newProblem.id,
        topic_id: topic.id
      }));
      
      const { error: mappingError } = await supabase
        .from('problem_topic_mapping')
        .insert(topicMappings);
      
      if (mappingError) {
        toast.error('Failed to add topics to problem');
        throw mappingError;
      }
      
      // Insert test cases
      const formattedTestCases = testCases.map(tc => ({
        ...tc,
        problem_id: newProblem.id
      }));
      
      const { error: testCasesError } = await supabase
        .from('test_cases')
        .insert(formattedTestCases);
      
      if (testCasesError) {
        toast.error('Failed to add test cases');
        throw testCasesError;
      }
      
      return newProblem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] });
      toast.success('Problem created successfully');
    },
  });
}

export function useUserSolvedProblems(userId?: string) {
  return useQuery({
    queryKey: ['solved-problems', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      // Get unique problem IDs from successful submissions
      const { data, error } = await supabase
        .from('submissions')
        .select('problem_id')
        .eq('user_id', userId)
        .eq('status', 'accepted')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast.error('Failed to load solved problems');
        throw error;
      }
      
      // Extract unique problem IDs
      const uniqueProblemIds = [...new Set(data.map(item => item.problem_id))];
      
      return uniqueProblemIds;
    },
    enabled: !!userId
  });
}
