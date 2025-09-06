export const cppSyntaxContent = {
  title: "C++ Syntax & STL Reference",
  sections: [
    {
      title: "Basic Syntax",
      content: `
// Basic C++ Program Structure
#include <iostream>
#include <vector>
#include <string>
using namespace std;

int main() {
    cout << "Hello World!" << endl;
    return 0;
}

// Variables & Data Types
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

// Functions
int add(int a, int b) {
    return a + b;
}

// Function with default parameters
int multiply(int a, int b = 1) {
    return a * b;
}
      `
    },
    {
      title: "Control Structures",
      content: `
// If-Else
if (condition) {
    // code
} else if (another_condition) {
    // code
} else {
    // code
}

// Ternary Operator
int result = (a > b) ? a : b;

// Switch Statement
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

// Loops
// For loop
for (int i = 0; i < n; i++) {
    cout << i << " ";
}

// Range-based for loop
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
      `
    },
    {
      title: "STL Containers",
      content: `
#include <vector>
#include <list>
#include <deque>
#include <stack>
#include <queue>
#include <set>
#include <map>
#include <unordered_set>
#include <unordered_map>

// VECTOR - Dynamic Array
vector<int> v;
v.push_back(10);           // Add element
v.pop_back();              // Remove last element
v.size();                  // Get size
v.empty();                 // Check if empty
v[0];                      // Access element
v.front();                 // First element
v.back();                  // Last element
v.clear();                 // Clear all elements

// LIST - Doubly Linked List
list<int> lst;
lst.push_front(10);        // Add to front
lst.push_back(20);         // Add to back
lst.pop_front();           // Remove from front
lst.pop_back();            // Remove from back

// DEQUE - Double-ended Queue
deque<int> dq;
dq.push_front(10);
dq.push_back(20);
dq.pop_front();
dq.pop_back();

// STACK - LIFO
stack<int> st;
st.push(10);               // Add element
st.pop();                  // Remove top element
st.top();                  // Access top element
st.empty();                // Check if empty

// QUEUE - FIFO
queue<int> q;
q.push(10);                // Add element
q.pop();                   // Remove front element
q.front();                 // Access front element
q.back();                  // Access back element

// PRIORITY QUEUE - Max Heap by default
priority_queue<int> pq;
pq.push(10);               // Add element
pq.pop();                  // Remove top element
pq.top();                  // Access top element

// Min Heap
priority_queue<int, vector<int>, greater<int>> minPq;
      `
    },
    {
      title: "STL Associative Containers",
      content: `
// SET - Unique elements, sorted
set<int> s;
s.insert(10);              // Insert element
s.erase(10);               // Remove element
s.find(10);                // Find element (returns iterator)
s.count(10);               // Count occurrences (0 or 1)
s.size();                  // Get size
s.empty();                 // Check if empty

// MULTISET - Allows duplicates, sorted
multiset<int> ms;
ms.insert(10);
ms.insert(10);             // Allows duplicates
ms.count(10);              // Returns count of element

// MAP - Key-value pairs, sorted by key
map<string, int> mp;
mp["apple"] = 5;           // Insert/update
mp.insert({"banana", 3});  // Insert using pair
mp.erase("apple");         // Remove by key
mp.find("apple");          // Find by key
mp.count("apple");         // Check if key exists
mp.size();                 // Get size

// UNORDERED_SET - Hash set, O(1) average operations
unordered_set<int> us;
us.insert(10);
us.erase(10);
us.find(10);
us.count(10);

// UNORDERED_MAP - Hash map, O(1) average operations
unordered_map<string, int> ump;
ump["key"] = 100;
ump.insert({"key2", 200});
ump.erase("key");
ump.find("key");
      `
    },
    {
      title: "STL Algorithms",
      content: `
#include <algorithm>
#include <numeric>

vector<int> v = {3, 1, 4, 1, 5, 9, 2, 6};

// SORTING
sort(v.begin(), v.end());              // Ascending order
sort(v.begin(), v.end(), greater<int>()); // Descending order

// Custom comparator
sort(v.begin(), v.end(), [](int a, int b) {
    return a > b;  // Descending order
});

// SEARCHING
binary_search(v.begin(), v.end(), 5);  // Returns true/false
lower_bound(v.begin(), v.end(), 5);    // First position >= 5
upper_bound(v.begin(), v.end(), 5);    // First position > 5

// FINDING
find(v.begin(), v.end(), 5);           // Find element
count(v.begin(), v.end(), 1);          // Count occurrences

// MIN/MAX
*min_element(v.begin(), v.end());      // Minimum element
*max_element(v.begin(), v.end());      // Maximum element
minmax_element(v.begin(), v.end());    // Returns pair of min,max

// REVERSE
reverse(v.begin(), v.end());

// UNIQUE (removes consecutive duplicates)
sort(v.begin(), v.end());
v.erase(unique(v.begin(), v.end()), v.end());

// PERMUTATIONS
next_permutation(v.begin(), v.end());  // Next lexicographic permutation
prev_permutation(v.begin(), v.end());  // Previous lexicographic permutation

// ACCUMULATE (sum of elements)
int sum = accumulate(v.begin(), v.end(), 0);

// FILL
fill(v.begin(), v.end(), 0);           // Fill with value

// TRANSFORM
transform(v.begin(), v.end(), v.begin(), [](int x) {
    return x * 2;  // Double each element
});
      `
    },
    {
      title: "String Operations",
      content: `
#include <string>
#include <sstream>

string s = "Hello World";

// Basic Operations
s.length();                // Get length
s.size();                  // Same as length()
s.empty();                 // Check if empty
s.clear();                 // Clear string
s.substr(0, 5);            // Substring from index 0, length 5
s.find("World");           // Find substring (returns position)
s.replace(6, 5, "C++");    // Replace substring

// Character Operations
s[0];                      // Access character
s.front();                 // First character
s.back();                  // Last character
s.push_back('!');          // Add character at end
s.pop_back();              // Remove last character

// String Concatenation
string s1 = "Hello";
string s2 = "World";
string s3 = s1 + " " + s2;

// String Comparison
s1 == s2;                  // Equal
s1 < s2;                   // Lexicographic comparison

// String to Number
string num_str = "123";
int num = stoi(num_str);           // String to int
long long big_num = stoll(num_str); // String to long long
double d = stod("3.14");           // String to double

// Number to String
int n = 123;
string str = to_string(n);

// String Stream (for parsing)
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
      `
    },
    {
      title: "Pairs and Tuples",
      content: `
#include <utility>  // for pair
#include <tuple>    // for tuple

// PAIR
pair<int, string> p;
p.first = 10;
p.second = "Hello";

// Or initialize directly
pair<int, string> p2(20, "World");
pair<int, string> p3 = make_pair(30, "C++");

// Pair operations
p1 == p2;                  // Comparison
p1 < p2;                   // Lexicographic comparison

// Vector of pairs
vector<pair<int, string>> vec_pairs;
vec_pairs.push_back({1, "One"});
vec_pairs.push_back({2, "Two"});

// Sort by first element (default)
sort(vec_pairs.begin(), vec_pairs.end());

// Sort by second element
sort(vec_pairs.begin(), vec_pairs.end(), [](const pair<int,string>& a, const pair<int,string>& b) {
    return a.second < b.second;
});

// TUPLE (for more than 2 elements)
tuple<int, string, double> t(1, "Hello", 3.14);
get<0>(t);                 // Access first element
get<1>(t);                 // Access second element
get<2>(t);                 // Access third element

// Tie (for unpacking)
int x;
string s;
double d;
tie(x, s, d) = t;          // Unpack tuple
      `
    },
    {
      title: "Iterators",
      content: `
vector<int> v = {1, 2, 3, 4, 5};

// Iterator types
vector<int>::iterator it;
vector<int>::const_iterator cit;
vector<int>::reverse_iterator rit;

// Basic iterator operations
it = v.begin();            // Points to first element
it = v.end();              // Points to one past last element
*it;                       // Dereference iterator
it++;                      // Move to next element
it--;                      // Move to previous element
it += 2;                   // Move forward by 2
it -= 2;                   // Move backward by 2

// Iterating through container
for (auto it = v.begin(); it != v.end(); ++it) {
    cout << *it << " ";
}

// Range-based for loop (C++11)
for (auto& element : v) {
    cout << element << " ";
}

// Reverse iteration
for (auto rit = v.rbegin(); rit != v.rend(); ++rit) {
    cout << *rit << " ";
}

// Auto keyword (C++11)
auto it2 = v.begin();      // Compiler deduces type

// Distance between iterators
int dist = distance(v.begin(), v.end());

// Advance iterator
auto it3 = v.begin();
advance(it3, 3);           // Move iterator forward by 3
      `
    },
    {
      title: "Lambda Functions & Function Objects",
      content: `
#include <functional>

// Lambda Functions (C++11)
auto lambda = [](int x, int y) {
    return x + y;
};
int result = lambda(5, 3);

// Lambda with capture
int multiplier = 10;
auto multiply = [multiplier](int x) {
    return x * multiplier;
};

// Capture by reference
int counter = 0;
auto increment = [&counter]() {
    counter++;
};

// Capture all by value [=] or by reference [&]
auto lambda2 = [=](int x) { return x + multiplier; };
auto lambda3 = [&](int x) { counter++; return x; };

// Using lambdas with STL algorithms
vector<int> v = {1, 2, 3, 4, 5};

// Sort with lambda
sort(v.begin(), v.end(), [](int a, int b) {
    return a > b;  // Descending order
});

// Find with lambda
auto it = find_if(v.begin(), v.end(), [](int x) {
    return x > 3;
});

// Transform with lambda
transform(v.begin(), v.end(), v.begin(), [](int x) {
    return x * x;  // Square each element
});

// Function objects (functors)
struct Compare {
    bool operator()(int a, int b) const {
        return a > b;
    }
};

sort(v.begin(), v.end(), Compare());

// std::function (C++11)
function<int(int, int)> func = [](int a, int b) {
    return a + b;
};
      `
    },
    {
      title: "Common DSA Patterns",
      content: `
// Two Pointers Technique
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

// Sliding Window
int windowSum = 0, maxSum = 0;
int windowSize = 3;
// Calculate sum of first window
for (int i = 0; i < windowSize; i++) {
    windowSum += arr[i];
}
maxSum = windowSum;
// Slide the window
for (int i = windowSize; i < arr.size(); i++) {
    windowSum = windowSum - arr[i - windowSize] + arr[i];
    maxSum = max(maxSum, windowSum);
}

// Fast and Slow Pointers (Floyd's Cycle Detection)
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

bool hasCycle(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}

// Binary Search Template
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

// DFS Template
void dfs(vector<vector<int>>& graph, int node, vector<bool>& visited) {
    visited[node] = true;
    // Process current node
    for (int neighbor : graph[node]) {
        if (!visited[neighbor]) {
            dfs(graph, neighbor, visited);
        }
    }
}

// BFS Template
void bfs(vector<vector<int>>& graph, int start) {
    queue<int> q;
    vector<bool> visited(graph.size(), false);
    q.push(start);
    visited[start] = true;
    
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        // Process current node
        
        for (int neighbor : graph[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
}
      `
    },
    {
      title: "Input/Output & Competitive Programming",
      content: `
#include <iostream>
#include <iomanip>

// Fast I/O for competitive programming
ios_base::sync_with_stdio(false);
cin.tie(NULL);

// Basic Input/Output
int n;
cin >> n;                  // Read integer
cout << n << endl;         // Print integer with newline

// Reading multiple values
int a, b, c;
cin >> a >> b >> c;

// Reading arrays
vector<int> arr(n);
for (int i = 0; i < n; i++) {
    cin >> arr[i];
}

// Reading strings
string s;
cin >> s;                  // Reads until whitespace
getline(cin, s);           // Reads entire line

// Output formatting
cout << fixed << setprecision(2) << 3.14159 << endl;  // Output: 3.14

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

// File I/O
freopen("input.txt", "r", stdin);
freopen("output.txt", "w", stdout);

// Useful macros for competitive programming
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

// Modular arithmetic
long long mod_add(long long a, long long b, long long mod = MOD) {
    return ((a % mod) + (b % mod)) % mod;
}

long long mod_mul(long long a, long long b, long long mod = MOD) {
    return ((a % mod) * (b % mod)) % mod;
}

long long power(long long base, long long exp, long long mod = MOD) {
    long long result = 1;
    while (exp > 0) {
        if (exp % 2 == 1) {
            result = mod_mul(result, base, mod);
        }
        base = mod_mul(base, base, mod);
        exp /= 2;
    }
    return result;
}
      `
    }
  ]
};