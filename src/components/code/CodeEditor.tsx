
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface CodeEditorProps {
  defaultLanguage?: string;
  defaultCode?: string;
  onRun?: (code: string, language: string) => void;
  onSubmit?: (code: string, language: string) => void;
}

// Example starter code for different languages
const starterCode = {
  python: `def solution(nums):
    # Write your solution here
    pass
    
# Example usage
if __name__ == "__main__":
    result = solution([1, 2, 3])
    print(result)`,
  javascript: `function solution(nums) {
    // Write your solution here
}

// Example usage
console.log(solution([1, 2, 3]));`,
  cpp: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    void solution(vector<int>& nums) {
        // Write your solution here
    }
};

int main() {
    Solution s;
    vector<int> nums = {1, 2, 3};
    s.solution(nums);
    return 0;
}`
};

const CodeEditor: React.FC<CodeEditorProps> = ({
  defaultLanguage = 'python',
  defaultCode,
  onRun,
  onSubmit
}) => {
  const [language, setLanguage] = useState(defaultLanguage);
  const [code, setCode] = useState(defaultCode || starterCode[language as keyof typeof starterCode]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    setCode(starterCode[value as keyof typeof starterCode]);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    
    // Simulate running code
    setTimeout(() => {
      onRun?.(code, language);
      toast.success('Code executed successfully!');
      setIsRunning(false);
    }, 1000);
  };

  const handleSubmitCode = () => {
    setIsSubmitting(true);
    
    // Simulate submitting code
    setTimeout(() => {
      onSubmit?.(code, language);
      toast.success('Solution submitted!');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-2">
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
          >
            {isRunning ? 'Running...' : 'Run Code'}
          </Button>
          <Button 
            onClick={handleSubmitCode}
            disabled={isRunning || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </div>
      
      <div className="flex-1 border rounded-md overflow-hidden bg-gray-900">
        {/* This is a placeholder for the Monaco Editor */}
        <textarea
          className="w-full h-full p-4 bg-gray-900 text-white font-mono resize-none outline-none"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write your code here..."
          spellCheck="false"
        />
      </div>
      
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Console Output:</h3>
        <div className="p-3 bg-gray-900 text-white rounded-md h-24 overflow-y-auto font-mono text-sm">
          <p className="text-gray-400"># Run your code to see output here</p>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
