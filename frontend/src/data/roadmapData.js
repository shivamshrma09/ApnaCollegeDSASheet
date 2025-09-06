export const roadmapData = {
  dsa: {
    title: "DSA Developer Roadmap",
    description: "Complete roadmap to master Data Structures and Algorithms",
    color: "#3B82F6",
    sections: [
      {
        id: "basics",
        title: "Programming Basics",
        status: "required",
        items: [
          { name: "Choose a Language", description: "C++, Java, Python - Pick one for consistency", status: "todo" },
          { name: "Basic Syntax", description: "Variables, loops, conditions, input/output", status: "todo" },
          { name: "Functions & Recursion", description: "Function creation, recursion patterns", status: "todo" },
          { name: "OOP Concepts", description: "Classes, objects, inheritance, polymorphism", status: "todo" },
          { name: "Memory Management", description: "Stack vs heap, pointers, references", status: "todo" }
        ]
      },
      {
        id: "complexity",
        title: "Time & Space Complexity",
        status: "required",
        items: [
          { name: "Big O Notation", description: "Understanding algorithm efficiency analysis", status: "todo" },
          { name: "Time Complexity", description: "O(1), O(log n), O(n), O(n log n), O(n²)", status: "todo" },
          { name: "Space Complexity", description: "Memory usage analysis, auxiliary space", status: "todo" },
          { name: "Best vs Average vs Worst", description: "Different case scenarios analysis", status: "todo" },
          { name: "Amortized Analysis", description: "Average performance over sequence of operations", status: "todo" }
        ]
      },
      {
        id: "arrays",
        title: "Arrays & Strings",
        status: "required",
        items: [
          { name: "Array Fundamentals", description: "Declaration, initialization, memory layout", status: "todo" },
          { name: "Array Operations", description: "Insert, delete, search, traversal", status: "todo" },
          { name: "Two Pointers Technique", description: "Efficient array traversal patterns", status: "todo" },
          { name: "Sliding Window", description: "Subarray problems, maximum/minimum windows", status: "todo" },
          { name: "String Algorithms", description: "Pattern matching, KMP, Z-algorithm", status: "todo" },
          { name: "Prefix Sum Arrays", description: "Range query optimization", status: "todo" }
        ]
      },
      {
        id: "hashing",
        title: "Hash Tables & Maps",
        status: "required",
        items: [
          { name: "Hash Function Design", description: "Good hash function properties", status: "todo" },
          { name: "Collision Resolution", description: "Separate chaining, open addressing", status: "todo" },
          { name: "Hash Map Applications", description: "Frequency counting, caching, memoization", status: "todo" },
          { name: "Load Factor & Rehashing", description: "Dynamic resizing strategies", status: "todo" }
        ]
      },
      {
        id: "sorting",
        title: "Sorting & Searching",
        status: "required",
        items: [
          { name: "Basic Sorting", description: "Bubble, selection, insertion sort", status: "todo" },
          { name: "Advanced Sorting", description: "Quick sort, merge sort, heap sort", status: "todo" },
          { name: "Binary Search", description: "Search in sorted arrays, variants", status: "todo" },
          { name: "Search in Rotated Arrays", description: "Modified binary search applications", status: "todo" },
          { name: "Counting & Radix Sort", description: "Non-comparison based sorting", status: "todo" }
        ]
      },
      {
        id: "linkedlists",
        title: "Linked Lists",
        status: "required",
        items: [
          { name: "Singly Linked List", description: "Insert, delete, search operations", status: "todo" },
          { name: "Doubly Linked List", description: "Bidirectional traversal, prev pointers", status: "todo" },
          { name: "Circular Linked List", description: "Circular references, applications", status: "todo" },
          { name: "Advanced Problems", description: "Reverse, merge, cycle detection, intersection", status: "todo" },
          { name: "Fast & Slow Pointers", description: "Floyd's algorithm, finding middle", status: "todo" }
        ]
      },
      {
        id: "stacks",
        title: "Stacks & Queues",
        status: "required",
        items: [
          { name: "Stack Implementation", description: "LIFO operations, array vs linked list", status: "todo" },
          { name: "Queue Implementation", description: "FIFO operations, circular queue", status: "todo" },
          { name: "Deque & Priority Queue", description: "Double-ended queue, heap-based PQ", status: "todo" },
          { name: "Stack Applications", description: "Expression evaluation, parentheses matching", status: "todo" },
          { name: "Queue Applications", description: "BFS traversal, level order processing", status: "todo" },
          { name: "Monotonic Stack/Queue", description: "Next greater element, sliding window maximum", status: "todo" }
        ]
      },
      {
        id: "trees",
        title: "Trees",
        status: "required",
        items: [
          { name: "Binary Tree Basics", description: "Structure, properties, representation", status: "todo" },
          { name: "Tree Traversals", description: "Inorder, preorder, postorder, level order", status: "todo" },
          { name: "Binary Search Trees", description: "Insert, delete, search operations", status: "todo" },
          { name: "Balanced Trees", description: "AVL trees, Red-Black trees, rotations", status: "todo" },
          { name: "Heap & Priority Queue", description: "Min/max heap, heap sort, applications", status: "todo" },
          { name: "Tree Problems", description: "LCA, diameter, path sum, serialization", status: "todo" }
        ]
      },
      {
        id: "graphs",
        title: "Graphs",
        status: "required",
        items: [
          { name: "Graph Representation", description: "Adjacency list, matrix, edge list", status: "todo" },
          { name: "Graph Traversal", description: "BFS, DFS, connected components", status: "todo" },
          { name: "Shortest Path Algorithms", description: "Dijkstra, Bellman-Ford, Floyd-Warshall", status: "todo" },
          { name: "Minimum Spanning Tree", description: "Kruskal, Prim algorithms, Union-Find", status: "todo" },
          { name: "Topological Sort", description: "DAG ordering, cycle detection", status: "todo" },
          { name: "Advanced Graph Problems", description: "Strongly connected components, bridges", status: "todo" }
        ]
      },
      {
        id: "greedy",
        title: "Greedy Algorithms",
        status: "required",
        items: [
          { name: "Greedy Strategy", description: "When to use greedy approach", status: "todo" },
          { name: "Activity Selection", description: "Interval scheduling problems", status: "todo" },
          { name: "Huffman Coding", description: "Optimal prefix codes", status: "todo" },
          { name: "Fractional Knapsack", description: "Greedy vs DP knapsack", status: "todo" }
        ]
      },
      {
        id: "backtracking",
        title: "Backtracking & Recursion",
        status: "required",
        items: [
          { name: "Recursion Patterns", description: "Base case, recursive case design", status: "todo" },
          { name: "Backtracking Template", description: "Choose, explore, unchoose pattern", status: "todo" },
          { name: "Permutations & Combinations", description: "Generate all possibilities", status: "todo" },
          { name: "N-Queens Problem", description: "Constraint satisfaction", status: "todo" },
          { name: "Sudoku Solver", description: "Advanced backtracking application", status: "todo" }
        ]
      },
      {
        id: "dp",
        title: "Dynamic Programming",
        status: "required",
        items: [
          { name: "DP Fundamentals", description: "Optimal substructure, overlapping subproblems", status: "todo" },
          { name: "Memoization vs Tabulation", description: "Top-down vs bottom-up approaches", status: "todo" },
          { name: "1D DP Problems", description: "Fibonacci, climbing stairs, house robber", status: "todo" },
          { name: "2D DP Problems", description: "Grid paths, LCS, edit distance", status: "todo" },
          { name: "Knapsack Variations", description: "0/1, unbounded, bounded knapsack", status: "todo" },
          { name: "Advanced DP", description: "Tree DP, digit DP, bitmask DP", status: "todo" }
        ]
      },
      {
        id: "bits",
        title: "Bit Manipulation",
        status: "required",
        items: [
          { name: "Bitwise Operations", description: "AND, OR, XOR, NOT, shifts", status: "todo" },
          { name: "Bit Masks", description: "Set, clear, toggle, check bits", status: "todo" },
          { name: "XOR Applications", description: "Find unique elements, swap without temp", status: "todo" },
          { name: "Subset Generation", description: "Using bits to represent subsets", status: "todo" }
        ]
      },
      {
        id: "advanced",
        title: "Advanced Data Structures",
        status: "optional",
        items: [
          { name: "Segment Trees", description: "Range query and update optimization", status: "todo" },
          { name: "Fenwick Tree (BIT)", description: "Binary indexed tree for prefix sums", status: "todo" },
          { name: "Trie (Prefix Tree)", description: "String operations, autocomplete", status: "todo" },
          { name: "Union Find (DSU)", description: "Disjoint set operations, cycle detection", status: "todo" },
          { name: "Heavy-Light Decomposition", description: "Tree path queries", status: "todo" },
          { name: "Persistent Data Structures", description: "Version control for data structures", status: "todo" }
        ]
      },
      {
        id: "concurrency",
        title: "Concurrency-Safe Data Structures",
        status: "optional",
        items: [
          { name: "Lock-Free Stacks", description: "Thread-safe stack operations", status: "todo" },
          { name: "Lock-Free Queues", description: "Thread-safe queue operations", status: "todo" },
          { name: "Atomic Operations", description: "Compare-and-swap, memory ordering", status: "todo" },
          { name: "Concurrent Hash Maps", description: "Thread-safe hash table implementations", status: "todo" }
        ]
      },
      {
        id: "practice",
        title: "Practice & Projects",
        status: "optional",
        items: [
          { name: "DSA Challenge Tracker", description: "Weekly problem sets with progress tracking", status: "todo" },
          { name: "Algorithm Visualizer", description: "Build interactive algorithm demonstrations", status: "todo" },
          { name: "Competitive Programming", description: "Codeforces, AtCoder, CodeChef practice", status: "todo" },
          { name: "Interview Preparation", description: "Company-specific problem patterns", status: "todo" },
          { name: "Performance Analysis", description: "Benchmarking and optimization", status: "todo" }
        ]
      }
    ]
  },
  
  frontend: {
    title: "Frontend Developer Roadmap",
    description: "Complete path to become a frontend developer",
    color: "#059669",
    sections: [
      {
        id: "basics",
        title: "Web Fundamentals",
        status: "required",
        items: [
          { name: "HTML5", description: "Semantic markup, accessibility, forms", status: "todo" },
          { name: "CSS3", description: "Styling, layouts, animations, responsive design", status: "todo" },
          { name: "JavaScript ES6+", description: "Modern JS features, DOM manipulation", status: "todo" },
          { name: "Browser DevTools", description: "Debugging, performance analysis", status: "todo" },
          { name: "Web Standards", description: "HTTP/HTTPS, REST APIs, JSON", status: "todo" }
        ]
      },
      {
        id: "css",
        title: "Advanced CSS & Design",
        status: "required",
        items: [
          { name: "CSS Grid & Flexbox", description: "Modern layout systems", status: "todo" },
          { name: "CSS Preprocessors", description: "Sass, Less, PostCSS", status: "todo" },
          { name: "CSS-in-JS", description: "Styled-components, Emotion", status: "todo" },
          { name: "Design Systems", description: "Component libraries, design tokens", status: "todo" },
          { name: "CSS Architecture", description: "BEM, OOCSS, atomic design", status: "todo" }
        ]
      },
      {
        id: "javascript",
        title: "Modern JavaScript",
        status: "required",
        items: [
          { name: "ES6+ Features", description: "Arrow functions, destructuring, modules", status: "todo" },
          { name: "Async Programming", description: "Promises, async/await, fetch API", status: "todo" },
          { name: "JavaScript Patterns", description: "Module pattern, observer, MVC", status: "todo" },
          { name: "Error Handling", description: "Try/catch, error boundaries", status: "todo" },
          { name: "Performance", description: "Debouncing, throttling, lazy loading", status: "todo" }
        ]
      },
      {
        id: "frameworks",
        title: "Frontend Frameworks",
        status: "required",
        items: [
          { name: "React Ecosystem", description: "Components, hooks, context, router", status: "todo" },
          { name: "State Management", description: "Redux, Zustand, Context API, Recoil", status: "todo" },
          { name: "Vue.js", description: "Composition API, Vuex, Vue Router", status: "todo" },
          { name: "Angular", description: "Components, services, RxJS, NgRx", status: "todo" },
          { name: "Next.js/Nuxt.js", description: "SSR, SSG, full-stack frameworks", status: "todo" }
        ]
      },
      {
        id: "tools",
        title: "Development Tools & Build",
        status: "required",
        items: [
          { name: "Version Control", description: "Git workflows, GitHub/GitLab", status: "todo" },
          { name: "Build Tools", description: "Webpack, Vite, Parcel, Rollup", status: "todo" },
          { name: "Package Managers", description: "npm, yarn, pnpm", status: "todo" },
          { name: "Linting & Formatting", description: "ESLint, Prettier, Husky", status: "todo" },
          { name: "Task Runners", description: "npm scripts, Gulp", status: "todo" }
        ]
      },
      {
        id: "testing",
        title: "Testing Strategies",
        status: "required",
        items: [
          { name: "Unit Testing", description: "Jest, Vitest, testing utilities", status: "todo" },
          { name: "Component Testing", description: "React Testing Library, Vue Test Utils", status: "todo" },
          { name: "E2E Testing", description: "Cypress, Playwright, Puppeteer", status: "todo" },
          { name: "Visual Testing", description: "Storybook, Chromatic", status: "todo" },
          { name: "Performance Testing", description: "Lighthouse, Web Vitals", status: "todo" }
        ]
      },
      {
        id: "accessibility",
        title: "Accessibility & Internationalization",
        status: "required",
        items: [
          { name: "WCAG Guidelines", description: "Web accessibility standards", status: "todo" },
          { name: "ARIA Attributes", description: "Screen reader support", status: "todo" },
          { name: "Keyboard Navigation", description: "Focus management, tab order", status: "todo" },
          { name: "Internationalization", description: "i18n libraries, RTL support", status: "todo" },
          { name: "Color & Contrast", description: "Accessible color schemes", status: "todo" }
        ]
      },
      {
        id: "performance",
        title: "Performance Optimization",
        status: "required",
        items: [
          { name: "Code Splitting", description: "Dynamic imports, lazy loading", status: "todo" },
          { name: "Bundle Analysis", description: "Webpack bundle analyzer", status: "todo" },
          { name: "Image Optimization", description: "WebP, lazy loading, responsive images", status: "todo" },
          { name: "Caching Strategies", description: "Service workers, HTTP caching", status: "todo" },
          { name: "Core Web Vitals", description: "LCP, FID, CLS optimization", status: "todo" }
        ]
      },
      {
        id: "pwa",
        title: "Progressive Web Apps",
        status: "optional",
        items: [
          { name: "Service Workers", description: "Offline functionality, caching", status: "todo" },
          { name: "Web App Manifest", description: "App-like experience", status: "todo" },
          { name: "Push Notifications", description: "Engagement features", status: "todo" },
          { name: "Workbox", description: "PWA toolkit", status: "todo" }
        ]
      },
      {
        id: "security",
        title: "Frontend Security",
        status: "optional",
        items: [
          { name: "Content Security Policy", description: "CSP headers, XSS prevention", status: "todo" },
          { name: "HTTPS & Security Headers", description: "Secure communication", status: "todo" },
          { name: "Authentication", description: "JWT, OAuth, session management", status: "todo" },
          { name: "Input Validation", description: "Client-side validation, sanitization", status: "todo" }
        ]
      }
    ]
  },

  backend: {
    title: "Backend Developer Roadmap",
    description: "Server-side development mastery path",
    color: "#DC2626",
    sections: [
      {
        id: "basics",
        title: "Programming Fundamentals",
        status: "required",
        items: [
          { name: "Choose Language", description: "Node.js, Python, Java, Go, C#", status: "todo" },
          { name: "Data Structures", description: "Arrays, objects, collections, algorithms", status: "todo" },
          { name: "OOP/FP Concepts", description: "Programming paradigms, design patterns", status: "todo" },
          { name: "Memory Management", description: "Garbage collection, memory leaks", status: "todo" },
          { name: "Concurrency", description: "Threads, async programming, locks", status: "todo" }
        ]
      },
      {
        id: "web",
        title: "Web & API Fundamentals",
        status: "required",
        items: [
          { name: "HTTP/HTTPS Protocol", description: "Methods, status codes, headers", status: "todo" },
          { name: "REST API Design", description: "RESTful principles, resource modeling", status: "todo" },
          { name: "GraphQL", description: "Schema design, resolvers, subscriptions", status: "todo" },
          { name: "API Documentation", description: "OpenAPI/Swagger, Postman", status: "todo" },
          { name: "API Versioning", description: "Versioning strategies, backward compatibility", status: "todo" }
        ]
      },
      {
        id: "databases",
        title: "Database Management",
        status: "required",
        items: [
          { name: "SQL Fundamentals", description: "CRUD, joins, indexes, transactions", status: "todo" },
          { name: "Database Design", description: "Normalization, relationships, schema design", status: "todo" },
          { name: "NoSQL Databases", description: "MongoDB, Redis, Cassandra", status: "todo" },
          { name: "ORMs & Query Builders", description: "Mongoose, Sequelize, Prisma", status: "todo" },
          { name: "Database Optimization", description: "Query optimization, indexing strategies", status: "todo" }
        ]
      },
      {
        id: "frameworks",
        title: "Backend Frameworks",
        status: "required",
        items: [
          { name: "Express.js", description: "Node.js web framework, middleware", status: "todo" },
          { name: "Django/Flask", description: "Python web frameworks", status: "todo" },
          { name: "Spring Boot", description: "Java enterprise framework", status: "todo" },
          { name: "ASP.NET Core", description: "C# web framework", status: "todo" },
          { name: "Gin/Echo", description: "Go web frameworks", status: "todo" }
        ]
      },
      {
        id: "caching",
        title: "Caching & Performance",
        status: "required",
        items: [
          { name: "In-Memory Caching", description: "Redis, Memcached patterns", status: "todo" },
          { name: "Database Caching", description: "Query result caching", status: "todo" },
          { name: "CDN Integration", description: "Content delivery networks", status: "todo" },
          { name: "Rate Limiting", description: "API protection, throttling", status: "todo" },
          { name: "Load Balancing", description: "Horizontal scaling, load distribution", status: "todo" }
        ]
      },
      {
        id: "messaging",
        title: "Message Queues & Events",
        status: "required",
        items: [
          { name: "Message Queues", description: "RabbitMQ, Apache Kafka", status: "todo" },
          { name: "Event-Driven Architecture", description: "Pub/sub patterns, event sourcing", status: "todo" },
          { name: "CQRS Pattern", description: "Command Query Responsibility Segregation", status: "todo" },
          { name: "Microservices Communication", description: "Service mesh, API gateways", status: "todo" }
        ]
      },
      {
        id: "security",
        title: "Security & Authentication",
        status: "required",
        items: [
          { name: "Authentication", description: "JWT, OAuth 2.0, session management", status: "todo" },
          { name: "Authorization", description: "RBAC, ABAC, permissions", status: "todo" },
          { name: "Input Validation", description: "Sanitization, SQL injection prevention", status: "todo" },
          { name: "CORS & Security Headers", description: "Cross-origin policies", status: "todo" },
          { name: "Encryption", description: "Hashing, SSL/TLS, data encryption", status: "todo" }
        ]
      },
      {
        id: "testing",
        title: "Testing & Monitoring",
        status: "required",
        items: [
          { name: "Unit Testing", description: "Jest, pytest, JUnit", status: "todo" },
          { name: "Integration Testing", description: "API testing, database testing", status: "todo" },
          { name: "Contract Testing", description: "Pact, API contract validation", status: "todo" },
          { name: "Load Testing", description: "Performance testing, stress testing", status: "todo" },
          { name: "APM Tools", description: "New Relic, Datadog, monitoring", status: "todo" }
        ]
      },
      {
        id: "logging",
        title: "Error Handling & Logging",
        status: "required",
        items: [
          { name: "Structured Logging", description: "JSON logs, log levels", status: "todo" },
          { name: "ELK Stack", description: "Elasticsearch, Logstash, Kibana", status: "todo" },
          { name: "Distributed Tracing", description: "OpenTelemetry, Jaeger", status: "todo" },
          { name: "Error Tracking", description: "Sentry, Bugsnag", status: "todo" }
        ]
      },
      {
        id: "deployment",
        title: "Deployment & Infrastructure",
        status: "optional",
        items: [
          { name: "Containerization", description: "Docker, container orchestration", status: "todo" },
          { name: "CI/CD Pipelines", description: "GitHub Actions, Jenkins", status: "todo" },
          { name: "Cloud Platforms", description: "AWS, Azure, GCP services", status: "todo" },
          { name: "Infrastructure as Code", description: "Terraform, CloudFormation", status: "todo" },
          { name: "Blue/Green Deployment", description: "Canary releases, rolling updates", status: "todo" }
        ]
      }
    ]
  },

  ml: {
    title: "ML Engineer Roadmap",
    description: "Machine Learning and AI development path",
    color: "#7C3AED",
    sections: [
      {
        id: "math",
        title: "Mathematics Foundation",
        status: "required",
        items: [
          { name: "Linear Algebra", description: "Vectors, matrices, eigenvalues, SVD", status: "todo" },
          { name: "Calculus", description: "Derivatives, gradients, optimization", status: "todo" },
          { name: "Statistics & Probability", description: "Distributions, hypothesis testing, Bayes", status: "todo" },
          { name: "Discrete Mathematics", description: "Logic, set theory, graph theory", status: "todo" },
          { name: "Optimization Theory", description: "Convex optimization, gradient descent", status: "todo" }
        ]
      },
      {
        id: "programming",
        title: "Programming & Tools",
        status: "required",
        items: [
          { name: "Python Mastery", description: "Advanced Python, OOP, functional programming", status: "todo" },
          { name: "NumPy & SciPy", description: "Numerical computing, scientific computing", status: "todo" },
          { name: "Pandas", description: "Data manipulation, analysis, cleaning", status: "todo" },
          { name: "Matplotlib & Seaborn", description: "Data visualization, plotting", status: "todo" },
          { name: "Jupyter Notebooks", description: "Interactive development, documentation", status: "todo" }
        ]
      },
      {
        id: "data-engineering",
        title: "Data Engineering & Pipelines",
        status: "required",
        items: [
          { name: "Data Collection", description: "APIs, web scraping, databases", status: "todo" },
          { name: "ETL Processes", description: "Extract, transform, load pipelines", status: "todo" },
          { name: "Data Versioning", description: "DVC, data lineage, reproducibility", status: "todo" },
          { name: "Big Data Tools", description: "Apache Spark, Hadoop, distributed computing", status: "todo" },
          { name: "Data Quality", description: "Validation, cleaning, anomaly detection", status: "todo" }
        ]
      },
      {
        id: "ml-basics",
        title: "Machine Learning Fundamentals",
        status: "required",
        items: [
          { name: "Supervised Learning", description: "Classification, regression algorithms", status: "todo" },
          { name: "Unsupervised Learning", description: "Clustering, dimensionality reduction", status: "todo" },
          { name: "Model Evaluation", description: "Cross-validation, metrics, bias-variance", status: "todo" },
          { name: "Feature Engineering", description: "Selection, transformation, creation", status: "todo" },
          { name: "Hyperparameter Tuning", description: "Grid search, random search, Bayesian optimization", status: "todo" }
        ]
      },
      {
        id: "frameworks",
        title: "ML Frameworks & Libraries",
        status: "required",
        items: [
          { name: "Scikit-learn", description: "Traditional ML algorithms, preprocessing", status: "todo" },
          { name: "TensorFlow", description: "Deep learning, production deployment", status: "todo" },
          { name: "PyTorch", description: "Research-focused deep learning", status: "todo" },
          { name: "Keras", description: "High-level neural network API", status: "todo" },
          { name: "XGBoost/LightGBM", description: "Gradient boosting frameworks", status: "todo" }
        ]
      },
      {
        id: "deep-learning",
        title: "Deep Learning",
        status: "required",
        items: [
          { name: "Neural Networks", description: "Perceptrons, backpropagation, architectures", status: "todo" },
          { name: "CNN", description: "Convolutional networks, computer vision", status: "todo" },
          { name: "RNN/LSTM/GRU", description: "Recurrent networks, sequence modeling", status: "todo" },
          { name: "Transformers", description: "Attention mechanisms, BERT, GPT", status: "todo" },
          { name: "GANs", description: "Generative adversarial networks", status: "todo" }
        ]
      },
      {
        id: "deployment",
        title: "Model Deployment & Serving",
        status: "required",
        items: [
          { name: "Model Serialization", description: "Pickle, ONNX, SavedModel formats", status: "todo" },
          { name: "TensorFlow Serving", description: "Production model serving", status: "todo" },
          { name: "TorchServe", description: "PyTorch model deployment", status: "todo" },
          { name: "Docker for ML", description: "Containerized ML services", status: "todo" },
          { name: "Kubernetes Deployment", description: "Scalable ML infrastructure", status: "todo" }
        ]
      },
      {
        id: "mlops",
        title: "MLOps Practices",
        status: "required",
        items: [
          { name: "Experiment Tracking", description: "MLflow, Weights & Biases", status: "todo" },
          { name: "CI/CD for ML", description: "Automated training, testing pipelines", status: "todo" },
          { name: "Model Monitoring", description: "Drift detection, performance monitoring", status: "todo" },
          { name: "A/B Testing", description: "Model comparison, statistical testing", status: "todo" },
          { name: "Feature Stores", description: "Feature management, serving", status: "todo" }
        ]
      },
      {
        id: "ethics",
        title: "AI Ethics & Explainability",
        status: "optional",
        items: [
          { name: "Model Interpretability", description: "SHAP, LIME, feature importance", status: "todo" },
          { name: "Fairness in AI", description: "Bias detection, fairness metrics", status: "todo" },
          { name: "Privacy & Security", description: "Differential privacy, adversarial attacks", status: "todo" },
          { name: "Responsible AI", description: "Ethical guidelines, governance", status: "todo" }
        ]
      },
      {
        id: "specialized",
        title: "Specialized Domains",
        status: "optional",
        items: [
          { name: "Computer Vision", description: "Image processing, object detection", status: "todo" },
          { name: "Natural Language Processing", description: "Text processing, language models", status: "todo" },
          { name: "Reinforcement Learning", description: "Q-learning, policy gradients", status: "todo" },
          { name: "Time Series Analysis", description: "Forecasting, anomaly detection", status: "todo" }
        ]
      }
    ]
  },

  devops: {
    title: "DevOps Engineer Roadmap",
    description: "Infrastructure and deployment automation",
    color: "#F59E0B",
    sections: [
      {
        id: "basics",
        title: "System Administration",
        status: "required",
        items: [
          { name: "Linux/Unix Systems", description: "Command line, shell scripting, system administration", status: "todo" },
          { name: "Networking Fundamentals", description: "TCP/IP, DNS, load balancing, firewalls", status: "todo" },
          { name: "Security Basics", description: "SSH, certificates, security hardening", status: "todo" },
          { name: "System Monitoring", description: "System metrics, log analysis, alerting", status: "todo" },
          { name: "Process Management", description: "Services, daemons, process monitoring", status: "todo" }
        ]
      },
      {
        id: "programming",
        title: "Programming & Scripting",
        status: "required",
        items: [
          { name: "Bash/Shell Scripting", description: "Automation scripts, system administration", status: "todo" },
          { name: "Python/Go", description: "Infrastructure tools, automation", status: "todo" },
          { name: "Configuration Formats", description: "YAML, JSON, TOML", status: "todo" },
          { name: "Version Control", description: "Git workflows, branching strategies", status: "todo" },
          { name: "Regular Expressions", description: "Text processing, log parsing", status: "todo" }
        ]
      },
      {
        id: "containers",
        title: "Containerization & Orchestration",
        status: "required",
        items: [
          { name: "Docker Fundamentals", description: "Containers, images, Dockerfile", status: "todo" },
          { name: "Docker Compose", description: "Multi-container applications", status: "todo" },
          { name: "Kubernetes", description: "Container orchestration, pods, services", status: "todo" },
          { name: "Helm Charts", description: "Kubernetes package management", status: "todo" },
          { name: "Container Security", description: "Image scanning, runtime security", status: "todo" }
        ]
      },
      {
        id: "iac",
        title: "Infrastructure as Code",
        status: "required",
        items: [
          { name: "Terraform", description: "Infrastructure provisioning, state management", status: "todo" },
          { name: "AWS CloudFormation", description: "AWS infrastructure templates", status: "todo" },
          { name: "Ansible", description: "Configuration management, automation", status: "todo" },
          { name: "Pulumi", description: "Modern infrastructure as code", status: "todo" },
          { name: "Terragrunt", description: "Terraform wrapper, DRY configurations", status: "todo" }
        ]
      },
      {
        id: "cloud",
        title: "Cloud Platforms",
        status: "required",
        items: [
          { name: "AWS Services", description: "EC2, S3, RDS, Lambda, VPC", status: "todo" },
          { name: "Azure Services", description: "Virtual machines, storage, databases", status: "todo" },
          { name: "Google Cloud Platform", description: "Compute Engine, Cloud Storage, BigQuery", status: "todo" },
          { name: "Multi-Cloud Strategy", description: "Cloud-agnostic deployments", status: "todo" },
          { name: "Cost Optimization", description: "Resource management, cost monitoring", status: "todo" }
        ]
      },
      {
        id: "cicd",
        title: "CI/CD Pipelines",
        status: "required",
        items: [
          { name: "Jenkins", description: "Automation server, pipeline as code", status: "todo" },
          { name: "GitHub Actions", description: "Git-based CI/CD workflows", status: "todo" },
          { name: "GitLab CI/CD", description: "Integrated DevOps platform", status: "todo" },
          { name: "Pipeline Design", description: "Best practices, security, testing", status: "todo" },
          { name: "Deployment Strategies", description: "Blue/green, canary, rolling updates", status: "todo" }
        ]
      },
      {
        id: "gitops",
        title: "GitOps & Workflow",
        status: "required",
        items: [
          { name: "GitOps Principles", description: "Git as single source of truth", status: "todo" },
          { name: "ArgoCD", description: "Kubernetes GitOps operator", status: "todo" },
          { name: "Flux", description: "GitOps toolkit for Kubernetes", status: "todo" },
          { name: "Git Workflows", description: "Branching strategies, code review", status: "todo" }
        ]
      },
      {
        id: "observability",
        title: "Monitoring & Observability",
        status: "required",
        items: [
          { name: "Prometheus", description: "Metrics collection, alerting", status: "todo" },
          { name: "Grafana", description: "Visualization, dashboards", status: "todo" },
          { name: "ELK/EFK Stack", description: "Logging pipeline, log analysis", status: "todo" },
          { name: "Distributed Tracing", description: "OpenTelemetry, Jaeger", status: "todo" },
          { name: "SLO/SLI", description: "Service level objectives, indicators", status: "todo" }
        ]
      },
      {
        id: "security",
        title: "Security & Compliance",
        status: "required",
        items: [
          { name: "DevSecOps", description: "Security in CI/CD pipelines", status: "todo" },
          { name: "Policy as Code", description: "OPA, Gatekeeper, compliance automation", status: "todo" },
          { name: "Secrets Management", description: "HashiCorp Vault, AWS Secrets Manager", status: "todo" },
          { name: "Container Security", description: "Image scanning, runtime protection", status: "todo" },
          { name: "Compliance", description: "SOC2, PCI DSS, GDPR requirements", status: "todo" }
        ]
      },
      {
        id: "advanced",
        title: "Advanced Topics",
        status: "optional",
        items: [
          { name: "Service Mesh", description: "Istio, Linkerd, traffic management", status: "todo" },
          { name: "Chaos Engineering", description: "Resilience testing, failure injection", status: "todo" },
          { name: "Site Reliability Engineering", description: "SRE practices, incident response", status: "todo" },
          { name: "Performance Engineering", description: "Load testing, capacity planning", status: "todo" }
        ]
      }
    ]
  },

  fullstack: {
    title: "Full Stack Developer Roadmap",
    description: "Complete web development mastery",
    color: "#06B6D4",
    sections: [
      {
        id: "basics",
        title: "Web Development Fundamentals",
        status: "required",
        items: [
          { name: "HTML5 & Semantic Markup", description: "Structure, accessibility, SEO", status: "todo" },
          { name: "CSS3 & Modern Layouts", description: "Flexbox, Grid, responsive design", status: "todo" },
          { name: "JavaScript ES6+", description: "Modern JS features, DOM manipulation", status: "todo" },
          { name: "Version Control", description: "Git workflows, collaboration", status: "todo" },
          { name: "Web Protocols", description: "HTTP/HTTPS, REST APIs, WebSockets", status: "todo" }
        ]
      },
      {
        id: "frontend",
        title: "Frontend Development",
        status: "required",
        items: [
          { name: "React Ecosystem", description: "Components, hooks, router, context", status: "todo" },
          { name: "State Management", description: "Redux, Zustand, Context API", status: "todo" },
          { name: "CSS Frameworks", description: "Tailwind CSS, styled-components", status: "todo" },
          { name: "Build Tools", description: "Webpack, Vite, bundling optimization", status: "todo" },
          { name: "TypeScript", description: "Type safety, better development experience", status: "todo" }
        ]
      },
      {
        id: "backend",
        title: "Backend Development",
        status: "required",
        items: [
          { name: "Node.js & Express", description: "Server-side JavaScript, middleware", status: "todo" },
          { name: "API Design", description: "REST, GraphQL, API documentation", status: "todo" },
          { name: "Authentication", description: "JWT, OAuth, session management", status: "todo" },
          { name: "Server Architecture", description: "MVC, microservices, clean architecture", status: "todo" },
          { name: "Error Handling", description: "Logging, monitoring, debugging", status: "todo" }
        ]
      },
      {
        id: "databases",
        title: "Database Management",
        status: "required",
        items: [
          { name: "SQL Databases", description: "PostgreSQL, MySQL, relationships", status: "todo" },
          { name: "NoSQL Databases", description: "MongoDB, Redis, document stores", status: "todo" },
          { name: "Database Design", description: "Schema design, normalization, indexing", status: "todo" },
          { name: "ORMs & Query Builders", description: "Prisma, Mongoose, Sequelize", status: "todo" },
          { name: "Database Optimization", description: "Query optimization, caching", status: "todo" }
        ]
      },
      {
        id: "testing",
        title: "Testing & Quality Assurance",
        status: "required",
        items: [
          { name: "Unit Testing", description: "Jest, Vitest, testing best practices", status: "todo" },
          { name: "Integration Testing", description: "API testing, database testing", status: "todo" },
          { name: "E2E Testing", description: "Cypress, Playwright, user workflows", status: "todo" },
          { name: "Test-Driven Development", description: "TDD practices, red-green-refactor", status: "todo" },
          { name: "Code Quality", description: "ESLint, Prettier, code reviews", status: "todo" }
        ]
      },
      {
        id: "deployment",
        title: "Deployment & DevOps",
        status: "required",
        items: [
          { name: "Cloud Platforms", description: "AWS, Vercel, Netlify, Railway", status: "todo" },
          { name: "Containerization", description: "Docker, container orchestration", status: "todo" },
          { name: "CI/CD Pipelines", description: "GitHub Actions, automated deployment", status: "todo" },
          { name: "Environment Management", description: "Environment variables, configuration", status: "todo" },
          { name: "Monitoring & Analytics", description: "Error tracking, performance monitoring", status: "todo" }
        ]
      },
      {
        id: "performance",
        title: "Performance & Scalability",
        status: "required",
        items: [
          { name: "Frontend Performance", description: "Code splitting, lazy loading, caching", status: "todo" },
          { name: "Backend Performance", description: "Database optimization, caching strategies", status: "todo" },
          { name: "SEO Optimization", description: "Meta tags, structured data, Core Web Vitals", status: "todo" },
          { name: "Load Testing", description: "Performance testing, bottleneck identification", status: "todo" },
          { name: "Scalability Patterns", description: "Horizontal scaling, load balancing", status: "todo" }
        ]
      },
      {
        id: "security",
        title: "Security & Best Practices",
        status: "required",
        items: [
          { name: "Web Security", description: "OWASP Top 10, XSS, CSRF prevention", status: "todo" },
          { name: "Data Protection", description: "Input validation, sanitization", status: "todo" },
          { name: "HTTPS & Security Headers", description: "SSL/TLS, CSP, security headers", status: "todo" },
          { name: "Authentication Security", description: "Password hashing, secure sessions", status: "todo" },
          { name: "API Security", description: "Rate limiting, API keys, OAuth", status: "todo" }
        ]
      },
      {
        id: "advanced",
        title: "Advanced Topics",
        status: "optional",
        items: [
          { name: "Microservices Architecture", description: "Service decomposition, communication", status: "todo" },
          { name: "Real-time Applications", description: "WebSockets, Server-Sent Events", status: "todo" },
          { name: "Progressive Web Apps", description: "Service workers, offline functionality", status: "todo" },
          { name: "GraphQL Advanced", description: "Subscriptions, federation, caching", status: "todo" },
          { name: "Serverless Architecture", description: "Functions as a Service, edge computing", status: "todo" }
        ]
      }
    ]
  },

  mobile: {
    title: "Mobile Developer Roadmap",
    description: "iOS and Android app development",
    color: "#EC4899",
    sections: [
      {
        id: "basics",
        title: "Mobile Development Fundamentals",
        status: "required",
        items: [
          { name: "Mobile Platforms", description: "iOS vs Android, platform differences", status: "todo" },
          { name: "Programming Languages", description: "Swift, Kotlin, Dart, JavaScript", status: "todo" },
          { name: "Mobile UI/UX", description: "Design principles, user experience", status: "todo" },
          { name: "Development Environment", description: "Xcode, Android Studio, VS Code", status: "todo" },
          { name: "Platform Guidelines", description: "iOS HIG, Material Design", status: "todo" }
        ]
      },
      {
        id: "native-ios",
        title: "iOS Native Development",
        status: "required",
        items: [
          { name: "Swift Programming", description: "Language fundamentals, optionals, closures", status: "todo" },
          { name: "UIKit Framework", description: "Views, controllers, navigation", status: "todo" },
          { name: "SwiftUI", description: "Declarative UI, state management", status: "todo" },
          { name: "Core Data", description: "Data persistence, Core Data stack", status: "todo" },
          { name: "iOS Architecture", description: "MVC, MVVM, Coordinator pattern", status: "todo" }
        ]
      },
      {
        id: "native-android",
        title: "Android Native Development",
        status: "required",
        items: [
          { name: "Kotlin Programming", description: "Language features, coroutines", status: "todo" },
          { name: "Android SDK", description: "Activities, fragments, services", status: "todo" },
          { name: "Jetpack Compose", description: "Modern Android UI toolkit", status: "todo" },
          { name: "Room Database", description: "SQLite abstraction, data persistence", status: "todo" },
          { name: "Android Architecture", description: "MVVM, Repository pattern, Clean Architecture", status: "todo" }
        ]
      },
      {
        id: "crossplatform",
        title: "Cross-Platform Development",
        status: "required",
        items: [
          { name: "React Native", description: "JavaScript-based mobile development", status: "todo" },
          { name: "Flutter", description: "Dart-based UI toolkit", status: "todo" },
          { name: "Xamarin", description: "C#-based cross-platform development", status: "todo" },
          { name: "Ionic", description: "Web-based mobile applications", status: "todo" },
          { name: "Platform Comparison", description: "Choosing the right framework", status: "todo" }
        ]
      },
      {
        id: "backend",
        title: "Backend Integration",
        status: "required",
        items: [
          { name: "REST API Integration", description: "HTTP clients, networking", status: "todo" },
          { name: "GraphQL", description: "Query language, Apollo client", status: "todo" },
          { name: "Real-time Communication", description: "WebSockets, push notifications", status: "todo" },
          { name: "Authentication", description: "OAuth, biometric authentication", status: "todo" },
          { name: "Offline Support", description: "Data synchronization, caching", status: "todo" }
        ]
      },
      {
        id: "device-features",
        title: "Device Features & APIs",
        status: "required",
        items: [
          { name: "Camera & Media", description: "Photo/video capture, media processing", status: "todo" },
          { name: "Location Services", description: "GPS, maps, geofencing", status: "todo" },
          { name: "Sensors", description: "Accelerometer, gyroscope, proximity", status: "todo" },
          { name: "Device Storage", description: "File system, secure storage", status: "todo" },
          { name: "Background Processing", description: "Background tasks, notifications", status: "todo" }
        ]
      },
      {
        id: "testing",
        title: "Mobile Testing",
        status: "required",
        items: [
          { name: "Unit Testing", description: "XCTest, JUnit, testing frameworks", status: "todo" },
          { name: "UI Testing", description: "Espresso, XCUITest, automated testing", status: "todo" },
          { name: "Device Testing", description: "Physical devices, simulators, emulators", status: "todo" },
          { name: "Performance Testing", description: "Memory usage, battery optimization", status: "todo" },
          { name: "Crash Reporting", description: "Firebase Crashlytics, Bugsnag", status: "todo" }
        ]
      },
      {
        id: "deployment",
        title: "App Store Deployment",
        status: "required",
        items: [
          { name: "iOS App Store", description: "App Store Connect, review process", status: "todo" },
          { name: "Google Play Store", description: "Play Console, publishing guidelines", status: "todo" },
          { name: "App Signing", description: "Certificates, provisioning profiles", status: "todo" },
          { name: "CI/CD for Mobile", description: "Fastlane, automated builds", status: "todo" },
          { name: "App Analytics", description: "User behavior, crash analytics", status: "todo" }
        ]
      },
      {
        id: "advanced",
        title: "Advanced Mobile Development",
        status: "optional",
        items: [
          { name: "Performance Optimization", description: "Memory management, rendering optimization", status: "todo" },
          { name: "Security Best Practices", description: "Code obfuscation, secure communication", status: "todo" },
          { name: "Accessibility", description: "VoiceOver, TalkBack, inclusive design", status: "todo" },
          { name: "Internationalization", description: "Localization, multi-language support", status: "todo" },
          { name: "AR/VR Integration", description: "ARKit, ARCore, immersive experiences", status: "todo" }
        ]
      }
    ]
  },

  cybersecurity: {
    title: "Cybersecurity Roadmap",
    description: "Information security and ethical hacking",
    color: "#DC2626",
    sections: [
      {
        id: "basics",
        title: "Security Fundamentals",
        status: "required",
        items: [
          { name: "Information Security Principles", description: "CIA triad, risk management", status: "todo" },
          { name: "Networking Fundamentals", description: "TCP/IP, OSI model, protocols", status: "todo" },
          { name: "Operating Systems Security", description: "Linux, Windows, macOS security", status: "todo" },
          { name: "Cryptography Basics", description: "Encryption, hashing, digital signatures", status: "todo" },
          { name: "Security Policies", description: "Governance, compliance, frameworks", status: "todo" }
        ]
      },
      {
        id: "tools",
        title: "Security Tools & Technologies",
        status: "required",
        items: [
          { name: "Network Scanners", description: "Nmap, Masscan, network discovery", status: "todo" },
          { name: "Vulnerability Scanners", description: "Nessus, OpenVAS, Qualys", status: "todo" },
          { name: "Penetration Testing", description: "Metasploit, Burp Suite, OWASP ZAP", status: "todo" },
          { name: "Forensics Tools", description: "Autopsy, Volatility, EnCase", status: "todo" },
          { name: "SIEM Platforms", description: "Splunk, ELK Stack, QRadar", status: "todo" }
        ]
      },
      {
        id: "web-security",
        title: "Web Application Security",
        status: "required",
        items: [
          { name: "OWASP Top 10", description: "Common web vulnerabilities", status: "todo" },
          { name: "SQL Injection", description: "Database attack vectors, prevention", status: "todo" },
          { name: "Cross-Site Scripting", description: "XSS types, exploitation, mitigation", status: "todo" },
          { name: "CSRF & SSRF", description: "Request forgery attacks", status: "todo" },
          { name: "Authentication Bypass", description: "Session management, access controls", status: "todo" }
        ]
      },
      {
        id: "network-security",
        title: "Network Security",
        status: "required",
        items: [
          { name: "Firewalls & IDS/IPS", description: "Network filtering, intrusion detection", status: "todo" },
          { name: "VPN Technologies", description: "Virtual private networks, tunneling", status: "todo" },
          { name: "Wireless Security", description: "WiFi security, WPA/WPA2/WPA3", status: "todo" },
          { name: "Network Monitoring", description: "Traffic analysis, anomaly detection", status: "todo" },
          { name: "DDoS Protection", description: "Distributed denial of service mitigation", status: "todo" }
        ]
      },
      {
        id: "incident-response",
        title: "Incident Response & Forensics",
        status: "required",
        items: [
          { name: "Incident Response Process", description: "NIST framework, response procedures", status: "todo" },
          { name: "Digital Forensics", description: "Evidence collection, analysis", status: "todo" },
          { name: "Malware Analysis", description: "Static/dynamic analysis, reverse engineering", status: "todo" },
          { name: "Threat Hunting", description: "Proactive threat detection", status: "todo" },
          { name: "Recovery & Lessons Learned", description: "Business continuity, post-incident analysis", status: "todo" }
        ]
      },
      {
        id: "compliance",
        title: "Compliance & Governance",
        status: "required",
        items: [
          { name: "Security Frameworks", description: "NIST, ISO 27001, CIS Controls", status: "todo" },
          { name: "Regulatory Compliance", description: "GDPR, HIPAA, SOX, PCI DSS", status: "todo" },
          { name: "Risk Assessment", description: "Threat modeling, vulnerability assessment", status: "todo" },
          { name: "Security Auditing", description: "Compliance audits, gap analysis", status: "todo" },
          { name: "Business Continuity", description: "Disaster recovery, continuity planning", status: "todo" }
        ]
      },
      {
        id: "ethical-hacking",
        title: "Ethical Hacking & Penetration Testing",
        status: "required",
        items: [
          { name: "Reconnaissance", description: "Information gathering, OSINT", status: "todo" },
          { name: "Scanning & Enumeration", description: "Service discovery, vulnerability identification", status: "todo" },
          { name: "Exploitation", description: "Vulnerability exploitation, privilege escalation", status: "todo" },
          { name: "Post-Exploitation", description: "Persistence, lateral movement", status: "todo" },
          { name: "Reporting", description: "Documentation, remediation recommendations", status: "todo" }
        ]
      },
      {
        id: "cloud-security",
        title: "Cloud Security",
        status: "optional",
        items: [
          { name: "AWS Security", description: "IAM, VPC, security services", status: "todo" },
          { name: "Azure Security", description: "Azure AD, security center", status: "todo" },
          { name: "Container Security", description: "Docker, Kubernetes security", status: "todo" },
          { name: "DevSecOps", description: "Security in CI/CD pipelines", status: "todo" }
        ]
      },
      {
        id: "advanced",
        title: "Advanced Security Topics",
        status: "optional",
        items: [
          { name: "Advanced Persistent Threats", description: "APT detection, attribution", status: "todo" },
          { name: "IoT Security", description: "Device security, firmware analysis", status: "todo" },
          { name: "AI/ML Security", description: "Adversarial attacks, model security", status: "todo" },
          { name: "Blockchain Security", description: "Smart contract auditing, DeFi security", status: "todo" }
        ]
      }
    ]
  },

  blockchain: {
    title: "Blockchain Developer Roadmap",
    description: "Web3 and blockchain development expertise",
    color: "#F59E0B",
    sections: [
      {
        id: "basics",
        title: "Blockchain Fundamentals",
        status: "required",
        items: [
          { name: "What is Blockchain", description: "Distributed ledger, consensus mechanisms", status: "todo" },
          { name: "Cryptography Basics", description: "Hashing, digital signatures, merkle trees", status: "todo" },
          { name: "Bitcoin & Ethereum", description: "Understanding major blockchain networks", status: "todo" },
          { name: "Smart Contracts", description: "Self-executing contracts on blockchain", status: "todo" },
          { name: "DeFi Concepts", description: "Decentralized finance protocols", status: "todo" }
        ]
      },
      {
        id: "solidity",
        title: "Smart Contract Development",
        status: "required",
        items: [
          { name: "Solidity Programming", description: "Smart contract language for Ethereum", status: "todo" },
          { name: "Web3.js/Ethers.js", description: "JavaScript libraries for blockchain interaction", status: "todo" },
          { name: "Truffle/Hardhat", description: "Development frameworks and testing", status: "todo" },
          { name: "OpenZeppelin", description: "Secure smart contract libraries", status: "todo" },
          { name: "Gas Optimization", description: "Efficient contract deployment and execution", status: "todo" }
        ]
      },
      {
        id: "dapps",
        title: "DApp Development",
        status: "required",
        items: [
          { name: "Frontend Integration", description: "React/Vue with Web3 wallets", status: "todo" },
          { name: "MetaMask Integration", description: "Wallet connection and transactions", status: "todo" },
          { name: "IPFS", description: "Decentralized file storage", status: "todo" },
          { name: "The Graph", description: "Indexing and querying blockchain data", status: "todo" },
          { name: "Testing & Deployment", description: "Testnet deployment and mainnet launch", status: "todo" }
        ]
      }
    ]
  },

  gamedev: {
    title: "Game Developer Roadmap",
    description: "Video game development and design",
    color: "#8B5CF6",
    sections: [
      {
        id: "basics",
        title: "Game Development Fundamentals",
        status: "required",
        items: [
          { name: "Game Design Principles", description: "Mechanics, dynamics, aesthetics", status: "todo" },
          { name: "Programming Languages", description: "C#, C++, JavaScript, Python", status: "todo" },
          { name: "Math for Games", description: "Linear algebra, trigonometry, physics", status: "todo" },
          { name: "Game Engines", description: "Unity, Unreal Engine, Godot", status: "todo" },
          { name: "Version Control", description: "Git for game development workflows", status: "todo" }
        ]
      },
      {
        id: "unity",
        title: "Unity Development",
        status: "required",
        items: [
          { name: "Unity Interface", description: "Scene view, inspector, project window", status: "todo" },
          { name: "C# Scripting", description: "MonoBehaviour, coroutines, events", status: "todo" },
          { name: "Physics & Animation", description: "Rigidbody, colliders, animator", status: "todo" },
          { name: "UI System", description: "Canvas, UI elements, responsive design", status: "todo" },
          { name: "Asset Management", description: "Sprites, models, audio, optimization", status: "todo" }
        ]
      },
      {
        id: "graphics",
        title: "Graphics & Art",
        status: "required",
        items: [
          { name: "2D/3D Art", description: "Sprites, models, textures, materials", status: "todo" },
          { name: "Shaders", description: "HLSL, shader graph, visual effects", status: "todo" },
          { name: "Lighting", description: "Global illumination, shadows, post-processing", status: "todo" },
          { name: "Animation", description: "Keyframe, procedural, state machines", status: "todo" },
          { name: "Optimization", description: "LOD, culling, texture compression", status: "todo" }
        ]
      }
    ]
  },

  uiux: {
    title: "UI/UX Designer Roadmap",
    description: "User interface and experience design",
    color: "#EC4899",
    sections: [
      {
        id: "basics",
        title: "Design Fundamentals",
        status: "required",
        items: [
          { name: "Design Principles", description: "Color theory, typography, layout", status: "todo" },
          { name: "User Research", description: "Personas, user interviews, surveys", status: "todo" },
          { name: "Information Architecture", description: "Site maps, user flows, wireframes", status: "todo" },
          { name: "Accessibility", description: "WCAG guidelines, inclusive design", status: "todo" },
          { name: "Design Systems", description: "Component libraries, style guides", status: "todo" }
        ]
      },
      {
        id: "tools",
        title: "Design Tools",
        status: "required",
        items: [
          { name: "Figma/Sketch", description: "Interface design and prototyping", status: "todo" },
          { name: "Adobe Creative Suite", description: "Photoshop, Illustrator, XD", status: "todo" },
          { name: "Prototyping Tools", description: "InVision, Principle, Framer", status: "todo" },
          { name: "Handoff Tools", description: "Zeplin, Avocode, developer handoff", status: "todo" },
          { name: "Version Control", description: "Design file management, collaboration", status: "todo" }
        ]
      },
      {
        id: "ux",
        title: "User Experience",
        status: "required",
        items: [
          { name: "User Testing", description: "Usability testing, A/B testing", status: "todo" },
          { name: "Analytics", description: "Google Analytics, heatmaps, user behavior", status: "todo" },
          { name: "Conversion Optimization", description: "CRO, landing page optimization", status: "todo" },
          { name: "Mobile UX", description: "Responsive design, mobile-first approach", status: "todo" },
          { name: "Psychology", description: "Cognitive load, persuasive design", status: "todo" }
        ]
      }
    ]
  },

  dataanalyst: {
    title: "Data Analyst Roadmap",
    description: "Data analysis and business intelligence",
    color: "#10B981",
    sections: [
      {
        id: "basics",
        title: "Data Analysis Fundamentals",
        status: "required",
        items: [
          { name: "Statistics", description: "Descriptive and inferential statistics", status: "todo" },
          { name: "Excel/Google Sheets", description: "Advanced formulas, pivot tables, charts", status: "todo" },
          { name: "SQL", description: "Data querying, joins, aggregations", status: "todo" },
          { name: "Data Cleaning", description: "Data preprocessing and validation", status: "todo" },
          { name: "Business Intelligence", description: "KPIs, metrics, business understanding", status: "todo" }
        ]
      },
      {
        id: "tools",
        title: "Analysis Tools",
        status: "required",
        items: [
          { name: "Python/R", description: "Programming for data analysis", status: "todo" },
          { name: "Pandas/NumPy", description: "Data manipulation libraries", status: "todo" },
          { name: "Tableau/Power BI", description: "Data visualization platforms", status: "todo" },
          { name: "Jupyter Notebooks", description: "Interactive analysis environment", status: "todo" },
          { name: "Database Tools", description: "MySQL, PostgreSQL, MongoDB", status: "todo" }
        ]
      },
      {
        id: "visualization",
        title: "Data Visualization",
        status: "required",
        items: [
          { name: "Chart Types", description: "Choosing appropriate visualizations", status: "todo" },
          { name: "Dashboard Design", description: "Interactive dashboards and reports", status: "todo" },
          { name: "Storytelling", description: "Data-driven narratives and insights", status: "todo" },
          { name: "Advanced Viz", description: "D3.js, custom visualizations", status: "todo" },
          { name: "Presentation Skills", description: "Communicating findings to stakeholders", status: "todo" }
        ]
      }
    ]
  },

  productmanager: {
    title: "Product Manager Roadmap",
    description: "Product strategy and management",
    color: "#F59E0B",
    sections: [
      {
        id: "basics",
        title: "Product Management Fundamentals",
        status: "required",
        items: [
          { name: "Product Strategy", description: "Vision, roadmap, competitive analysis", status: "todo" },
          { name: "Market Research", description: "Customer discovery, market sizing", status: "todo" },
          { name: "User Stories", description: "Requirements gathering, acceptance criteria", status: "todo" },
          { name: "Agile/Scrum", description: "Sprint planning, backlog management", status: "todo" },
          { name: "Stakeholder Management", description: "Communication, alignment, negotiation", status: "todo" }
        ]
      },
      {
        id: "analytics",
        title: "Product Analytics",
        status: "required",
        items: [
          { name: "Metrics & KPIs", description: "Product metrics, success measurement", status: "todo" },
          { name: "A/B Testing", description: "Experimentation and hypothesis testing", status: "todo" },
          { name: "User Analytics", description: "Google Analytics, Mixpanel, Amplitude", status: "todo" },
          { name: "Data Analysis", description: "SQL, Excel, data interpretation", status: "todo" },
          { name: "Reporting", description: "Dashboards, executive reporting", status: "todo" }
        ]
      },
      {
        id: "tools",
        title: "PM Tools & Processes",
        status: "required",
        items: [
          { name: "Project Management", description: "Jira, Asana, Trello, Monday", status: "todo" },
          { name: "Design Collaboration", description: "Figma, Miro, wireframing", status: "todo" },
          { name: "Documentation", description: "Confluence, Notion, PRDs", status: "todo" },
          { name: "Customer Feedback", description: "User interviews, surveys, feedback loops", status: "todo" },
          { name: "Go-to-Market", description: "Launch planning, marketing collaboration", status: "todo" }
        ]
      }
    ]
  }
};