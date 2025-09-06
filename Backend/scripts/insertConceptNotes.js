const mongoose = require('mongoose');
const ConceptNote = require('../models/ConceptNote');
require('dotenv').config();

const conceptNotes = [
  {
    topic: 'Arrays',
    title: 'Array Basics and Operations',
    content: `Arrays are linear data structures that store elements in contiguous memory locations.
    
Key Operations:
- Access: O(1) - Direct index access
- Search: O(n) - Linear search, O(log n) if sorted
- Insertion: O(n) - Need to shift elements
- Deletion: O(n) - Need to shift elements

Common Patterns:
1. Two Pointers: Use two pointers moving towards each other
2. Sliding Window: Maintain a window of elements
3. Prefix Sum: Precompute cumulative sums`,
    difficulty: 'Easy',
    tags: ['arrays', 'basics', 'data-structures'],
    examples: [
      {
        input: 'arr = [1, 2, 3, 4, 5]',
        output: 'Access arr[2] = 3',
        explanation: 'Direct access using index'
      }
    ],
    timeComplexity: 'O(1) for access, O(n) for search',
    spaceComplexity: 'O(1) for operations'
  },
  {
    topic: 'Strings',
    title: 'String Manipulation Techniques',
    content: `Strings are sequences of characters with various manipulation techniques.
    
Key Concepts:
- Immutability in many languages
- Character encoding (ASCII, Unicode)
- Pattern matching algorithms

Common Patterns:
1. Two Pointers: For palindrome checks
2. Sliding Window: For substring problems
3. KMP Algorithm: For pattern matching
4. Trie: For prefix-based operations`,
    difficulty: 'Medium',
    tags: ['strings', 'algorithms', 'pattern-matching'],
    examples: [
      {
        input: 's = "racecar"',
        output: 'true (palindrome)',
        explanation: 'Check if string reads same forwards and backwards'
      }
    ],
    timeComplexity: 'Varies by operation',
    spaceComplexity: 'O(1) to O(n)'
  },
  {
    topic: 'Trees',
    title: 'Binary Trees and Traversals',
    content: `Trees are hierarchical data structures with nodes connected by edges.
    
Types:
- Binary Tree: Each node has at most 2 children
- BST: Left < Root < Right property
- AVL Tree: Self-balancing BST
- Heap: Complete binary tree with heap property

Traversals:
1. Inorder: Left → Root → Right
2. Preorder: Root → Left → Right  
3. Postorder: Left → Right → Root
4. Level Order: BFS traversal`,
    difficulty: 'Medium',
    tags: ['trees', 'binary-trees', 'traversal'],
    examples: [
      {
        input: 'Tree: 1→2,3 (2→4,5)',
        output: 'Inorder: 4,2,5,1,3',
        explanation: 'Left subtree, root, right subtree'
      }
    ],
    timeComplexity: 'O(n) for traversals',
    spaceComplexity: 'O(h) where h is height'
  }
];

async function insertConceptNotes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await ConceptNote.deleteMany({});
    console.log('Cleared existing concept notes');

    const inserted = await ConceptNote.insertMany(conceptNotes);
    console.log(`Inserted ${inserted.length} concept notes`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

insertConceptNotes();