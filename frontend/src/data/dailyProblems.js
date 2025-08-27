
export const dailyProblemsData = [
  {
    day: 1,
    date: "2024-01-01",
    problems: [
      {
        id: 1001,
        title: "Remove Duplicates from Sorted Array",
        difficulty: "Easy",
        companies: "Amazon Google Microsoft Facebook",
        leetcodeLink: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
        youtubeLink: "https://www.youtube.com/watch?v=DEJAZBq0FDA",
        notes: "",
        hint: "Use two pointers technique"
      },
      {
        id: 1002,
        title: "Move Zeroes",
        difficulty: "Easy",
        companies: "Facebook Amazon Google",
        leetcodeLink: "https://leetcode.com/problems/move-zeroes/",
        youtubeLink: "https://www.youtube.com/watch?v=aayNRwUN3Do",
        notes: "",
        hint: "Two pointer approach to move non-zero elements"
      },
      {
        id: 1003,
        title: "Find Peak Element",
        difficulty: "Medium",
        companies: "Google Microsoft Amazon",
        leetcodeLink: "https://leetcode.com/problems/find-peak-element/",
        youtubeLink: "https://www.youtube.com/watch?v=kMzJy9es7Hc",
        notes: "",
        hint: "Binary search on unsorted array"
      }
    ]
  },
  {
    day: 2,
    date: "2024-01-02",
    problems: [
      {
        id: 1004,
        title: "Single Number",
        difficulty: "Easy",
        companies: "Amazon Microsoft Apple",
        leetcodeLink: "https://leetcode.com/problems/single-number/",
        youtubeLink: "https://www.youtube.com/watch?v=XzwUBIkR9pA",
        notes: "",
        hint: "Use XOR operation properties"
      },
      {
        id: 1005,
        title: "Majority Element",
        difficulty: "Easy",
        companies: "Amazon Google Microsoft",
        leetcodeLink: "https://leetcode.com/problems/majority-element/",
        youtubeLink: "https://www.youtube.com/watch?v=7pnhv842keE",
        notes: "",
        hint: "Boyer-Moore Voting Algorithm"
      },
      {
        id: 1006,
        title: "Sort Colors",
        difficulty: "Medium",
        companies: "Microsoft Facebook Amazon",
        leetcodeLink: "https://leetcode.com/problems/sort-colors/",
        youtubeLink: "https://www.youtube.com/watch?v=4xbWSRZHqac",
        notes: "",
        hint: "Dutch National Flag Algorithm"
      }
    ]
  },
  {
    day: 3,
    date: "2024-01-03",
    problems: [
      {
        id: 1007,
        title: "Missing Number",
        difficulty: "Easy",
        companies: "Amazon Microsoft Google",
        leetcodeLink: "https://leetcode.com/problems/missing-number/",
        youtubeLink: "https://www.youtube.com/watch?v=8g78yfzMlao",
        notes: "",
        hint: "Use sum formula or XOR"
      },
      {
        id: 1008,
        title: "Find All Numbers Disappeared in Array",
        difficulty: "Easy",
        companies: "Google Amazon Facebook",
        leetcodeLink: "https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/",
        youtubeLink: "https://www.youtube.com/watch?v=aMsSF1Il3IY",
        notes: "",
        hint: "Mark visited elements by negating values"
      },
      {
        id: 1009,
        title: "Rotate Array",
        difficulty: "Medium",
        companies: "Microsoft Amazon Google",
        leetcodeLink: "https://leetcode.com/problems/rotate-array/",
        youtubeLink: "https://www.youtube.com/watch?v=BHr381Guz3Y",
        notes: "",
        hint: "Reverse array in parts"
      }
    ]
  },
  {
    day: 4,
    date: "2024-01-04",
    problems: [
      {
        id: 1010,
        title: "Intersection of Two Arrays II",
        difficulty: "Easy",
        companies: "Facebook Amazon Google",
        leetcodeLink: "https://leetcode.com/problems/intersection-of-two-arrays-ii/",
        youtubeLink: "https://www.youtube.com/watch?v=lKuK69-hMcc",
        notes: "",
        hint: "Use HashMap to count frequencies"
      },
      {
        id: 1011,
        title: "Plus One",
        difficulty: "Easy",
        companies: "Google Amazon Microsoft",
        leetcodeLink: "https://leetcode.com/problems/plus-one/",
        youtubeLink: "https://www.youtube.com/watch?v=jIaA8boiG1s",
        notes: "",
        hint: "Handle carry propagation"
      },
      {
        id: 1012,
        title: "Pascal's Triangle",
        difficulty: "Easy",
        companies: "Amazon Microsoft Apple",
        leetcodeLink: "https://leetcode.com/problems/pascals-triangle/",
        youtubeLink: "https://www.youtube.com/watch?v=6FLvhQjZqvM",
        notes: "",
        hint: "Each element is sum of two elements above"
      }
    ]
  },
  {
    day: 5,
    date: "2024-01-05",
    problems: [
      {
        id: 1013,
        title: "Remove Element",
        difficulty: "Easy",
        companies: "Amazon Google Microsoft",
        leetcodeLink: "https://leetcode.com/problems/remove-element/",
        youtubeLink: "https://www.youtube.com/watch?v=Pcd1ii9P9ZI",
        notes: "",
        hint: "Two pointers to overwrite elements"
      },
      {
        id: 1014,
        title: "Search Insert Position",
        difficulty: "Easy",
        companies: "Amazon Microsoft Google",
        leetcodeLink: "https://leetcode.com/problems/search-insert-position/",
        youtubeLink: "https://www.youtube.com/watch?v=K-RYzDZkzCI",
        notes: "",
        hint: "Binary search for insertion point"
      },
      {
        id: 1015,
        title: "Squares of Sorted Array",
        difficulty: "Easy",
        companies: "Facebook Amazon Google",
        leetcodeLink: "https://leetcode.com/problems/squares-of-a-sorted-array/",
        youtubeLink: "https://www.youtube.com/watch?v=FPCZsG_AkUg",
        notes: "",
        hint: "Two pointers from both ends"
      }
    ]
  }
];


export const getProblemsForDay = (dayNumber) => {
  const dayData = dailyProblemsData.find(day => day.day === dayNumber);
  return dayData ? dayData.problems : [];
};


export const getCurrentDayProblems = () => {
  const startDate = new Date('2024-01-01');
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const currentDay = ((diffDays - 1) % dailyProblemsData.length) + 1;
  return getProblemsForDay(currentDay);
};


export const getAllDailyProblems = () => {
  return dailyProblemsData.flatMap(day => day.problems);
};


export const isProblemInMainSheet = (problemTitle) => {

  const mainSheetProblems = [
    'Reverse the Array', 'Maximum-Subarray', 'Contains Duplicate', 'Search in Rotated Sorted Array',
    'Next Permutation', 'Best time to Buy and Sell Stock', 'Trapping Rain Water', 'Product of Array Except Self',
    'Valid Palindrome', 'Valid Anagram', 'Valid parentheses', 'Longest Substring without Repeating Characters'

  ];
  return mainSheetProblems.includes(problemTitle);
};