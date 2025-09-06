// CP-31 Sheet YouTube Video Link Verification Results

const cp31VideoIssues = {
  // ❌ INVALID LINKS FOUND:
  
  // Rick Roll Links (Invalid)
  invalidLinks: [
    { id: 2, title: "Line Trip", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 7, title: "Don't Try to Count", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 22, title: "Coins", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 27, title: "One and Two", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 38, title: "Balanced Round", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 42, title: "Not Dividing", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 47, title: "Deletive Editing", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 57, title: "Odd Divisor", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 64, title: "Raspberries", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 74, title: "Beautiful Array", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 84, title: "Add and Divide", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 94, title: "Erase First or Second Letter", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 104, title: "Maximum Sum", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 114, title: "Coprime", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 124, title: "Yet Another Card Deck", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 126, title: "Make Almost Equal With Mod", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 139, title: "Binary Deque", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 149, title: "Same Differences", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 159, title: "Divide and Equalize", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 169, title: "Array Elimination", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 179, title: "Just Eat It!", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 188, title: "Grouping Increases", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 194, title: "Copil Copac Draws Trees", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 204, title: "AND Sequences", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 214, title: "Lost Numbers", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 224, title: "Palindrome Basis", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 234, title: "K-Complete Word", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 244, title: "Nested Segments", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 250, title: "Good Triples", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 259, title: "Flexible String", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 269, title: "Erase and Extend (Easy Version)", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 279, title: "Kuroni and Impossible Calculation", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 289, title: "Neutral Tonality", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 299, title: "Even Subarrays", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 309, title: "Kavi on Pairing Duty", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 312, title: "Rendez-vous de Marian et Robin", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 324, title: "Max GEQ Sum", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 334, title: "Maximum Distributed Tree", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: 343, title: "Recommendations", youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
  ],

  // Non-existent Video Links
  nonExistentLinks: [
    { id: 3, title: "Cover in Water", youtubeLink: "https://www.youtube.com/watch?v=1900A-CoverInWater-Solution" }
  ],

  // Repeated/Generic Links (Not problem-specific)
  repeatedLinks: [
    "https://www.youtube.com/watch?v=kPRA0W1kECg", // Used 50+ times
    "https://www.youtube.com/watch?v=9bZkp7q19f0", // Used 40+ times  
    "https://www.youtube.com/watch?v=L3LMbpZIKhQ", // Used 40+ times
    "https://www.youtube.com/watch?v=fNVs1Mt0hPE", // Used 40+ times
    "https://www.youtube.com/watch?v=Hoixgm4-P4M", // Used 30+ times
    "https://www.youtube.com/watch?v=YQHsXMglC9A", // Used 30+ times
    "https://www.youtube.com/watch?v=oHg5SJYRHA0", // Used 30+ times
    "https://www.youtube.com/watch?v=RBSGKlAvoiM", // Used 30+ times
    "https://www.youtube.com/watch?v=f2ic2Rsc9pU", // Used 30+ times
    "https://www.youtube.com/watch?v=xAuBELlwjkA"  // Used for all Rating 1900 problems
  ],

  // Summary
  totalProblems: 372,
  invalidCount: 39,
  rickRollCount: 38,
  nonExistentCount: 1,
  repeatedGenericCount: 333,
  validSpecificCount: 0,

  // Issues Found
  issues: [
    "❌ 38 Rick Roll links (https://www.youtube.com/watch?v=dQw4w9WgXcQ)",
    "❌ 1 Non-existent video link", 
    "❌ 333 Generic/repeated links not specific to problems",
    "❌ 0 Valid problem-specific video links found",
    "❌ All Rating 1900 problems use same generic link",
    "❌ Most problems use recycled generic YouTube links"
  ],

  // Recommendations
  recommendations: [
    "🔧 Replace all Rick Roll links with actual CP tutorial videos",
    "🔧 Create problem-specific video links for each Codeforces problem", 
    "🔧 Use actual competitive programming channels (Errichto, SecondThread, etc.)",
    "🔧 Remove generic repeated links and add unique explanations per problem",
    "🔧 Fix the non-existent video link for 'Cover in Water' problem"
  ]
};

export default cp31VideoIssues;