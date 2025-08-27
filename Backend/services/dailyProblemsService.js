const getDailyProblems = () => {
  const allProblems = [
    { id: 1, title: "Reverse the Array", difficulty: "Easy", companies: "Infosys Moonfrog Labs", link: "https://leetcode.com/problems/reverse-string/", video: "https://www.youtube.com/watch?v=_4V6jjGX4W4", topic: "Arrays" },
    { id: 2, title: "Maximum-Subarray", difficulty: "Medium", companies: "Microsoft + Facebook Interview Qs", hint: "use Kadane's Algorithm", link: "https://leetcode.com/problems/maximum-subarray/", video: "https://www.youtube.com/watch?v=w_KEocd__20", topic: "Arrays" },
    { id: 3, title: "Contains Duplicate", difficulty: "Easy", companies: "Amazon Interview Qs", link: "https://leetcode.com/problems/contains-duplicate/", video: "https://www.youtube.com/watch?v=3OamzN90kPg", topic: "Arrays" },
    { id: 15, title: "Reverse a LinkedList", difficulty: "Easy", companies: "Paytm Adobe Amazon", link: "https://leetcode.com/problems/reverse-linked-list/", video: "https://www.youtube.com/watch?v=NhapJmyaVkY", topic: "Linked List" },
    { id: 18, title: "Level order traversal", difficulty: "Medium", companies: "Amazon Microsoft", link: "https://practice.geeksforgeeks.org/problems/level-order-traversal/1", video: "https://www.youtube.com/watch?v=EoAsWbO7sqg", topic: "Binary Trees" },
    { id: 32, title: "Valid Parentheses", difficulty: "Easy", companies: "Amazon Microsoft", link: "https://leetcode.com/problems/valid-parentheses/", video: "https://www.youtube.com/watch?v=WTzjTskDFMg", topic: "Stacks and Queues" },
    { id: 41, title: "Coin ChangeProblem", difficulty: "Medium", companies: "Amazon Microsoft", link: "https://leetcode.com/problems/coin-change/", video: "https://www.youtube.com/watch?v=H9bfqozjoqs", topic: "Dynamic Programming" }
  ];

  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  
  const seededRandom = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const shuffled = [...allProblems];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, 3);
};

module.exports = { getDailyProblems };