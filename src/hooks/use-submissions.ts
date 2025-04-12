
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Submission {
  id: string;
  user_id: string;
  problem_id: string;
  language: string;
  code: string;
  status: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'runtime_error' | 'compile_error' | null;
  execution_time: number | null;
  memory_used: number | null;
  created_at: string;
}

// Fetch user submissions for a specific problem
export function useUserProblemSubmissions(userId?: string, problemId?: string) {
  return useQuery({
    queryKey: ['submissions', userId, problemId],
    queryFn: async () => {
      if (!userId || !problemId) return [];

      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', userId)
        .eq('problem_id', problemId)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to load submissions');
        throw error;
      }

      return data as Submission[];
    },
    enabled: !!userId && !!problemId
  });
}

// Fetch all user submissions
export function useUserSubmissions(userId?: string) {
  return useQuery({
    queryKey: ['submissions', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          problems(title, difficulty)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to load submissions');
        throw error;
      }

      return data;
    },
    enabled: !!userId
  });
}

// Create a new submission
export function useCreateSubmission() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      problemId, 
      language, 
      code,
      status = 'accepted', // In a real app, this would be determined by judging
      executionTime = Math.floor(Math.random() * 100) + 10, // Mock execution time
      memoryUsed = Math.floor(Math.random() * 50) + 20 // Mock memory usage
    }: { 
      problemId: string;
      language: string;
      code: string;
      status?: Submission['status'];
      executionTime?: number;
      memoryUsed?: number;
    }) => {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        toast.error('You must be logged in to submit solutions');
        throw new Error('Not authenticated');
      }
      
      const submission = {
        user_id: userData.user.id,
        problem_id: problemId,
        language,
        code,
        status,
        execution_time: executionTime,
        memory_used: memoryUsed
      };
      
      const { data, error } = await supabase
        .from('submissions')
        .insert([submission])
        .select()
        .single();
      
      if (error) {
        toast.error('Failed to save submission');
        throw error;
      }
      
      return data;
    },
    onSuccess: (_, variables) => {
      const { data: userData } = supabase.auth.getUser();
      if (userData?.user) {
        queryClient.invalidateQueries({ 
          queryKey: ['submissions', userData.user.id, variables.problemId] 
        });
        queryClient.invalidateQueries({
          queryKey: ['solved-problems', userData.user.id]
        });
      }
      toast.success('Solution submitted successfully');
    }
  });
}
