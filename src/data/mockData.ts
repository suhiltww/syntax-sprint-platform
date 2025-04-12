
// Mock data for development purposes

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'student';
  createdAt: string;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
  description: string;
  constraints: string;
  inputFormat: string;
  outputFormat: string;
  sampleTestCases: TestCase[];
  hiddenTestCases?: TestCase[];
  acceptanceRate: number;
  timeLimit: number;
  memoryLimit: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TestCase {
  input: string;
  output: string;
  explanation?: string;
}

export interface Submission {
  id: string;
  problemId: string;
  userId: string;
  code: string;
  language: string;
  status: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'memory_limit_exceeded' | 'runtime_error' | 'compilation_error';
  runtime: number;
  memory: number;
  submittedAt: string;
}

export interface UserProgress {
  solved: string[];
  attempted: string[];
  submissions: Record<string, number>;
}

export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@syntaxsprint.com",
    name: "Admin User",
    role: "admin",
    createdAt: "2023-01-15T09:24:00Z"
  },
  {
    id: "2",
    email: "student@example.com",
    name: "Demo Student",
    role: "student",
    createdAt: "2023-02-20T14:50:00Z"
  }
];

export const mockProblems: Problem[] = [
  {
    id: "1",
    title: "Two Sum",
    difficulty: "easy",
    topics: ["arrays", "hash-table"],
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    constraints: "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.",
    inputFormat: "The first line contains an array of integers separated by spaces.\nThe second line contains the target sum.",
    outputFormat: "Return the indices of the two numbers that add up to the target.",
    sampleTestCases: [
      {
        input: "[2,7,11,15]\n9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 2 + 7 == 9, we return [0, 1]."
      },
      {
        input: "[3,2,4]\n6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 2 + 4 == 6, we return [1, 2]."
      }
    ],
    acceptanceRate: 48.2,
    timeLimit: 1000,
    memoryLimit: 128,
    createdBy: "1",
    createdAt: "2023-01-20T08:30:00Z",
    updatedAt: "2023-01-20T08:30:00Z"
  },
  {
    id: "2",
    title: "Valid Parentheses",
    difficulty: "easy",
    topics: ["stack", "strings"],
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order. Every close bracket has a corresponding open bracket of the same type.",
    constraints: "1 <= s.length <= 10^4\ns consists of parentheses only '()[]{}'.",
    inputFormat: "A string s containing just the characters '(', ')', '{', '}', '[' and ']'.",
    outputFormat: "Return true if the input string is valid, otherwise return false.",
    sampleTestCases: [
      {
        input: "()",
        output: "true"
      },
      {
        input: "()[]{}",
        output: "true"
      },
      {
        input: "(]",
        output: "false"
      }
    ],
    acceptanceRate: 40.5,
    timeLimit: 1000,
    memoryLimit: 128,
    createdBy: "1",
    createdAt: "2023-01-22T10:15:00Z",
    updatedAt: "2023-01-22T10:15:00Z"
  },
  {
    id: "3",
    title: "Maximum Subarray",
    difficulty: "medium",
    topics: ["arrays", "dynamic-programming", "divide-and-conquer"],
    description: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    constraints: "1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4",
    inputFormat: "An array of integers separated by spaces.",
    outputFormat: "The maximum sum of a contiguous subarray.",
    sampleTestCases: [
      {
        input: "[-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "[4,-1,2,1] has the largest sum = 6."
      },
      {
        input: "[1]",
        output: "1"
      }
    ],
    acceptanceRate: 49.8,
    timeLimit: 1000,
    memoryLimit: 128,
    createdBy: "1",
    createdAt: "2023-02-05T15:45:00Z",
    updatedAt: "2023-02-05T15:45:00Z"
  },
  {
    id: "4",
    title: "Merge Two Sorted Lists",
    difficulty: "easy",
    topics: ["linked-list", "recursion"],
    description: "Merge two sorted linked lists and return it as a sorted list. The list should be made by splicing together the nodes of the first two lists.",
    constraints: "The number of nodes in both lists is in the range [0, 50].\n-100 <= Node.val <= 100\nBoth l1 and l2 are sorted in non-decreasing order.",
    inputFormat: "Two sorted linked lists represented as arrays.",
    outputFormat: "A merged sorted linked list represented as an array.",
    sampleTestCases: [
      {
        input: "[1,2,4]\n[1,3,4]",
        output: "[1,1,2,3,4,4]"
      },
      {
        input: "[]\n[]",
        output: "[]"
      }
    ],
    acceptanceRate: 58.7,
    timeLimit: 1000,
    memoryLimit: 128,
    createdBy: "1",
    createdAt: "2023-02-10T09:20:00Z",
    updatedAt: "2023-02-10T09:20:00Z"
  },
  {
    id: "5",
    title: "Binary Tree Level Order Traversal",
    difficulty: "medium",
    topics: ["tree", "breadth-first-search", "binary-tree"],
    description: "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).",
    constraints: "The number of nodes in the tree is in the range [0, 2000].\n-1000 <= Node.val <= 1000",
    inputFormat: "A binary tree represented as an array in level order traversal where null indicates no node.",
    outputFormat: "A 2D array where each subarray represents a level in the tree from top to bottom.",
    sampleTestCases: [
      {
        input: "[3,9,20,null,null,15,7]",
        output: "[[3],[9,20],[15,7]]"
      },
      {
        input: "[1]",
        output: "[[1]]"
      }
    ],
    acceptanceRate: 59.1,
    timeLimit: 1000,
    memoryLimit: 128,
    createdBy: "1",
    createdAt: "2023-02-15T14:30:00Z",
    updatedAt: "2023-02-15T14:30:00Z"
  },
  {
    id: "6",
    title: "Reverse Linked List",
    difficulty: "easy",
    topics: ["linked-list", "recursion"],
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    constraints: "The number of nodes in the list is the range [0, 5000].\n-5000 <= Node.val <= 5000",
    inputFormat: "A singly linked list represented as an array.",
    outputFormat: "The reversed linked list represented as an array.",
    sampleTestCases: [
      {
        input: "[1,2,3,4,5]",
        output: "[5,4,3,2,1]"
      },
      {
        input: "[1,2]",
        output: "[2,1]"
      }
    ],
    acceptanceRate: 67.3,
    timeLimit: 1000,
    memoryLimit: 128,
    createdBy: "1",
    createdAt: "2023-02-18T11:10:00Z",
    updatedAt: "2023-02-18T11:10:00Z"
  }
];

export const mockSubmissions: Submission[] = [
  {
    id: "1",
    problemId: "1",
    userId: "2",
    code: "def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []",
    language: "python",
    status: "accepted",
    runtime: 60,
    memory: 15,
    submittedAt: "2023-03-01T14:22:00Z"
  },
  {
    id: "2",
    problemId: "2",
    userId: "2",
    code: "def is_valid(s):\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in mapping:\n            if not stack or stack.pop() != mapping[char]:\n                return False\n        else:\n            stack.append(char)\n    return len(stack) == 0",
    language: "python",
    status: "accepted",
    runtime: 32,
    memory: 14,
    submittedAt: "2023-03-02T09:45:00Z"
  },
  {
    id: "3",
    problemId: "3",
    userId: "2",
    code: "def max_subarray(nums):\n    current_max = global_max = nums[0]\n    for i in range(1, len(nums)):\n        current_max = max(nums[i], current_max + nums[i])\n        global_max = max(global_max, current_max)\n    return global_max",
    language: "python",
    status: "wrong_answer",
    runtime: 45,
    memory: 15,
    submittedAt: "2023-03-03T16:10:00Z"
  },
  {
    id: "4",
    problemId: "3",
    userId: "2",
    code: "def max_subarray(nums):\n    if not nums:\n        return 0\n    current_max = global_max = nums[0]\n    for i in range(1, len(nums)):\n        current_max = max(nums[i], current_max + nums[i])\n        global_max = max(global_max, current_max)\n    return global_max",
    language: "python",
    status: "accepted",
    runtime: 48,
    memory: 15,
    submittedAt: "2023-03-03T16:25:00Z"
  }
];

export const mockUserProgress: Record<string, UserProgress> = {
  "2": {
    solved: ["1", "2", "3"],
    attempted: ["1", "2", "3"],
    submissions: {
      "1": 1,
      "2": 1,
      "3": 2
    }
  }
};
