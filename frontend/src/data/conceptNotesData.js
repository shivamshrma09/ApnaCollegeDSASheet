// Enhanced DSA Concept Notes with comprehensive coverage and interactive examples
// Based on detailed analysis and improvement recommendations

// Utility function for copying code to clipboard
export const copyToClipboard = (text) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Code copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
};

// Resources data for each topic
export const topicResources = {
  Arrays: {
    videos: [
      { title: "Array Data Structure - CS50", url: "https://www.youtube.com/watch?v=tI_tIZFyKBw", duration: "15 min" },
      { title: "Arrays in Programming - freeCodeCamp", url: "https://www.youtube.com/watch?v=QJNwK2uJyGs", duration: "45 min" },
      { title: "Two Pointers Technique", url: "https://www.youtube.com/watch?v=On03HWe2tZM", duration: "20 min" }
    ],
    articles: [
      { title: "Array Data Structure - GeeksforGeeks", url: "https://www.geeksforgeeks.org/array-data-structure/" },
      { title: "Dynamic Arrays - Wikipedia", url: "https://en.wikipedia.org/wiki/Dynamic_array" }
    ],
    practice: [
      { title: "Array Problems - LeetCode", url: "https://leetcode.com/tag/array/" },
      { title: "Array Practice - HackerRank", url: "https://www.hackerrank.com/domains/data-structures/arrays" }
    ]
  },
  Strings: {
    videos: [
      { title: "String Algorithms - MIT", url: "https://www.youtube.com/watch?v=V5-7GzOfADQ", duration: "50 min" },
      { title: "KMP Algorithm Explained", url: "https://www.youtube.com/watch?v=GTJr8OvyEVQ", duration: "25 min" }
    ],
    articles: [
      { title: "String Matching Algorithms", url: "https://www.geeksforgeeks.org/string-matching-algorithms/" },
      { title: "Pattern Searching", url: "https://www.geeksforgeeks.org/searching-for-patterns-set-1-naive-pattern-searching/" }
    ],
    practice: [
      { title: "String Problems - LeetCode", url: "https://leetcode.com/tag/string/" }
    ]
  },
  Trees: {
    videos: [
      { title: "Tree Data Structure - CS50", url: "https://www.youtube.com/watch?v=mFptHjTT3l8", duration: "30 min" },
      { title: "Binary Search Trees - MIT", url: "https://www.youtube.com/watch?v=9Jry5-82I68", duration: "45 min" },
      { title: "Tree Traversals Explained", url: "https://www.youtube.com/watch?v=9RHO6jU--GU", duration: "20 min" }
    ],
    articles: [
      { title: "Tree Data Structure - GeeksforGeeks", url: "https://www.geeksforgeeks.org/binary-tree-data-structure/" },
      { title: "AVL Trees", url: "https://www.geeksforgeeks.org/avl-tree-set-1-insertion/" }
    ],
    practice: [
      { title: "Tree Problems - LeetCode", url: "https://leetcode.com/tag/tree/" }
    ]
  },
  CPP: {
    videos: [
      { title: "C++ Tutorial - Derek Banas", url: "https://www.youtube.com/watch?v=vLnPwxZdW4Y", duration: "4 hours" },
      { title: "C++ STL - GeeksforGeeks", url: "https://www.youtube.com/watch?v=RRVYpIET_RU", duration: "1 hour" },
      { title: "Modern C++ Features", url: "https://www.youtube.com/watch?v=mUQZ1qmKlLY", duration: "45 min" }
    ],
    articles: [
      { title: "C++ Reference - cppreference.com", url: "https://en.cppreference.com/" },
      { title: "C++ Core Guidelines", url: "https://isocpp.github.io/CppCoreGuidelines/" }
    ],
    practice: [
      { title: "C++ Problems - HackerRank", url: "https://www.hackerrank.com/domains/cpp" },
      { title: "C++ Practice - LeetCode", url: "https://leetcode.com/problemset/all/?topicSlugs=array&difficulty=Easy&listId=wpwgkgt" }
    ]
  }
};

export const conceptNotesData = {
  Arrays: {
    title: "Arrays - Complete Tutorial",
    toc: [
      "Understanding Arrays",
      "Memory Representation", 
      "Core Operations",
      "Advanced Techniques",
      "Practice Problems",
      "Time Complexity Summary"
    ],
    hasResources: true,
    content: `# Arrays - The Complete Masterclass

## Table of Contents
1. [Understanding Arrays](#understanding)
2. [Memory Representation](#memory)
3. [Core Operations](#operations)
4. [Advanced Techniques](#advanced)
5. [Practice Problems](#practice)
6. [Time Complexity Summary](#complexity)

Arrays are the backbone of computer science and programming. This comprehensive guide will take you from absolute beginner to expert level. Every concept is explained with real examples, complete code, and practical applications.

## Chapter 1: Understanding Arrays from Scratch

### What Exactly is an Array?

An array is a **collection of elements** stored in **contiguous memory locations**. Think of it as:

**Real-world Analogy 1 - Apartment Building:**
- Building has numbered apartments: 0, 1, 2, 3, 4...
- Each apartment can hold one resident (data)
- You can directly go to apartment 3 without visiting 0, 1, 2
- All apartments are in the same building (contiguous memory)

**Real-world Analogy 2 - Library Bookshelf:**
- Books arranged in order: Position 0, 1, 2, 3...
- Each position holds exactly one book
- You can grab book at position 5 directly
- All books are on the same shelf

**Real-world Analogy 3 - Train Compartments:**
- Train has compartments numbered 0, 1, 2, 3...
- Each compartment holds passengers (data)
- Conductor can check any compartment directly by number
- All compartments are connected (contiguous)

### Memory Representation

\`\`\`
Memory Layout of int[] arr = {10, 20, 30, 40, 50};

Memory Address:  1000  1004  1008  1012  1016
Array Index:       0     1     2     3     4
Values:           10    20    30    40    50

// Each integer takes 4 bytes
// arr[0] is at address 1000
// arr[1] is at address 1004 (1000 + 4)
// arr[2] is at address 1008 (1000 + 8)
// Formula: address = base_address + (index * size_of_datatype)
\`\`\`

### Why Arrays are Important?

1. **Foundation of Data Structures**: Lists, stacks, queues all use arrays internally
2. **Memory Efficiency**: No extra overhead, just pure data storage
3. **Cache Performance**: Accessing nearby elements is super fast
4. **Mathematical Operations**: Perfect for matrices, vectors, algorithms
5. **Real Applications**: Image processing, databases, games, AI

## Chapter 2: Array Fundamentals Deep Dive

### Array Properties Explained

#### 1. Fixed Size (Static Arrays)
\`\`\`
// Once declared, size cannot change
int[] numbers = new int[5];  // Always 5 elements
// numbers.length = 10;  // ERROR! Cannot change size

// Why fixed size?
// - Memory is allocated at compile time
// - Ensures predictable memory usage
// - Enables O(1) access time
\`\`\`

#### 2. Homogeneous Elements
\`\`\`
// All elements must be same data type
int[] integers = {1, 2, 3, 4, 5};        // ✓ Valid
String[] names = {"John", "Jane", "Bob"}; // ✓ Valid
// int[] mixed = {1, "hello", 3.14};     // ✗ Invalid

// Why homogeneous?
// - Ensures consistent memory allocation
// - Enables pointer arithmetic for indexing
// - Type safety at compile time
\`\`\`

#### 3. Zero-Based Indexing
\`\`\`
int[] scores = {95, 87, 92, 78, 85};
//              0   1   2   3   4   <- indices

// Why start from 0?
// - Memory address calculation: base + (index * size)
// - If started from 1: base + ((index-1) * size) - extra subtraction!
// - 0-based indexing is more efficient
\`\`\`

#### 4. Contiguous Memory Layout
\`\`\`
// Elements stored next to each other
int[] arr = {10, 20, 30};

// Memory layout:
// [10][20][30] <- consecutive memory blocks
// Not: [10]...[20]...[30] <- scattered memory

// Benefits:
// - Cache locality: accessing arr[i] loads arr[i+1] into cache
// - Predictable memory access patterns
// - Better performance for sequential access
\`\`\`

### Array Declaration and Initialization - Complete Guide

#### Method 1: Declare then Initialize
\`\`\`
// Step 1: Declare array variable
int[] numbers;

// Step 2: Allocate memory
numbers = new int[5];  // Creates array of 5 integers (all 0)

// Step 3: Assign values
numbers[0] = 10;
numbers[1] = 20;
numbers[2] = 30;
numbers[3] = 40;
numbers[4] = 50;

System.out.println(Arrays.toString(numbers)); // [10, 20, 30, 40, 50]
\`\`\`

#### Method 2: Declare and Initialize Together
\`\`\`
// Array literal syntax
int[] scores = {95, 87, 92, 78, 85};

// Equivalent to:
int[] scores = new int[]{95, 87, 92, 78, 85};

// Different data types
String[] names = {"Alice", "Bob", "Charlie"};
double[] prices = {19.99, 25.50, 12.75};
boolean[] flags = {true, false, true, true};
char[] vowels = {'a', 'e', 'i', 'o', 'u'};
\`\`\`

#### Method 3: Dynamic Size (User Input)
\`\`\`
Scanner scanner = new Scanner(System.in);
System.out.print("Enter array size: ");
int size = scanner.nextInt();

// Create array with user-specified size
int[] userArray = new int[size];

// Fill array with user input
System.out.println("Enter " + size + " numbers:");
for(int i = 0; i < size; i++) {
    userArray[i] = scanner.nextInt();
}
\`\`\`

## Chapter 3: Core Operations - Complete Implementation

### 1. Accessing Elements - O(1) Time Complexity

#### Basic Access
\`\`\`
int[] arr = {10, 20, 30, 40, 50};

// Direct access by index
int first = arr[0];        // 10
int third = arr[2];        // 30
int last = arr[arr.length - 1];  // 50

// Why O(1)?
// Formula: memory_address = base_address + (index * element_size)
// Example: arr[3] = 1000 + (3 * 4) = 1012
// No loops, no searching - direct calculation!
\`\`\`

#### Safe Access with Bounds Checking
\`\`\`
public static int safeGet(int[] arr, int index) {
    // Always check bounds before accessing
    if(index < 0 || index >= arr.length) {
        throw new ArrayIndexOutOfBoundsException(
            "Index " + index + " out of bounds for array length " + arr.length
        );
    }
    return arr[index];
}

// Usage
int[] numbers = {1, 2, 3};
int value = safeGet(numbers, 1);  // Returns 2
// int invalid = safeGet(numbers, 5);  // Throws exception
\`\`\`

### 2. Array Traversal - Complete Guide

#### Method 1: Traditional For Loop (Most Control)
\`\`\`
int[] arr = {10, 20, 30, 40, 50};

// Forward traversal
System.out.println("Forward traversal:");
for(int i = 0; i < arr.length; i++) {
    System.out.println("Index " + i + ": " + arr[i]);
}

// Backward traversal
System.out.println("Backward traversal:");
for(int i = arr.length - 1; i >= 0; i--) {
    System.out.println("Index " + i + ": " + arr[i]);
}
\`\`\`

#### Method 2: Enhanced For Loop (Cleaner Syntax)
\`\`\`
int[] arr = {10, 20, 30, 40, 50};

// Enhanced for loop (for-each)
System.out.println("Enhanced for loop:");
for(int element : arr) {
    System.out.println(element);
}
\`\`\`

### 3. Searching Algorithms - Complete Implementation

#### Linear Search - O(n) Time Complexity
\`\`\`
public static int linearSearch(int[] arr, int target) {
    // Check each element from start to end
    for(int i = 0; i < arr.length; i++) {
        if(arr[i] == target) {
            return i;  // Found at index i
        }
    }
    return -1;  // Not found
}
\`\`\`

#### Binary Search - O(log n) Time Complexity
\`\`\`
public static int binarySearch(int[] arr, int target) {
    int left = 0;
    int right = arr.length - 1;
    
    while(left <= right) {
        int mid = left + (right - left) / 2;
        
        if(arr[mid] == target) {
            return mid;  // Found at middle
        }
        else if(arr[mid] < target) {
            left = mid + 1;  // Search right half
        }
        else {
            right = mid - 1;  // Search left half
        }
    }
    
    return -1;  // Not found
}
\`\`\`

### 4. Insertion Operations - Complete Implementation

#### Insert at Beginning - O(n) Time Complexity
\`\`\`
public static int[] insertAtBeginning(int[] arr, int element) {
    // Create new array with size + 1
    int[] newArr = new int[arr.length + 1];
    
    // Insert new element at index 0
    newArr[0] = element;
    
    // Copy all existing elements (shift right by 1)
    for(int i = 0; i < arr.length; i++) {
        newArr[i + 1] = arr[i];
    }
    
    return newArr;
}
\`\`\`

#### Insert at End - O(1) Time Complexity
\`\`\`
public static int[] insertAtEnd(int[] arr, int element) {
    // Create new array with size + 1
    int[] newArr = new int[arr.length + 1];
    
    // Copy all existing elements
    for(int i = 0; i < arr.length; i++) {
        newArr[i] = arr[i];
    }
    
    // Insert new element at end
    newArr[arr.length] = element;
    
    return newArr;
}
\`\`\`

### 5. Deletion Operations - Complete Implementation

#### Delete from Beginning - O(n) Time Complexity
\`\`\`
public static int[] deleteFromBeginning(int[] arr) {
    if(arr.length == 0) {
        throw new IllegalStateException("Cannot delete from empty array");
    }
    
    // Create new array with size - 1
    int[] newArr = new int[arr.length - 1];
    
    // Copy all elements except first (shift left by 1)
    for(int i = 1; i < arr.length; i++) {
        newArr[i - 1] = arr[i];
    }
    
    return newArr;
}
\`\`\`

## Chapter 4: Advanced Techniques

### Two Pointers Technique
\`\`\`
// Find pair with given sum
public static boolean findPairWithSum(int[] arr, int target) {
    Arrays.sort(arr);  // Sort first
    int left = 0, right = arr.length - 1;
    
    while(left < right) {
        int sum = arr[left] + arr[right];
        
        if(sum == target) return true;
        else if(sum < target) left++;
        else right--;
    }
    return false;
}
\`\`\`

### Sliding Window Technique
\`\`\`
// Maximum sum of k consecutive elements
public static int maxSumOfKElements(int[] arr, int k) {
    if(arr.length < k) return -1;
    
    // Calculate sum of first window
    int windowSum = 0;
    for(int i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    
    int maxSum = windowSum;
    
    // Slide the window
    for(int i = k; i < arr.length; i++) {
        windowSum = windowSum - arr[i-k] + arr[i];
        maxSum = Math.max(maxSum, windowSum);
    }
    
    return maxSum;
}
\`\`\`

### Kadane's Algorithm (Maximum Subarray Sum)
\`\`\`
public static int maxSubarraySum(int[] arr) {
    int maxSoFar = arr[0];
    int maxEndingHere = arr[0];
    
    for(int i = 1; i < arr.length; i++) {
        maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);
        maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }
    
    return maxSoFar;
}
\`\`\`

## Time & Space Complexity Summary

| Operation | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| Access | O(1) | O(1) |
| Search | O(n) | O(1) |
| Insertion | O(n) | O(1) |
| Deletion | O(n) | O(1) |
| Traversal | O(n) | O(1) |

## Advantages vs Disadvantages

### Advantages:
- **Lightning Fast Access**: O(1) time to access any element
- **Memory Efficient**: No extra memory overhead
- **Cache Friendly**: Elements stored contiguously
- **Simple to Use**: Easy to understand and implement

### Disadvantages:
- **Fixed Size**: Cannot grow or shrink dynamically
- **Expensive Insertion/Deletion**: O(n) time complexity
- **Memory Waste**: Unused space if array not full
- **No Built-in Safety**: No automatic bounds checking

## Pro Tips for Interviews

1. **Always check array bounds** before accessing elements
2. **Use two pointers** for problems involving pairs or palindromes
3. **Consider sorting** if it makes the problem easier
4. **Think about edge cases**: empty array, single element, all same elements
5. **Optimize space**: Can you solve it in O(1) extra space?
6. **Practice these patterns**: Two pointers, Sliding window, Prefix sum

## Next Steps

Now that you've mastered arrays, you're ready for:
- **Dynamic Arrays** (ArrayList, Vector)
- **2D Arrays** (Matrices)
- **Strings** (Character arrays)
- **Linked Lists** (Dynamic data structures)

**Remember**: Arrays are the foundation of almost every other data structure. Master them, and you'll excel in programming!

**Practice Problems**: Start with easy array problems on LeetCode, then gradually move to medium and hard ones. You've got this!

Welcome to the most comprehensive Arrays tutorial. By the end of this, you'll be an Array master! Let's dive in!

## What is an Array?

Imagine you have a **row of lockers** in school, each numbered 0, 1, 2, 3... That's exactly what an array is!

**Real-life example**: Think of an apartment building with numbered flats:
- Flat 0: John lives here
- Flat 1: Sarah lives here  
- Flat 2: Mike lives here

In programming:
\`\`\`
int[] residents = {"John", "Sarah", "Mike"};
// residents[0] = "John"
// residents[1] = "Sarah" 
// residents[2] = "Mike"
\`\`\`

## Array Fundamentals

### **Key Properties:**
- **Fixed Size**: Once created, size cannot change (like a building with fixed flats)
- **Same Data Type**: All elements must be same type (all integers OR all strings)
- **Zero Indexing**: First element is at index 0, not 1!
- **Contiguous Memory**: Elements stored next to each other in memory

### **Declaration & Initialization:**
\`\`\`
// Method 1: Declare then assign
int[] numbers = new int[5];  // Creates array of size 5
numbers[0] = 10;
numbers[1] = 20;

// Method 2: Declare and initialize together
int[] scores = {95, 87, 92, 78, 85};

// Method 3: Using new keyword
int[] ages = new int[]{25, 30, 35, 40};
\`\`\`

## Core Operations (Must Know!)

### **1. Accessing Elements - O(1)**
\`\`\`
int[] arr = {10, 20, 30, 40, 50};
System.out.println(arr[0]);  // Output: 10
System.out.println(arr[2]);  // Output: 30

// WARNING: Be careful with bounds!
// arr[5] will give ArrayIndexOutOfBoundsException
\`\`\`

### **2. Traversing (Visiting all elements)**
\`\`\`
// Method 1: Traditional for loop
for(int i = 0; i < arr.length; i++) {
    System.out.println(arr[i]);
}

// Method 2: Enhanced for loop (recommended)
for(int element : arr) {
    System.out.println(element);
}

// Method 3: While loop
int i = 0;
while(i < arr.length) {
    System.out.println(arr[i]);
    i++;
}
\`\`\`

### **3. Searching Elements**
\`\`\`
// Linear Search - O(n)
public static int linearSearch(int[] arr, int target) {
    for(int i = 0; i < arr.length; i++) {
        if(arr[i] == target) {
            return i;  // Found at index i
        }
    }
    return -1;  // Not found
}

// Binary Search - O(log n) [Only for sorted arrays]
public static int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    
    while(left <= right) {
        int mid = left + (right - left) / 2;
        
        if(arr[mid] == target) return mid;
        else if(arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}
\`\`\`

### **4. Insertion Operations**
\`\`\`
// Insert at beginning - O(n)
public static int[] insertAtBeginning(int[] arr, int element) {
    int[] newArr = new int[arr.length + 1];
    newArr[0] = element;
    
    for(int i = 0; i < arr.length; i++) {
        newArr[i + 1] = arr[i];
    }
    return newArr;
}

// Insert at end - O(1) if space available
public static int[] insertAtEnd(int[] arr, int element) {
    int[] newArr = new int[arr.length + 1];
    
    for(int i = 0; i < arr.length; i++) {
        newArr[i] = arr[i];
    }
    newArr[arr.length] = element;
    return newArr;
}

// Insert at specific position - O(n)
public static int[] insertAtPosition(int[] arr, int element, int pos) {
    int[] newArr = new int[arr.length + 1];
    
    for(int i = 0; i < pos; i++) {
        newArr[i] = arr[i];
    }
    
    newArr[pos] = element;
    
    for(int i = pos; i < arr.length; i++) {
        newArr[i + 1] = arr[i];
    }
    return newArr;
}
\`\`\`

### **5. Deletion Operations**
\`\`\`
// Delete from beginning - O(n)
public static int[] deleteFromBeginning(int[] arr) {
    if(arr.length == 0) return arr;
    
    int[] newArr = new int[arr.length - 1];
    for(int i = 1; i < arr.length; i++) {
        newArr[i - 1] = arr[i];
    }
    return newArr;
}

// Delete from end - O(1)
public static int[] deleteFromEnd(int[] arr) {
    if(arr.length == 0) return arr;
    
    int[] newArr = new int[arr.length - 1];
    for(int i = 0; i < arr.length - 1; i++) {
        newArr[i] = arr[i];
    }
    return newArr;
}

// Delete from specific position - O(n)
public static int[] deleteFromPosition(int[] arr, int pos) {
    if(pos < 0 || pos >= arr.length) return arr;
    
    int[] newArr = new int[arr.length - 1];
    
    for(int i = 0; i < pos; i++) {
        newArr[i] = arr[i];
    }
    
    for(int i = pos + 1; i < arr.length; i++) {
        newArr[i - 1] = arr[i];
    }
    return newArr;
}
\`\`\`

## Advanced Techniques (Interview Favorites!)

### **1. Two Pointers Technique**
\`\`\`
// Find pair with given sum
public static boolean findPairWithSum(int[] arr, int target) {
    Arrays.sort(arr);  // Sort first
    int left = 0, right = arr.length - 1;
    
    while(left < right) {
        int sum = arr[left] + arr[right];
        
        if(sum == target) return true;
        else if(sum < target) left++;
        else right--;
    }
    return false;
}

// Remove duplicates from sorted array
public static int removeDuplicates(int[] arr) {
    if(arr.length == 0) return 0;
    
    int writeIndex = 1;
    
    for(int i = 1; i < arr.length; i++) {
        if(arr[i] != arr[i-1]) {
            arr[writeIndex] = arr[i];
            writeIndex++;
        }
    }
    return writeIndex;
}
\`\`\`

### **2. Sliding Window Technique**
\`\`\`
// Maximum sum of k consecutive elements
public static int maxSumOfKElements(int[] arr, int k) {
    if(arr.length < k) return -1;
    
    // Calculate sum of first window
    int windowSum = 0;
    for(int i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    
    int maxSum = windowSum;
    
    // Slide the window
    for(int i = k; i < arr.length; i++) {
        windowSum = windowSum - arr[i-k] + arr[i];
        maxSum = Math.max(maxSum, windowSum);
    }
    
    return maxSum;
}
\`\`\`

### **3. Prefix Sum Technique**
\`\`\`
// Range sum queries in O(1) time
class PrefixSum {
    private int[] prefixSum;
    
    public PrefixSum(int[] arr) {
        prefixSum = new int[arr.length + 1];
        
        for(int i = 0; i < arr.length; i++) {
            prefixSum[i + 1] = prefixSum[i] + arr[i];
        }
    }
    
    // Get sum from index left to right (inclusive)
    public int getRangeSum(int left, int right) {
        return prefixSum[right + 1] - prefixSum[left];
    }
}
\`\`\`

## Must-Know Array Problems

### **1. Kadane's Algorithm (Maximum Subarray Sum)**
\`\`\`
public static int maxSubarraySum(int[] arr) {
    int maxSoFar = arr[0];
    int maxEndingHere = arr[0];
    
    for(int i = 1; i < arr.length; i++) {
        maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);
        maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }
    
    return maxSoFar;
}
\`\`\`

### **2. Array Rotation**
\`\`\`
// Rotate array to right by k positions
public static void rotateRight(int[] arr, int k) {
    int n = arr.length;
    k = k % n;  // Handle k > n
    
    // Reverse entire array
    reverse(arr, 0, n - 1);
    
    // Reverse first k elements
    reverse(arr, 0, k - 1);
    
    // Reverse remaining elements
    reverse(arr, k, n - 1);
}

private static void reverse(int[] arr, int start, int end) {
    while(start < end) {
        int temp = arr[start];
        arr[start] = arr[end];
        arr[end] = temp;
        start++;
        end--;
    }
}
\`\`\`

### **3. Find Missing Number**
\`\`\`
// Array contains numbers 1 to n, one number is missing
public static int findMissingNumber(int[] arr, int n) {
    // Method 1: Using sum formula
    int expectedSum = n * (n + 1) / 2;
    int actualSum = 0;
    
    for(int num : arr) {
        actualSum += num;
    }
    
    return expectedSum - actualSum;
    
    // Method 2: Using XOR (more efficient)
    int xor1 = 0, xor2 = 0;
    
    for(int i = 0; i < arr.length; i++) {
        xor1 ^= arr[i];
    }
    
    for(int i = 1; i <= n; i++) {
        xor2 ^= i;
    }
    
    return xor1 ^ xor2;
}
\`\`\`

## Time & Space Complexity Summary

| Operation | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| Access | O(1) | O(1) |
| Search | O(n) | O(1) |
| Insertion | O(n) | O(1) |
| Deletion | O(n) | O(1) |
| Traversal | O(n) | O(1) |

## Advantages vs Disadvantages

### **Advantages:**
- **Lightning Fast Access**: O(1) time to access any element
- **Memory Efficient**: No extra memory overhead
- **Cache Friendly**: Elements stored contiguously
- **Simple to Use**: Easy to understand and implement

### **Disadvantages:**
- **Fixed Size**: Cannot grow or shrink dynamically
- **Expensive Insertion/Deletion**: O(n) time complexity
- **Memory Waste**: Unused space if array not full
- **No Built-in Safety**: No automatic bounds checking

## Pro Tips for Interviews

1. **Always check array bounds** before accessing elements
2. **Use two pointers** for problems involving pairs or palindromes
3. **Consider sorting** if it makes the problem easier
4. **Think about edge cases**: empty array, single element, all same elements
5. **Optimize space**: Can you solve it in O(1) extra space?
6. **Practice these patterns**: Two pointers, Sliding window, Prefix sum

## Next Steps

Now that you've mastered arrays, you're ready for:
- **Dynamic Arrays** (ArrayList, Vector)
- **2D Arrays** (Matrices)
- **Strings** (Character arrays)
- **Linked Lists** (Dynamic data structures)

**Remember**: Arrays are the foundation of almost every other data structure. Master them, and you'll excel in programming!

**Practice Problems**: Start with easy array problems on LeetCode, then gradually move to medium and hard ones. You've got this!`,
    
    examples: [
      {
        input: "int[] arr = {10, 20, 30, 40, 50}; arr[2]",
        output: "30",
        explanation: "Direct access to index 2 returns the value 30 in O(1) time",
        runnable: true
      },
      {
        input: "findPairWithSum([1, 2, 3, 4, 5], 7)",
        output: "true (indices 2 and 3: 3+4=7)",
        explanation: "Two pointers technique finds pair with sum 7 efficiently",
        runnable: true
      },
      {
        input: "Given a rotated sorted array, find the pivot index",
        output: "Binary search approach in O(log n)",
        explanation: "Find the point where array was rotated using modified binary search",
        difficulty: "Medium"
      },
      {
        input: "Find the number of subarrays with sum = K",
        output: "Use prefix sum + hashmap approach",
        explanation: "Efficient O(n) solution using cumulative sum technique",
        difficulty: "Medium"
      },
      {
        input: "Dutch National Flag Problem",
        output: "Sort 0s, 1s, 2s in O(n) time, O(1) space",
        explanation: "Three-pointer technique for in-place sorting",
        difficulty: "Hard"
      }
    ],
    
    practiceProblems: [
      "Two Sum",
      "Best Time to Buy and Sell Stock",
      "Contains Duplicate",
      "Product of Array Except Self",
      "Maximum Subarray",
      "Merge Intervals",
      "3Sum",
      "Container With Most Water",
      "Rotate Array",
      "Find Minimum in Rotated Sorted Array"
    ],
    
    quiz: [
      {
        question: "What is the time complexity of accessing an element in an array?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correct: 0,
        explanation: "Array access is O(1) because we can directly calculate memory address"
      },
      {
        question: "Which technique is best for finding pairs with given sum in sorted array?",
        options: ["Nested loops", "Two pointers", "Binary search", "Hashing"],
        correct: 1,
        explanation: "Two pointers technique works optimally for sorted arrays in O(n) time"
      }
    ],
    
    timeComplexity: "Access: O(1), Search: O(n), Insert/Delete: O(n)",
    spaceComplexity: "O(1) for operations, O(n) for storage"
  },

  Strings: {
    title: "Strings - Complete Tutorial",
    toc: [
      "String Fundamentals",
      "Pattern Matching Algorithms", 
      "String Manipulation",
      "Advanced Techniques",
      "Practice Problems"
    ],
    content: `# Strings - Master Text Processing

Strings are everywhere in programming! From user input to data processing, mastering strings is crucial for any programmer.

## What is a String?

A string is a **sequence of characters** stored in memory. Think of it as a **chain of letters, numbers, and symbols**.

**Real-life example**: Your name "John Doe" is a string containing:
- Characters: J, o, h, n, space, D, o, e
- Length: 8 characters
- Indexed from 0 to 7

\`\`\`
String name = "John Doe";
// name[0] = 'J'
// name[1] = 'o'
// name[4] = ' ' (space)
// name[7] = 'e'
\`\`\`

## String Fundamentals

### **Key Properties:**
- **Immutable**: Once created, cannot be changed (in most languages)
- **Indexed Access**: Each character has a position (0-based)
- **Length Property**: Built-in method to get string length
- **Unicode Support**: Can store international characters

### **String Declaration:**
\`\`\`
// Method 1: String literal
String greeting = "Hello World";

// Method 2: Using constructor
String message = new String("Welcome");

// Method 3: From character array
char[] chars = {'H', 'e', 'l', 'l', 'o'};
String word = new String(chars);

// Method 4: Empty string
String empty = "";
String alsoEmpty = new String();
\`\`\`

## Core String Operations

### **1. Length and Access - O(1)**
\`\`\`
String text = "Programming";

// Get length
int length = text.length();  // Returns 11

// Access character at index
char firstChar = text.charAt(0);    // 'P'
char lastChar = text.charAt(length-1);  // 'g'

// Check if empty
boolean isEmpty = text.isEmpty();  // false
boolean isBlank = text.isBlank();  // false (Java 11+)
\`\`\`

### **2. String Comparison**
\`\`\`
String str1 = "Hello";
String str2 = "hello";
String str3 = "Hello";

// Case-sensitive comparison
boolean equal1 = str1.equals(str3);        // true
boolean equal2 = str1.equals(str2);        // false

// Case-insensitive comparison
boolean equalIgnoreCase = str1.equalsIgnoreCase(str2);  // true

// Lexicographic comparison
int result = str1.compareTo(str2);  // negative (str1 < str2)
int result2 = str1.compareTo(str3); // 0 (equal)

// NEVER use == for string comparison!
// It compares references, not content
\`\`\`

### **3. Substring Operations**
\`\`\`
String text = "Hello World";

// Extract substring
String sub1 = text.substring(0, 5);    // "Hello"
String sub2 = text.substring(6);       // "World"
String sub3 = text.substring(1, 4);    // "ell"

// Check if contains substring
boolean contains = text.contains("World");  // true
boolean startsWith = text.startsWith("Hello");  // true
boolean endsWith = text.endsWith("World");    // true
\`\`\`

### **4. String Modification (Creates New String)**
\`\`\`
String original = "  Hello World  ";

// Case conversion
String upper = original.toUpperCase();    // "  HELLO WORLD  "
String lower = original.toLowerCase();    // "  hello world  "

// Trimming whitespace
String trimmed = original.trim();         // "Hello World"
String stripped = original.strip();       // "Hello World" (Java 11+)

// Replace operations
String replaced = original.replace(" ", "_");     // "__Hello_World__"
String replacedFirst = original.replaceFirst(" ", "_");  // "_Hello World  "
String replacedAll = original.replaceAll("\\s+", "_");   // "_Hello_World_"
\`\`\`

### **5. String Splitting and Joining**
\`\`\`
// Splitting strings
String csv = "apple,banana,orange,grape";
String[] fruits = csv.split(",");  // ["apple", "banana", "orange", "grape"]

String sentence = "Hello world programming";
String[] words = sentence.split(" ");  // ["Hello", "world", "programming"]

// Joining strings
String[] names = {"John", "Jane", "Bob"};
String joined = String.join(", ", names);  // "John, Jane, Bob"

// StringBuilder for efficient concatenation
StringBuilder sb = new StringBuilder();
sb.append("Hello");
sb.append(" ");
sb.append("World");
String result = sb.toString();  // "Hello World"
\`\`\`

## Advanced String Algorithms

### **1. Pattern Matching Algorithms**

#### **Naive Pattern Search - O(n*m)**
\`\`\`
public static int naiveSearch(String text, String pattern) {
    int n = text.length();
    int m = pattern.length();
    
    for(int i = 0; i <= n - m; i++) {
        int j;
        for(j = 0; j < m; j++) {
            if(text.charAt(i + j) != pattern.charAt(j)) {
                break;
            }
        }
        if(j == m) {
            return i;  // Pattern found at index i
        }
    }
    return -1;  // Pattern not found
}
\`\`\`

#### **KMP Algorithm - O(n+m)**
\`\`\`
public static int KMPSearch(String text, String pattern) {
    int[] lps = computeLPS(pattern);
    int i = 0, j = 0;
    
    while(i < text.length()) {
        if(text.charAt(i) == pattern.charAt(j)) {
            i++;
            j++;
        }
        
        if(j == pattern.length()) {
            return i - j;  // Pattern found
        } else if(i < text.length() && text.charAt(i) != pattern.charAt(j)) {
            if(j != 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }
    return -1;
}

private static int[] computeLPS(String pattern) {
    int[] lps = new int[pattern.length()];
    int len = 0;
    int i = 1;
    
    while(i < pattern.length()) {
        if(pattern.charAt(i) == pattern.charAt(len)) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if(len != 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    return lps;
}
\`\`\`

### **2. String Manipulation Problems**

#### **Reverse a String**
\`\`\`
// Method 1: Using StringBuilder
public static String reverseString1(String str) {
    return new StringBuilder(str).reverse().toString();
}

// Method 2: Using character array
public static String reverseString2(String str) {
    char[] chars = str.toCharArray();
    int left = 0, right = chars.length - 1;
    
    while(left < right) {
        char temp = chars[left];
        chars[left] = chars[right];
        chars[right] = temp;
        left++;
        right--;
    }
    
    return new String(chars);
}

// Method 3: Recursive
public static String reverseString3(String str) {
    if(str.length() <= 1) {
        return str;
    }
    return str.charAt(str.length() - 1) + reverseString3(str.substring(0, str.length() - 1));
}
\`\`\`

#### **Check Palindrome**
\`\`\`
public static boolean isPalindrome(String str) {
    // Clean string: remove non-alphanumeric and convert to lowercase
    String cleaned = str.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    
    int left = 0, right = cleaned.length() - 1;
    
    while(left < right) {
        if(cleaned.charAt(left) != cleaned.charAt(right)) {
            return false;
        }
        left++;
        right--;
    }
    
    return true;
}
\`\`\`

#### **Anagram Check**
\`\`\`
public static boolean areAnagrams(String str1, String str2) {
    if(str1.length() != str2.length()) {
        return false;
    }
    
    // Method 1: Sort and compare
    char[] chars1 = str1.toLowerCase().toCharArray();
    char[] chars2 = str2.toLowerCase().toCharArray();
    
    Arrays.sort(chars1);
    Arrays.sort(chars2);
    
    return Arrays.equals(chars1, chars2);
}

// Method 2: Character frequency count
public static boolean areAnagrams2(String str1, String str2) {
    if(str1.length() != str2.length()) {
        return false;
    }
    
    int[] count = new int[26];  // For lowercase letters
    
    for(int i = 0; i < str1.length(); i++) {
        count[str1.charAt(i) - 'a']++;
        count[str2.charAt(i) - 'a']--;
    }
    
    for(int c : count) {
        if(c != 0) return false;
    }
    
    return true;
}
\`\`\`

#### **Longest Common Subsequence**
\`\`\`
public static int longestCommonSubsequence(String str1, String str2) {
    int m = str1.length();
    int n = str2.length();
    int[][] dp = new int[m + 1][n + 1];
    
    for(int i = 1; i <= m; i++) {
        for(int j = 1; j <= n; j++) {
            if(str1.charAt(i - 1) == str2.charAt(j - 1)) {
                dp[i][j] = 1 + dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    return dp[m][n];
}
\`\`\`

### **3. Advanced String Techniques**

#### **Rolling Hash (Rabin-Karp)**
\`\`\`
class RollingHash {
    private static final int BASE = 256;
    private static final int MOD = 101;
    
    public static int search(String text, String pattern) {
        int m = pattern.length();
        int n = text.length();
        
        int patternHash = 0;
        int textHash = 0;
        int h = 1;
        
        // Calculate h = pow(BASE, m-1) % MOD
        for(int i = 0; i < m - 1; i++) {
            h = (h * BASE) % MOD;
        }
        
        // Calculate hash for pattern and first window
        for(int i = 0; i < m; i++) {
            patternHash = (BASE * patternHash + pattern.charAt(i)) % MOD;
            textHash = (BASE * textHash + text.charAt(i)) % MOD;
        }
        
        // Slide the pattern over text
        for(int i = 0; i <= n - m; i++) {
            if(patternHash == textHash) {
                // Check character by character
                boolean match = true;
                for(int j = 0; j < m; j++) {
                    if(text.charAt(i + j) != pattern.charAt(j)) {
                        match = false;
                        break;
                    }
                }
                if(match) return i;
            }
            
            // Calculate hash for next window
            if(i < n - m) {
                textHash = (BASE * (textHash - text.charAt(i) * h) + text.charAt(i + m)) % MOD;
                if(textHash < 0) textHash += MOD;
            }
        }
        
        return -1;
    }
}
\`\`\`

## String Performance Optimization

### **StringBuilder vs String Concatenation**
\`\`\`
// BAD: O(n²) time complexity
public static String inefficientConcat(String[] words) {
    String result = "";
    for(String word : words) {
        result += word;  // Creates new string each time!
    }
    return result;
}

// GOOD: O(n) time complexity
public static String efficientConcat(String[] words) {
    StringBuilder sb = new StringBuilder();
    for(String word : words) {
        sb.append(word);
    }
    return sb.toString();
}

// BEST: When you know the size
public static String bestConcat(String[] words) {
    int totalLength = 0;
    for(String word : words) {
        totalLength += word.length();
    }
    
    StringBuilder sb = new StringBuilder(totalLength);
    for(String word : words) {
        sb.append(word);
    }
    return sb.toString();
}
\`\`\`

## Time & Space Complexity Summary

| Operation | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| Access charAt() | O(1) | O(1) |
| Length | O(1) | O(1) |
| Substring | O(k) | O(k) |
| Concatenation | O(n+m) | O(n+m) |
| Search (naive) | O(n*m) | O(1) |
| Search (KMP) | O(n+m) | O(m) |
| Split | O(n) | O(n) |

## Common String Interview Problems

1. **Reverse String / Reverse Words**
2. **Palindrome Check / Longest Palindrome**
3. **Anagram Detection / Group Anagrams**
4. **String Pattern Matching**
5. **Longest Common Subsequence/Substring**
6. **String Compression**
7. **Valid Parentheses**
8. **Edit Distance**
9. **Word Break Problem**
10. **Regular Expression Matching**

## Pro Tips for String Problems

1. **Use StringBuilder** for multiple concatenations
2. **Consider two pointers** for palindrome/reverse problems
3. **Hash maps** are great for character frequency problems
4. **Sliding window** technique for substring problems
5. **Dynamic Programming** for complex string matching
6. **Always handle edge cases**: null, empty strings
7. **Be careful with string immutability**

## Memory Management

### **String Interning**
\`\`\`
String str1 = "Hello";        // Stored in string pool
String str2 = "Hello";        // References same object in pool
String str3 = new String("Hello");  // Creates new object in heap

System.out.println(str1 == str2);     // true (same reference)
System.out.println(str1 == str3);     // false (different references)
System.out.println(str1.equals(str3)); // true (same content)
\`\`\`

## Next Steps

After mastering strings, explore:
- **Regular Expressions** (Pattern matching)
- **Text Processing** (Parsing, tokenization)
- **String Algorithms** (Suffix arrays, tries)
- **Unicode and Internationalization**

**Remember**: Strings are used everywhere in programming. Master string manipulation, and you'll solve countless real-world problems efficiently!

**Practice**: Start with basic string problems, then move to pattern matching and dynamic programming string problems.

## Key Characteristics:
- **Immutable**: In many languages, strings cannot be modified after creation
- **Character Array**: Internally represented as arrays of characters
- **Null Termination**: C-style strings end with null character '\\0'
- **Unicode Support**: Modern strings support international characters

## Common Operations:

### 1. String Traversal
\`\`\`
for (int i = 0; i < str.length(); i++) {
    process(str[i]);
}
\`\`\`

### 2. String Comparison
- Lexicographic comparison
- Case-sensitive vs case-insensitive
- Time Complexity: O(min(m,n)) where m,n are string lengths

### 3. Substring Operations
- **Substring extraction**: O(k) where k is substring length
- **Pattern searching**: O(n*m) naive, O(n+m) with KMP

## Important Algorithms:

### Pattern Matching Algorithms:
1. **Naive Algorithm**: O(n*m) time complexity
2. **KMP (Knuth-Morris-Pratt)**: O(n+m) time complexity
3. **Rabin-Karp**: O(n+m) average case using hashing
4. **Boyer-Moore**: O(n/m) best case, O(n*m) worst case

### String Processing Techniques:
1. **Two Pointers**: For palindrome checking, string reversal
2. **Sliding Window**: For substring problems
3. **Hashing**: For anagram detection, pattern matching
4. **Trie**: For prefix-based operations and autocomplete

## Common String Problems:
1. **Palindrome Check**
2. **Anagram Detection**
3. **Longest Common Subsequence**
4. **String Rotation**
5. **Valid Parentheses**
6. **Longest Palindromic Substring**
7. **String Compression**
8. **Word Break Problem**

## Advanced Concepts:

### Regular Expressions:
- Pattern matching with wildcards
- Text validation and extraction
- Complex string operations

### String Hashing:
- Rolling hash for efficient pattern matching
- Polynomial hashing for string comparison
- Hash-based string algorithms

## Memory Considerations:
- String concatenation can be expensive (O(n²) in naive approach)
- Use StringBuilder/StringBuffer for multiple concatenations
- Consider memory usage for large text processing

## Best Practices:
- Use appropriate string methods instead of manual character manipulation
- Consider string immutability when designing algorithms
- Use efficient algorithms for pattern matching
- Handle edge cases like empty strings and null values`,
    
    examples: [
      {
        input: 'isPalindrome("A man, a plan, a canal: Panama")',
        output: "true",
        explanation: "After removing non-alphanumeric characters and converting to lowercase, it reads the same forwards and backwards",
        runnable: true
      },
      {
        input: 'areAnagrams("listen", "silent")',
        output: "true",
        explanation: "Both strings contain the same characters with the same frequency",
        runnable: true
      },
      {
        input: 'boyerMooreSearch("ABAAABCDABABCABCABCABC", "ABCAB")',
        output: "10",
        explanation: "Boyer-Moore algorithm with good suffix and bad character heuristics",
        difficulty: "Advanced"
      },
      {
        input: 'minimumWindowSubstring("ADOBECODEBANC", "ABC")',
        output: "BANC",
        explanation: "Sliding window technique to find minimum window containing all characters",
        difficulty: "Hard"
      },
      {
        input: 'wildcardMatching("adceb", "*a*b")',
        output: "true",
        explanation: "Dynamic programming approach for pattern matching with wildcards",
        difficulty: "Hard"
      }
    ],
    
    practiceProblems: [
      "Valid Anagram",
      "Group Anagrams", 
      "Longest Palindromic Substring",
      "String to Integer (atoi)",
      "Implement strStr()",
      "Longest Common Prefix",
      "Valid Parentheses",
      "Generate Parentheses",
      "Letter Combinations of Phone Number",
      "Regular Expression Matching"
    ],
    
    timeComplexity: "Access: O(1), Search: O(n), Pattern Match: O(n+m)",
    spaceComplexity: "O(1) for operations, O(n) for storage"
  },

  "Stacks & Queues": {
    title: "Stacks & Queues - LIFO and FIFO Data Structures",
    toc: [
      "Stack Fundamentals",
      "Queue Fundamentals",
      "Implementation Techniques",
      "Advanced Applications",
      "Practice Problems"
    ],
    content: `# Stacks & Queues - Essential Linear Data Structures

## Stack - Last In First Out (LIFO)

### Stack Operations:
- **Push**: Add element to top - O(1)
- **Pop**: Remove element from top - O(1) 
- **Peek/Top**: View top element - O(1)
- **isEmpty**: Check if stack is empty - O(1)

### Implementation using Array:
\`\`\`cpp
class Stack {
private:
    vector<int> arr;
    int topIndex;
    
public:
    Stack() : topIndex(-1) {}
    
    void push(int x) {
        arr.push_back(x);
        topIndex++;
    }
    
    int pop() {
        if (isEmpty()) throw runtime_error("Stack underflow");
        int val = arr[topIndex];
        arr.pop_back();
        topIndex--;
        return val;
    }
    
    int top() {
        if (isEmpty()) throw runtime_error("Stack is empty");
        return arr[topIndex];
    }
    
    bool isEmpty() { return topIndex == -1; }
};
\`\`\`

### Stack using Two Queues:
\`\`\`cpp
class StackUsingQueues {
private:
    queue<int> q1, q2;
    
public:
    void push(int x) {
        q2.push(x);
        while (!q1.empty()) {
            q2.push(q1.front());
            q1.pop();
        }
        swap(q1, q2);
    }
    
    int pop() {
        if (q1.empty()) throw runtime_error("Stack is empty");
        int val = q1.front();
        q1.pop();
        return val;
    }
};
\`\`\`

## Queue - First In First Out (FIFO)

### Queue Operations:
- **Enqueue**: Add element to rear - O(1)
- **Dequeue**: Remove element from front - O(1)
- **Front**: View front element - O(1)
- **Rear**: View rear element - O(1)

### Queue using Two Stacks:
\`\`\`cpp
class QueueUsingStacks {
private:
    stack<int> s1, s2;
    
public:
    void enqueue(int x) {
        s1.push(x);
    }
    
    int dequeue() {
        if (s2.empty()) {
            while (!s1.empty()) {
                s2.push(s1.top());
                s1.pop();
            }
        }
        if (s2.empty()) throw runtime_error("Queue is empty");
        int val = s2.top();
        s2.pop();
        return val;
    }
};
\`\`\`

### Monotonic Queue for Sliding Window Maximum:
\`\`\`cpp
vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    deque<int> dq; // stores indices
    vector<int> result;
    
    for (int i = 0; i < nums.size(); i++) {
        // Remove indices outside window
        while (!dq.empty() && dq.front() <= i - k) {
            dq.pop_front();
        }
        
        // Remove smaller elements from rear
        while (!dq.empty() && nums[dq.back()] <= nums[i]) {
            dq.pop_back();
        }
        
        dq.push_back(i);
        
        if (i >= k - 1) {
            result.push_back(nums[dq.front()]);
        }
    }
    
    return result;
}
\`\`\`

## Applications:

### Stack Applications:
1. **Function Call Management** - Call stack
2. **Expression Evaluation** - Infix to postfix
3. **Parentheses Matching** - Balanced brackets
4. **Undo Operations** - Text editors
5. **Browser History** - Back button
6. **Depth-First Search** - Graph traversal

### Queue Applications:
1. **Process Scheduling** - Operating systems
2. **Breadth-First Search** - Graph traversal
3. **Buffer for Data Streams** - I/O operations
4. **Print Queue** - Printer management
5. **Level Order Traversal** - Trees
6. **Cache Implementation** - LRU cache`,
    
    examples: [
      {
        input: "Stack: push(1), push(2), push(3), pop(), pop()",
        output: "Stack contains: [1], popped: 3, 2",
        explanation: "LIFO behavior - last pushed elements are popped first"
      },
      {
        input: "Queue: enqueue(1), enqueue(2), enqueue(3), dequeue(), dequeue()",
        output: "Queue contains: [3], dequeued: 1, 2",
        explanation: "FIFO behavior - first enqueued elements are dequeued first"
      }
    ],
    
    practiceProblems: [
      "Valid Parentheses",
      "Implement Queue using Stacks",
      "Implement Stack using Queues", 
      "Min Stack",
      "Evaluate Reverse Polish Notation",
      "Sliding Window Maximum",
      "Daily Temperatures",
      "Trapping Rain Water",
      "Largest Rectangle in Histogram",
      "Design Circular Queue"
    ],
    
    timeComplexity: "Push/Pop/Enqueue/Dequeue: O(1)",
    spaceComplexity: "O(n) for storage"
  },

  Trees: {
    title: "Trees - Hierarchical Data Structure",
    toc: [
      "Tree Fundamentals",
      "Binary Trees",
      "Tree Traversals", 
      "Binary Search Trees",
      "Self-Balancing Trees",
      "Advanced Tree Concepts",
      "Segment Trees",
      "Fenwick Trees",
      "Trie Data Structure"
    ],
    content: `# Trees - Master Hierarchical Data Structures

## Chapter 1: Tree Fundamentals

### What is a Tree?

A tree is a **hierarchical data structure** consisting of nodes connected by edges. Unlike linear data structures (arrays, linked lists), trees represent hierarchical relationships.

**Real-world Analogies:**
- **Family Tree**: Parents, children, grandchildren relationships
- **File System**: Folders containing subfolders and files
- **Organization Chart**: CEO → Managers → Employees
- **Decision Tree**: Series of yes/no decisions leading to outcomes

### Tree Terminology

\`\`\`
        A (Root)
       / \\
      B   C
     / \\   \\
    D   E   F
   /
  G

- Root: A (topmost node, no parent)
- Parent: B is parent of D and E
- Children: D and E are children of B
- Siblings: B and C are siblings
- Leaf: G, E, F (nodes with no children)
- Internal Node: A, B, C (nodes with children)
- Height: 3 (longest path from root to leaf)
- Depth of E: 2 (distance from root)
- Subtree: Tree rooted at any node
\`\`\`

### Tree Properties

- **N nodes** → **N-1 edges** (connected tree)
- **Exactly one path** between any two nodes
- **No cycles** (acyclic graph)
- **Height = max depth** of any node
- **Level**: All nodes at same distance from root

## Chapter 2: Binary Trees

### Binary Tree Definition

A binary tree is a tree where **each node has at most 2 children** (left and right).

**Node Structure:**
\`\`\`cpp
struct TreeNode {
    int data;
    TreeNode* left;
    TreeNode* right;
    
    TreeNode(int val) : data(val), left(nullptr), right(nullptr) {}
};
\`\`\`

### Types of Binary Trees

#### 1. Full Binary Tree
- Every node has **0 or 2 children** (no node has exactly 1 child)
\`\`\`
    A
   / \\
  B   C
     / \\
    D   E
\`\`\`

#### 2. Complete Binary Tree
- All levels filled except possibly the last
- Last level filled from **left to right**
\`\`\`
      A
     / \\
    B   C
   / \\ /
  D  E F
\`\`\`

#### 3. Perfect Binary Tree
- All internal nodes have **exactly 2 children**
- All leaves at **same level**
\`\`\`
      A
     / \\
    B   C
   / \\ / \\
  D  E F  G
\`\`\`

#### 4. Balanced Binary Tree
- Height difference between left and right subtrees ≤ 1
- **Height = O(log n)**

### Binary Tree Implementation

\`\`\`cpp
class BinaryTree {
private:
    TreeNode* root;
    
public:
    BinaryTree() : root(nullptr) {}
    
    // Insert level-order (for complete binary tree)
    void insert(int val) {
        if (!root) {
            root = new TreeNode(val);
            return;
        }
        
        queue<TreeNode*> q;
        q.push(root);
        
        while (!q.empty()) {
            TreeNode* current = q.front();
            q.pop();
            
            if (!current->left) {
                current->left = new TreeNode(val);
                return;
            } else if (!current->right) {
                current->right = new TreeNode(val);
                return;
            } else {
                q.push(current->left);
                q.push(current->right);
            }
        }
    }
    
    // Calculate height
    int height(TreeNode* node) {
        if (!node) return -1;
        return 1 + max(height(node->left), height(node->right));
    }
    
    // Count nodes
    int countNodes(TreeNode* node) {
        if (!node) return 0;
        return 1 + countNodes(node->left) + countNodes(node->right);
    }
    
    // Check if balanced
    bool isBalanced(TreeNode* node) {
        if (!node) return true;
        
        int leftHeight = height(node->left);
        int rightHeight = height(node->right);
        
        return abs(leftHeight - rightHeight) <= 1 && 
               isBalanced(node->left) && 
               isBalanced(node->right);
    }
};
\`\`\`

## Chapter 3: Tree Traversals

### Depth-First Search (DFS) Traversals

#### 1. Inorder Traversal (Left → Root → Right)
\`\`\`cpp
void inorderTraversal(TreeNode* root) {
    if (!root) return;
    
    inorderTraversal(root->left);   // Visit left subtree
    cout << root->data << " ";      // Process root
    inorderTraversal(root->right);  // Visit right subtree
}

// Iterative approach
vector<int> inorderIterative(TreeNode* root) {
    vector<int> result;
    stack<TreeNode*> st;
    TreeNode* current = root;
    
    while (current || !st.empty()) {
        // Go to leftmost node
        while (current) {
            st.push(current);
            current = current->left;
        }
        
        // Process current node
        current = st.top();
        st.pop();
        result.push_back(current->data);
        
        // Move to right subtree
        current = current->right;
    }
    
    return result;
}
\`\`\`

#### 2. Preorder Traversal (Root → Left → Right)
\`\`\`cpp
void preorderTraversal(TreeNode* root) {
    if (!root) return;
    
    cout << root->data << " ";      // Process root
    preorderTraversal(root->left);  // Visit left subtree
    preorderTraversal(root->right); // Visit right subtree
}

// Iterative approach
vector<int> preorderIterative(TreeNode* root) {
    if (!root) return {};
    
    vector<int> result;
    stack<TreeNode*> st;
    st.push(root);
    
    while (!st.empty()) {
        TreeNode* current = st.top();
        st.pop();
        
        result.push_back(current->data);
        
        // Push right first, then left (stack is LIFO)
        if (current->right) st.push(current->right);
        if (current->left) st.push(current->left);
    }
    
    return result;
}
\`\`\`

#### 3. Postorder Traversal (Left → Right → Root)
\`\`\`cpp
void postorderTraversal(TreeNode* root) {
    if (!root) return;
    
    postorderTraversal(root->left);  // Visit left subtree
    postorderTraversal(root->right); // Visit right subtree
    cout << root->data << " ";       // Process root
}

// Iterative approach (using two stacks)
vector<int> postorderIterative(TreeNode* root) {
    if (!root) return {};
    
    vector<int> result;
    stack<TreeNode*> st1, st2;
    st1.push(root);
    
    while (!st1.empty()) {
        TreeNode* current = st1.top();
        st1.pop();
        st2.push(current);
        
        if (current->left) st1.push(current->left);
        if (current->right) st1.push(current->right);
    }
    
    while (!st2.empty()) {
        result.push_back(st2.top()->data);
        st2.pop();
    }
    
    return result;
}
\`\`\`

### Breadth-First Search (BFS) - Level Order

\`\`\`cpp
vector<vector<int>> levelOrder(TreeNode* root) {
    if (!root) return {};
    
    vector<vector<int>> result;
    queue<TreeNode*> q;
    q.push(root);
    
    while (!q.empty()) {
        int levelSize = q.size();
        vector<int> currentLevel;
        
        for (int i = 0; i < levelSize; i++) {
            TreeNode* current = q.front();
            q.pop();
            
            currentLevel.push_back(current->data);
            
            if (current->left) q.push(current->left);
            if (current->right) q.push(current->right);
        }
        
        result.push_back(currentLevel);
    }
    
    return result;
}

// Zigzag Level Order
vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
    if (!root) return {};
    
    vector<vector<int>> result;
    queue<TreeNode*> q;
    q.push(root);
    bool leftToRight = true;
    
    while (!q.empty()) {
        int levelSize = q.size();
        vector<int> currentLevel(levelSize);
        
        for (int i = 0; i < levelSize; i++) {
            TreeNode* current = q.front();
            q.pop();
            
            int index = leftToRight ? i : levelSize - 1 - i;
            currentLevel[index] = current->data;
            
            if (current->left) q.push(current->left);
            if (current->right) q.push(current->right);
        }
        
        result.push_back(currentLevel);
        leftToRight = !leftToRight;
    }
    
    return result;
}
\`\`\`

### Morris Traversal (O(1) Space)

\`\`\`cpp
vector<int> morrisInorder(TreeNode* root) {
    vector<int> result;
    TreeNode* current = root;
    
    while (current) {
        if (!current->left) {
            // No left subtree, process current and go right
            result.push_back(current->data);
            current = current->right;
        } else {
            // Find inorder predecessor
            TreeNode* predecessor = current->left;
            while (predecessor->right && predecessor->right != current) {
                predecessor = predecessor->right;
            }
            
            if (!predecessor->right) {
                // Create thread
                predecessor->right = current;
                current = current->left;
            } else {
                // Remove thread and process current
                predecessor->right = nullptr;
                result.push_back(current->data);
                current = current->right;
            }
        }
    }
    
    return result;
}
\`\`\`

## Chapter 4: Binary Search Trees (BST)

### BST Property
- **Left subtree** contains nodes with values **less than** root
- **Right subtree** contains nodes with values **greater than** root
- **Both subtrees** are also BSTs
- **Inorder traversal** gives **sorted sequence**

### BST Implementation

\`\`\`cpp
class BST {
private:
    TreeNode* root;
    
    TreeNode* insertHelper(TreeNode* node, int val) {
        if (!node) return new TreeNode(val);
        
        if (val < node->data) {
            node->left = insertHelper(node->left, val);
        } else if (val > node->data) {
            node->right = insertHelper(node->right, val);
        }
        // Duplicate values not allowed
        
        return node;
    }
    
    TreeNode* findMin(TreeNode* node) {
        while (node->left) {
            node = node->left;
        }
        return node;
    }
    
    TreeNode* deleteHelper(TreeNode* node, int val) {
        if (!node) return nullptr;
        
        if (val < node->data) {
            node->left = deleteHelper(node->left, val);
        } else if (val > node->data) {
            node->right = deleteHelper(node->right, val);
        } else {
            // Node to be deleted found
            if (!node->left) {
                TreeNode* temp = node->right;
                delete node;
                return temp;
            } else if (!node->right) {
                TreeNode* temp = node->left;
                delete node;
                return temp;
            }
            
            // Node with two children
            TreeNode* temp = findMin(node->right);
            node->data = temp->data;
            node->right = deleteHelper(node->right, temp->data);
        }
        
        return node;
    }
    
public:
    BST() : root(nullptr) {}
    
    void insert(int val) {
        root = insertHelper(root, val);
    }
    
    bool search(int val) {
        TreeNode* current = root;
        while (current) {
            if (val == current->data) return true;
            else if (val < current->data) current = current->left;
            else current = current->right;
        }
        return false;
    }
    
    void remove(int val) {
        root = deleteHelper(root, val);
    }
    
    bool isValidBST(TreeNode* node, long minVal, long maxVal) {
        if (!node) return true;
        
        if (node->data <= minVal || node->data >= maxVal) {
            return false;
        }
        
        return isValidBST(node->left, minVal, node->data) &&
               isValidBST(node->right, node->data, maxVal);
    }
};
\`\`\`

## Chapter 5: Self-Balancing Trees

### AVL Trees

**Balance Factor**: height(left) - height(right) ∈ {-1, 0, 1}

\`\`\`cpp
struct AVLNode {
    int data, height;
    AVLNode* left, *right;
    
    AVLNode(int val) : data(val), height(1), left(nullptr), right(nullptr) {}
};

class AVLTree {
private:
    int getHeight(AVLNode* node) {
        return node ? node->height : 0;
    }
    
    int getBalance(AVLNode* node) {
        return node ? getHeight(node->left) - getHeight(node->right) : 0;
    }
    
    void updateHeight(AVLNode* node) {
        if (node) {
            node->height = 1 + max(getHeight(node->left), getHeight(node->right));
        }
    }
    
    AVLNode* rotateRight(AVLNode* y) {
        AVLNode* x = y->left;
        AVLNode* T2 = x->right;
        
        // Perform rotation
        x->right = y;
        y->left = T2;
        
        // Update heights
        updateHeight(y);
        updateHeight(x);
        
        return x;
    }
    
    AVLNode* rotateLeft(AVLNode* x) {
        AVLNode* y = x->right;
        AVLNode* T2 = y->left;
        
        // Perform rotation
        y->left = x;
        x->right = T2;
        
        // Update heights
        updateHeight(x);
        updateHeight(y);
        
        return y;
    }
    
    AVLNode* insert(AVLNode* node, int val) {
        // Standard BST insertion
        if (!node) return new AVLNode(val);
        
        if (val < node->data) {
            node->left = insert(node->left, val);
        } else if (val > node->data) {
            node->right = insert(node->right, val);
        } else {
            return node; // Duplicates not allowed
        }
        
        // Update height
        updateHeight(node);
        
        // Get balance factor
        int balance = getBalance(node);
        
        // Left Left Case
        if (balance > 1 && val < node->left->data) {
            return rotateRight(node);
        }
        
        // Right Right Case
        if (balance < -1 && val > node->right->data) {
            return rotateLeft(node);
        }
        
        // Left Right Case
        if (balance > 1 && val > node->left->data) {
            node->left = rotateLeft(node->left);
            return rotateRight(node);
        }
        
        // Right Left Case
        if (balance < -1 && val < node->right->data) {
            node->right = rotateRight(node->right);
            return rotateLeft(node);
        }
        
        return node;
    }
};
\`\`\`

## Chapter 6: Advanced Tree Concepts

### Segment Trees

**Purpose**: Range queries and updates in O(log n)

\`\`\`cpp
class SegmentTree {
private:
    vector<int> tree;
    int n;
    
    void build(vector<int>& arr, int node, int start, int end) {
        if (start == end) {
            tree[node] = arr[start];
        } else {
            int mid = (start + end) / 2;
            build(arr, 2*node, start, mid);
            build(arr, 2*node+1, mid+1, end);
            tree[node] = tree[2*node] + tree[2*node+1];
        }
    }
    
    void updateHelper(int node, int start, int end, int idx, int val) {
        if (start == end) {
            tree[node] = val;
        } else {
            int mid = (start + end) / 2;
            if (idx <= mid) {
                updateHelper(2*node, start, mid, idx, val);
            } else {
                updateHelper(2*node+1, mid+1, end, idx, val);
            }
            tree[node] = tree[2*node] + tree[2*node+1];
        }
    }
    
    int queryHelper(int node, int start, int end, int l, int r) {
        if (r < start || end < l) {
            return 0; // Out of range
        }
        if (l <= start && end <= r) {
            return tree[node]; // Complete overlap
        }
        
        int mid = (start + end) / 2;
        int p1 = queryHelper(2*node, start, mid, l, r);
        int p2 = queryHelper(2*node+1, mid+1, end, l, r);
        return p1 + p2;
    }
    
public:
    SegmentTree(vector<int>& arr) {
        n = arr.size();
        tree.resize(4 * n);
        build(arr, 1, 0, n-1);
    }
    
    void update(int idx, int val) {
        updateHelper(1, 0, n-1, idx, val);
    }
    
    int query(int l, int r) {
        return queryHelper(1, 0, n-1, l, r);
    }
};
\`\`\`

### Fenwick Tree (Binary Indexed Tree)

**Purpose**: Prefix sum queries and updates in O(log n)

\`\`\`cpp
class FenwickTree {
private:
    vector<int> tree;
    int n;
    
public:
    FenwickTree(int size) {
        n = size;
        tree.assign(n + 1, 0);
    }
    
    void update(int idx, int delta) {
        for (++idx; idx <= n; idx += idx & -idx) {
            tree[idx] += delta;
        }
    }
    
    int query(int idx) {
        int sum = 0;
        for (++idx; idx > 0; idx -= idx & -idx) {
            sum += tree[idx];
        }
        return sum;
    }
    
    int rangeQuery(int l, int r) {
        return query(r) - query(l - 1);
    }
};
\`\`\`

### Trie (Prefix Tree)

**Purpose**: String operations, autocomplete, dictionary

\`\`\`cpp
struct TrieNode {
    TrieNode* children[26];
    bool isEndOfWord;
    
    TrieNode() {
        isEndOfWord = false;
        for (int i = 0; i < 26; i++) {
            children[i] = nullptr;
        }
    }
};

class Trie {
private:
    TrieNode* root;
    
public:
    Trie() {
        root = new TrieNode();
    }
    
    void insert(string word) {
        TrieNode* current = root;
        for (char c : word) {
            int index = c - 'a';
            if (!current->children[index]) {
                current->children[index] = new TrieNode();
            }
            current = current->children[index];
        }
        current->isEndOfWord = true;
    }
    
    bool search(string word) {
        TrieNode* current = root;
        for (char c : word) {
            int index = c - 'a';
            if (!current->children[index]) {
                return false;
            }
            current = current->children[index];
        }
        return current->isEndOfWord;
    }
    
    bool startsWith(string prefix) {
        TrieNode* current = root;
        for (char c : prefix) {
            int index = c - 'a';
            if (!current->children[index]) {
                return false;
            }
            current = current->children[index];
        }
        return true;
    }
};
\`\`\`

Trees are hierarchical data structures consisting of nodes connected by edges. They are fundamental for representing hierarchical relationships and enable efficient searching, insertion, and deletion operations.

## Tree Applications in Real World

1. **File Systems**: Directory structure (folders and files)
2. **Database Indexing**: B-trees, B+ trees for fast data retrieval
3. **Expression Parsing**: Abstract Syntax Trees (AST)
4. **Decision Making**: Decision trees in AI/ML
5. **Network Routing**: Spanning trees for network protocols
6. **Compression**: Huffman coding trees
7. **Game Development**: Game state trees, AI decision trees
8. **Web Development**: DOM (Document Object Model)
9. **Compiler Design**: Parse trees, syntax trees
10. **Data Compression**: Optimal binary search trees

## Types of Trees:

### 1. Binary Tree
- Each node has at most 2 children (left and right)
- **Complete Binary Tree**: All levels filled except possibly the last
- **Perfect Binary Tree**: All internal nodes have 2 children, all leaves at same level
- **Balanced Binary Tree**: Height difference between left and right subtrees ≤ 1

### 2. Binary Search Tree (BST)
- **Property**: Left child < Parent < Right child
- **Search**: O(log n) average, O(n) worst case
- **Insertion/Deletion**: O(log n) average, O(n) worst case

### 3. AVL Tree
- **Self-balancing BST**
- **Balance Factor**: Height difference between left and right subtrees ∈ {-1, 0, 1}
- **Rotations**: Single and double rotations to maintain balance
- **Guaranteed**: O(log n) operations

### 4. Red-Black Tree
- **Self-balancing BST** with color properties
- **Properties**: Root is black, no two red nodes adjacent, all paths have same black height
- **Guaranteed**: O(log n) operations

## Tree Traversals:

### 1. Depth-First Search (DFS):
- **Inorder**: Left → Root → Right (gives sorted order in BST)
- **Preorder**: Root → Left → Right (useful for copying tree)
- **Postorder**: Left → Right → Root (useful for deletion)

### 2. Breadth-First Search (BFS):
- **Level Order**: Visit nodes level by level
- **Implementation**: Using queue data structure
- **Applications**: Finding shortest path, level-wise processing

## Common Tree Operations:

### Insertion in BST:
\`\`\`
function insert(root, key):
    if root is null:
        return new Node(key)
    if key < root.data:
        root.left = insert(root.left, key)
    else:
        root.right = insert(root.right, key)
    return root
\`\`\`

### Search in BST:
\`\`\`
function search(root, key):
    if root is null or root.data == key:
        return root
    if key < root.data:
        return search(root.left, key)
    return search(root.right, key)
\`\`\`

## Advanced Tree Concepts:

### 1. Segment Tree
- **Purpose**: Range queries and updates
- **Time Complexity**: O(log n) for query and update
- **Space Complexity**: O(4n)

### 2. Fenwick Tree (Binary Indexed Tree)
- **Purpose**: Prefix sum queries and updates
- **Time Complexity**: O(log n) for query and update
- **Space Complexity**: O(n)

### 3. Trie (Prefix Tree)
- **Purpose**: String operations, autocomplete
- **Applications**: Dictionary implementation, IP routing
- **Time Complexity**: O(m) where m is string length

## Common Tree Problems:
1. **Maximum Depth of Binary Tree**
2. **Validate Binary Search Tree**
3. **Lowest Common Ancestor**
4. **Binary Tree Level Order Traversal**
5. **Symmetric Tree**
6. **Path Sum Problems**
7. **Serialize and Deserialize Binary Tree**
8. **Binary Tree Maximum Path Sum**

## Applications:
- **File Systems**: Directory structure
- **Database Indexing**: B-trees, B+ trees
- **Expression Parsing**: Abstract Syntax Trees
- **Decision Making**: Decision trees
- **Network Routing**: Spanning trees
- **Compression**: Huffman coding trees

## Best Practices:
- Choose appropriate tree type based on use case
- Consider balance for performance-critical applications
- Handle edge cases (empty tree, single node)
- Use iterative approaches to avoid stack overflow for deep trees`,
    
    examples: [
      {
        input: "Tree: 4→2,6 (2→1,3) (6→5,7)",
        output: "Inorder: 1,2,3,4,5,6,7",
        explanation: "Inorder traversal of BST gives sorted sequence",
        visualization: "ASCII tree diagram available",
        code: `void inorderTraversal(TreeNode* root) {
    if (!root) return;
    inorderTraversal(root->left);
    cout << root->data << " ";
    inorderTraversal(root->right);
}`,
        copyable: true
      },
      {
        input: "Morris Inorder Traversal",
        output: "O(1) space traversal using threading",
        explanation: "Advanced technique using temporary links for space optimization",
        difficulty: "Advanced",
        code: `vector<int> morrisInorder(TreeNode* root) {
    vector<int> result;
    TreeNode* current = root;
    
    while (current) {
        if (!current->left) {
            result.push_back(current->data);
            current = current->right;
        } else {
            TreeNode* predecessor = current->left;
            while (predecessor->right && predecessor->right != current) {
                predecessor = predecessor->right;
            }
            
            if (!predecessor->right) {
                predecessor->right = current;
                current = current->left;
            } else {
                predecessor->right = nullptr;
                result.push_back(current->data);
                current = current->right;
            }
        }
    }
    return result;
}`,
        copyable: true
      },
      {
        input: "AVL Tree Rotation",
        output: "Self-balancing with rotations",
        explanation: "Maintain balance factor between -1 and 1",
        difficulty: "Advanced",
        code: `AVLNode* rotateRight(AVLNode* y) {
    AVLNode* x = y->left;
    AVLNode* T2 = x->right;
    
    x->right = y;
    y->left = T2;
    
    updateHeight(y);
    updateHeight(x);
    
    return x;
}`,
        copyable: true
      },
      {
        input: "Segment Tree Range Query",
        output: "O(log n) range sum queries",
        explanation: "Efficient range queries and updates",
        difficulty: "Advanced",
        code: `int query(int node, int start, int end, int l, int r) {
    if (r < start || end < l) return 0;
    if (l <= start && end <= r) return tree[node];
    
    int mid = (start + end) / 2;
    return query(2*node, start, mid, l, r) + 
           query(2*node+1, mid+1, end, l, r);
}`,
        copyable: true
      }
    ],
    
    practiceProblems: [
      { name: "Maximum Depth of Binary Tree", difficulty: "Easy", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
      { name: "Validate Binary Search Tree", difficulty: "Medium", url: "https://leetcode.com/problems/validate-binary-search-tree/" },
      { name: "Lowest Common Ancestor", difficulty: "Medium", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/" },
      { name: "Binary Tree Level Order Traversal", difficulty: "Medium", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
      { name: "Symmetric Tree", difficulty: "Easy", url: "https://leetcode.com/problems/symmetric-tree/" },
      { name: "Path Sum", difficulty: "Easy", url: "https://leetcode.com/problems/path-sum/" },
      { name: "Construct Binary Tree from Preorder and Inorder", difficulty: "Medium", url: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/" },
      { name: "Binary Tree Maximum Path Sum", difficulty: "Hard", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
      { name: "Serialize and Deserialize Binary Tree", difficulty: "Hard", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },
      { name: "Vertical Order Traversal", difficulty: "Hard", url: "https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/" }
    ],
    
    treeComparison: {
      "AVL vs Red-Black vs Splay": {
        "AVL": "Strictly balanced, faster lookups, slower insertions",
        "Red-Black": "Loosely balanced, faster insertions, used in STL",
        "Splay": "Self-adjusting, recently accessed nodes move to root"
      },
      "Tree Types Comparison": {
        "Binary Tree": "Each node has at most 2 children",
        "BST": "Binary tree with ordering property",
        "AVL Tree": "Self-balancing BST with height difference ≤ 1",
        "Red-Black Tree": "Self-balancing BST with color properties",
        "B-Tree": "Multi-way tree for databases",
        "Trie": "Prefix tree for string operations",
        "Segment Tree": "Binary tree for range queries",
        "Fenwick Tree": "Binary indexed tree for prefix sums"
      }
    },
    
    visualizations: {
      "Tree Structure": `
        Root (A)
       /        \\
      B          C
     / \\        / \\
    D   E      F   G
   /
  H
`,
      "BST Example": `
       50
      /  \\
     30   70
    / \\   / \\
   20 40 60 80
`,
      "AVL Rotations": `
Left Rotation:
   x              y
    \\            / \\
     y    =>    x   z
      \\
       z

Right Rotation:
     y            x
    /            / \\
   x      =>    a   y
  /                  \\
 a                    b
`
    },
    
    timeComplexity: "Search/Insert/Delete: O(log n) balanced, O(n) worst case",
    spaceComplexity: "O(n) for storage, O(h) for recursion where h is height",
    
    interactiveElements: {
      "Tree Visualizer": "https://visualgo.net/en/bst",
      "Tree Traversal Animation": "https://www.cs.usfca.edu/~galles/visualization/BST.html",
      "AVL Tree Simulator": "https://www.cs.usfca.edu/~galles/visualization/AVLtree.html"
    }
  },

  Graphs: {
    title: "Graphs - Network Data Structure",
    toc: [
      "Graph Fundamentals",
      "Graph Representations",
      "Traversal Algorithms",
      "Shortest Path Algorithms",
      "Advanced Graph Algorithms",
      "Applications"
    ],
    content: `Graphs are non-linear data structures consisting of vertices (nodes) connected by edges. They represent relationships between entities and are fundamental for modeling networks, social connections, and many real-world problems.

## Key Terminology:
- **Vertex/Node**: Individual entity in the graph
- **Edge**: Connection between two vertices
- **Adjacent**: Two vertices connected by an edge
- **Degree**: Number of edges connected to a vertex
- **Path**: Sequence of vertices connected by edges
- **Cycle**: Path that starts and ends at the same vertex
- **Connected Graph**: Path exists between every pair of vertices

## Types of Graphs:

### 1. Based on Direction:
- **Undirected Graph**: Edges have no direction (bidirectional)
- **Directed Graph (Digraph)**: Edges have direction (unidirectional)

### 2. Based on Weights:
- **Weighted Graph**: Edges have associated weights/costs
- **Unweighted Graph**: All edges have equal weight (usually 1)

### 3. Based on Connectivity:
- **Connected Graph**: Path exists between all vertex pairs
- **Disconnected Graph**: Some vertices are not reachable from others
- **Strongly Connected**: In directed graphs, path exists between all vertex pairs in both directions

## Graph Representations:

### 1. Adjacency Matrix:
- **2D array**: matrix[i][j] = 1 if edge exists between vertex i and j
- **Space Complexity**: O(V²)
- **Edge Check**: O(1)
- **Good for**: Dense graphs, frequent edge queries

### 2. Adjacency List:
- **Array of lists**: Each vertex maintains list of adjacent vertices
- **Space Complexity**: O(V + E)
- **Edge Check**: O(degree of vertex)
- **Good for**: Sparse graphs, memory efficiency

### 3. Edge List:
- **List of edges**: Each edge stored as (u, v) pair
- **Space Complexity**: O(E)
- **Good for**: Simple operations, algorithms that process edges

## Graph Traversal Algorithms:

### 1. Depth-First Search (DFS):
\`\`\`
function DFS(graph, start, visited):
    visited[start] = true
    process(start)
    for each neighbor of start:
        if not visited[neighbor]:
            DFS(graph, neighbor, visited)
\`\`\`
- **Time Complexity**: O(V + E)
- **Space Complexity**: O(V) for recursion stack
- **Applications**: Cycle detection, topological sorting, connected components

### 2. Breadth-First Search (BFS):
\`\`\`
function BFS(graph, start):
    queue = [start]
    visited[start] = true
    while queue is not empty:
        vertex = queue.dequeue()
        process(vertex)
        for each neighbor of vertex:
            if not visited[neighbor]:
                visited[neighbor] = true
                queue.enqueue(neighbor)
\`\`\`
- **Time Complexity**: O(V + E)
- **Space Complexity**: O(V) for queue
- **Applications**: Shortest path in unweighted graphs, level-order processing

## Shortest Path Algorithms:

### 1. Dijkstra's Algorithm:
- **Purpose**: Single-source shortest path in weighted graphs (non-negative weights)
- **Time Complexity**: O((V + E) log V) with priority queue
- **Approach**: Greedy algorithm using priority queue

### 2. Bellman-Ford Algorithm:
- **Purpose**: Single-source shortest path (handles negative weights)
- **Time Complexity**: O(VE)
- **Advantage**: Detects negative cycles

### 3. Floyd-Warshall Algorithm:
- **Purpose**: All-pairs shortest path
- **Time Complexity**: O(V³)
- **Approach**: Dynamic programming

## Minimum Spanning Tree:

### 1. Kruskal's Algorithm:
- **Approach**: Sort edges by weight, use Union-Find
- **Time Complexity**: O(E log E)
- **Good for**: Sparse graphs

### 2. Prim's Algorithm:
- **Approach**: Grow MST from starting vertex
- **Time Complexity**: O((V + E) log V) with priority queue
- **Good for**: Dense graphs

## Advanced Graph Algorithms:

### 1. Topological Sorting:
- **Purpose**: Linear ordering of vertices in DAG
- **Applications**: Task scheduling, dependency resolution
- **Algorithms**: DFS-based, Kahn's algorithm (BFS-based)

### 2. Strongly Connected Components:
- **Kosaraju's Algorithm**: Two DFS passes
- **Tarjan's Algorithm**: Single DFS with low-link values
- **Applications**: Social network analysis, web page ranking

### 3. Network Flow:
- **Ford-Fulkerson Method**: Maximum flow in flow networks
- **Applications**: Transportation, assignment problems

## Common Graph Problems:
1. **Graph Traversal** (DFS, BFS)
2. **Shortest Path** (Dijkstra, Bellman-Ford)
3. **Minimum Spanning Tree** (Kruskal, Prim)
4. **Cycle Detection**
5. **Topological Sorting**
6. **Connected Components**
7. **Bipartite Graph Check**
8. **Graph Coloring**

## Applications:
- **Social Networks**: Friend connections, influence propagation
- **Transportation**: Route planning, traffic optimization
- **Computer Networks**: Routing protocols, network topology
- **Web**: Page ranking, link analysis
- **Biology**: Protein interactions, phylogenetic trees
- **Economics**: Market analysis, supply chains

## Best Practices:
- Choose appropriate representation based on graph density
- Consider memory constraints for large graphs
- Use appropriate algorithms based on graph properties
- Handle disconnected components in traversal algorithms
- Optimize for specific use cases (sparse vs dense graphs)`,
    
    examples: [
      {
        input: "Graph: A-B, B-C, C-D, A-D",
        output: "DFS from A: A→B→C→D",
        explanation: "Depth-first traversal explores as deep as possible before backtracking",
        visualization: "Adjacency list and matrix representations shown"
      },
      {
        input: "Johnson's Algorithm for all-pairs shortest paths",
        output: "O(V²log V + VE) for sparse graphs",
        explanation: "Combines Dijkstra and Bellman-Ford for negative edge handling",
        difficulty: "Advanced"
      },
      {
        input: "Dinic's Max Flow Algorithm",
        output: "O(V²E) time complexity for maximum flow",
        explanation: "Efficient algorithm for network flow problems",
        difficulty: "Advanced"
      },
      {
        input: "Word Ladder (BFS on implicit graph)",
        output: "Transform 'hit' to 'cog' through valid words",
        explanation: "BFS on word transformation graph",
        difficulty: "Medium"
      }
    ],
    
    practiceProblems: [
      "Number of Islands",
      "Course Schedule",
      "Clone Graph",
      "Word Ladder",
      "Network Delay Time",
      "Cheapest Flights Within K Stops",
      "Critical Connections in Network",
      "Minimum Spanning Tree",
      "Alien Dictionary",
      "Reconstruct Itinerary"
    ],
    
    timeComplexity: "Traversal: O(V+E), Shortest Path: O(V²) to O((V+E)logV)",
    spaceComplexity: "Adjacency List: O(V+E), Adjacency Matrix: O(V²)"
  },

  DP: {
    title: "Dynamic Programming - Optimization Technique",
    toc: [
      "DP Fundamentals",
      "Common DP Patterns",
      "Classic DP Problems",
      "Advanced DP Concepts",
      "Optimization Techniques",
      "Problem-Solving Strategy"
    ],
    content: `Dynamic Programming (DP) is an algorithmic paradigm that solves complex problems by breaking them down into simpler subproblems. It stores the results of subproblems to avoid redundant calculations, trading space for time efficiency.

## Core Principles:

### 1. Optimal Substructure:
- The optimal solution contains optimal solutions to subproblems
- **Example**: Shortest path problem - if path A→C is optimal and goes through B, then A→B and B→C must also be optimal

### 2. Overlapping Subproblems:
- Same subproblems are solved multiple times in naive recursive approach
- **Example**: Fibonacci sequence - F(n) = F(n-1) + F(n-2) recalculates same values

## DP Approaches:

### 1. Top-Down (Memoization):
- Start with original problem and recursively solve subproblems
- Store results in cache to avoid recomputation
- **Implementation**: Recursion + Memoization table

\`\`\`
function fibonacci(n, memo):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)
    return memo[n]
\`\`\`

### 2. Bottom-Up (Tabulation):
- Start with smallest subproblems and build up to original problem
- Fill DP table iteratively
- **Implementation**: Iterative approach with DP table

\`\`\`
function fibonacci(n):
    if n <= 1: return n
    dp = array of size n+1
    dp[0] = 0, dp[1] = 1
    for i from 2 to n:
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]
\`\`\`

## Common DP Patterns:

### 1. Linear DP:
- **1D array**: dp[i] represents solution for first i elements
- **Examples**: Fibonacci, Climbing Stairs, House Robber
- **Recurrence**: dp[i] = f(dp[i-1], dp[i-2], ...)

### 2. Grid DP:
- **2D array**: dp[i][j] represents solution for subproblem at position (i,j)
- **Examples**: Unique Paths, Minimum Path Sum, Edit Distance
- **Recurrence**: dp[i][j] = f(dp[i-1][j], dp[i][j-1], ...)

### 3. Interval DP:
- **Range-based**: dp[i][j] represents solution for range [i,j]
- **Examples**: Matrix Chain Multiplication, Palindrome Partitioning
- **Recurrence**: dp[i][j] = min/max(dp[i][k] + dp[k+1][j]) for all k

### 4. Knapsack DP:
- **Choice-based**: Include or exclude items
- **Examples**: 0/1 Knapsack, Coin Change, Subset Sum
- **Recurrence**: dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])

## Classic DP Problems:

### 1. Fibonacci Sequence:
- **Naive**: O(2ⁿ) exponential time
- **DP**: O(n) time, O(n) or O(1) space
- **Recurrence**: F(n) = F(n-1) + F(n-2)

### 2. Longest Common Subsequence (LCS):
- **Problem**: Find longest subsequence common to two sequences
- **Recurrence**: 
  - If chars match: LCS[i][j] = 1 + LCS[i-1][j-1]
  - Else: LCS[i][j] = max(LCS[i-1][j], LCS[i][j-1])

### 3. 0/1 Knapsack:
- **Problem**: Maximize value with weight constraint
- **Recurrence**: 
  - If weight[i] <= w: dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])
  - Else: dp[i][w] = dp[i-1][w]

### 4. Coin Change:
- **Problem**: Minimum coins to make amount
- **Recurrence**: dp[amount] = min(dp[amount-coin] + 1) for all coins

## Advanced DP Concepts:

### 1. State Compression:
- Reduce space complexity using bitmasking
- **Example**: Traveling Salesman Problem with bitmask DP
- **Space**: O(2ⁿ × n) instead of exponential

### 2. Digit DP:
- Handle constraints on digits of numbers
- **Applications**: Count numbers with specific digit properties
- **State**: (position, tight, started, ...)

### 3. Tree DP:
- DP on tree structures
- **Examples**: Maximum path sum in tree, tree diameter
- **Approach**: DFS with memoization

### 4. Probability DP:
- Calculate probabilities using DP
- **Examples**: Expected value problems, game theory
- **State**: Probability distributions

## Optimization Techniques:

### 1. Space Optimization:
- Use rolling arrays when only previous states needed
- **Example**: Fibonacci with O(1) space using two variables

### 2. Matrix Exponentiation:
- Optimize linear recurrences using matrix multiplication
- **Time**: O(k³ log n) for k-term recurrence
- **Example**: Fibonacci in O(log n) time

### 3. Convex Hull Optimization:
- Optimize DP with convex/concave cost functions
- **Applications**: Divide and conquer optimization

## Problem-Solving Strategy:

### 1. Identify DP Problem:
- Optimal substructure present
- Overlapping subproblems exist
- Optimization or counting problem

### 2. Define State:
- What parameters uniquely identify a subproblem?
- What information is needed to solve subproblem?

### 3. Write Recurrence:
- How to compute current state from previous states?
- Consider all possible transitions

### 4. Implement:
- Choose top-down or bottom-up approach
- Handle base cases carefully
- Optimize space if possible

## Common Mistakes:
- Incorrect state definition
- Missing base cases
- Wrong recurrence relation
- Not considering all transitions
- Integer overflow in calculations

## Best Practices:
- Start with recursive solution, then add memoization
- Clearly define what each DP state represents
- Verify recurrence with small examples
- Consider space optimization after correctness
- Handle edge cases and constraints properly`,
    
    examples: [
      {
        input: "Fibonacci(5)",
        output: "5 (sequence: 0,1,1,2,3,5)",
        explanation: "F(5) = F(4) + F(3) = 3 + 2 = 5, computed efficiently using DP",
        memoizationVsTabulation: "Both approaches shown with complexity analysis"
      },
      {
        input: "Palindromic Partitioning",
        output: "Minimum cuts to make all substrings palindromes",
        explanation: "DP with palindrome precomputation for optimization",
        difficulty: "Hard"
      },
      {
        input: "DP on Trees (Tree Diameter)",
        output: "Longest path between any two nodes",
        explanation: "Tree DP with DFS for diameter calculation",
        difficulty: "Medium"
      },
      {
        input: "Digit DP (Count numbers without repeating digits)",
        output: "State: (position, mask, tight, started)",
        explanation: "Advanced DP technique for digit-based constraints",
        difficulty: "Advanced"
      }
    ],
    
    practiceProblems: [
      "Climbing Stairs",
      "House Robber",
      "Coin Change",
      "Longest Increasing Subsequence",
      "Edit Distance",
      "Maximum Product Subarray",
      "Palindromic Substrings",
      "Word Break",
      "Unique Paths",
      "Regular Expression Matching"
    ],
    
    dpPatterns: {
      "Linear DP": "1D array, dp[i] depends on previous elements",
      "Grid DP": "2D array, dp[i][j] from adjacent cells", 
      "Interval DP": "Range-based, dp[i][j] for subrange [i,j]",
      "Knapsack DP": "Choice-based, include/exclude decisions",
      "Bitmask DP": "State compression using bit manipulation"
    },
    
    timeComplexity: "Varies by problem: O(n) to O(n³) typically",
    spaceComplexity: "O(n) to O(n²) for memoization table"
  },

  "Linked Lists": {
    title: "Linked Lists - Dynamic Data Structure",
    toc: [
      "Linked List Fundamentals",
      "Types of Linked Lists",
      "Core Operations",
      "Advanced Algorithms",
      "Applications",
      "Practice Problems"
    ],
    content: `# Linked Lists - Master Dynamic Data Structures

## Understanding Linked Lists

Linked Lists overcome array limitations with dynamic size and efficient insertion/deletion.

**Memory Layout Comparison:**
\`\`\`
Array: [10][20][30][40][50] ← Contiguous memory
       1000 1004 1008 1012 1016

Linked List: 
Node 1: [10|1500] at 1000 → Node 2: [20|2000] at 1500 → Node 3: [30|NULL] at 2000
\`\`\`

## Singly Linked List Implementation

\`\`\`cpp
struct ListNode {
    int data;
    ListNode* next;
    ListNode(int val) : data(val), next(nullptr) {}
};

class LinkedList {
private:
    ListNode* head;
    int size;
    
public:
    LinkedList() : head(nullptr), size(0) {}
    
    // Insert at head - O(1)
    void insertAtHead(int val) {
        ListNode* newNode = new ListNode(val);
        newNode->next = head;
        head = newNode;
        size++;
    }
    
    // Delete by value - O(n)
    bool deleteByValue(int val) {
        if (!head) return false;
        
        if (head->data == val) {
            ListNode* temp = head;
            head = head->next;
            delete temp;
            size--;
            return true;
        }
        
        ListNode* current = head;
        while (current->next && current->next->data != val) {
            current = current->next;
        }
        
        if (current->next) {
            ListNode* nodeToDelete = current->next;
            current->next = nodeToDelete->next;
            delete nodeToDelete;
            size--;
            return true;
        }
        
        return false;
    }
};
\`\`\`

## Advanced Algorithms

### Floyd's Cycle Detection
\`\`\`cpp
bool hasCycle(ListNode* head) {
    if (!head || !head->next) return false;
    
    ListNode* slow = head;
    ListNode* fast = head;
    
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        
        if (slow == fast) return true;
    }
    
    return false;
}
\`\`\`

### Reverse Linked List
\`\`\`cpp
ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* current = head;
    
    while (current) {
        ListNode* next = current->next;
        current->next = prev;
        prev = current;
        current = next;
    }
    
    return prev;
}
\`\`\`

### Merge Two Sorted Lists
\`\`\`cpp
ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
    ListNode dummy(0);
    ListNode* current = &dummy;
    
    while (l1 && l2) {
        if (l1->data <= l2->data) {
            current->next = l1;
            l1 = l1->next;
        } else {
            current->next = l2;
            l2 = l2->next;
        }
        current = current->next;
    }
    
    current->next = l1 ? l1 : l2;
    return dummy.next;
}
\`\`\`

## Time Complexity Summary

| Operation | Singly LL | Doubly LL | Array |
|-----------|-----------|-----------|-------|
| Access | O(n) | O(n) | O(1) |
| Search | O(n) | O(n) | O(n) |
| Insert at head | O(1) | O(1) | O(n) |
| Insert at tail | O(n) | O(1)* | O(1) |
| Delete from head | O(1) | O(1) | O(n) |
| Delete from tail | O(n) | O(1)* | O(1) |

*With tail pointer

## Applications

1. **Stack Implementation** - Push/pop at head
2. **Queue Implementation** - Enqueue at tail, dequeue at head
3. **LRU Cache** - Doubly linked list + HashMap
4. **Undo Functionality** - Maintain operation history
5. **Music Playlist** - Next/previous navigation`,
    
    examples: [
      {
        input: "List: 1→2→3→4→5, Reverse",
        output: "5→4→3→2→1",
        explanation: "Iteratively reverse pointer directions using three pointers",
        runnable: true
      },
      {
        input: "Detect cycle in: 1→2→3→4→2 (cycle)",
        output: "true, cycle starts at node 2",
        explanation: "Floyd's algorithm detects cycle and finds starting point",
        runnable: true
      },
      {
        input: "LRU Cache Implementation",
        output: "O(1) get/put operations",
        explanation: "Doubly linked list + HashMap for constant time operations",
        difficulty: "Hard"
      },
      {
        input: "Copy List with Random Pointer",
        output: "Deep copy with random pointers preserved",
        explanation: "Three-pass algorithm or HashMap approach",
        difficulty: "Medium"
      }
    ],
    
    practiceProblems: [
      "Reverse Linked List",
      "Merge Two Sorted Lists",
      "Remove Nth Node From End",
      "Linked List Cycle",
      "Intersection of Two Linked Lists",
      "Palindrome Linked List",
      "Remove Duplicates from Sorted List",
      "Add Two Numbers",
      "Copy List with Random Pointer",
      "LRU Cache"
    ],
    
    timeComplexity: "Access/Search: O(n), Insert/Delete: O(1) with reference",
    spaceComplexity: "O(1) for operations, O(n) for storage"
  },

  CPP_SYNTAX: {
    title: "C++ Syntax & STL Reference",
    toc: [
      "Basic Syntax",
      "Control Structures", 
      "STL Containers",
      "STL Algorithms",
      "String Operations",
      "Advanced Features"
    ],
    content: `# C++ Syntax & STL - Complete Reference Guide

This comprehensive guide covers essential C++ syntax and Standard Template Library (STL) components that are crucial for competitive programming and software development.

## Basic Syntax

### Program Structure
\`\`\`cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

int main() {
    cout << "Hello World!" << endl;
    return 0;
}
\`\`\`

### Variables & Data Types
\`\`\`cpp
// Integer types
int num = 10;
long long bigNum = 1000000000LL;
double decimal = 3.14;
char character = 'A';
string text = "Hello";
bool flag = true;

// Arrays
int arr[5] = {1, 2, 3, 4, 5};
int matrix[3][3] = {{1,2,3}, {4,5,6}, {7,8,9}};

// Pointers & References
int x = 10;
int* ptr = &x;        // Pointer
int& ref = x;         // Reference
\`\`\`

### Functions
\`\`\`cpp
// Basic function
int add(int a, int b) {
    return a + b;
}

// Function with default parameters
int multiply(int a, int b = 1) {
    return a * b;
}

// Function overloading
int max(int a, int b) { return a > b ? a : b; }
double max(double a, double b) { return a > b ? a : b; }
\`\`\`

## Control Structures

### Conditional Statements
\`\`\`cpp
// If-else
if (condition) {
    // code
} else if (another_condition) {
    // code
} else {
    // code
}

// Ternary operator
int result = (a > b) ? a : b;

// Switch statement
switch (choice) {
    case 1:
        cout << "One";
        break;
    case 2:
        cout << "Two";
        break;
    default:
        cout << "Other";
}
\`\`\`

### Loops
\`\`\`cpp
// For loop
for (int i = 0; i < n; i++) {
    cout << i << " ";
}

// Range-based for loop (C++11)
vector<int> vec = {1, 2, 3, 4, 5};
for (int x : vec) {
    cout << x << " ";
}

// While loop
while (condition) {
    // code
}

// Do-while loop
do {
    // code
} while (condition);
\`\`\`

## STL Containers

### Vector - Dynamic Array
\`\`\`cpp
#include <vector>

vector<int> v;
// Insert Operations
v.push_back(10);           // Add at end
v.insert(v.begin(), 5);    // Insert at beginning
v.insert(v.begin()+2, 15); // Insert at position
v.insert(v.end(), {1,2,3}); // Insert multiple
v.emplace_back(20);        // Construct in place at end
v.emplace(v.begin(), 25);  // Construct in place at position

// Delete Operations
v.pop_back();              // Remove last
v.erase(v.begin());        // Remove first
v.erase(v.begin()+2);      // Remove at position
v.erase(v.begin(), v.begin()+3); // Remove range
v.clear();                 // Remove all

// Access Operations
v[0];                      // Access by index
v.at(0);                   // Safe access
v.front();                 // First element
v.back();                  // Last element
v.data();                  // Pointer to underlying array

// Utility Operations
v.size();                  // Get size
v.capacity();              // Get capacity
v.empty();                 // Check if empty
v.resize(10);              // Resize vector
v.reserve(100);            // Reserve capacity
v.shrink_to_fit();         // Reduce capacity to size
reverse(v.begin(), v.end()); // Reverse

// Initialize vector
vector<int> v1(5, 100);    // 5 elements, all 100
vector<int> v2 = {1, 2, 3, 4, 5};
vector<int> v3(v2);        // Copy constructor
\`\`\`

### Stack - LIFO
\`\`\`cpp
#include <stack>

stack<int> st;
// Insert Operations
st.push(10);               // Add element
st.emplace(20);            // Construct in place

// Delete Operations
st.pop();                  // Remove top

// Access Operations
st.top();                  // Access top element

// Utility Operations
st.empty();                // Check if empty
st.size();                 // Get size

// Stack using different containers
stack<int, vector<int>> st_vec;
stack<int, deque<int>> st_deque;
stack<int, list<int>> st_list;
\`\`\`

### Queue - FIFO
\`\`\`cpp
#include <queue>

queue<int> q;
// Insert Operations
q.push(10);                // Add at back
q.emplace(20);             // Construct in place

// Delete Operations
q.pop();                   // Remove front

// Access Operations
q.front();                 // Access front
q.back();                  // Access back

// Utility Operations
q.empty();                 // Check if empty
q.size();                  // Get size

// Queue using different containers
queue<int, deque<int>> q_deque;
queue<int, list<int>> q_list;
\`\`\`

### Deque - Double-ended Queue
\`\`\`cpp
#include <deque>

deque<int> dq;
// Insert Operations
dq.push_back(10);          // Add at back
dq.push_front(5);          // Add at front
dq.insert(dq.begin()+1, 15); // Insert at position
dq.emplace_back(20);       // Construct at back
dq.emplace_front(25);      // Construct at front

// Delete Operations
dq.pop_back();             // Remove back
dq.pop_front();            // Remove front
dq.erase(dq.begin());      // Remove at position
dq.clear();                // Remove all

// Access Operations
dq[0];                     // Access by index
dq.at(0);                  // Safe access
dq.front();                // First element
dq.back();                 // Last element

// Utility Operations
dq.size();                 // Get size
dq.empty();                // Check if empty
dq.resize(10);             // Resize deque
\`\`\`

### Priority Queue - Max Heap by default
\`\`\`cpp
#include <queue>

// Max Heap (default)
priority_queue<int> maxPq;
maxPq.push(10);            // Add element
maxPq.emplace(20);         // Construct in place
maxPq.pop();               // Remove top (max)
maxPq.top();               // Access top (max)
maxPq.size();              // Get size
maxPq.empty();             // Check if empty

// Min Heap
priority_queue<int, vector<int>, greater<int>> minPq;
minPq.push(10);            // Add element
minPq.top();               // Access top (min)

// Custom Comparator
auto cmp = [](int a, int b) { return a > b; }; // Min heap
priority_queue<int, vector<int>, decltype(cmp)> customPq(cmp);

// Priority queue with pairs
priority_queue<pair<int, int>> pairPq;
pairPq.push({10, 20});
\`\`\`

### Set - Unique elements, sorted
\`\`\`cpp
#include <set>

set<int> s;
// Insert Operations
s.insert(10);              // Add element
s.insert({1,2,3,4});       // Insert multiple
s.emplace(20);             // Construct in place
s.emplace_hint(s.begin(), 5); // Insert with hint

// Delete Operations
s.erase(10);               // Remove by value
s.erase(s.begin());        // Remove by iterator
s.erase(s.begin(), s.end()); // Remove range
s.clear();                 // Remove all

// Search Operations
s.find(10);                // Find element
s.count(10);               // Count occurrences (0 or 1)
s.lower_bound(10);         // First >= element
s.upper_bound(10);         // First > element
s.equal_range(10);         // Pair of lower and upper bound

// Utility Operations
s.size();                  // Get size
s.empty();                 // Check if empty
s.begin(), s.end();        // Iterators
s.rbegin(), s.rend();      // Reverse iterators
\`\`\`

### Multiset - Allows duplicates
\`\`\`cpp
#include <set>

multiset<int> ms;
// Insert Operations
ms.insert(10);             // Add element
ms.insert({1,2,2,3});      // Insert multiple
ms.emplace(20);            // Construct in place

// Delete Operations
ms.erase(10);              // Remove all occurrences
ms.erase(ms.find(10));     // Remove single occurrence
ms.clear();                // Remove all

// Search Operations
ms.find(10);               // Find element
ms.count(10);              // Count occurrences
ms.lower_bound(10);        // First >= element
ms.upper_bound(10);        // First > element
ms.equal_range(10);        // Range of equal elements

// Utility Operations
ms.size();                 // Get size
ms.empty();                // Check if empty
\`\`\`

### Map - Key-value pairs, sorted by key
\`\`\`cpp
#include <map>

map<string, int> mp;
// Insert Operations
mp["key"] = 10;            // Insert/Update
mp.insert({"key2", 20});   // Insert pair
mp.insert(make_pair("key3", 30)); // Insert using make_pair
mp.emplace("key4", 40);    // Construct in place
mp.emplace_hint(mp.begin(), "key5", 50); // Insert with hint

// Delete Operations
mp.erase("key");           // Remove by key
mp.erase(mp.begin());      // Remove by iterator
mp.erase(mp.begin(), mp.end()); // Remove range
mp.clear();                // Remove all

// Access Operations
mp["key"];                 // Access/Create
mp.at("key");              // Safe access (throws if not found)

// Search Operations
mp.find("key");            // Find by key
mp.count("key");           // Check if exists (0 or 1)
mp.lower_bound("key");     // First >= key
mp.upper_bound("key");     // First > key
mp.equal_range("key");     // Pair of bounds

// Utility Operations
mp.size();                 // Get size
mp.empty();                // Check if empty

// Iterate through map
for (auto& pair : mp) {
    cout << pair.first << ": " << pair.second << endl;
}
for (auto& [key, value] : mp) { // C++17 structured binding
    cout << key << ": " << value << endl;
}
\`\`\`

### Unordered Set - Hash-based, O(1) average
\`\`\`cpp
#include <unordered_set>

unordered_set<int> us;
// Insert Operations
us.insert(10);             // Add element
us.insert({1,2,3,4});      // Insert multiple
us.emplace(20);            // Construct in place

// Delete Operations
us.erase(10);              // Remove by value
us.erase(us.begin());      // Remove by iterator
us.clear();                // Remove all

// Search Operations
us.find(10);               // Find element
us.count(10);              // Check if exists (0 or 1)

// Utility Operations
us.size();                 // Get size
us.empty();                // Check if empty
us.bucket_count();         // Number of buckets
us.load_factor();          // Average elements per bucket
us.max_load_factor();      // Maximum load factor
us.rehash(100);            // Set minimum bucket count
us.reserve(1000);          // Reserve space for elements
\`\`\`

### Unordered Map - Hash-based key-value pairs
\`\`\`cpp
#include <unordered_map>

unordered_map<string, int> um;
// Insert Operations
um["key"] = 10;            // Insert/Update
um.insert({"key2", 20});   // Insert pair
um.emplace("key3", 30);    // Construct in place

// Delete Operations
um.erase("key");           // Remove by key
um.erase(um.begin());      // Remove by iterator
um.clear();                // Remove all

// Access Operations
um["key"];                 // Access/Create
um.at("key");              // Safe access

// Search Operations
um.find("key");            // Find by key
um.count("key");           // Check if exists

// Utility Operations
um.size();                 // Get size
um.empty();                // Check if empty
um.bucket_count();         // Number of buckets
um.load_factor();          // Current load factor
\`\`\`

### List - Doubly Linked List
\`\`\`cpp
#include <list>

list<int> lst;
// Insert Operations
lst.push_back(10);         // Add at back
lst.push_front(5);         // Add at front
lst.insert(lst.begin(), 15); // Insert at position
lst.emplace_back(20);      // Construct at back
lst.emplace_front(25);     // Construct at front

// Delete Operations
lst.pop_back();            // Remove back
lst.pop_front();           // Remove front
lst.erase(lst.begin());    // Remove at position
lst.remove(10);            // Remove all occurrences of value
lst.remove_if([](int x) { return x > 15; }); // Remove if condition
lst.clear();               // Remove all

// Access Operations
lst.front();               // First element
lst.back();                // Last element
// Note: No random access operator[] or at()

// Utility Operations
lst.size();                // Get size
lst.empty();               // Check if empty
lst.reverse();             // Reverse list
lst.sort();                // Sort list
lst.sort(greater<int>());  // Sort in descending order
lst.unique();              // Remove consecutive duplicates
lst.merge(other_list);     // Merge with another sorted list
lst.splice(lst.begin(), other_list); // Move elements from another list
\`\`\`

## STL Algorithms

### Sorting
\`\`\`cpp
#include <algorithm>

vector<int> v = {3, 1, 4, 1, 5, 9, 2, 6};

// Sort in ascending order
sort(v.begin(), v.end());

// Sort in descending order
sort(v.begin(), v.end(), greater<int>());

// Custom comparator
sort(v.begin(), v.end(), [](int a, int b) {
    return a > b;  // Descending order
});
\`\`\`

### Searching
\`\`\`cpp
// Binary search (requires sorted array)
binary_search(v.begin(), v.end(), 5);  // Returns true/false
lower_bound(v.begin(), v.end(), 5);    // First position >= 5
upper_bound(v.begin(), v.end(), 5);    // First position > 5

// Linear search
find(v.begin(), v.end(), 5);           // Find element
count(v.begin(), v.end(), 1);          // Count occurrences
\`\`\`

### Min/Max Operations
\`\`\`cpp
*min_element(v.begin(), v.end());      // Minimum element
*max_element(v.begin(), v.end());      // Maximum element
minmax_element(v.begin(), v.end());    // Returns pair of min,max

min(a, b);                             // Minimum of two values
max(a, b);                             // Maximum of two values
\`\`\`

### Other Useful Algorithms
\`\`\`cpp
// Reverse
reverse(v.begin(), v.end());

// Unique (removes consecutive duplicates)
sort(v.begin(), v.end());
v.erase(unique(v.begin(), v.end()), v.end());

// Permutations
next_permutation(v.begin(), v.end());  // Next lexicographic permutation
prev_permutation(v.begin(), v.end());  // Previous lexicographic permutation

// Accumulate (sum of elements)
#include <numeric>
int sum = accumulate(v.begin(), v.end(), 0);

// Fill
fill(v.begin(), v.end(), 0);           // Fill with value

// Transform
transform(v.begin(), v.end(), v.begin(), [](int x) {
    return x * 2;  // Double each element
});
\`\`\`

## String Operations

### Basic String Operations
\`\`\`cpp
#include <string>

string s = "Hello World";

// Basic operations
s.length();                // Get length
s.size();                  // Same as length()
s.empty();                 // Check if empty
s.clear();                 // Clear string
s.substr(0, 5);            // Substring from index 0, length 5
s.find("World");           // Find substring (returns position)
s.replace(6, 5, "C++");    // Replace substring

// Character operations
s[0];                      // Access character
s.front();                 // First character
s.back();                  // Last character
s.push_back('!');          // Add character at end
s.pop_back();              // Remove last character
\`\`\`

### String Conversion
\`\`\`cpp
// String to number
string num_str = "123";
int num = stoi(num_str);           // String to int
long long big_num = stoll(num_str); // String to long long
double d = stod("3.14");           // String to double

// Number to string
int n = 123;
string str = to_string(n);
\`\`\`

### String Stream
\`\`\`cpp
#include <sstream>

// Parse string
stringstream ss("1 2 3 4 5");
int x;
while (ss >> x) {
    cout << x << " ";
}

// Split string by delimiter
string text = "apple,banana,orange";
stringstream ss2(text);
string item;
while (getline(ss2, item, ',')) {
    cout << item << endl;
}
\`\`\`

## Advanced Features

### Pairs and Tuples
\`\`\`cpp
#include <utility>  // for pair
#include <tuple>    // for tuple

// Pair
pair<int, string> p = make_pair(1, "Hello");
cout << p.first << " " << p.second << endl;

// Tuple
tuple<int, string, double> t = make_tuple(1, "Hello", 3.14);
cout << get<0>(t) << " " << get<1>(t) << " " << get<2>(t) << endl;

// Tie for unpacking
int x;
string s;
double d;
tie(x, s, d) = t;
\`\`\`

### Lambda Functions
\`\`\`cpp
// Basic lambda
auto add = [](int a, int b) { return a + b; };

// Lambda with capture
int multiplier = 10;
auto multiply = [multiplier](int x) { return x * multiplier; };

// Lambda with STL algorithms
vector<int> v = {1, 2, 3, 4, 5};

// Sort with lambda
sort(v.begin(), v.end(), [](int a, int b) {
    return a > b;  // Descending order
});

// Transform with lambda
transform(v.begin(), v.end(), v.begin(), [](int x) {
    return x * x;  // Square each element
});
\`\`\`

### Iterators
\`\`\`cpp
vector<int> v = {1, 2, 3, 4, 5};

// Iterator types
vector<int>::iterator it = v.begin();
auto it2 = v.begin();  // Auto keyword

// Iterator operations
it++;                  // Move to next
it--;                  // Move to previous
*it;                   // Dereference

// Iterate with iterators
for (auto it = v.begin(); it != v.end(); ++it) {
    cout << *it << " ";
}

// Reverse iterators
for (auto rit = v.rbegin(); rit != v.rend(); ++rit) {
    cout << *rit << " ";
}
\`\`\`

### Input/Output for Competitive Programming
\`\`\`cpp
// Fast I/O
ios_base::sync_with_stdio(false);
cin.tie(NULL);

// Reading input
int n;
cin >> n;

vector<int> arr(n);
for (int i = 0; i < n; i++) {
    cin >> arr[i];
}

// Reading until EOF
int x;
while (cin >> x) {
    // Process x
}

// Multiple test cases
int t;
cin >> t;
while (t--) {
    // Solve each test case
}
\`\`\`

### Useful Macros
\`\`\`cpp
#define ll long long
#define vi vector<int>
#define vll vector<long long>
#define pii pair<int, int>
#define pb push_back
#define mp make_pair
#define F first
#define S second
#define all(x) x.begin(), x.end()
#define sz(x) (int)x.size()

// Constants
const int MOD = 1e9 + 7;
const int INF = 1e9;
const long long LLINF = 1e18;
\`\`\`

### Common Patterns
\`\`\`cpp
// Two pointers
vector<int> arr = {1, 2, 3, 4, 5, 6};
int left = 0, right = arr.size() - 1;
while (left < right) {
    if (arr[left] + arr[right] == target) {
        // Found pair
        break;
    } else if (arr[left] + arr[right] < target) {
        left++;
    } else {
        right--;
    }
}

// Sliding window
int windowSum = 0, maxSum = 0;
int windowSize = 3;
for (int i = 0; i < windowSize; i++) {
    windowSum += arr[i];
}
maxSum = windowSum;
for (int i = windowSize; i < arr.size(); i++) {
    windowSum = windowSum - arr[i - windowSize] + arr[i];
    maxSum = max(maxSum, windowSum);
}

// Binary search template
int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}
\`\`\`

This reference guide covers the essential C++ syntax and STL components needed for competitive programming and efficient software development. Practice these concepts regularly to master C++ programming!`,
    
    examples: [
      {
        input: "vector<int> v = {3,1,4,1,5}; sort(v.begin(), v.end());",
        output: "v = {1,1,3,4,5}",
        explanation: "STL sort function arranges elements in ascending order"
      },
      {
        input: "map<string,int> m; m[\"apple\"] = 5; cout << m[\"apple\"];",
        output: "5",
        explanation: "STL map provides key-value storage with O(log n) operations"
      },
      {
        input: "auto lambda = [](int x) { return x * x; }; cout << lambda(5);",
        output: "25",
        explanation: "Lambda function for inline function definitions"
      }
    ],
    
    practiceProblems: [
      "Two Sum using unordered_map",
      "Sliding Window Maximum using deque",
      "Custom Comparator with priority_queue",
      "String manipulation with stringstream",
      "Binary Search with STL functions",
      "Set operations for unique elements",
      "Vector operations and algorithms",
      "Map iteration and key-value processing",
      "Lambda functions with STL algorithms",
      "Iterator usage and custom loops"
    ],
    
    timeComplexity: "Vector: O(1) access, Set/Map: O(log n), Unordered: O(1) average",
    spaceComplexity: "Depends on container: O(n) for most STL containers"
  },

  CPP: {
    title: "C++ Programming - Complete Guide",
    toc: [
      "C++ Fundamentals",
      "Object-Oriented Programming",
      "STL Containers",
      "Modern C++ Features",
      "Memory Management",
      "Best Practices"
    ],
    hasResources: true,
    content: `# C++ Programming - From Basics to Advanced

C++ is a powerful, general-purpose programming language that supports procedural, object-oriented, and generic programming. It's widely used in system programming, game development, embedded systems, and competitive programming.

## Chapter 1: Introduction to C++

### What is C++?

C++ is an extension of the C programming language, developed by Bjarne Stroustrup at Bell Labs starting in 1979. It adds object-oriented programming capabilities to C while maintaining its efficiency and flexibility.

**Key Features:**
- **Object-Oriented Programming**: Classes, objects, inheritance, polymorphism
- **Low-Level Control**: Direct memory management, pointers
- **High Performance**: Compiled language, minimal runtime overhead
- **Standard Template Library (STL)**: Rich collection of algorithms and data structures
- **Multi-Paradigm**: Supports procedural, object-oriented, and generic programming

### Why Learn C++?

1. **Performance**: One of the fastest programming languages
2. **Versatility**: Used in games, operating systems, browsers, databases
3. **Industry Demand**: High demand in tech companies
4. **Foundation**: Helps understand computer science concepts
5. **Competitive Programming**: Preferred language for coding contests

## Chapter 2: Basic Syntax and Structure

### Hello World Program

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
\`\`\`

**Explanation:**
- \`#include <iostream>\`: Preprocessor directive to include input/output stream
- \`using namespace std\`: Allows using standard library without std:: prefix
- \`int main()\`: Entry point of the program
- \`cout\`: Standard output stream
- \`endl\`: End line manipulator
- \`return 0\`: Indicates successful program termination

### Basic Data Types

\`\`\`cpp
// Integer types
int age = 25;           // 4 bytes, range: -2^31 to 2^31-1
short height = 175;     // 2 bytes, range: -32,768 to 32,767
long population = 1000000L;  // 4 or 8 bytes (system dependent)
long long bigNumber = 9223372036854775807LL;  // 8 bytes

// Unsigned types
unsigned int count = 100U;
unsigned char grade = 'A';

// Floating point types
float price = 19.99f;   // 4 bytes, ~7 decimal digits precision
double salary = 50000.50;  // 8 bytes, ~15 decimal digits precision
long double precise = 3.14159265358979323846L;  // 12 or 16 bytes

// Character and boolean
char letter = 'A';      // 1 byte
bool isActive = true;   // 1 byte (true or false)

// String (from string library)
string name = "John Doe";
\`\`\`

### Variables and Constants

\`\`\`cpp
// Variable declaration and initialization
int x;          // Declaration
x = 10;         // Assignment
int y = 20;     // Declaration + initialization
int a = 5, b = 10, c = 15;  // Multiple variables

// Constants
const int MAX_SIZE = 100;        // Compile-time constant
const double PI = 3.14159;

// constexpr (C++11)
constexpr int ARRAY_SIZE = 50;   // Compile-time constant expression

// \#define preprocessor (avoid in modern C++)
\#define MAX_VALUE 1000
\`\`\`

### Input and Output

\`\`\`cpp
\#include <iostream>
\#include <iomanip>
using namespace std;

int main() {
    // Basic input/output
    int age;
    string name;
    
    cout << "Enter your name: ";
    getline(cin, name);  // Read entire line including spaces
    
    cout << "Enter your age: ";
    cin >> age;
    
    cout << "Hello " << name << ", you are " << age << " years old." << endl;
    
    // Formatted output
    double price = 19.99;
    cout << fixed << setprecision(2) << "Price: $" << price << endl;
    
    return 0;
}
\`\`\`

## Chapter 3: Control Structures

### Conditional Statements

#### if-else Statement
\`\`\`cpp
int score = 85;

// Simple if
if (score >= 90) {
    cout << "Grade A" << endl;
}

// if-else
if (score >= 90) {
    cout << "Grade A" << endl;
} else if (score >= 80) {
    cout << "Grade B" << endl;
} else if (score >= 70) {
    cout << "Grade C" << endl;
} else {
    cout << "Grade F" << endl;
}

// Ternary operator
string result = (score >= 60) ? "Pass" : "Fail";
\`\`\`

#### switch Statement
\`\`\`cpp
char grade = 'B';

switch (grade) {
    case 'A':
        cout << "Excellent!" << endl;
        break;
    case 'B':
        cout << "Good!" << endl;
        break;
    case 'C':
        cout << "Average" << endl;
        break;
    default:
        cout << "Invalid grade" << endl;
        break;
}
\`\`\`

### Loops

#### for Loop
\`\`\`cpp
// Traditional for loop
for (int i = 0; i < 10; i++) {
    cout << i << " ";
}

// Range-based for loop (C++11)
vector<int> numbers = {1, 2, 3, 4, 5};
for (int num : numbers) {
    cout << num << " ";
}

// Range-based for loop with auto
for (auto num : numbers) {
    cout << num << " ";
}
\`\`\`

#### while and do-while Loops
\`\`\`cpp
// while loop
int i = 0;
while (i < 5) {
    cout << i << " ";
    i++;
}

// do-while loop
int j = 0;
do {
    cout << j << " ";
    j++;
} while (j < 5);
\`\`\`

## Chapter 4: Functions

### Function Declaration and Definition

\`\`\`cpp
// Function declaration (prototype)
int add(int a, int b);
void printMessage(string message);
double calculateArea(double radius);

// Function definition
int add(int a, int b) {
    return a + b;
}

void printMessage(string message) {
    cout << message << endl;
}

double calculateArea(double radius) {
    const double PI = 3.14159;
    return PI * radius * radius;
}

int main() {
    int result = add(5, 3);
    printMessage("Hello from function!");
    double area = calculateArea(5.0);
    
    return 0;
}
\`\`\`

### Function Overloading

\`\`\`cpp
// Multiple functions with same name but different parameters
int add(int a, int b) {
    return a + b;
}

double add(double a, double b) {
    return a + b;
}

int add(int a, int b, int c) {
    return a + b + c;
}

int main() {
    cout << add(5, 3) << endl;        // Calls int version
    cout << add(5.5, 3.2) << endl;    // Calls double version
    cout << add(1, 2, 3) << endl;     // Calls three-parameter version
    
    return 0;
}
\`\`\`

### Default Parameters

\`\`\`cpp
// Function with default parameters
void greet(string name, string greeting = "Hello") {
    cout << greeting << ", " << name << "!" << endl;
}

int main() {
    greet("Alice");              // Uses default greeting
    greet("Bob", "Hi");          // Uses custom greeting
    
    return 0;
}
\`\`\`

## Chapter 5: Arrays and Strings

### Arrays

\`\`\`cpp
// Static array declaration
int numbers[5];                    // Uninitialized
int scores[5] = {90, 85, 92, 78, 88};  // Initialized
int values[] = {1, 2, 3, 4, 5};   // Size inferred

// Multi-dimensional arrays
int matrix[3][3] = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

// Array operations
int size = sizeof(scores) / sizeof(scores[0]);  // Get array size

// Iterating through array
for (int i = 0; i < 5; i++) {
    cout << scores[i] << " ";
}

// Range-based for loop
for (int score : scores) {
    cout << score << " ";
}
\`\`\`

### Strings

\`\`\`cpp
#include <string>
using namespace std;

// String declaration and initialization
string str1;                    // Empty string
string str2 = "Hello";
string str3("World");
string str4(5, 'A');           // "AAAAA"

// String operations
string fullName = str2 + " " + str3;  // Concatenation
int length = fullName.length();        // Get length
char firstChar = fullName[0];          // Access character

// String methods
fullName.append("!");           // Append
fullName.insert(5, " Beautiful");  // Insert
fullName.erase(5, 10);          // Erase substring
string sub = fullName.substr(0, 5);  // Get substring

// String comparison
if (str2 == "Hello") {
    cout << "Strings are equal" << endl;
}

// String input
string line;
getline(cin, line);  // Read entire line including spaces
\`\`\`

## Chapter 6: Pointers and References

### Pointers

\`\`\`cpp
// Pointer declaration and initialization
int x = 10;
int* ptr = &x;        // ptr points to address of x
int* ptr2 = nullptr;  // Null pointer (C++11)

// Pointer operations
cout << "Value of x: " << x << endl;        // 10
cout << "Address of x: " << &x << endl;     // Memory address
cout << "Value of ptr: " << ptr << endl;    // Same as &x
cout << "Value pointed by ptr: " << *ptr << endl;  // 10

// Modifying value through pointer
*ptr = 20;
cout << "New value of x: " << x << endl;   // 20

// Pointer arithmetic
int arr[] = {1, 2, 3, 4, 5};
int* p = arr;  // Points to first element

cout << *p << endl;      // 1
cout << *(p + 1) << endl;  // 2
cout << *(p + 2) << endl;  // 3
\`\`\`

### References

\`\`\`cpp
// Reference declaration (must be initialized)
int x = 10;
int& ref = x;  // ref is an alias for x

// Using references
cout << "x = " << x << endl;      // 10
cout << "ref = " << ref << endl;  // 10

ref = 20;  // Changes x as well
cout << "x = " << x << endl;      // 20

// References in functions (pass by reference)
void swap(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}

int main() {
    int x = 5, y = 10;
    swap(x, y);
    cout << "x = " << x << ", y = " << y << endl;  // x = 10, y = 5
    
    return 0;
}
\`\`\`

## Chapter 7: Object-Oriented Programming

### Classes and Objects

\`\`\`cpp
class Rectangle {
private:
    double length;
    double width;
    
public:
    // Constructor
    Rectangle(double l, double w) : length(l), width(w) {}
    
    // Default constructor
    Rectangle() : length(0), width(0) {}
    
    // Getter methods
    double getLength() const { return length; }
    double getWidth() const { return width; }
    
    // Setter methods
    void setLength(double l) { length = l; }
    void setWidth(double w) { width = w; }
    
    // Member functions
    double area() const {
        return length * width;
    }
    
    double perimeter() const {
        return 2 * (length + width);
    }
    
    // Display function
    void display() const {
        cout << "Rectangle: " << length << " x " << width << endl;
        cout << "Area: " << area() << endl;
        cout << "Perimeter: " << perimeter() << endl;
    }
};

int main() {
    // Creating objects
    Rectangle rect1(5.0, 3.0);
    Rectangle rect2;
    
    rect1.display();
    
    rect2.setLength(4.0);
    rect2.setWidth(2.0);
    rect2.display();
    
    return 0;
}
\`\`\`

### Inheritance

\`\`\`cpp
// Base class
class Shape {
protected:
    string color;
    
public:
    Shape(string c) : color(c) {}
    
    virtual double area() const = 0;  // Pure virtual function
    virtual void display() const {
        cout << "Color: " << color << endl;
    }
};

// Derived class
class Circle : public Shape {
private:
    double radius;
    
public:
    Circle(string c, double r) : Shape(c), radius(r) {}
    
    double area() const override {
        return 3.14159 * radius * radius;
    }
    
    void display() const override {
        Shape::display();  // Call base class method
        cout << "Circle with radius: " << radius << endl;
        cout << "Area: " << area() << endl;
    }
};

class Rectangle : public Shape {
private:
    double length, width;
    
public:
    Rectangle(string c, double l, double w) : Shape(c), length(l), width(w) {}
    
    double area() const override {
        return length * width;
    }
    
    void display() const override {
        Shape::display();
        cout << "Rectangle: " << length << " x " << width << endl;
        cout << "Area: " << area() << endl;
    }
};
\`\`\`

## Chapter 8: Standard Template Library (STL)

### Vectors

\`\`\`cpp
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    // Vector declaration and initialization
    vector<int> numbers;                    // Empty vector
    vector<int> scores(5, 100);            // 5 elements, all 100
    vector<int> values = {1, 2, 3, 4, 5};  // Initializer list
    
    // Adding elements
    numbers.push_back(10);
    numbers.push_back(20);
    numbers.push_back(30);
    
    // Accessing elements
    cout << "First element: " << numbers[0] << endl;
    cout << "Last element: " << numbers.back() << endl;
    cout << "Size: " << numbers.size() << endl;
    
    // Iterating
    for (int i = 0; i < numbers.size(); i++) {
        cout << numbers[i] << " ";
    }
    
    // Range-based for loop
    for (int num : numbers) {
        cout << num << " ";
    }
    
    // STL algorithms
    sort(numbers.begin(), numbers.end());
    reverse(numbers.begin(), numbers.end());
    
    return 0;
}
\`\`\`

### Maps

\`\`\`cpp
#include <map>
#include <unordered_map>
using namespace std;

int main() {
    // Map (ordered)
    map<string, int> ages;
    ages["Alice"] = 25;
    ages["Bob"] = 30;
    ages.insert({"Charlie", 35});
    
    // Accessing map elements
    cout << "Alice's age: " << ages["Alice"] << endl;
    
    // Iterating through map
    for (auto pair : ages) {
        cout << pair.first << ": " << pair.second << endl;
    }
    
    // Unordered map (hash table)
    unordered_map<string, string> capitals;
    capitals["USA"] = "Washington D.C.";
    capitals["France"] = "Paris";
    capitals["Japan"] = "Tokyo";
    
    return 0;
}
\`\`\`

## Chapter 9: File Handling

\`\`\`cpp
#include <fstream>
#include <iostream>
using namespace std;

int main() {
    // Writing to file
    ofstream outFile("data.txt");
    if (outFile.is_open()) {
        outFile << "Hello, World!" << endl;
        outFile << "This is a test file." << endl;
        outFile.close();
    }
    
    // Reading from file
    ifstream inFile("data.txt");
    string line;
    if (inFile.is_open()) {
        while (getline(inFile, line)) {
            cout << line << endl;
        }
        inFile.close();
    }
    
    // Reading and writing (append mode)
    fstream file("log.txt", ios::app);
    if (file.is_open()) {
        file << "New log entry" << endl;
        file.close();
    }
    
    return 0;
}
\`\`\`

## Chapter 10: Advanced Features

### Templates

\`\`\`cpp
// Function template
template <typename T>
T maximum(T a, T b) {
    return (a > b) ? a : b;
}

// Class template
template <typename T>
class Stack {
private:
    vector<T> elements;
    
public:
    void push(const T& element) {
        elements.push_back(element);
    }
    
    T pop() {
        if (elements.empty()) {
            throw runtime_error("Stack is empty");
        }
        T top = elements.back();
        elements.pop_back();
        return top;
    }
    
    bool empty() const {
        return elements.empty();
    }
};

int main() {
    // Using function template
    cout << maximum(10, 20) << endl;        // int version
    cout << maximum(3.14, 2.71) << endl;    // double version
    
    // Using class template
    Stack<int> intStack;
    intStack.push(10);
    intStack.push(20);
    
    Stack<string> stringStack;
    stringStack.push("Hello");
    stringStack.push("World");
    
    return 0;
}
\`\`\`

### Lambda Functions (C++11)

\`\`\`cpp
#include <algorithm>
#include <vector>
using namespace std;

int main() {
    vector<int> numbers = {5, 2, 8, 1, 9, 3};
    
    // Simple lambda
    auto square = [](int x) { return x * x; };
    cout << square(5) << endl;  // 25
    
    // Lambda with capture
    int multiplier = 3;
    auto multiply = [multiplier](int x) { return x * multiplier; };
    
    // Using lambda with STL algorithms
    sort(numbers.begin(), numbers.end(), [](int a, int b) {
        return a > b;  // Sort in descending order
    });
    
    // for_each with lambda
    for_each(numbers.begin(), numbers.end(), [](int n) {
        cout << n << " ";
    });
    
    return 0;
}
\`\`\`

## Best Practices and Tips

### Memory Management

\`\`\`cpp
// Use smart pointers (C++11)
#include <memory>
using namespace std;

int main() {
    // unique_ptr - exclusive ownership
    unique_ptr<int> ptr1 = make_unique<int>(42);
    
    // shared_ptr - shared ownership
    shared_ptr<int> ptr2 = make_shared<int>(100);
    shared_ptr<int> ptr3 = ptr2;  // Both point to same object
    
    // weak_ptr - non-owning observer
    weak_ptr<int> weakPtr = ptr2;
    
    return 0;
}
\`\`\`

### Exception Handling

\`\`\`cpp
#include <stdexcept>
using namespace std;

int divide(int a, int b) {
    if (b == 0) {
        throw invalid_argument("Division by zero");
    }
    return a / b;
}

int main() {
    try {
        int result = divide(10, 0);
        cout << "Result: " << result << endl;
    }
    catch (const invalid_argument& e) {
        cout << "Error: " << e.what() << endl;
    }
    catch (...) {
        cout << "Unknown error occurred" << endl;
    }
    
    return 0;
}
\`\`\`

## Common Interview Topics

1. **Pointers and Memory Management**
2. **Object-Oriented Programming Concepts**
3. **STL Containers and Algorithms**
4. **Template Programming**
5. **Exception Handling**
6. **Virtual Functions and Polymorphism**
7. **Constructor and Destructor**
8. **Operator Overloading**
9. **File I/O Operations**
10. **Multi-threading (C++11)**

## Next Steps

After mastering C++ basics:
- **Advanced C++**: Move semantics, perfect forwarding, variadic templates
- **Design Patterns**: Singleton, Factory, Observer patterns
- **Concurrency**: std::thread, std::mutex, std::async
- **Modern C++**: C++14, C++17, C++20 features
- **Performance Optimization**: Profiling, optimization techniques

**Remember**: C++ is a vast language. Focus on understanding core concepts first, then gradually explore advanced features. Practice coding regularly and work on projects to solidify your understanding!`,
    
    examples: [
      {
        input: "#include <iostream>\nint main() { std::cout << \"Hello World\"; return 0; }",
        output: "Hello World",
        explanation: "Basic C++ program structure with iostream library for output",
        code: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello World" << endl;
    return 0;
}`,
        copyable: true
      },
      {
        input: "vector<int> v = {1,2,3}; v.push_back(4); cout << v.size();",
        output: "4",
        explanation: "STL vector dynamic array with push_back operation",
        code: `#include <vector>
#include <iostream>
using namespace std;

int main() {
    vector<int> v = {1, 2, 3};
    v.push_back(4);
    cout << v.size() << endl; // Output: 4
    return 0;
}`,
        copyable: true
      },
      {
        input: "STL Map Usage",
        output: "Key-value pair storage and retrieval",
        explanation: "Using STL map for efficient key-value operations",
        code: `#include <map>
#include <iostream>
using namespace std;

int main() {
    map<string, int> ages;
    ages["Alice"] = 25;
    ages["Bob"] = 30;
    
    for(auto& pair : ages) {
        cout << pair.first << ": " << pair.second << endl;
    }
    return 0;
}`,
        copyable: true
      }
    ],
    
    practiceProblems: [
      "Implement Vector Class",
      "Smart Pointer Implementation",
      "Template Meta-programming",
      "RAII Pattern Implementation",
      "Custom Allocator Design",
      "Thread-Safe Singleton",
      "Expression Templates",
      "Policy-Based Design",
      "SFINAE Techniques",
      "Variadic Templates"
    ],
    
    stlContainers: {
      "vector": "Dynamic array, O(1) amortized insertion",
      "deque": "Double-ended queue, O(1) front/back operations",
      "list": "Doubly linked list, O(1) insertion anywhere",
      "set/map": "Balanced BST, O(log n) operations",
      "unordered_set/map": "Hash table, O(1) average operations"
    },
    
    timeComplexity: "Varies by operation: O(1) for basic operations, O(n) for algorithms",
    spaceComplexity: "Depends on data structures used and memory allocation",
    
    modernFeatures: {
      "C++11": "auto, lambda, smart pointers, move semantics",
      "C++14": "generic lambdas, variable templates",
      "C++17": "structured bindings, if constexpr, parallel algorithms",
      "C++20": "concepts, coroutines, modules, ranges"
    }
  },

  LinkedLists: {
    title: "Linked Lists - Complete Masterclass",
    content: `# Linked Lists - Dynamic Data Structure Mastery

Linked Lists are fundamental dynamic data structures that overcome the limitations of arrays. Unlike arrays, linked lists can grow and shrink during runtime, making them incredibly flexible for various applications.

## Chapter 1: Understanding Linked Lists

### What is a Linked List?

A linked list is a **linear data structure** where elements (called nodes) are stored in sequence, but unlike arrays, they are **not stored in contiguous memory locations**. Each node contains:
1. **Data**: The actual value stored
2. **Pointer/Reference**: Address of the next node

**Real-world Analogy - Treasure Hunt:**
- Each clue (node) contains a treasure (data) and directions to the next clue (pointer)
- You start at the first clue (head)
- Follow the chain until you reach the end (null pointer)
- Clues can be anywhere in the city (non-contiguous memory)

**Real-world Analogy - Train Cars:**
- Each car (node) carries passengers (data) and is connected to the next car (pointer)
- Cars can be added or removed anywhere in the train
- The engine (head pointer) leads the entire train

### Memory Representation

\`\`\`
Array vs Linked List Memory Layout:

Array: [10][20][30][40][50] <- Contiguous memory
        1000 1004 1008 1012 1016

Linked List: 
Node 1: [10|1500] at address 1000
Node 2: [20|2000] at address 1500  
Node 3: [30|2500] at address 2000
Node 4: [40|3000] at address 2500
Node 5: [50|NULL] at address 3000

// Nodes can be anywhere in memory!
// Connected through pointers, not physical adjacency
\`\`\`

### Why Use Linked Lists?

**Advantages over Arrays:**
1. **Dynamic Size**: Can grow/shrink during runtime
2. **Efficient Insertion/Deletion**: O(1) at known positions
3. **Memory Efficient**: Allocate only what you need
4. **No Memory Waste**: No unused allocated space

**Disadvantages:**
1. **No Random Access**: Must traverse from head
2. **Extra Memory**: Pointers require additional space
3. **Cache Performance**: Poor locality of reference
4. **No Backward Traversal**: (in singly linked lists)

## Chapter 2: Types of Linked Lists

### 1. Singly Linked List

**Structure**: Each node points to the next node
\`\`\`
[Data|Next] -> [Data|Next] -> [Data|Next] -> NULL
\`\`\`

**Node Implementation:**
\`\`\`cpp
struct ListNode {
    int data;
    ListNode* next;
    
    // Constructor
    ListNode(int val) : data(val), next(nullptr) {}
    ListNode(int val, ListNode* nextNode) : data(val), next(nextNode) {}
};
\`\`\`

**Complete Singly Linked List Class:**
\`\`\`cpp
class SinglyLinkedList {
private:
    ListNode* head;
    int size;
    
public:
    // Constructor
    SinglyLinkedList() : head(nullptr), size(0) {}
    
    // Destructor
    ~SinglyLinkedList() {
        clear();
    }
    
    // Insert at beginning - O(1)
    void insertAtHead(int val) {
        ListNode* newNode = new ListNode(val, head);
        head = newNode;
        size++;
    }
    
    // Insert at end - O(n)
    void insertAtTail(int val) {
        ListNode* newNode = new ListNode(val);
        
        if (!head) {
            head = newNode;
        } else {
            ListNode* current = head;
            while (current->next) {
                current = current->next;
            }
            current->next = newNode;
        }
        size++;
    }
    
    // Insert at position - O(n)
    void insertAtPosition(int pos, int val) {
        if (pos < 0 || pos > size) {
            throw out_of_range("Invalid position");
        }
        
        if (pos == 0) {
            insertAtHead(val);
            return;
        }
        
        ListNode* newNode = new ListNode(val);
        ListNode* current = head;
        
        for (int i = 0; i < pos - 1; i++) {
            current = current->next;
        }
        
        newNode->next = current->next;
        current->next = newNode;
        size++;
    }
    
    // Delete from beginning - O(1)
    void deleteFromHead() {
        if (!head) {
            throw runtime_error("List is empty");
        }
        
        ListNode* temp = head;
        head = head->next;
        delete temp;
        size--;
    }
    
    // Delete by value - O(n)
    bool deleteByValue(int val) {
        if (!head) return false;
        
        // If head node contains the value
        if (head->data == val) {
            deleteFromHead();
            return true;
        }
        
        ListNode* current = head;
        while (current->next && current->next->data != val) {
            current = current->next;
        }
        
        if (current->next) {
            ListNode* nodeToDelete = current->next;
            current->next = nodeToDelete->next;
            delete nodeToDelete;
            size--;
            return true;
        }
        
        return false;
    }
    
    // Search for value - O(n)
    bool search(int val) {
        ListNode* current = head;
        while (current) {
            if (current->data == val) {
                return true;
            }
            current = current->next;
        }
        return false;
    }
    
    // Get size - O(1)
    int getSize() const {
        return size;
    }
    
    // Display list - O(n)
    void display() {
        ListNode* current = head;
        cout << "List: ";
        while (current) {
            cout << current->data;
            if (current->next) cout << " -> ";
            current = current->next;
        }
        cout << " -> NULL" << endl;
    }
    
    // Clear entire list - O(n)
    void clear() {
        while (head) {
            ListNode* temp = head;
            head = head->next;
            delete temp;
        }
        size = 0;
    }
};
\`\`\`

### 2. Doubly Linked List

**Structure**: Each node has pointers to both next and previous nodes
\`\`\`
NULL <- [Prev|Data|Next] <-> [Prev|Data|Next] <-> [Prev|Data|Next] -> NULL
\`\`\`

**Node Implementation:**
\`\`\`cpp
struct DoublyListNode {
    int data;
    DoublyListNode* next;
    DoublyListNode* prev;
    
    DoublyListNode(int val) : data(val), next(nullptr), prev(nullptr) {}
};
\`\`\`

**Doubly Linked List Class:**
\`\`\`cpp
class DoublyLinkedList {
private:
    DoublyListNode* head;
    DoublyListNode* tail;
    int size;
    
public:
    DoublyLinkedList() : head(nullptr), tail(nullptr), size(0) {}
    
    // Insert at beginning - O(1)
    void insertAtHead(int val) {
        DoublyListNode* newNode = new DoublyListNode(val);
        
        if (!head) {
            head = tail = newNode;
        } else {
            newNode->next = head;
            head->prev = newNode;
            head = newNode;
        }
        size++;
    }
    
    // Insert at end - O(1)
    void insertAtTail(int val) {
        DoublyListNode* newNode = new DoublyListNode(val);
        
        if (!tail) {
            head = tail = newNode;
        } else {
            tail->next = newNode;
            newNode->prev = tail;
            tail = newNode;
        }
        size++;
    }
    
    // Delete from beginning - O(1)
    void deleteFromHead() {
        if (!head) {
            throw runtime_error("List is empty");
        }
        
        DoublyListNode* temp = head;
        
        if (head == tail) {  // Only one node
            head = tail = nullptr;
        } else {
            head = head->next;
            head->prev = nullptr;
        }
        
        delete temp;
        size--;
    }
    
    // Delete from end - O(1)
    void deleteFromTail() {
        if (!tail) {
            throw runtime_error("List is empty");
        }
        
        DoublyListNode* temp = tail;
        
        if (head == tail) {  // Only one node
            head = tail = nullptr;
        } else {
            tail = tail->prev;
            tail->next = nullptr;
        }
        
        delete temp;
        size--;
    }
    
    // Display forward - O(n)
    void displayForward() {
        DoublyListNode* current = head;
        cout << "Forward: ";
        while (current) {
            cout << current->data;
            if (current->next) cout << " <-> ";
            current = current->next;
        }
        cout << " -> NULL" << endl;
    }
    
    // Display backward - O(n)
    void displayBackward() {
        DoublyListNode* current = tail;
        cout << "Backward: ";
        while (current) {
            cout << current->data;
            if (current->prev) cout << " <-> ";
            current = current->prev;
        }
        cout << " -> NULL" << endl;
    }
};
\`\`\`

### 3. Circular Linked List

**Structure**: Last node points back to the first node
\`\`\`
[Data|Next] -> [Data|Next] -> [Data|Next] ->
     ^                                      |
     |______________________________________|
\`\`\`

**Circular Linked List Implementation:**
\`\`\`cpp
class CircularLinkedList {
private:
    ListNode* head;
    int size;
    
public:
    CircularLinkedList() : head(nullptr), size(0) {}
    
    // Insert at beginning - O(1) if we maintain tail pointer
    void insertAtHead(int val) {
        ListNode* newNode = new ListNode(val);
        
        if (!head) {
            head = newNode;
            newNode->next = head;  // Points to itself
        } else {
            // Find the last node
            ListNode* last = head;
            while (last->next != head) {
                last = last->next;
            }
            
            newNode->next = head;
            last->next = newNode;
            head = newNode;
        }
        size++;
    }
    
    // Display circular list - O(n)
    void display() {
        if (!head) {
            cout << "List is empty" << endl;
            return;
        }
        
        ListNode* current = head;
        cout << "Circular List: ";
        do {
            cout << current->data;
            current = current->next;
            if (current != head) cout << " -> ";
        } while (current != head);
        cout << " -> (back to " << head->data << ")" << endl;
    }
    
    // Check if list contains cycle (always true for circular)
    bool hasCycle() {
        return head != nullptr;
    }
};
\`\`\`

## Chapter 3: Advanced Linked List Algorithms

### 1. Reverse a Linked List

#### Iterative Approach - O(n) Time, O(1) Space
\`\`\`cpp
ListNode* reverseIterative(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* current = head;
    ListNode* next = nullptr;
    
    while (current) {
        next = current->next;    // Store next node
        current->next = prev;    // Reverse the link
        prev = current;          // Move prev forward
        current = next;          // Move current forward
    }
    
    return prev;  // New head
}
\`\`\`

#### Recursive Approach - O(n) Time, O(n) Space
\`\`\`cpp
ListNode* reverseRecursive(ListNode* head) {
    // Base case
    if (!head || !head->next) {
        return head;
    }
    
    // Recursively reverse the rest
    ListNode* newHead = reverseRecursive(head->next);
    
    // Reverse the current connection
    head->next->next = head;
    head->next = nullptr;
    
    return newHead;
}
\`\`\`

### 2. Detect Cycle in Linked List (Floyd's Algorithm)

\`\`\`cpp
// Floyd's Cycle Detection Algorithm (Tortoise and Hare)
bool hasCycle(ListNode* head) {
    if (!head || !head->next) {
        return false;
    }
    
    ListNode* slow = head;      // Moves 1 step
    ListNode* fast = head;      // Moves 2 steps
    
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        
        if (slow == fast) {
            return true;  // Cycle detected
        }
    }
    
    return false;  // No cycle
}

// Find the start of the cycle
ListNode* detectCycleStart(ListNode* head) {
    if (!head || !head->next) {
        return nullptr;
    }
    
    ListNode* slow = head;
    ListNode* fast = head;
    
    // Phase 1: Detect if cycle exists
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        
        if (slow == fast) {
            break;  // Cycle found
        }
    }
    
    // No cycle found
    if (!fast || !fast->next) {
        return nullptr;
    }
    
    // Phase 2: Find cycle start
    slow = head;
    while (slow != fast) {
        slow = slow->next;
        fast = fast->next;
    }
    
    return slow;  // Start of cycle
}
\`\`\`

### 3. Find Middle of Linked List

\`\`\`cpp
// Two-pointer technique
ListNode* findMiddle(ListNode* head) {
    if (!head) return nullptr;
    
    ListNode* slow = head;
    ListNode* fast = head;
    
    // Fast moves 2 steps, slow moves 1 step
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    
    return slow;  // Middle node
}

// Find middle and split into two lists
pair<ListNode*, ListNode*> splitList(ListNode* head) {
    if (!head || !head->next) {
        return {head, nullptr};
    }
    
    ListNode* slow = head;
    ListNode* fast = head;
    ListNode* prev = nullptr;
    
    while (fast && fast->next) {
        prev = slow;
        slow = slow->next;
        fast = fast->next->next;
    }
    
    prev->next = nullptr;  // Split the list
    
    return {head, slow};
}
\`\`\`

### 4. Merge Two Sorted Linked Lists

\`\`\`cpp
// Iterative approach
ListNode* mergeTwoSortedLists(ListNode* l1, ListNode* l2) {
    // Create dummy node to simplify logic
    ListNode dummy(0);
    ListNode* current = &dummy;
    
    while (l1 && l2) {
        if (l1->data <= l2->data) {
            current->next = l1;
            l1 = l1->next;
        } else {
            current->next = l2;
            l2 = l2->next;
        }
        current = current->next;
    }
    
    // Attach remaining nodes
    current->next = l1 ? l1 : l2;
    
    return dummy.next;
}

// Recursive approach
ListNode* mergeTwoSortedListsRecursive(ListNode* l1, ListNode* l2) {
    // Base cases
    if (!l1) return l2;
    if (!l2) return l1;
    
    if (l1->data <= l2->data) {
        l1->next = mergeTwoSortedListsRecursive(l1->next, l2);
        return l1;
    } else {
        l2->next = mergeTwoSortedListsRecursive(l1, l2->next);
        return l2;
    }
}
\`\`\`

### 5. Remove Nth Node from End

\`\`\`cpp
// Two-pointer technique
ListNode* removeNthFromEnd(ListNode* head, int n) {
    // Create dummy node to handle edge cases
    ListNode dummy(0);
    dummy.next = head;
    
    ListNode* first = &dummy;
    ListNode* second = &dummy;
    
    // Move first pointer n+1 steps ahead
    for (int i = 0; i <= n; i++) {
        first = first->next;
    }
    
    // Move both pointers until first reaches end
    while (first) {
        first = first->next;
        second = second->next;
    }
    
    // Remove the nth node from end
    ListNode* nodeToDelete = second->next;
    second->next = second->next->next;
    delete nodeToDelete;
    
    return dummy.next;
}
\`\`\`

### 6. Check if Linked List is Palindrome

\`\`\`cpp
bool isPalindrome(ListNode* head) {
    if (!head || !head->next) {
        return true;
    }
    
    // Step 1: Find middle of the list
    ListNode* slow = head;
    ListNode* fast = head;
    
    while (fast->next && fast->next->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    
    // Step 2: Reverse second half
    ListNode* secondHalf = reverseIterative(slow->next);
    
    // Step 3: Compare first and second half
    ListNode* firstHalf = head;
    ListNode* secondHalfCopy = secondHalf;
    bool isPalin = true;
    
    while (secondHalf) {
        if (firstHalf->data != secondHalf->data) {
            isPalin = false;
            break;
        }
        firstHalf = firstHalf->next;
        secondHalf = secondHalf->next;
    }
    
    // Step 4: Restore original list (optional)
    slow->next = reverseIterative(secondHalfCopy);
    
    return isPalin;
}
\`\`\`

## Chapter 4: Applications and Use Cases

### 1. Implementing Stack using Linked List

\`\`\`cpp
class LinkedStack {
private:
    ListNode* top;
    int size;
    
public:
    LinkedStack() : top(nullptr), size(0) {}
    
    // Push - O(1)
    void push(int val) {
        ListNode* newNode = new ListNode(val, top);
        top = newNode;
        size++;
    }
    
    // Pop - O(1)
    int pop() {
        if (!top) {
            throw runtime_error("Stack is empty");
        }
        
        int val = top->data;
        ListNode* temp = top;
        top = top->next;
        delete temp;
        size--;
        
        return val;
    }
    
    // Peek - O(1)
    int peek() {
        if (!top) {
            throw runtime_error("Stack is empty");
        }
        return top->data;
    }
    
    bool isEmpty() { return top == nullptr; }
    int getSize() { return size; }
};
\`\`\`

### 2. Implementing Queue using Linked List

\`\`\`cpp
class LinkedQueue {
private:
    ListNode* front;
    ListNode* rear;
    int size;
    
public:
    LinkedQueue() : front(nullptr), rear(nullptr), size(0) {}
    
    // Enqueue - O(1)
    void enqueue(int val) {
        ListNode* newNode = new ListNode(val);
        
        if (!rear) {
            front = rear = newNode;
        } else {
            rear->next = newNode;
            rear = newNode;
        }
        size++;
    }
    
    // Dequeue - O(1)
    int dequeue() {
        if (!front) {
            throw runtime_error("Queue is empty");
        }
        
        int val = front->data;
        ListNode* temp = front;
        front = front->next;
        
        if (!front) {
            rear = nullptr;
        }
        
        delete temp;
        size--;
        
        return val;
    }
    
    bool isEmpty() { return front == nullptr; }
    int getSize() { return size; }
};
\`\`\`

## Time & Space Complexity Summary

| Operation | Singly LL | Doubly LL | Array |
|-----------|-----------|-----------|-------|
| Access | O(n) | O(n) | O(1) |
| Search | O(n) | O(n) | O(n) |
| Insert at head | O(1) | O(1) | O(n) |
| Insert at tail | O(n) | O(1) | O(1) |
| Delete from head | O(1) | O(1) | O(n) |
| Delete from tail | O(n) | O(1) | O(1) |
| Memory per element | Data + 1 pointer | Data + 2 pointers | Data only |

## When to Use Linked Lists

**Use Linked Lists When:**
- Frequent insertions/deletions at the beginning
- Size of data structure varies significantly
- You don't need random access to elements
- Memory is limited and you want to avoid waste

**Use Arrays When:**
- Frequent random access to elements
- Cache performance is critical
- Memory usage needs to be minimized
- Mathematical operations on indices

## Common Interview Problems

1. **Reverse Linked List** (Iterative & Recursive)
2. **Detect Cycle in Linked List** (Floyd's Algorithm)
3. **Find Middle of Linked List** (Two Pointers)
4. **Merge Two Sorted Lists**
5. **Remove Nth Node from End**
6. **Palindrome Linked List**
7. **Intersection of Two Linked Lists**
8. **Add Two Numbers** (represented as linked lists)
9. **Copy List with Random Pointer**
10. **LRU Cache Implementation**

## Pro Tips for Interviews

1. **Always check for null pointers** before dereferencing
2. **Use dummy nodes** to simplify edge cases
3. **Draw diagrams** to visualize pointer manipulations
4. **Consider two-pointer techniques** for many problems
5. **Practice memory management** (new/delete in C++)
6. **Think about edge cases**: empty list, single node, cycles

## Next Steps

After mastering linked lists:
- **Advanced Data Structures**: Skip lists, XOR linked lists
- **Trees**: Binary trees, BST (which use similar node concepts)
- **Graphs**: Adjacency lists (arrays of linked lists)
- **Hash Tables**: Chaining collision resolution

**Remember**: Linked lists are fundamental to understanding more complex data structures. Master pointer manipulation here, and trees and graphs will become much easier!

**Practice**: Implement all operations from scratch, solve LeetCode problems, and always consider both iterative and recursive approaches.

## Key Characteristics:
- **Dynamic Size**: Can grow or shrink during runtime
- **Non-contiguous Memory**: Nodes can be anywhere in memory
- **Sequential Access**: Must traverse from head to reach any element
- **No Random Access**: Cannot directly access elements by index

## Types of Linked Lists:

### 1. Singly Linked List:
- Each node points to the next node
- Last node points to NULL
- **Structure**: [Data|Next] → [Data|Next] → ... → [Data|NULL]

### 2. Doubly Linked List:
- Each node has pointers to both next and previous nodes
- Allows bidirectional traversal
- **Structure**: NULL ← [Prev|Data|Next] ↔ [Prev|Data|Next] ↔ ... → NULL

### 3. Circular Linked List:
- Last node points back to the first node
- No NULL pointers (except for empty list)
- Can be singly or doubly circular

## Basic Operations:

### 1. Insertion:
\`\`\`
// Insert at beginning
function insertAtHead(head, data):
    newNode = new Node(data)
    newNode.next = head
    return newNode

// Insert at end
function insertAtTail(head, data):
    newNode = new Node(data)
    if head is null:
        return newNode
    current = head
    while current.next is not null:
        current = current.next
    current.next = newNode
    return head
\`\`\`

### 2. Deletion:
\`\`\`
// Delete by value
function deleteNode(head, value):
    if head is null:
        return null
    if head.data == value:
        return head.next
    current = head
    while current.next and current.next.data != value:
        current = current.next
    if current.next:
        current.next = current.next.next
    return head
\`\`\`

### 3. Traversal:
\`\`\`
function traverse(head):
    current = head
    while current is not null:
        process(current.data)
        current = current.next
\`\`\`

### 4. Search:
\`\`\`
function search(head, value):
    current = head
    position = 0
    while current is not null:
        if current.data == value:
            return position
        current = current.next
        position++
    return -1  // Not found
\`\`\`

## Time Complexities:
- **Access**: O(n) - Must traverse from head
- **Search**: O(n) - Linear search through nodes
- **Insertion**: O(1) at head, O(n) at tail or middle
- **Deletion**: O(1) if node reference given, O(n) if searching first

## Advanced Techniques:

### 1. Two Pointers (Slow-Fast):
- **Floyd's Cycle Detection**: Detect cycles in linked list
- **Find Middle**: Slow pointer moves 1 step, fast moves 2 steps
- **Nth from End**: Use two pointers with n-node gap

\`\`\`
function detectCycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return true  // Cycle detected
    return false
\`\`\`

### 2. Dummy Node Technique:
- Use dummy node to simplify edge cases
- Especially useful for deletion and merging operations

\`\`\`
function mergeTwoLists(l1, l2):
    dummy = new Node(0)
    current = dummy
    while l1 and l2:
        if l1.data <= l2.data:
            current.next = l1
            l1 = l1.next
        else:
            current.next = l2
            l2 = l2.next
        current = current.next
    current.next = l1 or l2
    return dummy.next
\`\`\`

### 3. Reversal Techniques:
- **Iterative Reversal**: Use three pointers (prev, current, next)
- **Recursive Reversal**: Reverse recursively
- **Partial Reversal**: Reverse only a portion of the list

\`\`\`
function reverseList(head):
    prev = null
    current = head
    while current:
        next = current.next
        current.next = prev
        prev = current
        current = next
    return prev
\`\`\`

## Common Problems:

### 1. Cycle Detection:
- **Floyd's Algorithm**: Use slow and fast pointers
- **Applications**: Detect infinite loops, find cycle start

### 2. Merge Operations:
- **Merge Two Sorted Lists**: Compare and link nodes
- **Merge K Sorted Lists**: Use divide and conquer or priority queue

### 3. Palindrome Check:
- **Approach**: Find middle, reverse second half, compare
- **Time**: O(n), **Space**: O(1)

### 4. Intersection of Lists:
- **Approach**: Calculate lengths, align starts, find common node
- **Time**: O(m+n), **Space**: O(1)

### 5. Remove Duplicates:
- **Sorted List**: Single pass comparison
- **Unsorted List**: Use hash set or nested loops

## Advantages:
- **Dynamic Size**: Grows and shrinks as needed
- **Efficient Insertion/Deletion**: O(1) at known positions
- **Memory Efficient**: Allocates memory as needed
- **Flexibility**: Easy to implement stacks and queues

## Disadvantages:
- **No Random Access**: Cannot directly access elements by index
- **Extra Memory**: Requires additional memory for pointers
- **Cache Performance**: Poor locality of reference
- **Sequential Access**: Must traverse from beginning

## Applications:
- **Implementation of Stacks and Queues**
- **Undo Functionality**: Maintain history of operations
- **Music Playlists**: Next/previous song navigation
- **Browser History**: Forward/backward navigation
- **Memory Management**: Free list in memory allocators
- **Graph Representation**: Adjacency lists

## Best Practices:
- Always check for NULL pointers before dereferencing
- Use dummy nodes to simplify edge cases
- Free memory properly to avoid memory leaks
- Consider using doubly linked lists for bidirectional traversal
- Use appropriate techniques (two pointers, dummy nodes) for complex operations

## Memory Management:
- **C/C++**: Manual memory allocation and deallocation
- **Java/Python**: Automatic garbage collection
- **Best Practice**: Set pointers to NULL after deletion`,
    
    examples: [
      {
        input: "List: 1→2→3→4→5, Insert 0 at head",
        output: "0→1→2→3→4→5",
        explanation: "New node with value 0 becomes the new head, pointing to old head"
      },
      {
        input: "List: 1→2→3→4→5, Reverse",
        output: "5→4→3→2→1",
        explanation: "Iteratively reverse the direction of all pointers"
      }
    ],
    
    timeComplexity: "Access/Search: O(n), Insert/Delete: O(1) with reference",
    spaceComplexity: "O(1) for operations, O(n) for storage"
  },

  C: {
    title: "C Programming - Complete Guide",
    content: `# C Programming - Master the Foundation

C is a powerful, general-purpose programming language that forms the foundation of modern computing. Created by Dennis Ritchie at Bell Labs in 1972, C is the mother of many programming languages and is essential for system programming, embedded systems, and understanding computer fundamentals.

## Chapter 1: Introduction to C

### What is C?

C is a **procedural programming language** that provides:
- **Low-level access** to memory and hardware
- **High-level constructs** for structured programming
- **Portability** across different platforms
- **Efficiency** in execution and memory usage
- **Foundation** for operating systems and compilers

**Why Learn C?**
1. **Foundation Language**: Understanding C helps learn other languages
2. **System Programming**: Operating systems, drivers, embedded systems
3. **Performance**: Direct hardware access and minimal overhead
4. **Industry Standard**: Widely used in critical applications
5. **Problem Solving**: Develops strong programming fundamentals

### C Program Structure

\`\`\`c
// Basic C Program Structure
#include <stdio.h>      // Preprocessor directive
#include <stdlib.h>

// Function declarations (prototypes)
int add(int a, int b);
void display(void);

// Global variables (avoid when possible)
int globalVar = 100;

// Main function - entry point
int main() {
    // Local variables
    int x = 10, y = 20;
    int result;
    
    // Function calls
    result = add(x, y);
    display();
    
    printf("Result: %d\\n", result);
    
    return 0;  // Success
}

// Function definitions
int add(int a, int b) {
    return a + b;
}

void display(void) {
    printf("Hello from C!\\n");
}
\`\`\`

## Chapter 2: Data Types and Variables

### Basic Data Types

\`\`\`c
#include <stdio.h>
#include <limits.h>
#include <float.h>

int main() {
    // Integer types
    char c = 'A';              // 1 byte: -128 to 127
    unsigned char uc = 255;    // 1 byte: 0 to 255
    
    short s = 32000;           // 2 bytes: -32,768 to 32,767
    unsigned short us = 65000; // 2 bytes: 0 to 65,535
    
    int i = 2147483647;        // 4 bytes: -2^31 to 2^31-1
    unsigned int ui = 4000000000U; // 4 bytes: 0 to 2^32-1
    
    long l = 2147483647L;      // 4 or 8 bytes (system dependent)
    long long ll = 9223372036854775807LL; // 8 bytes
    
    // Floating point types
    float f = 3.14159f;        // 4 bytes, ~7 decimal digits
    double d = 3.141592653589793; // 8 bytes, ~15 decimal digits
    long double ld = 3.141592653589793238L; // 12 or 16 bytes
    
    // Display sizes and ranges
    printf("char: %zu bytes, range: %d to %d\\n", 
           sizeof(char), CHAR_MIN, CHAR_MAX);
    printf("int: %zu bytes, range: %d to %d\\n", 
           sizeof(int), INT_MIN, INT_MAX);
    printf("float: %zu bytes, precision: %d digits\\n", 
           sizeof(float), FLT_DIG);
    printf("double: %zu bytes, precision: %d digits\\n", 
           sizeof(double), DBL_DIG);
    
    return 0;
}
\`\`\`

### Variable Declaration and Initialization

\`\`\`c
// Variable declaration patterns
int main() {
    // Declaration without initialization
    int age;
    float salary;
    char grade;
    
    // Declaration with initialization
    int count = 0;
    float pi = 3.14159f;
    char letter = 'A';
    
    // Multiple declarations
    int x = 10, y = 20, z = 30;
    float a, b = 2.5f, c = 3.7f;
    
    // Constants
    const int MAX_SIZE = 100;        // Runtime constant
    const float TAX_RATE = 0.08f;
    
    // Preprocessor constants (compile-time)
    #define PI 3.14159
    #define MAX_STUDENTS 50
    
    // Using variables
    age = 25;
    salary = 50000.0f;
    grade = 'A';
    
    printf("Age: %d, Salary: %.2f, Grade: %c\\n", age, salary, grade);
    
    return 0;
}
\`\`\`

## Chapter 3: Input and Output

### Standard I/O Functions

\`\`\`c
#include <stdio.h>

int main() {
    // Output functions
    printf("Hello, World!\\n");           // Formatted output
    puts("This is a string");             // String output with newline
    putchar('A');                         // Single character output
    putchar('\\n');
    
    // Input functions
    int age;
    float height;
    char name[50];
    char grade;
    
    // Reading different data types
    printf("Enter your age: ");
    scanf("%d", &age);                    // Read integer
    
    printf("Enter your height: ");
    scanf("%f", &height);                 // Read float
    
    printf("Enter your grade: ");
    scanf(" %c", &grade);                 // Read character (note space)
    
    printf("Enter your name: ");
    scanf("%s", name);                    // Read string (no spaces)
    
    // Alternative: fgets for strings with spaces
    printf("Enter full name: ");
    getchar();  // Consume newline from previous input
    fgets(name, sizeof(name), stdin);
    
    // Display results
    printf("\\nYour Information:\\n");
    printf("Age: %d years\\n", age);
    printf("Height: %.2f cm\\n", height);
    printf("Grade: %c\\n", grade);
    printf("Name: %s\\n", name);
    
    return 0;
}
\`\`\`

### Format Specifiers

\`\`\`c
int main() {
    int num = 42;
    float pi = 3.14159f;
    double e = 2.718281828;
    char ch = 'X';
    char str[] = "Hello";
    
    // Integer format specifiers
    printf("Decimal: %d\\n", num);        // 42
    printf("Octal: %o\\n", num);          // 52
    printf("Hexadecimal: %x\\n", num);    // 2a
    printf("Hexadecimal: %X\\n", num);    // 2A
    
    // Floating point format specifiers
    printf("Float: %f\\n", pi);           // 3.141590
    printf("Float (2 decimals): %.2f\\n", pi); // 3.14
    printf("Scientific: %e\\n", e);       // 2.718282e+00
    printf("Scientific: %E\\n", e);       // 2.718282E+00
    printf("Shorter of %%f or %%e: %g\\n", pi); // 3.14159
    
    // Character and string
    printf("Character: %c\\n", ch);       // X
    printf("String: %s\\n", str);         // Hello
    
    // Width and alignment
    printf("Right aligned: %10d\\n", num);     // "        42"
    printf("Left aligned: %-10d\\n", num);     // "42        "
    printf("Zero padded: %05d\\n", num);       // "00042"
    
    return 0;
}
\`\`\`

## Chapter 4: Control Structures

### Conditional Statements

\`\`\`c
// if-else statements
int main() {
    int score;
    printf("Enter your score (0-100): ");
    scanf("%d", &score);
    
    // Simple if
    if (score >= 90) {
        printf("Excellent! Grade A\\n");
    }
    
    // if-else chain
    if (score >= 90) {
        printf("Grade: A\\n");
    } else if (score >= 80) {
        printf("Grade: B\\n");
    } else if (score >= 70) {
        printf("Grade: C\\n");
    } else if (score >= 60) {
        printf("Grade: D\\n");
    } else {
        printf("Grade: F\\n");
    }
    
    // Ternary operator
    char* result = (score >= 60) ? "Pass" : "Fail";
    printf("Result: %s\\n", result);
    
    return 0;
}
\`\`\`

### Loops

\`\`\`c
// for loop examples
void forLoopExamples() {
    // Basic for loop
    printf("Numbers 1 to 10:\\n");
    for (int i = 1; i <= 10; i++) {
        printf("%d ", i);
    }
    printf("\\n");
    
    // Reverse counting
    printf("Countdown:\\n");
    for (int i = 10; i >= 1; i--) {
        printf("%d ", i);
    }
    printf("\\n");
    
    // Step by 2
    printf("Even numbers 2 to 20:\\n");
    for (int i = 2; i <= 20; i += 2) {
        printf("%d ", i);
    }
    printf("\\n");
}

// while loop examples
void whileLoopExamples() {
    // Basic while loop
    int i = 1;
    printf("While loop - Numbers 1 to 5:\\n");
    while (i <= 5) {
        printf("%d ", i);
        i++;
    }
    printf("\\n");
}
\`\`\`

## Chapter 5: Functions

### Function Basics

\`\`\`c
// Function declaration (prototype)
int add(int a, int b);
void greet(char name[]);
float calculateArea(float radius);
int factorial(int n);

// Function definitions
int add(int a, int b) {
    return a + b;
}

void greet(char name[]) {
    printf("Hello, %s!\\n", name);
}

float calculateArea(float radius) {
    const float PI = 3.14159f;
    return PI * radius * radius;
}

int factorial(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);  // Recursive call
}

int main() {
    // Function calls
    int result = add(10, 20);
    printf("10 + 20 = %d\\n", result);
    
    greet("Alice");
    
    float area = calculateArea(5.0f);
    printf("Area of circle with radius 5: %.2f\\n", area);
    
    int fact = factorial(5);
    printf("5! = %d\\n", fact);
    
    return 0;
}
\`\`\`

## Chapter 6: Arrays and Pointers

### Arrays

\`\`\`c
void arrayBasics() {
    // Array declaration and initialization
    int numbers[5];                    // Uninitialized
    int scores[5] = {90, 85, 92, 78, 88}; // Initialized
    int values[] = {1, 2, 3, 4, 5};   // Size inferred
    
    // Accessing array elements
    printf("First score: %d\\n", scores[0]);
    printf("Last score: %d\\n", scores[4]);
    
    // Array traversal
    printf("All scores: ");
    for (int i = 0; i < 5; i++) {
        printf("%d ", scores[i]);
    }
    printf("\\n");
    
    // Finding array size
    int size = sizeof(scores) / sizeof(scores[0]);
    printf("Array size: %d\\n", size);
}
\`\`\`

### Pointers

\`\`\`c
void pointerBasics() {
    int x = 42;
    int *ptr;        // Pointer declaration
    
    ptr = &x;        // Assign address of x to ptr
    
    printf("Value of x: %d\\n", x);
    printf("Address of x: %p\\n", (void*)&x);
    printf("Value of ptr: %p\\n", (void*)ptr);
    printf("Value pointed by ptr: %d\\n", *ptr);
    
    // Modifying value through pointer
    *ptr = 100;
    printf("New value of x: %d\\n", x);
    
    // Pointer arithmetic
    int arr[] = {10, 20, 30, 40, 50};
    int *p = arr;    // Points to first element
    
    printf("\\nArray elements using pointer arithmetic:\\n");
    for (int i = 0; i < 5; i++) {
        printf("arr[%d] = %d, *(p+%d) = %d\\n", i, arr[i], i, *(p + i));
    }
}
\`\`\`

## Chapter 7: Strings

### String Basics

\`\`\`c
#include <string.h>

void stringBasics() {
    // String declaration and initialization
    char str1[20];                    // Uninitialized
    char str2[] = "Hello";            // Size inferred
    char str3[10] = "World";          // Explicit size
    
    // String operations
    printf("Length of '%s': %zu\\n", str2, strlen(str2));
    
    // String copy
    strcpy(str1, str2);
    printf("Copied string: %s\\n", str1);
    
    // String concatenation
    strcat(str1, " ");
    strcat(str1, str3);
    printf("Concatenated string: %s\\n", str1);
    
    // String comparison
    int result = strcmp(str2, str3);
    if (result == 0) {
        printf("Strings are equal\\n");
    } else if (result < 0) {
        printf("'%s' comes before '%s'\\n", str2, str3);
    } else {
        printf("'%s' comes after '%s'\\n", str2, str3);
    }
}
\`\`\`

## Chapter 8: Structures

### Structure Basics

\`\`\`c
// Structure definition
struct Student {
    int id;
    char name[50];
    float gpa;
    char grade;
};

void structureBasics() {
    // Structure variable declaration
    struct Student student1;
    struct Student student2 = {101, "Alice", 3.8f, 'A'};
    
    // Accessing structure members
    student1.id = 102;
    strcpy(student1.name, "Bob");
    student1.gpa = 3.5f;
    student1.grade = 'B';
    
    // Display structure data
    printf("Student 1:\\n");
    printf("ID: %d\\n", student1.id);
    printf("Name: %s\\n", student1.name);
    printf("GPA: %.2f\\n", student1.gpa);
    printf("Grade: %c\\n", student1.grade);
}
\`\`\`

## Applications of C

1. **System Programming**: Operating systems, device drivers
2. **Embedded Systems**: Microcontrollers, IoT devices
3. **Compilers**: Language translators and interpreters
4. **Databases**: High-performance database engines
5. **Game Development**: Game engines and graphics
6. **Network Programming**: Servers and network protocols

## Best Practices

1. **Always initialize variables** before using them
2. **Check array bounds** to prevent buffer overflows
3. **Use meaningful variable names** for better readability
4. **Free allocated memory** to prevent memory leaks
5. **Handle error conditions** properly
6. **Use const for read-only data**
7. **Avoid global variables** when possible

## Next Steps

After mastering C:
- **C++**: Object-oriented programming
- **Data Structures**: Advanced algorithms and data structures
- **System Programming**: Linux/Unix system calls
- **Embedded Programming**: Microcontroller programming
- **Computer Graphics**: OpenGL programming

**Remember**: C is the foundation of modern programming. Master C, and you'll understand how computers really work at the lowest level!

**Practice**: Write lots of programs, work on projects, and always focus on understanding memory management and pointers.`,
    
    examples: [
      {
        input: "#include <stdio.h>\nint main() { printf(\"Hello World\"); return 0; }",
        output: "Hello World",
        explanation: "Basic C program structure with stdio.h library for input/output"
      },
      {
        input: "int arr[5] = {1,2,3,4,5}; printf(\"%d\", arr[2]);",
        output: "3",
        explanation: "Array declaration and accessing element at index 2"
      },
      {
        input: "int x = 10; int *ptr = &x; printf(\"%d\", *ptr);",
        output: "10",
        explanation: "Pointer declaration, assignment, and dereferencing"
      },
      {
        input: "struct Point {int x, y;}; struct Point p = {10, 20};",
        output: "Structure with x=10, y=20",
        explanation: "Structure definition and initialization"
      }
    ],
    
    timeComplexity: "Varies by operation: O(1) for basic operations, O(n) for algorithms",
    spaceComplexity: "Depends on data structures and memory allocation"
  },

  JavaScript: {
    title: "JavaScript - Complete Modern Guide",
    content: `# JavaScript - Master Web Development

JavaScript is the programming language of the web, enabling interactive and dynamic web applications. From frontend development to backend with Node.js, JavaScript is essential for modern web development.

## Chapter 1: JavaScript Fundamentals

### What is JavaScript?

JavaScript is a **high-level, interpreted programming language** that provides:
- **Dynamic typing**: Variables can hold different types
- **First-class functions**: Functions are treated as values
- **Prototype-based OOP**: Object-oriented programming without classes (ES5)
- **Event-driven programming**: Responds to user interactions
- **Asynchronous programming**: Non-blocking code execution

**Why Learn JavaScript?**
1. **Web Development**: Essential for frontend and backend
2. **Versatility**: Runs in browsers, servers, mobile apps
3. **Large Ecosystem**: Huge community and libraries
4. **Job Market**: High demand in tech industry
5. **Easy to Learn**: Beginner-friendly syntax

### Basic Syntax and Variables

\`\`\`javascript
// Variables - let, const, var
let name = "John";           // Block-scoped, can be reassigned
const age = 25;             // Block-scoped, cannot be reassigned
var city = "New York";      // Function-scoped (avoid in modern JS)

// Data Types
let number = 42;            // Number
let text = "Hello World";   // String
let isActive = true;        // Boolean
let items = [1, 2, 3];     // Array
let person = {name: "Alice", age: 30}; // Object
let nothing = null;         // Null
let undefined_var;          // Undefined

// Template Literals (ES6)
let greeting = \`Hello, \${name}! You are \${age} years old.\`;
console.log(greeting);

// Type checking
console.log(typeof number);  // "number"
console.log(typeof text);    // "string"
console.log(typeof isActive); // "boolean"
console.log(typeof items);   // "object"
console.log(typeof person);  // "object"
\`\`\`

### Functions

\`\`\`javascript
// Function Declaration
function add(a, b) {
    return a + b;
}

// Function Expression
const multiply = function(a, b) {
    return a * b;
};

// Arrow Functions (ES6)
const subtract = (a, b) => a - b;
const square = x => x * x;
const greet = () => "Hello!";

// Higher-Order Functions
const numbers = [1, 2, 3, 4, 5];

// Map - transform each element
const doubled = numbers.map(x => x * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Filter - select elements based on condition
const evens = numbers.filter(x => x % 2 === 0);
console.log(evens); // [2, 4]

// Reduce - accumulate values
const sum = numbers.reduce((acc, curr) => acc + curr, 0);
console.log(sum); // 15

// forEach - iterate over elements
numbers.forEach(num => console.log(num));
\`\`\`

## Objects - Master JavaScript Objects

### Object Creation Methods

\`\`\`javascript
// Method 1: Object Literal (Most Common)
const person = {
    name: "John Doe",
    age: 30,
    city: "New York",
    hobbies: ["reading", "coding", "gaming"],
    isEmployed: true,
    
    // Methods
    introduce: function() {
        return \`Hi, I'm \${this.name} from \${this.city}\`;
    },
    
    // ES6 Method Shorthand
    getAge() {
        return this.age;
    },
    
    // Arrow function (be careful with 'this')
    getHobbies: () => {
        return this.hobbies; // 'this' won't work as expected
    }
};

// Method 2: Constructor Function
function Person(name, age, city) {
    this.name = name;
    this.age = age;
    this.city = city;
    this.introduce = function() {
        return \`Hi, I'm \${this.name}\`;
    };
}
const person2 = new Person("Jane", 25, "Boston");

// Method 3: Object.create()
const personPrototype = {
    introduce() {
        return \`Hi, I'm \${this.name}\`;
    }
};
const person3 = Object.create(personPrototype);
person3.name = "Alice";
person3.age = 28;

// Method 4: Class (ES6)
class PersonClass {
    constructor(name, age, city) {
        this.name = name;
        this.age = age;
        this.city = city;
    }
    
    introduce() {
        return \`Hi, I'm \${this.name}\`;
    }
}
const person4 = new PersonClass("Bob", 35, "Chicago");
\`\`\`

### Property Access and Manipulation

\`\`\`javascript
const user = {
    firstName: "John",
    lastName: "Doe",
    age: 30,
    "full-name": "John Doe", // Property with special characters
    123: "numeric key",
    address: {
        street: "123 Main St",
        city: "New York",
        zipCode: "10001"
    }
};

// Property Access Methods
console.log(user.firstName);        // Dot notation
console.log(user["lastName"]);      // Bracket notation
console.log(user["full-name"]);     // Required for special characters
console.log(user[123]);             // Numeric keys
console.log(user.address.city);     // Nested object access

// Dynamic Property Access
const propertyName = "age";
console.log(user[propertyName]);    // 30

// Adding Properties
user.email = "john@example.com";
user["phone"] = "123-456-7890";
user.isActive = true;

// Modifying Properties
user.age = 31;
user["firstName"] = "Johnny";

// Deleting Properties
delete user.phone;
delete user["full-name"];

// Check if property exists
console.log("email" in user);           // true
console.log(user.hasOwnProperty("age")); // true
console.log(user.phone !== undefined);   // false (deleted)
\`\`\`

### Object Methods and Utilities

\`\`\`javascript
const student = {
    name: "Alice",
    age: 22,
    grade: "A",
    subjects: ["Math", "Physics", "Chemistry"]
};

// Object.keys() - Get all property names
const keys = Object.keys(student);
console.log(keys); // ["name", "age", "grade", "subjects"]

// Object.values() - Get all property values
const values = Object.values(student);
console.log(values); // ["Alice", 22, "A", ["Math", "Physics", "Chemistry"]]

// Object.entries() - Get key-value pairs
const entries = Object.entries(student);
console.log(entries); // [["name", "Alice"], ["age", 22], ...]

// Object.assign() - Copy properties
const studentCopy = Object.assign({}, student);
const studentWithNewProps = Object.assign({}, student, {
    university: "MIT",
    year: 2024
});

// Object.freeze() - Make object immutable
const frozenStudent = Object.freeze(student);
// frozenStudent.age = 23; // Won't work, object is frozen

// Object.seal() - Prevent adding/deleting properties
const sealedStudent = Object.seal(student);
sealedStudent.age = 23; // This works (modifying existing)
// sealedStudent.newProp = "value"; // Won't work (adding new)

// Object.getOwnPropertyNames() - Get all properties including non-enumerable
const allProps = Object.getOwnPropertyNames(student);

// Object.defineProperty() - Define property with specific attributes
Object.defineProperty(student, "id", {
    value: 12345,
    writable: false,    // Cannot be changed
    enumerable: false,  // Won't show in for...in loop
    configurable: false // Cannot be deleted or reconfigured
});
\`\`\`

### Object Iteration Methods

\`\`\`javascript
const product = {
    name: "Laptop",
    price: 999,
    brand: "TechCorp",
    inStock: true,
    specs: {
        ram: "16GB",
        storage: "512GB SSD"
    }
};

// for...in loop - Iterate over enumerable properties
for (let key in product) {
    console.log(\`\${key}: \${product[key]}\`);
}

// Object.keys() with forEach
Object.keys(product).forEach(key => {
    console.log(\`\${key}: \${product[key]}\`);
});

// Object.entries() with for...of
for (let [key, value] of Object.entries(product)) {
    console.log(\`\${key}: \${value}\`);
}

// Object.entries() with forEach
Object.entries(product).forEach(([key, value]) => {
    console.log(\`\${key}: \${value}\`);
});

// Filter object properties
const numericProps = Object.entries(product)
    .filter(([key, value]) => typeof value === 'number')
    .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
    }, {});
console.log(numericProps); // { price: 999 }
\`\`\`

### Destructuring Assignment - Advanced

\`\`\`javascript
const employee = {
    name: "Sarah",
    age: 28,
    position: "Developer",
    salary: 75000,
    address: {
        street: "456 Oak Ave",
        city: "Seattle",
        state: "WA"
    },
    skills: ["JavaScript", "React", "Node.js"]
};

// Basic destructuring
const {name, age, position} = employee;

// Destructuring with renaming
const {name: employeeName, age: employeeAge} = employee;

// Destructuring with default values
const {name, department = "Engineering"} = employee;

// Nested destructuring
const {address: {city, state}} = employee;
const {address: {city: employeeCity, state: employeeState}} = employee;

// Array destructuring from object property
const {skills: [primarySkill, secondarySkill]} = employee;

// Rest operator in destructuring
const {name, age, ...otherDetails} = employee;

// Function parameter destructuring
function displayEmployee({name, position, salary}) {
    return \`\${name} works as \${position} with salary $\${salary}\`;
}
console.log(displayEmployee(employee));

// Destructuring in function with default values
function createUser({name, age = 18, role = "user"} = {}) {
    return {name, age, role};
}
const newUser = createUser({name: "Tom"});
\`\`\`

### Object Comparison and Cloning

\`\`\`javascript
const obj1 = {a: 1, b: 2};
const obj2 = {a: 1, b: 2};
const obj3 = obj1;

// Reference comparison
console.log(obj1 === obj2); // false (different objects)
console.log(obj1 === obj3); // true (same reference)

// Shallow comparison function
function shallowEqual(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) return false;
    
    for (let key of keys1) {
        if (obj1[key] !== obj2[key]) return false;
    }
    
    return true;
}

// Shallow cloning
const shallowClone1 = {...obj1};           // Spread operator
const shallowClone2 = Object.assign({}, obj1); // Object.assign

// Deep cloning (simple objects only)
const deepClone1 = JSON.parse(JSON.stringify(obj1));

// Deep cloning function (handles more cases)
function deepClone(obj) {
    if (obj === null || typeof obj !== "object") return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === "object") {
        const clonedObj = {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
}
\`\`\`

### Arrays

\`\`\`javascript
// Array Creation
const fruits = ["apple", "banana", "orange"];
const numbers = new Array(1, 2, 3, 4, 5);
const mixed = [1, "hello", true, {name: "John"}];

// Array Methods
fruits.push("grape");           // Add to end
fruits.unshift("mango");        // Add to beginning
const lastFruit = fruits.pop(); // Remove from end
const firstFruit = fruits.shift(); // Remove from beginning

// Array Iteration
for (let i = 0; i < fruits.length; i++) {
    console.log(fruits[i]);
}

for (let fruit of fruits) {
    console.log(fruit);
}

fruits.forEach((fruit, index) => {
    console.log(\`\${index}: \${fruit}\`);
});

// Array Search
const index = fruits.indexOf("banana");
const exists = fruits.includes("apple");
const found = fruits.find(fruit => fruit.startsWith("a"));

// Array Transformation
const upperFruits = fruits.map(fruit => fruit.toUpperCase());
const longFruits = fruits.filter(fruit => fruit.length > 5);
const totalLength = fruits.reduce((sum, fruit) => sum + fruit.length, 0);

// Array Sorting
const sortedFruits = fruits.sort();
const sortedNumbers = numbers.sort((a, b) => a - b);
\`\`\`

## Chapter 3: Control Structures

### Conditional Statements

\`\`\`javascript
// if-else statements
let score = 85;

if (score >= 90) {
    console.log("Grade A");
} else if (score >= 80) {
    console.log("Grade B");
} else if (score >= 70) {
    console.log("Grade C");
} else {
    console.log("Grade F");
}

// Ternary Operator
const result = score >= 60 ? "Pass" : "Fail";
const grade = score >= 90 ? "A" : score >= 80 ? "B" : "C";

// Switch Statement
const day = "Monday";

switch (day) {
    case "Monday":
        console.log("Start of work week");
        break;
    case "Friday":
        console.log("TGIF!");
        break;
    case "Saturday":
    case "Sunday":
        console.log("Weekend!");
        break;
    default:
        console.log("Regular day");
}
\`\`\`

### Loops

\`\`\`javascript
// for loop
for (let i = 0; i < 5; i++) {
    console.log(\`Iteration \${i}\`);
}

// for...in loop (for object properties)
const person = {name: "John", age: 30, city: "NYC"};
for (let key in person) {
    console.log(\`\${key}: \${person[key]}\`);
}

// for...of loop (for iterable values)
const colors = ["red", "green", "blue"];
for (let color of colors) {
    console.log(color);
}

// while loop
let count = 0;
while (count < 3) {
    console.log(\`Count: \${count}\`);
    count++;
}

// do-while loop
let num = 0;
do {
    console.log(\`Number: \${num}\`);
    num++;
} while (num < 3);
\`\`\`

## Chapter 4: ES6+ Modern Features

### Destructuring and Spread Operator

\`\`\`javascript
// Array Destructuring
const numbers = [1, 2, 3, 4, 5];
const [first, second, ...rest] = numbers;
console.log(first, second, rest); // 1 2 [3, 4, 5]

// Object Destructuring
const person = {name: "Alice", age: 25, city: "Boston"};
const {name, age, city = "Unknown"} = person;

// Spread Operator
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

const obj1 = {a: 1, b: 2};
const obj2 = {c: 3, d: 4};
const merged = {...obj1, ...obj2}; // {a: 1, b: 2, c: 3, d: 4}

// Rest Parameters
function sum(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}
console.log(sum(1, 2, 3, 4)); // 10
\`\`\`

### Classes (ES6)

\`\`\`javascript
// Class Definition
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    // Instance Method
    introduce() {
        return \`Hi, I'm \${this.name} and I'm \${this.age} years old\`;
    }
    
    // Static Method
    static createAdult(name) {
        return new Person(name, 18);
    }
    
    // Getter
    get info() {
        return \`\${this.name} (\${this.age})\`;
    }
    
    // Setter
    set age(newAge) {
        if (newAge >= 0) {
            this._age = newAge;
        }
    }
}

// Inheritance
class Student extends Person {
    constructor(name, age, grade) {
        super(name, age);
        this.grade = grade;
    }
    
    introduce() {
        return \`\${super.introduce()}. I'm in grade \${this.grade}\`;
    }
}

// Usage
const person = new Person("John", 25);
const student = new Student("Alice", 16, "10th");
console.log(person.introduce());
console.log(student.introduce());
\`\`\`

## Chapter 5: Asynchronous JavaScript

### Promises

\`\`\`javascript
// Creating a Promise
const fetchData = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const success = Math.random() > 0.5;
            if (success) {
                resolve("Data fetched successfully!");
            } else {
                reject("Failed to fetch data");
            }
        }, 1000);
    });
};

// Using Promises
fetchData()
    .then(data => {
        console.log(data);
        return "Processing data...";
    })
    .then(message => {
        console.log(message);
    })
    .catch(error => {
        console.error(error);
    })
    .finally(() => {
        console.log("Operation completed");
    });

// Promise.all - Wait for all promises
const promise1 = Promise.resolve("First");
const promise2 = Promise.resolve("Second");
const promise3 = Promise.resolve("Third");

Promise.all([promise1, promise2, promise3])
    .then(values => {
        console.log(values); // ["First", "Second", "Third"]
    });
\`\`\`

### Async/Await

\`\`\`javascript
// Async Function
async function fetchUserData(userId) {
    try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
}

// Using async/await
async function displayUser() {
    try {
        const user = await fetchUserData(123);
        console.log(\`User: \${user.name}\`);
    } catch (error) {
        console.log("Failed to display user");
    }
}

// Parallel execution with async/await
async function fetchMultipleUsers() {
    try {
        const [user1, user2, user3] = await Promise.all([
            fetchUserData(1),
            fetchUserData(2),
            fetchUserData(3)
        ]);
        
        console.log("All users:", user1, user2, user3);
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}
\`\`\`

## Chapter 6: DOM Manipulation

### Selecting Elements

\`\`\`javascript
// Selecting Elements
const elementById = document.getElementById("myId");
const elementsByClass = document.getElementsByClassName("myClass");
const elementsByTag = document.getElementsByTagName("div");

// Modern selectors (preferred)
const element = document.querySelector(".my-class");
const elements = document.querySelectorAll(".my-class");

// Modifying Content
element.textContent = "New text content";
element.innerHTML = "<strong>Bold text</strong>";

// Modifying Attributes
element.setAttribute("data-id", "123");
const dataId = element.getAttribute("data-id");
element.classList.add("new-class");
element.classList.remove("old-class");
element.classList.toggle("active");

// Modifying Styles
element.style.color = "red";
element.style.backgroundColor = "yellow";
element.style.display = "none";
\`\`\`

### Event Handling

\`\`\`javascript
// Adding Event Listeners
const button = document.querySelector("#myButton");

// Click event
button.addEventListener("click", function(event) {
    console.log("Button clicked!");
    event.preventDefault(); // Prevent default behavior
});

// Arrow function event handler
button.addEventListener("click", (e) => {
    console.log("Clicked at:", e.clientX, e.clientY);
});

// Form handling
const form = document.querySelector("#myForm");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    console.log("Form data:", data);
});

// Keyboard events
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        console.log("Enter key pressed");
    }
});
\`\`\`

## Chapter 7: Error Handling

\`\`\`javascript
// Try-Catch-Finally
function divideNumbers(a, b) {
    try {
        if (b === 0) {
            throw new Error("Division by zero is not allowed");
        }
        return a / b;
    } catch (error) {
        console.error("Error:", error.message);
        return null;
    } finally {
        console.log("Division operation completed");
    }
}

// Custom Error Classes
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}

function validateAge(age) {
    if (age < 0 || age > 150) {
        throw new ValidationError("Age must be between 0 and 150");
    }
    return true;
}

// Error handling with async/await
async function safeApiCall() {
    try {
        const response = await fetch("/api/data");
        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("API call failed:", error);
        return null;
    }
}
\`\`\`

## Chapter 8: Modules (ES6)

\`\`\`javascript
// math.js - Exporting functions
export function add(a, b) {
    return a + b;
}

export function multiply(a, b) {
    return a * b;
}

export const PI = 3.14159;

// Default export
export default function subtract(a, b) {
    return a - b;
}

// main.js - Importing
import subtract, { add, multiply, PI } from './math.js';

console.log(add(5, 3));      // 8
console.log(multiply(4, 2)); // 8
console.log(subtract(10, 3)); // 7
console.log(PI);             // 3.14159

// Import all
import * as math from './math.js';
console.log(math.add(2, 3));

// Dynamic imports
async function loadModule() {
    const { add } = await import('./math.js');
    console.log(add(1, 2));
}
\`\`\`

## Applications of JavaScript

1. **Frontend Development**: React, Vue, Angular
2. **Backend Development**: Node.js, Express
3. **Mobile Development**: React Native, Ionic
4. **Desktop Applications**: Electron
5. **Game Development**: Phaser, Three.js
6. **Data Visualization**: D3.js, Chart.js

## Best Practices

1. **Use const and let** instead of var
2. **Use strict mode** ("use strict")
3. **Handle errors properly** with try-catch
4. **Use meaningful variable names**
5. **Avoid global variables**
6. **Use arrow functions** for short functions
7. **Use template literals** for string interpolation
8. **Use async/await** instead of callbacks

## Next Steps

After mastering JavaScript:
- **Frontend Frameworks**: React, Vue, Angular
- **Backend Development**: Node.js, Express
- **TypeScript**: Typed JavaScript
- **Testing**: Jest, Mocha, Cypress
- **Build Tools**: Webpack, Vite, Parcel

**Remember**: JavaScript is constantly evolving. Stay updated with new features and best practices!

**Practice**: Build projects, contribute to open source, and practice coding challenges regularly.`,
    
    examples: [
      {
        input: "let arr = [1,2,3]; arr.map(x => x * 2);",
        output: "[2, 4, 6]",
        explanation: "Array map method transforms each element using the provided function"
      },
      {
        input: "const {name, age} = {name: 'John', age: 25};",
        output: "name = 'John', age = 25",
        explanation: "Object destructuring extracts properties into variables"
      },
      {
        input: "async function getData() { return await fetch('/api'); }",
        output: "Promise-based function",
        explanation: "Async/await syntax for handling asynchronous operations"
      }
    ],
    
    timeComplexity: "Varies by operation: O(1) for property access, O(n) for array methods",
    spaceComplexity: "Depends on data structures and closures"
  },

  Python: {
    title: "Python - Complete Programming Guide",
    content: `# Python - Master Programming Simplicity

Python is a high-level, interpreted programming language known for its simplicity and readability. It's widely used in web development, data science, artificial intelligence, automation, and more.

## Chapter 1: Python Fundamentals

### What is Python?

Python is a **versatile, interpreted programming language** that provides:
- **Simple syntax**: Easy to read and write
- **Dynamic typing**: Variables don't need type declarations
- **Interpreted**: No compilation step needed
- **Object-oriented**: Supports OOP concepts
- **Extensive libraries**: Rich ecosystem of packages

**Why Learn Python?**
1. **Beginner-friendly**: Easy syntax and learning curve
2. **Versatile**: Web dev, data science, AI, automation
3. **High demand**: Popular in job market
4. **Large community**: Extensive support and resources
5. **Rapid development**: Quick prototyping and development

### Basic Syntax and Variables

\`\`\`python
# Variables and Data Types
name = "Alice"              # String
age = 25                   # Integer
height = 5.6              # Float
is_student = True         # Boolean
hobbies = ["reading", "coding"]  # List
person = {"name": "Bob", "age": 30}  # Dictionary

# Multiple assignment
x, y, z = 1, 2, 3
a = b = c = 0

# Type checking
print(type(name))         # <class 'str'>
print(type(age))          # <class 'int'>
print(isinstance(age, int))  # True

# String formatting
greeting = f"Hello, {name}! You are {age} years old."
print(greeting)

# Alternative string formatting
greeting2 = "Hello, {}! You are {} years old.".format(name, age)
greeting3 = "Hello, {name}! You are {age} years old.".format(name=name, age=age)

# Input and Output
user_name = input("Enter your name: ")
print(f"Welcome, {user_name}!")
\`\`\`

### Functions

\`\`\`python
# Basic function
def greet(name):
    return f"Hello, {name}!"

# Function with default parameters
def introduce(name, age=18, city="Unknown"):
    return f"I'm {name}, {age} years old from {city}"

# Function with variable arguments
def sum_numbers(*args):
    return sum(args)

# Function with keyword arguments
def create_profile(**kwargs):
    profile = {}
    for key, value in kwargs.items():
        profile[key] = value
    return profile

# Lambda functions (anonymous functions)
square = lambda x: x ** 2
add = lambda x, y: x + y

# Higher-order functions
numbers = [1, 2, 3, 4, 5]

# Map - apply function to each element
squared = list(map(lambda x: x**2, numbers))
print(squared)  # [1, 4, 9, 16, 25]

# Filter - select elements based on condition
evens = list(filter(lambda x: x % 2 == 0, numbers))
print(evens)  # [2, 4]

# Reduce - accumulate values
from functools import reduce
total = reduce(lambda x, y: x + y, numbers)
print(total)  # 15

# Function examples
print(greet("Alice"))
print(introduce("Bob", 25, "New York"))
print(sum_numbers(1, 2, 3, 4, 5))
profile = create_profile(name="Charlie", age=30, occupation="Developer")
print(profile)
\`\`\`

## Chapter 2: Data Structures

### Lists

\`\`\`python
# List creation and manipulation
fruits = ["apple", "banana", "orange"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", True, 3.14]

# List methods
fruits.append("grape")        # Add to end
fruits.insert(0, "mango")     # Insert at index
removed = fruits.pop()        # Remove and return last
fruits.remove("banana")       # Remove by value

# List operations
print(len(fruits))            # Length
print("apple" in fruits)      # Membership test
print(fruits.index("orange")) # Find index
print(fruits.count("apple"))  # Count occurrences

# List slicing
print(numbers[1:4])           # [2, 3, 4]
print(numbers[:3])            # [1, 2, 3]
print(numbers[2:])            # [3, 4, 5]
print(numbers[-1])            # 5 (last element)
print(numbers[::-1])          # [5, 4, 3, 2, 1] (reverse)

# List comprehensions
squares = [x**2 for x in range(1, 6)]
even_squares = [x**2 for x in range(1, 11) if x % 2 == 0]
print(squares)      # [1, 4, 9, 16, 25]
print(even_squares) # [4, 16, 36, 64, 100]

# Nested lists
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
print(matrix[1][2])  # 6

# List sorting
numbers = [3, 1, 4, 1, 5, 9, 2, 6]
numbers.sort()              # In-place sorting
print(numbers)              # [1, 1, 2, 3, 4, 5, 6, 9]

sorted_desc = sorted(numbers, reverse=True)
print(sorted_desc)          # [9, 6, 5, 4, 3, 2, 1, 1]
\`\`\`

### Dictionaries

\`\`\`python
# Dictionary creation
person = {
    "name": "Alice",
    "age": 30,
    "city": "New York",
    "hobbies": ["reading", "swimming"]
}

# Alternative creation
person2 = dict(name="Bob", age=25, city="Boston")

# Accessing and modifying
print(person["name"])         # Alice
print(person.get("age", 0))   # 30 (with default)
person["email"] = "alice@example.com"  # Add new key
person["age"] = 31            # Update existing

# Dictionary methods
keys = person.keys()
values = person.values()
items = person.items()

print(list(keys))    # ['name', 'age', 'city', 'hobbies', 'email']
print(list(values))  # ['Alice', 31, 'New York', ['reading', 'swimming'], 'alice@example.com']

# Dictionary iteration
for key in person:
    print(f"{key}: {person[key]}")

for key, value in person.items():
    print(f"{key}: {value}")

# Dictionary comprehensions
squares_dict = {x: x**2 for x in range(1, 6)}
print(squares_dict)  # {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# Nested dictionaries
students = {
    "alice": {"grade": "A", "score": 95},
    "bob": {"grade": "B", "score": 87}
}
print(students["alice"]["score"])  # 95
\`\`\`

### Sets and Tuples

\`\`\`python
# Sets - unordered collection of unique elements
fruits = {"apple", "banana", "orange"}
numbers = set([1, 2, 3, 2, 1])  # {1, 2, 3}

# Set operations
fruits.add("grape")
fruits.remove("banana")
print("apple" in fruits)  # True

# Set operations
set1 = {1, 2, 3, 4}
set2 = {3, 4, 5, 6}

print(set1.union(set2))        # {1, 2, 3, 4, 5, 6}
print(set1.intersection(set2)) # {3, 4}
print(set1.difference(set2))   # {1, 2}

# Tuples - ordered, immutable collection
coordinates = (10, 20)
colors = ("red", "green", "blue")

# Tuple unpacking
x, y = coordinates
print(f"x: {x}, y: {y}")  # x: 10, y: 20

# Named tuples
from collections import namedtuple
Point = namedtuple('Point', ['x', 'y'])
p = Point(10, 20)
print(p.x, p.y)  # 10 20
\`\`\`

## Chapter 3: Control Structures

### Conditional Statements

\`\`\`python
# if-elif-else
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

print(f"Grade: {grade}")

# Ternary operator
result = "Pass" if score >= 60 else "Fail"

# Multiple conditions
age = 25
income = 50000

if age >= 18 and income > 30000:
    print("Eligible for loan")
elif age >= 18 or income > 40000:
    print("Partially eligible")
else:
    print("Not eligible")

# Checking membership
fruits = ["apple", "banana", "orange"]
if "apple" in fruits:
    print("Apple is available")

# Checking None
value = None
if value is None:
    print("Value is None")
if value is not None:
    print("Value is not None")
\`\`\`

### Loops

\`\`\`python
# for loop with range
for i in range(5):
    print(f"Number: {i}")  # 0 to 4

for i in range(1, 6):
    print(f"Number: {i}")  # 1 to 5

for i in range(0, 10, 2):
    print(f"Even: {i}")    # 0, 2, 4, 6, 8

# for loop with sequences
fruits = ["apple", "banana", "orange"]
for fruit in fruits:
    print(f"Fruit: {fruit}")

# for loop with enumerate (index and value)
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")

# for loop with dictionaries
person = {"name": "Alice", "age": 30, "city": "NYC"}
for key in person:
    print(f"{key}: {person[key]}")

for key, value in person.items():
    print(f"{key}: {value}")

# while loop
count = 0
while count < 5:
    print(f"Count: {count}")
    count += 1

# Loop control statements
for i in range(10):
    if i == 3:
        continue  # Skip iteration
    if i == 7:
        break     # Exit loop
    print(i)

# else clause with loops
for i in range(5):
    print(i)
else:
    print("Loop completed normally")
\`\`\`

## Chapter 4: Object-Oriented Programming

### Classes and Objects

\`\`\`python
# Class definition
class Person:
    # Class variable
    species = "Homo sapiens"
    
    def __init__(self, name, age):
        # Instance variables
        self.name = name
        self.age = age
    
    # Instance method
    def introduce(self):
        return f"Hi, I'm {self.name} and I'm {self.age} years old"
    
    def have_birthday(self):
        self.age += 1
        return f"Happy birthday! Now I'm {self.age}"
    
    # String representation
    def __str__(self):
        return f"Person(name='{self.name}', age={self.age})"
    
    def __repr__(self):
        return f"Person('{self.name}', {self.age})"
    
    # Class method
    @classmethod
    def from_birth_year(cls, name, birth_year):
        age = 2024 - birth_year
        return cls(name, age)
    
    # Static method
    @staticmethod
    def is_adult(age):
        return age >= 18

# Creating objects
person1 = Person("Alice", 30)
person2 = Person.from_birth_year("Bob", 1990)

print(person1.introduce())
print(person1.have_birthday())
print(Person.is_adult(person1.age))
print(person1)
\`\`\`

### Inheritance

\`\`\`python
# Base class
class Animal:
    def __init__(self, name, species):
        self.name = name
        self.species = species
    
    def make_sound(self):
        return "Some generic animal sound"
    
    def info(self):
        return f"{self.name} is a {self.species}"

# Derived class
class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name, "Canine")
        self.breed = breed
    
    def make_sound(self):  # Method overriding
        return "Woof! Woof!"
    
    def fetch(self):
        return f"{self.name} is fetching the ball"

class Cat(Animal):
    def __init__(self, name, color):
        super().__init__(name, "Feline")
        self.color = color
    
    def make_sound(self):
        return "Meow!"
    
    def climb(self):
        return f"{self.name} is climbing a tree"

# Multiple inheritance
class FlyingAnimal:
    def fly(self):
        return "Flying high in the sky"

class Bird(Animal, FlyingAnimal):
    def __init__(self, name, wingspan):
        super().__init__(name, "Avian")
        self.wingspan = wingspan
    
    def make_sound(self):
        return "Tweet! Tweet!"

# Usage
dog = Dog("Buddy", "Golden Retriever")
cat = Cat("Whiskers", "Orange")
bird = Bird("Tweety", "15cm")

animals = [dog, cat, bird]
for animal in animals:
    print(f"{animal.info()} - {animal.make_sound()}")

print(dog.fetch())
print(cat.climb())
print(bird.fly())
\`\`\`

### Special Methods (Magic Methods)

\`\`\`python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __str__(self):
        return f"Vector({self.x}, {self.y})"
    
    def __repr__(self):
        return f"Vector({self.x}, {self.y})"
    
    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)
    
    def __sub__(self, other):
        return Vector(self.x - other.x, self.y - other.y)
    
    def __mul__(self, scalar):
        return Vector(self.x * scalar, self.y * scalar)
    
    def __eq__(self, other):
        return self.x == other.x and self.y == other.y
    
    def __len__(self):
        return int((self.x**2 + self.y**2)**0.5)
    
    def __getitem__(self, index):
        if index == 0:
            return self.x
        elif index == 1:
            return self.y
        else:
            raise IndexError("Vector index out of range")

# Usage
v1 = Vector(3, 4)
v2 = Vector(1, 2)

print(v1 + v2)    # Vector(4, 6)
print(v1 - v2)    # Vector(2, 2)
print(v1 * 2)     # Vector(6, 8)
print(v1 == v2)   # False
print(len(v1))    # 5
print(v1[0])      # 3
\`\`\`

## Chapter 5: File Handling and Exceptions

### File Operations

\`\`\`python
# Writing to files
with open("example.txt", "w") as file:
    file.write("Hello, World!\n")
    file.write("This is a test file.\n")
    
    # Writing multiple lines
    lines = ["Line 1\n", "Line 2\n", "Line 3\n"]
    file.writelines(lines)

# Reading from files
with open("example.txt", "r") as file:
    content = file.read()  # Read entire file
    print(content)

# Reading line by line
with open("example.txt", "r") as file:
    for line_number, line in enumerate(file, 1):
        print(f"Line {line_number}: {line.strip()}")

# Reading all lines into a list
with open("example.txt", "r") as file:
    lines = file.readlines()
    print(lines)

# Appending to files
with open("example.txt", "a") as file:
    file.write("Appended line\n")

# Working with CSV files
import csv

# Writing CSV
data = [
    ["Name", "Age", "City"],
    ["Alice", 30, "New York"],
    ["Bob", 25, "Boston"]
]

with open("people.csv", "w", newline="") as file:
    writer = csv.writer(file)
    writer.writerows(data)

# Reading CSV
with open("people.csv", "r") as file:
    reader = csv.reader(file)
    for row in reader:
        print(row)

# Working with JSON
import json

# Writing JSON
data = {
    "name": "Alice",
    "age": 30,
    "hobbies": ["reading", "coding"]
}

with open("data.json", "w") as file:
    json.dump(data, file, indent=2)

# Reading JSON
with open("data.json", "r") as file:
    loaded_data = json.load(file)
    print(loaded_data)
\`\`\`

### Exception Handling

\`\`\`python
# Basic try-except
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero!")

# Multiple exceptions
try:
    number = int(input("Enter a number: "))
    result = 10 / number
    print(f"Result: {result}")
except ValueError:
    print("Invalid input! Please enter a number.")
except ZeroDivisionError:
    print("Cannot divide by zero!")
except Exception as e:
    print(f"An unexpected error occurred: {e}")

# try-except-else-finally
try:
    file = open("data.txt", "r")
except FileNotFoundError:
    print("File not found!")
else:
    print("File opened successfully")
    content = file.read()
    print(content)
finally:
    if 'file' in locals() and not file.closed:
        file.close()
        print("File closed")

# Custom exceptions
class CustomError(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)

def validate_age(age):
    if age < 0:
        raise CustomError("Age cannot be negative")
    if age > 150:
        raise CustomError("Age seems unrealistic")
    return True

try:
    validate_age(-5)
except CustomError as e:
    print(f"Validation error: {e.message}")

# Raising exceptions
def divide(a, b):
    if b == 0:
        raise ValueError("Division by zero is not allowed")
    return a / b

try:
    result = divide(10, 0)
except ValueError as e:
    print(f"Error: {e}")
\`\`\`

## Chapter 6: Modules and Packages

### Creating and Using Modules

\`\`\`python
# math_operations.py - Custom module
def add(a, b):
    """Add two numbers"""
    return a + b

def multiply(a, b):
    """Multiply two numbers"""
    return a * b

def factorial(n):
    """Calculate factorial of n"""
    if n <= 1:
        return 1
    return n * factorial(n - 1)

PI = 3.14159

if __name__ == "__main__":
    # This code runs only when module is executed directly
    print("Testing math operations...")
    print(f"5 + 3 = {add(5, 3)}")
    print(f"4 * 6 = {multiply(4, 6)}")

# main.py - Using the module
import math_operations
from math_operations import add, PI
from math_operations import multiply as mult

# Different ways to use imported functions
result1 = math_operations.add(5, 3)
result2 = add(10, 20)
result3 = mult(4, 5)

print(f"Results: {result1}, {result2}, {result3}")
print(f"PI value: {PI}")

# Import all (use with caution)
# from math_operations import *
\`\`\`

### Standard Library Modules

\`\`\`python
# datetime module
from datetime import datetime, date, timedelta

now = datetime.now()
today = date.today()
tomorrow = today + timedelta(days=1)

print(f"Current time: {now}")
print(f"Today: {today}")
print(f"Tomorrow: {tomorrow}")

# os module
import os

print(f"Current directory: {os.getcwd()}")
print(f"Files in directory: {os.listdir('.')}")

# Create directory
if not os.path.exists("test_dir"):
    os.makedirs("test_dir")

# random module
import random

print(f"Random number: {random.randint(1, 100)}")
print(f"Random choice: {random.choice(['apple', 'banana', 'orange'])}")

numbers = [1, 2, 3, 4, 5]
random.shuffle(numbers)
print(f"Shuffled: {numbers}")

# collections module
from collections import Counter, defaultdict, deque

# Counter
text = "hello world"
letter_count = Counter(text)
print(letter_count)  # Counter({'l': 3, 'o': 2, 'h': 1, 'e': 1, ' ': 1, 'w': 1, 'r': 1, 'd': 1})

# defaultdict
dd = defaultdict(list)
dd['fruits'].append('apple')
dd['fruits'].append('banana')
print(dict(dd))  # {'fruits': ['apple', 'banana']}

# deque (double-ended queue)
dq = deque([1, 2, 3])
dq.appendleft(0)
dq.append(4)
print(list(dq))  # [0, 1, 2, 3, 4]
\`\`\`

## Chapter 7: Advanced Features

### Decorators

\`\`\`python
# Simple decorator
def my_decorator(func):
    def wrapper():
        print("Something before the function")
        func()
        print("Something after the function")
    return wrapper

@my_decorator
def say_hello():
    print("Hello!")

say_hello()
# Output:
# Something before the function
# Hello!
# Something after the function

# Decorator with arguments
def repeat(times):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")

# Timing decorator
import time
from functools import wraps

def timing_decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"{func.__name__} took {end_time - start_time:.4f} seconds")
        return result
    return wrapper

@timing_decorator
def slow_function():
    time.sleep(1)
    return "Done"

result = slow_function()
\`\`\`

### Generators

\`\`\`python
# Generator function
def countdown(n):
    while n > 0:
        yield n
        n -= 1

# Using generator
for num in countdown(5):
    print(num)

# Generator expression
squares = (x**2 for x in range(1, 6))
print(list(squares))  # [1, 4, 9, 16, 25]

# Fibonacci generator
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

# Get first 10 Fibonacci numbers
fib = fibonacci()
fib_numbers = [next(fib) for _ in range(10)]
print(fib_numbers)  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

# File reading generator
def read_large_file(file_path):
    with open(file_path, 'r') as file:
        for line in file:
            yield line.strip()

# Memory-efficient file processing
# for line in read_large_file('large_file.txt'):
#     process(line)
\`\`\`

### Context Managers

\`\`\`python
# Custom context manager using class
class FileManager:
    def __init__(self, filename, mode):
        self.filename = filename
        self.mode = mode
        self.file = None
    
    def __enter__(self):
        print(f"Opening file {self.filename}")
        self.file = open(self.filename, self.mode)
        return self.file
    
    def __exit__(self, exc_type, exc_value, traceback):
        print(f"Closing file {self.filename}")
        if self.file:
            self.file.close()

# Using custom context manager
with FileManager('test.txt', 'w') as f:
    f.write('Hello, World!')

# Context manager using contextlib
from contextlib import contextmanager

@contextmanager
def timer():
    start = time.time()
    print("Timer started")
    try:
        yield
    finally:
        end = time.time()
        print(f"Timer ended. Elapsed: {end - start:.4f} seconds")

# Using timer context manager
with timer():
    time.sleep(1)
    print("Doing some work...")
\`\`\`

## Applications of Python

1. **Web Development**: Django, Flask, FastAPI
2. **Data Science**: Pandas, NumPy, Matplotlib
3. **Machine Learning**: Scikit-learn, TensorFlow, PyTorch
4. **Automation**: Selenium, Beautiful Soup
5. **Desktop Applications**: Tkinter, PyQt, Kivy
6. **Game Development**: Pygame, Panda3D

## Best Practices

1. **Follow PEP 8** style guide
2. **Use meaningful variable names**
3. **Write docstrings** for functions and classes
4. **Handle exceptions** properly
5. **Use list comprehensions** when appropriate
6. **Avoid global variables**
7. **Use virtual environments**
8. **Write unit tests**

## Next Steps

After mastering Python:
- **Web Frameworks**: Django, Flask
- **Data Science**: Pandas, NumPy, Matplotlib
- **Machine Learning**: Scikit-learn, TensorFlow
- **Testing**: pytest, unittest
- **Async Programming**: asyncio, aiohttp

**Remember**: Python's philosophy is "Simple is better than complex." Write clean, readable code!

**Practice**: Build projects, contribute to open source, and solve coding challenges regularly.`,
    
    examples: [
      {
        input: "numbers = [1, 2, 3, 4, 5]\nsquares = [x**2 for x in numbers]",
        output: "[1, 4, 9, 16, 25]",
        explanation: "List comprehension creates a new list by applying an expression to each element"
      },
      {
        input: "def greet(name='World'): return f'Hello, {name}!'\ngreet('Alice')",
        output: "'Hello, Alice!'",
        explanation: "Function with default parameter and f-string formatting"
      },
      {
        input: "class Dog:\n    def __init__(self, name):\n        self.name = name\ndog = Dog('Buddy')",
        output: "Dog object with name 'Buddy'",
        explanation: "Class definition with constructor and object instantiation"
      }
    ],
    
    timeComplexity: "Varies by operation: O(1) for dict access, O(n) for list operations",
    spaceComplexity: "Depends on data structures and object creation"
  }
};

// Summary and Quick Reference
export const Summary = {
  title: "DSA Quick Reference & Cheat Sheet",
  content: `# DSA Quick Reference Guide

## Time Complexity Cheat Sheet

| Data Structure | Access | Search | Insert | Delete |
|----------------|--------|--------|--------|---------|
| Array | O(1) | O(n) | O(n) | O(n) |
| Linked List | O(n) | O(n) | O(1) | O(1) |
| Stack | O(n) | O(n) | O(1) | O(1) |
| Queue | O(n) | O(n) | O(1) | O(1) |
| Hash Table | N/A | O(1) | O(1) | O(1) |
| Binary Search Tree | O(log n) | O(log n) | O(log n) | O(log n) |
| AVL Tree | O(log n) | O(log n) | O(log n) | O(log n) |
| B-Tree | O(log n) | O(log n) | O(log n) | O(log n) |

## Algorithm Complexity Guide

| Algorithm | Best | Average | Worst | Space |
|-----------|------|---------|-------|-------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) |
| Binary Search | O(1) | O(log n) | O(log n) | O(1) |
| DFS | O(V+E) | O(V+E) | O(V+E) | O(V) |
| BFS | O(V+E) | O(V+E) | O(V+E) | O(V) |

## Problem-Solving Patterns

### Two Pointers
- **Use when**: Array/string problems, finding pairs
- **Examples**: Two Sum, Container With Most Water
- **Time**: Usually O(n), **Space**: O(1)

### Sliding Window
- **Use when**: Subarray/substring problems
- **Examples**: Maximum sum subarray, Longest substring
- **Time**: O(n), **Space**: O(1)

### Fast & Slow Pointers
- **Use when**: Cycle detection, finding middle
- **Examples**: Linked list cycle, Happy number
- **Time**: O(n), **Space**: O(1)

### Merge Intervals
- **Use when**: Overlapping intervals
- **Examples**: Meeting rooms, Insert interval
- **Time**: O(n log n), **Space**: O(1)

### Cyclic Sort
- **Use when**: Array with numbers in range [1,n]
- **Examples**: Find missing number, Find duplicate
- **Time**: O(n), **Space**: O(1)

### Tree DFS
- **Use when**: Tree traversal, path problems
- **Examples**: Path sum, Diameter of tree
- **Time**: O(n), **Space**: O(h)

### Tree BFS
- **Use when**: Level-order traversal
- **Examples**: Level order, Zigzag traversal
- **Time**: O(n), **Space**: O(w) where w is max width

### Binary Search
- **Use when**: Sorted array, search space reduction
- **Examples**: Search in rotated array, Find peak
- **Time**: O(log n), **Space**: O(1)

### Top K Elements
- **Use when**: Finding K largest/smallest
- **Examples**: K closest points, Top K frequent
- **Time**: O(n log k), **Space**: O(k)

### K-way Merge
- **Use when**: Merging sorted arrays/lists
- **Examples**: Merge K sorted lists
- **Time**: O(n log k), **Space**: O(k)

### Dynamic Programming
- **Use when**: Optimal substructure + overlapping subproblems
- **Examples**: Fibonacci, Knapsack, LCS
- **Time**: Varies, **Space**: Usually O(n) or O(n²)

## Interview Preparation Checklist

### Must-Know Data Structures
- ✅ Arrays and Strings
- ✅ Linked Lists
- ✅ Stacks and Queues
- ✅ Trees (Binary, BST, Balanced)
- ✅ Graphs (Directed, Undirected)
- ✅ Hash Tables
- ✅ Heaps
- ✅ Tries

### Must-Know Algorithms
- ✅ Sorting (Merge, Quick, Heap)
- ✅ Searching (Binary Search)
- ✅ Graph Traversal (DFS, BFS)
- ✅ Dynamic Programming
- ✅ Greedy Algorithms
- ✅ Backtracking
- ✅ Divide and Conquer

### Problem-Solving Steps
1. **Understand** the problem completely
2. **Explore** examples and edge cases
3. **Break down** the problem
4. **Solve/Simplify** step by step
5. **Look back** and refactor

### Coding Interview Tips
- Start with brute force, then optimize
- Think out loud during problem solving
- Test with examples and edge cases
- Consider time and space complexity
- Write clean, readable code
- Ask clarifying questions

## Language-Specific Quick Reference

### C++ STL
\`\`\`cpp
// Containers
vector<int> v; deque<int> dq; list<int> l;
set<int> s; map<int,int> m; unordered_set<int> us;

// Algorithms
sort(v.begin(), v.end());
binary_search(v.begin(), v.end(), target);
find(v.begin(), v.end(), target);

// Iterators
for(auto it = v.begin(); it != v.end(); ++it)
for(auto& x : v) // Range-based for loop
\`\`\`

### Python Built-ins
\`\`\`python
# Data Structures
list(), dict(), set(), tuple()
from collections import deque, defaultdict, Counter
from heapq import heappush, heappop

# Common Operations
sorted(arr), arr.sort()
max(arr), min(arr), sum(arr)
len(arr), arr.count(x), arr.index(x)
\`\`\`

### JavaScript Essentials
\`\`\`javascript
// Arrays
arr.push(), arr.pop(), arr.shift(), arr.unshift()
arr.slice(), arr.splice(), arr.concat()
arr.map(), arr.filter(), arr.reduce()

// Objects
Object.keys(), Object.values(), Object.entries()
JSON.stringify(), JSON.parse()
\`\`\``,
  
  practiceSchedule: {
    "Week 1-2": "Arrays, Strings, Basic Math",
    "Week 3-4": "Linked Lists, Stacks, Queues", 
    "Week 5-6": "Trees, Binary Search",
    "Week 7-8": "Graphs, DFS, BFS",
    "Week 9-10": "Dynamic Programming",
    "Week 11-12": "Advanced Topics, Mock Interviews"
  },
  
  resources: {
    "Online Judges": ["LeetCode", "HackerRank", "CodeChef", "Codeforces"],
    "Books": ["CLRS", "Elements of Programming Interviews", "Cracking the Coding Interview"],
    "Visualization": ["VisuAlgo", "Algorithm Visualizer", "Data Structure Visualizations"]
  }
};

// Interactive features and utilities
export const getTopicDifficulty = (topic) => {
  const difficultyMap = {
    'Arrays': 'Beginner',
    'Strings': 'Beginner', 
    'Linked Lists': 'Intermediate',
    'Stacks & Queues': 'Beginner',
    'Trees': 'Intermediate',
    'Graphs': 'Advanced',
    'DP': 'Advanced',
    'CPP': 'Intermediate'
  };
  return difficultyMap[topic] || 'Intermediate';
};

export const getEstimatedStudyTime = (topic) => {
  const timeMap = {
    'Arrays': '1-2 weeks',
    'Strings': '1-2 weeks',
    'Linked Lists': '2-3 weeks', 
    'Stacks & Queues': '1 week',
    'Trees': '3-4 weeks',
    'Graphs': '4-5 weeks',
    'DP': '5-6 weeks',
    'CPP': '2-3 weeks'
  };
  return timeMap[topic] || '2-3 weeks';
};

export const getPrerequisites = (topic) => {
  const prereqMap = {
    'Strings': ['Arrays'],
    'Linked Lists': ['Arrays'],
    'Stacks & Queues': ['Arrays', 'Linked Lists'],
    'Trees': ['Linked Lists', 'Stacks & Queues'],
    'Graphs': ['Trees', 'Stacks & Queues'],
    'DP': ['Arrays', 'Strings', 'Trees']
  };
  return prereqMap[topic] || [];
};