const express = require('express');
const Problem = require('../models/Problem');
const { getDailyProblems } = require('../services/dailyProblemsService');

const router = express.Router();

const dsaProblemsData = [
  {
    id: 1,
    title: "Arrays",
    problems: [
      { id: 1, title: "Reverse the Array", difficulty: "Easy", companies: "Infosys Moonfrog Labs", link: "https://leetcode.com/problems/reverse-string/", video: "https://www.youtube.com/watch?v=_4V6jjGX4W4" },
      { id: 2, title: "Maximum-Subarray", difficulty: "Medium", companies: "Microsoft + Facebook Interview Qs", hint: "use Kadane's Algorithm", link: "https://leetcode.com/problems/maximum-subarray/", video: "https://www.youtube.com/watch?v=w_KEocd__20" },
      { id: 3, title: "Contains Duplicate", difficulty: "Easy", companies: "Amazon Interview Qs", link: "https://leetcode.com/problems/contains-duplicate/", video: "https://www.youtube.com/watch?v=3OamzN90kPg" },
      { id: 4, title: "Chocolate Distribution Problem", difficulty: "Easy", companies: "Accolite Amazon Hike", link: "https://practice.geeksforgeeks.org/problems/chocolate-distribution-problem/0", video: "https://www.youtube.com/watch?v=LFKD2Zb5B9E" },
      { id: 5, title: "Search in Rotated Sorted Array", difficulty: "Medium", companies: "Facebook Amazon Microsoft", link: "https://leetcode.com/problems/search-in-rotated-sorted-array/", video: "https://www.youtube.com/watch?v=r3pMQ8-Ad5s" }
    ]
  },
  {
    id: 2,
    title: "Matrix",
    problems: [
      { id: 6, title: "Spiral Traversal on a Matrix", difficulty: "Medium", companies: "Paytm Zoho Morgan Stanley", link: "https://practice.geeksforgeeks.org/problems/spirally-traversing-a-matrix/0", video: "https://www.youtube.com/watch?v=BJnMZNwUk1M" },
      { id: 7, title: "Search a 2D Matrix", difficulty: "Medium", companies: "Amazon Microsoft", link: "https://leetcode.com/problems/search-a-2d-matrix/", video: "https://www.youtube.com/watch?v=FOa55B9Ikfg" },
      { id: 8, title: "Median in a row-wise sorted Matrix", difficulty: "Hard", companies: "Amazon", link: "https://practice.geeksforgeeks.org/problems/median-in-a-row-wise-sorted-matrix1527/1", video: "https://www.youtube.com/watch?v=63fPPOdIr2c" }
    ]
  },
  {
    id: 3,
    title: "String",
    problems: [
      { id: 9, title: "Reverse Words in a String", difficulty: "Medium", companies: "Microsoft", link: "https://leetcode.com/problems/reverse-words-in-a-string/", video: "https://www.youtube.com/watch?v=YaXrbSJGi5U" },
      { id: 10, title: "Longest Palindromic Substring", difficulty: "Medium", companies: "Amazon Microsoft", link: "https://leetcode.com/problems/longest-palindromic-substring/", video: "https://www.youtube.com/watch?v=XYQecbcd6_c" },
      { id: 11, title: "Roman Number to Integer", difficulty: "Easy", companies: "Amazon Microsoft", link: "https://leetcode.com/problems/roman-to-integer/", video: "https://www.youtube.com/watch?v=3jdxYj3DD98" }
    ]
  },
  {
    id: 4,
    title: "Searching & Sorting",
    problems: [
      { id: 12, title: "Find First and Last Position of Element in Sorted Array", difficulty: "Medium", companies: "Facebook Amazon", link: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/", video: "https://www.youtube.com/watch?v=hjR1IYVx9lY" },
      { id: 13, title: "Count Inversions", difficulty: "Medium", companies: "Amazon Microsoft", link: "https://practice.geeksforgeeks.org/problems/inversion-of-array/0", video: "https://www.youtube.com/watch?v=kQ1mJlwW-c0" },
      { id: 14, title: "Search in Rotated Sorted Array", difficulty: "Medium", companies: "Amazon Microsoft", link: "https://leetcode.com/problems/search-in-rotated-sorted-array/", video: "https://www.youtube.com/watch?v=r3pMQ8-Ad5s" }
    ]
  },
  {
    id: 5,
    title: "Linked List",
    problems: [
      { id: 15, title: "Reverse a LinkedList", difficulty: "Easy", companies: "Paytm Adobe Amazon", link: "https://leetcode.com/problems/reverse-linked-list/", video: "https://www.youtube.com/watch?v=NhapJmyaVkY" },
      { id: 16, title: "Detect Loop in linked list", difficulty: "Medium", companies: "Flipkart Accolite Amazon", link: "https://practice.geeksforgeeks.org/problems/detect-loop-in-linked-list/1", video: "https://www.youtube.com/watch?v=354J83hX7RI" },
      { id: 17, title: "Merge Two Sorted Lists", difficulty: "Easy", companies: "Amazon Apple Microsoft", link: "https://leetcode.com/problems/merge-two-sorted-lists/", video: "https://www.youtube.com/watch?v=XIdigk956u0" }
    ]
  },
  {
    id: 6,
    title: "Binary Trees",
    problems: [
      { id: 18, title: "Level order traversal", difficulty: "Medium", companies: "Amazon Microsoft", link: "https://practice.geeksforgeeks.org/problems/level-order-traversal/1", video: "https://www.youtube.com/watch?v=EoAsWbO7sqg" },
      { id: 19, title: "Height of Binary Tree", difficulty: "Easy", companies: "Paytm Accolite Amazon", link: "https://practice.geeksforgeeks.org/problems/height-of-binary-tree/1", video: "https://www.youtube.com/watch?v=_pnqMz5nrRs" },
      { id: 20, title: "Diameter of Binary Tree", difficulty: "Easy", companies: "Amazon Microsoft", link: "https://practice.geeksforgeeks.org/problems/diameter-of-binary-tree/1", video: "https://www.youtube.com/watch?v=Rezetez59Nk" }
    ]
  },
  {
    id: 7,
    title: "Binary Search Trees",
    problems: [
      { id: 21, title: "Find a value in a BST", difficulty: "Easy", companies: "Amazon", link: "https://leetcode.com/problems/search-in-a-binary-search-tree/", video: "https://www.youtube.com/watch?v=KcNt6v_56cc" },
      { id: 22, title: "Delete a node in BST", difficulty: "Medium", companies: "Amazon Microsoft", link: "https://leetcode.com/problems/delete-node-in-a-bst/", video: "https://www.youtube.com/watch?v=gcULXE7ViZw" },
      { id: 23, title: "Validate Binary Search Tree", difficulty: "Medium", companies: "Amazon Facebook", link: "https://leetcode.com/problems/validate-binary-search-tree/", video: "https://www.youtube.com/watch?v=s6ATEkipzow" }
    ]
  },
  {
    id: 8,
    title: "Greedy",
    problems: [
      { id: 24, title: "Activity Selection Problem", difficulty: "Medium", companies: "Flipkart Amazon", link: "https://practice.geeksforgeeks.org/problems/activity-selection-1587115620/1", video: "https://www.youtube.com/watch?v=poWB2UCuozA" },
      { id: 25, title: "Job Sequencing Problem", difficulty: "Medium", companies: "Paytm Flipkart Amazon", link: "https://practice.geeksforgeeks.org/problems/job-sequencing-problem-1587115620/1", video: "https://www.youtube.com/watch?v=LjPx4wQaRIs" },
      { id: 26, title: "Huffman Coding", difficulty: "Medium", companies: "Amazon", link: "https://practice.geeksforgeeks.org/problems/huffman-encoding3345/1", video: "https://www.youtube.com/watch?v=co4_ahEDCho" }
    ]
  },
  {
    id: 9,
    title: "Backtracking",
    problems: [
      { id: 27, title: "Rat in a Maze Problem", difficulty: "Medium", companies: "Paytm Amazon Microsoft", link: "https://practice.geeksforgeeks.org/problems/rat-in-a-maze-problem/1", video: "https://www.youtube.com/watch?v=bLGZhJlt4y0" },
      { id: 28, title: "N-Queen Problem", difficulty: "Hard", companies: "Amazon Microsoft", link: "https://leetcode.com/problems/n-queens/", video: "https://www.youtube.com/watch?v=i05Ju7AftcM" },
      { id: 29, title: "Word Break Problem", difficulty: "Medium", companies: "Amazon Google", link: "https://practice.geeksforgeeks.org/problems/word-break-part-23249/1", video: "https://www.youtube.com/watch?v=th4OUcorOHc" }
    ]
  },
  {
    id: 10,
    title: "Stacks and Queues",
    problems: [
      { id: 30, title: "Implement Stack using Arrays", difficulty: "Easy", companies: "Paytm Microsoft", link: "https://practice.geeksforgeeks.org/problems/implement-stack-using-array/1", video: "https://www.youtube.com/watch?v=GYptUgnIM_I" },
      { id: 31, title: "Implement two Stacks in an Array", difficulty: "Easy", companies: "TCS Amazon", link: "https://practice.geeksforgeeks.org/problems/implement-two-stacks-in-an-array/1", video: "https://www.youtube.com/watch?v=lrSXKLmnMV8" },
      { id: 32, title: "Valid Parentheses", difficulty: "Easy", companies: "Amazon Microsoft", link: "https://leetcode.com/problems/valid-parentheses/", video: "https://www.youtube.com/watch?v=WTzjTskDFMg" }
    ]
  },
  {
    id: 11,
    title: "Heap",
    problems: [
      { id: 33, title: "Implement a Maxheap/MinHeap using arrays and recursion", difficulty: "Medium", companies: "Amazon", link: "https://www.geeksforgeeks.org/building-heap-from-array/", video: "https://www.youtube.com/watch?v=HqPJF2L5h9U" },
      { id: 34, title: "Sort a K sorted array", difficulty: "Medium", companies: "Amazon Microsoft", link: "https://practice.geeksforgeeks.org/problems/nearly-sorted-1587115620/1", video: "https://www.youtube.com/watch?v=yQ40EdXYAHs" },
      { id: 35, title: "Merge K sorted Linked Lists", difficulty: "Hard", companies: "Amazon Facebook", link: "https://leetcode.com/problems/merge-k-sorted-lists/", video: "https://www.youtube.com/watch?v=q5a5OiGbT6Q" }
    ]
  },
  {
    id: 12,
    title: "Graph",
    problems: [
      { id: 36, title: "Create a Graph, print it", difficulty: "Easy", companies: "Amazon", link: "https://www.geeksforgeeks.org/graph-and-its-representations/", video: "https://www.youtube.com/watch?v=gXgEDyodOJU" },
      { id: 37, title: "Implement BFS algorithm", difficulty: "Medium", companies: "Paytm Amazon Microsoft", link: "https://practice.geeksforgeeks.org/problems/bfs-traversal-of-graph/1", video: "https://www.youtube.com/watch?v=oDqjPvD54Ss" },
      { id: 38, title: "Implement DFS Algo", difficulty: "Medium", companies: "Paytm Amazon Microsoft", link: "https://practice.geeksforgeeks.org/problems/depth-first-traversal-for-a-graph/1", video: "https://www.youtube.com/watch?v=7fujbpJ0LB4" }
    ]
  },
  {
    id: 13,
    title: "Trie",
    problems: [
      { id: 39, title: "Construct a trie from given words", difficulty: "Medium", companies: "Amazon Microsoft", link: "https://www.geeksforgeeks.org/trie-insert-and-search/", video: "https://www.youtube.com/watch?v=AXjmTQ8LEoI" },
      { id: 40, title: "Implement a Phone Directory", difficulty: "Medium", companies: "Amazon", link: "https://practice.geeksforgeeks.org/problems/phone-directory4628/1", video: "https://www.youtube.com/watch?v=f9S_6WyhK1k" }
    ]
  },
  {
    id: 14,
    title: "Dynamic Programming",
    problems: [
      { id: 41, title: "Coin ChangeProblem", difficulty: "Medium", companies: "Amazon Microsoft", link: "https://leetcode.com/problems/coin-change/", video: "https://www.youtube.com/watch?v=H9bfqozjoqs" },
      { id: 42, title: "0/1 Knapsack Problem", difficulty: "Medium", companies: "Flipkart Amazon", link: "https://practice.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1", video: "https://www.youtube.com/watch?v=8LusJS5-AGo" },
      { id: 43, title: "Longest Common Subsequence", difficulty: "Medium", companies: "Paytm Amazon", link: "https://practice.geeksforgeeks.org/problems/longest-common-subsequence-1587115620/1", video: "https://www.youtube.com/watch?v=NPZn9jBrX8U" },
      { id: 44, title: "Longest Increasing Subsequence", difficulty: "Medium", companies: "Microsoft Amazon", link: "https://leetcode.com/problems/longest-increasing-subsequence/", video: "https://www.youtube.com/watch?v=CE2b_-XfVDk" },
      { id: 45, title: "Edit Distance", difficulty: "Hard", companies: "Amazon Google", link: "https://leetcode.com/problems/edit-distance/", video: "https://www.youtube.com/watch?v=We3YDTzNXEk" }
    ]
  }
];

router.get('/', async (req, res) => {
  try {
    res.json(dsaProblemsData);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/daily', async (req, res) => {
  try {
    const dailyProblems = getDailyProblems();
    res.json(dailyProblems);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/topic/:topicId', async (req, res) => {
  try {
    const topicId = parseInt(req.params.topicId);
    const topic = dsaProblemsData.find(t => t.id === topicId);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    res.json(topic);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const problemId = parseInt(req.params.id);
    let foundProblem = null;
    
    for (const topic of dsaProblemsData) {
      foundProblem = topic.problems.find(p => p.id === problemId);
      if (foundProblem) break;
    }
    
    if (!foundProblem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    res.json(foundProblem);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;