// Dynamic Programming - Topic-wise Best Questions Collection
export const topicDP = {
  id: 'dp',
  title: 'Dynamic Programming - Complete Practice',
  description: 'Master DP patterns with comprehensive problem coverage',
  totalProblems: 50,
  sections: [
    {
      title: 'Basic DP Problems',
      problems: [
        { id: 1, title: 'Climbing Stairs', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/climbing-stairs/', gfg: 'https://www.geeksforgeeks.org/count-ways-reach-nth-stair/', youtube: 'https://www.youtube.com/watch?v=Y0lT9Fck7qI', companies: ['Amazon', 'Microsoft', 'Adobe'] },
        { id: 2, title: 'Fibonacci Number', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/fibonacci-number/', gfg: 'https://www.geeksforgeeks.org/program-for-nth-fibonacci-number/', youtube: 'https://www.youtube.com/watch?v=oBt53YbR9Kk', companies: ['Amazon', 'Microsoft'] },
        { id: 3, title: 'Min Cost Climbing Stairs', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/min-cost-climbing-stairs/', gfg: 'https://www.geeksforgeeks.org/min-cost-climbing-stairs/', youtube: 'https://www.youtube.com/watch?v=ktmzAZWkEZ0', companies: ['Amazon', 'Google'] },
        { id: 4, title: 'House Robber', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/house-robber/', gfg: 'https://www.geeksforgeeks.org/find-maximum-sum-such-that-no-two-elements-are-adjacent/', youtube: 'https://www.youtube.com/watch?v=xlvhyfcoQa4', companies: ['Amazon', 'Microsoft', 'Google'] },
        { id: 5, title: 'Maximum Subarray', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/maximum-subarray/', gfg: 'https://www.geeksforgeeks.org/largest-sum-contiguous-subarray/', youtube: 'https://www.youtube.com/watch?v=5WZl3MMT0Eg', companies: ['Amazon', 'Microsoft', 'Apple'] }
      ]
    },
    {
      title: 'String DP',
      problems: [
        { id: 6, title: 'Longest Common Subsequence', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/longest-common-subsequence/', gfg: 'https://www.geeksforgeeks.org/longest-common-subsequence-dp-4/', youtube: 'https://www.youtube.com/watch?v=sSno9rV8Rhg', companies: ['Amazon', 'Google', 'Facebook'] },
        { id: 7, title: 'Edit Distance', difficulty: 'Hard', leetcode: 'https://leetcode.com/problems/edit-distance/', gfg: 'https://www.geeksforgeeks.org/edit-distance-dp-5/', youtube: 'https://www.youtube.com/watch?v=We3YDTzNXEk', companies: ['Amazon', 'Google', 'Facebook'] },
        { id: 8, title: 'Longest Palindromic Subsequence', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/longest-palindromic-subsequence/', gfg: 'https://www.geeksforgeeks.org/longest-palindromic-subsequence-dp-12/', youtube: 'https://www.youtube.com/watch?v=_nCsPn7_OgI', companies: ['Amazon', 'Microsoft'] },
        { id: 9, title: 'Palindromic Substrings', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/palindromic-substrings/', gfg: 'https://www.geeksforgeeks.org/count-palindrome-sub-strings-string/', youtube: 'https://www.youtube.com/watch?v=4RACzI5-du8', companies: ['Amazon', 'Facebook'] },
        { id: 10, title: 'Longest Increasing Subsequence', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/longest-increasing-subsequence/', gfg: 'https://www.geeksforgeeks.org/longest-increasing-subsequence-dp-3/', youtube: 'https://www.youtube.com/watch?v=CE2b_-XfVDk', companies: ['Amazon', 'Microsoft', 'Google'] }
      ]
    },
    {
      title: 'Grid DP',
      problems: [
        { id: 11, title: 'Unique Paths', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/unique-paths/', gfg: 'https://www.geeksforgeeks.org/count-possible-paths-top-left-bottom-right-nxm-matrix/', youtube: 'https://www.youtube.com/watch?v=IlEsdxuD4lY', companies: ['Amazon', 'Google', 'Facebook'] },
        { id: 12, title: 'Minimum Path Sum', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/minimum-path-sum/', gfg: 'https://www.geeksforgeeks.org/min-cost-path-dp-6/', youtube: 'https://www.youtube.com/watch?v=_rgTlyky1uQ', companies: ['Amazon', 'Microsoft'] },
        { id: 13, title: 'Unique Paths II', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/unique-paths-ii/', gfg: 'https://www.geeksforgeeks.org/unique-paths-in-a-grid-with-obstacles/', youtube: 'https://www.youtube.com/watch?v=TmhpgXScLyY', companies: ['Amazon', 'Google'] },
        { id: 14, title: 'Dungeon Game', difficulty: 'Hard', leetcode: 'https://leetcode.com/problems/dungeon-game/', gfg: 'https://www.geeksforgeeks.org/minimum-positive-points-to-reach-destination/', youtube: 'https://www.youtube.com/watch?v=0m2XPGaKTXk', companies: ['Amazon', 'Microsoft'] },
        { id: 15, title: 'Cherry Pickup', difficulty: 'Hard', leetcode: 'https://leetcode.com/problems/cherry-pickup/', gfg: 'https://www.geeksforgeeks.org/collect-maximum-points-in-a-grid-using-two-traversals/', youtube: 'https://www.youtube.com/watch?v=vvPSWORCKow', companies: ['Google', 'Amazon'] }
      ]
    },
    {
      title: 'Knapsack Problems',
      problems: [
        { id: 16, title: '0/1 Knapsack Problem', difficulty: 'Medium', leetcode: '', gfg: 'https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/', youtube: 'https://www.youtube.com/watch?v=8LusJS5-AGo', companies: ['Amazon', 'Microsoft', 'Google'] },
        { id: 17, title: 'Partition Equal Subset Sum', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/partition-equal-subset-sum/', gfg: 'https://www.geeksforgeeks.org/partition-problem-dp-18/', youtube: 'https://www.youtube.com/watch?v=UmMh7xp07kY', companies: ['Amazon', 'Facebook'] },
        { id: 18, title: 'Target Sum', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/target-sum/', gfg: 'https://www.geeksforgeeks.org/count-of-subsets-with-sum-equal-to-x/', youtube: 'https://www.youtube.com/watch?v=Hw6Ygp3JBYw', companies: ['Amazon', 'Google', 'Facebook'] },
        { id: 19, title: 'Coin Change', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/coin-change/', gfg: 'https://www.geeksforgeeks.org/coin-change-dp-7/', youtube: 'https://www.youtube.com/watch?v=H9bfqozjoqs', companies: ['Amazon', 'Microsoft', 'Google'] },
        { id: 20, title: 'Coin Change 2', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/coin-change-2/', gfg: 'https://www.geeksforgeeks.org/coin-change-dp-7/', youtube: 'https://www.youtube.com/watch?v=DJ4a7cmjZY0', companies: ['Amazon', 'Facebook'] }
      ]
    },
    {
      title: 'Advanced DP',
      problems: [
        { id: 21, title: 'Longest Valid Parentheses', difficulty: 'Hard', leetcode: 'https://leetcode.com/problems/longest-valid-parentheses/', gfg: 'https://www.geeksforgeeks.org/length-of-the-longest-valid-parentheses-substring/', youtube: 'https://www.youtube.com/watch?v=VdQuwtEd10M', companies: ['Amazon', 'Google'] },
        { id: 22, title: 'Regular Expression Matching', difficulty: 'Hard', leetcode: 'https://leetcode.com/problems/regular-expression-matching/', gfg: 'https://www.geeksforgeeks.org/wildcard-pattern-matching/', youtube: 'https://www.youtube.com/watch?v=l3hda49XcDE', companies: ['Amazon', 'Google', 'Facebook'] },
        { id: 23, title: 'Interleaving String', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/interleaving-string/', gfg: 'https://www.geeksforgeeks.org/find-if-a-string-is-interleaved-of-two-other-strings-dp-33/', youtube: 'https://www.youtube.com/watch?v=ih2OZ9-M3OM', companies: ['Amazon', 'Microsoft'] },
        { id: 24, title: 'Best Time to Buy and Sell Stock with Cooldown', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/', gfg: 'https://www.geeksforgeeks.org/stock-buy-sell-k-transactions-allowed/', youtube: 'https://www.youtube.com/watch?v=I7j0F7AHpb8', companies: ['Amazon', 'Google'] },
        { id: 25, title: 'Word Break', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/word-break/', gfg: 'https://www.geeksforgeeks.org/word-break-problem-dp-32/', youtube: 'https://www.youtube.com/watch?v=Sx9NNgInc3A', companies: ['Amazon', 'Microsoft', 'Google'] }
      ]
    },
    {
      title: 'Tree & DAG DP',
      problems: [
        { id: 26, title: 'House Robber III', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/house-robber-iii/', gfg: 'https://www.geeksforgeeks.org/maximum-sum-nodes-binary-tree-no-two-adjacent/', youtube: 'https://www.youtube.com/watch?v=nHR8ytpzz7c', companies: ['Amazon', 'Google', 'Microsoft'] },
        { id: 27, title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', leetcode: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', gfg: 'https://www.geeksforgeeks.org/find-maximum-path-sum-in-a-binary-tree/', youtube: 'https://www.youtube.com/watch?v=WszrfSwMz58', companies: ['Amazon', 'Google', 'Facebook'] },
        { id: 28, title: 'Diameter of Binary Tree', difficulty: 'Easy', leetcode: 'https://leetcode.com/problems/diameter-of-binary-tree/', gfg: 'https://www.geeksforgeeks.org/diameter-of-a-binary-tree/', youtube: 'https://www.youtube.com/watch?v=ey7DYc9OANo', companies: ['Amazon', 'Microsoft', 'Google'] },
        { id: 29, title: 'Longest Univalue Path', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/longest-univalue-path/', gfg: 'https://www.geeksforgeeks.org/longest-path-values-binary-tree/', youtube: 'https://www.youtube.com/watch?v=7uykdo9Gu_I', companies: ['Google', 'Amazon'] }
      ]
    },
    {
      title: 'Bitmask & State Compression DP',
      problems: [
        { id: 30, title: 'Shortest Path Visiting All Nodes', difficulty: 'Hard', leetcode: 'https://leetcode.com/problems/shortest-path-visiting-all-nodes/', gfg: 'https://www.geeksforgeeks.org/travelling-salesman-problem-using-dynamic-programming/', youtube: 'https://www.youtube.com/watch?v=cY4HiiFHO1o', companies: ['Amazon', 'Google', 'Microsoft'] },
        { id: 31, title: 'Partition to K Equal Sum Subsets', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/partition-to-k-equal-sum-subsets/', gfg: 'https://www.geeksforgeeks.org/partition-set-k-subsets-equal-sum/', youtube: 'https://www.youtube.com/watch?v=qpgqhp_9d1s', companies: ['Amazon', 'Facebook', 'Google'] },
        { id: 32, title: 'Maximum Students Taking Exam', difficulty: 'Hard', leetcode: 'https://leetcode.com/problems/maximum-students-taking-exam/', gfg: 'https://www.geeksforgeeks.org/bitmask-dp/', youtube: 'https://www.youtube.com/watch?v=K1fQ7VuVbaY', companies: ['Google', 'Facebook'] }
      ]
    },
    {
      title: 'Digit DP',
      problems: [
        { id: 33, title: 'Count Numbers with Unique Digits', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/count-numbers-with-unique-digits/', gfg: 'https://www.geeksforgeeks.org/count-numbers-with-unique-digits/', youtube: 'https://www.youtube.com/watch?v=nZG3I_-Xvgc', companies: ['Google', 'Amazon'] },
        { id: 34, title: 'Numbers At Most N Given Digit Set', difficulty: 'Hard', leetcode: 'https://leetcode.com/problems/numbers-at-most-n-given-digit-set/', gfg: 'https://www.geeksforgeeks.org/digit-dp-introduction/', youtube: 'https://www.youtube.com/watch?v=heUFId6Qd1A', companies: ['Google', 'Facebook'] },
        { id: 35, title: 'Count of Integers', difficulty: 'Hard', leetcode: 'https://leetcode.com/problems/count-of-integers/', gfg: 'https://www.geeksforgeeks.org/digit-dp-introduction/', youtube: 'https://www.youtube.com/watch?v=heUFId6Qd1A', companies: ['Google', 'Amazon'] }
      ]
    },
    {
      title: 'Interval DP',
      problems: [
        { id: 36, title: 'Burst Balloons', difficulty: 'Hard', leetcode: 'https://leetcode.com/problems/burst-balloons/', gfg: 'https://www.geeksforgeeks.org/burst-balloon-to-maximize-coins/', youtube: 'https://www.youtube.com/watch?v=VFskby7lUbw', companies: ['Amazon', 'Google', 'Facebook'] },
        { id: 37, title: 'Matrix Chain Multiplication', difficulty: 'Hard', leetcode: '', gfg: 'https://www.geeksforgeeks.org/matrix-chain-multiplication-dp-8/', youtube: 'https://www.youtube.com/watch?v=vgLJZMUfnsU', companies: ['Amazon', 'Microsoft', 'Google'] },
        { id: 38, title: 'Minimum Cost to Cut a Stick', difficulty: 'Hard', leetcode: 'https://leetcode.com/problems/minimum-cost-to-cut-a-stick/', gfg: 'https://www.geeksforgeeks.org/minimum-cost-to-cut-the-stick/', youtube: 'https://www.youtube.com/watch?v=xwomavsC86c', companies: ['Amazon', 'Google'] },
        { id: 39, title: 'Palindrome Partitioning II', difficulty: 'Hard', leetcode: 'https://leetcode.com/problems/palindrome-partitioning-ii/', gfg: 'https://www.geeksforgeeks.org/palindrome-partitioning-dp-17/', youtube: 'https://www.youtube.com/watch?v=WBgsABoClE0', companies: ['Amazon', 'Google'] }
      ]
    },
    {
      title: 'Space-Optimized DP',
      problems: [
        { id: 40, title: 'Best Time to Buy and Sell Stock IV', difficulty: 'Hard', leetcode: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/', gfg: 'https://www.geeksforgeeks.org/stock-buy-sell-k-transactions-allowed/', youtube: 'https://www.youtube.com/watch?v=IV0dQzh2yv4', companies: ['Amazon', 'Google', 'Facebook'] },
        { id: 41, title: 'Paint House', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/paint-house/', gfg: 'https://www.geeksforgeeks.org/paint-house-problem/', youtube: 'https://www.youtube.com/watch?v=fZIsEPhSBgM', companies: ['Amazon', 'Microsoft'] },
        { id: 42, title: 'Paint House II', difficulty: 'Hard', leetcode: 'https://leetcode.com/problems/paint-house-ii/', gfg: 'https://www.geeksforgeeks.org/paint-house-problem/', youtube: 'https://www.youtube.com/watch?v=fZIsEPhSBgM', companies: ['Amazon', 'Google'] },
        { id: 43, title: 'Delete Operation for Two Strings', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/delete-operation-for-two-strings/', gfg: 'https://www.geeksforgeeks.org/minimum-number-deletions-make-two-strings-equal/', youtube: 'https://www.youtube.com/watch?v=NnD96abizww', companies: ['Amazon', 'Microsoft'] },
        { id: 44, title: 'Minimum ASCII Delete Sum', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/', gfg: 'https://www.geeksforgeeks.org/minimum-sum-of-ascii-values-of-characters-to-be-removed-to-make-two-strings-equal/', youtube: 'https://www.youtube.com/watch?v=NnD96abizww', companies: ['Amazon', 'Google'] },
        { id: 45, title: 'Russian Doll Envelopes', difficulty: 'Hard', leetcode: 'https://leetcode.com/problems/russian-doll-envelopes/', gfg: 'https://www.geeksforgeeks.org/russian-doll-envelopes-problem/', youtube: 'https://www.youtube.com/watch?v=CE2b_-XfVDk', companies: ['Amazon', 'Google', 'Facebook'] },
        { id: 46, title: 'Wiggle Subsequence', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/wiggle-subsequence/', gfg: 'https://www.geeksforgeeks.org/longest-alternating-subsequence/', youtube: 'https://www.youtube.com/watch?v=yVdKa8dnj0M', companies: ['Amazon', 'Microsoft'] },
        { id: 47, title: 'Maximum Length of Pair Chain', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/maximum-length-of-pair-chain/', gfg: 'https://www.geeksforgeeks.org/maximum-length-chain-of-pairs-dp-20/', youtube: 'https://www.youtube.com/watch?v=CE2b_-XfVDk', companies: ['Amazon', 'Google'] },
        { id: 48, title: 'Number of Longest Increasing Subsequence', difficulty: 'Medium', leetcode: 'https://leetcode.com/problems/number-of-longest-increasing-subsequence/', gfg: 'https://www.geeksforgeeks.org/number-of-longest-increasing-subsequences/', youtube: 'https://www.youtube.com/watch?v=CE2b_-XfVDk', companies: ['Amazon', 'Google', 'Microsoft'] },
        { id: 49, title: 'Arithmetic Slices II - Subsequence', difficulty: 'Hard', leetcode: 'https://leetcode.com/problems/arithmetic-slices-ii-subsequence/', gfg: 'https://www.geeksforgeeks.org/longest-arithmetic-progression-dp-35/', youtube: 'https://www.youtube.com/watch?v=cHT6sG_hUZI', companies: ['Google', 'Amazon'] },
        { id: 50, title: 'Frog Jump', difficulty: 'Hard', leetcode: 'https://leetcode.com/problems/frog-jump/', gfg: 'https://www.geeksforgeeks.org/frog-jump-problem/', youtube: 'https://www.youtube.com/watch?v=Hm05llzw3D4', companies: ['Amazon', 'Google', 'Facebook'] }
      ]
    }
  ]
};

export default topicDP;