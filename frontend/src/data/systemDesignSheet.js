// System Design Sheet - Complete Roadmap for SDEs
export const systemDesignSheet = [
  {
    id: 1,
    title: "Module 1: Basics",
    problems: [
      { id: 1, title: "What is System Design?", difficulty: "Easy", youtubeLink: "https://www.youtube.com/watch?v=UzLMhqg3_Wc", gfgLink: "https://www.geeksforgeeks.org/what-is-system-design-learn-system-design/", companies: "Google, Amazon, Microsoft" },
      { id: 2, title: "Horizontal vs. Vertical Scaling", difficulty: "Easy", youtubeLink: "https://www.youtube.com/watch?v=xpDnVSmNFX0", gfgLink: "https://www.geeksforgeeks.org/horizontal-and-vertical-scaling-in-databases/", companies: "Amazon, Netflix, Facebook" },
      { id: 3, title: "What is Capacity Estimation?", difficulty: "Medium", youtubeLink: "https://www.youtube.com/watch?v=UC5xf8FbdJc", gfgLink: "https://www.geeksforgeeks.org/capacity-planning-in-system-design/", companies: "Google, Amazon" },
      { id: 4, title: "What is HTTP?", difficulty: "Easy", gfgLink: "https://www.geeksforgeeks.org/http-non-persistent-persistent-connection/", youtubeLink: "https://www.youtube.com/watch?v=iYM2zFP3Zn0", companies: "All Companies" },
      { id: 5, title: "What is the Internet TCP/IP stack?", difficulty: "Medium", gfgLink: "https://www.geeksforgeeks.org/tcp-ip-model/", youtubeLink: "https://www.youtube.com/watch?v=PpsEaqJV_A0", companies: "Google, Microsoft" },
      { id: 6, title: "What happens when you enter Google.com?", difficulty: "Medium", gfgLink: "https://www.geeksforgeeks.org/what-happens-when-we-enter-www-google-com-in-a-browser/", youtubeLink: "https://www.youtube.com/watch?v=dh406O2v_1c", companies: "Google, Amazon, Facebook" },
      { id: 7, title: "What are Relational Databases?", difficulty: "Easy", gfgLink: "https://www.geeksforgeeks.org/relational-model-in-dbms/", youtubeLink: "https://www.youtube.com/watch?v=OqjJjpjDRLc", companies: "All Companies" },
      { id: 8, title: "What are Database Indexes?", difficulty: "Medium", youtubeLink: "https://www.youtube.com/watch?v=YuRO9-rOgv4", gfgLink: "https://www.geeksforgeeks.org/indexing-in-databases-set-1/", companies: "Amazon, Google, Microsoft" },
      { id: 9, title: "What are NoSQL databases?", difficulty: "Medium", youtubeLink: "https://www.youtube.com/watch?v=0buKQHokLK8", gfgLink: "https://www.geeksforgeeks.org/introduction-to-nosql/", companies: "Amazon, Facebook, Netflix" },
      { id: 10, title: "What is a Cache?", difficulty: "Easy", gfgLink: "https://www.geeksforgeeks.org/cache-memory-in-computer-organization/", youtubeLink: "https://www.youtube.com/watch?v=6FyXURRVmR0", companies: "All Companies" },
      { id: 11, title: "What is Thrashing?", difficulty: "Medium", gfgLink: "https://www.geeksforgeeks.org/techniques-to-handle-thrashing/", youtubeLink: "https://www.youtube.com/watch?v=2QuDTrpKLSw", companies: "Google, Microsoft" },
      { id: 12, title: "What are Threads?", difficulty: "Easy", gfgLink: "https://www.geeksforgeeks.org/thread-in-operating-system/", youtubeLink: "https://www.youtube.com/watch?v=LOfGJcVnvAk", companies: "All Companies" }
    ]
  },
  {
    id: 2,
    title: "Module 2: Load Balancing",
    problems: [
      { id: 13, title: "What is Load Balancing?", difficulty: "Medium", youtubeLink: "https://www.youtube.com/watch?v=K0Ta65OqQkY", gfgLink: "https://www.geeksforgeeks.org/load-balancing-in-system-design/", companies: "Amazon, Google, Netflix" },
      { id: 14, title: "What is Consistent Hashing?", difficulty: "Hard", youtubeLink: "https://www.youtube.com/watch?v=zaRkONvyGr8", gfgLink: "https://www.geeksforgeeks.org/consistent-hashing/", companies: "Amazon, Google, Facebook" },
      { id: 15, title: "What is Sharding?", difficulty: "Hard", youtubeLink: "https://www.youtube.com/watch?v=5faMjKuB9bc", gfgLink: "https://www.geeksforgeeks.org/database-sharding-a-system-design-concept/", companies: "Amazon, Facebook, Twitter" }
    ]
  },
  {
    id: 3,
    title: "Module 3: DataStores",
    problems: [
      { id: 16, title: "What are Bloom Filters?", difficulty: "Hard", youtubeLink: "https://www.youtube.com/watch?v=Bay3X9PAX5k", gfgLink: "https://www.geeksforgeeks.org/bloom-filters-introduction-and-python-implementation/", companies: "Google, Amazon" },
      { id: 17, title: "What is Data Replication?", difficulty: "Medium", youtubeLink: "https://www.youtube.com/watch?v=GeGxgmPTe4c", gfgLink: "https://www.geeksforgeeks.org/data-replication-in-dbms/", companies: "Amazon, Google, Facebook" },
      { id: 18, title: "How are NoSQL databases optimized?", difficulty: "Hard", youtubeLink: "https://www.youtube.com/watch?v=W2Z7fbCLSTw", gfgLink: "https://www.geeksforgeeks.org/nosql-databases-types/", companies: "Amazon, Facebook, Netflix" },
      { id: 19, title: "What are Location-based Databases?", difficulty: "Medium", youtubeLink: "https://www.youtube.com/watch?v=M4lR_Va97cQ", gfgLink: "https://www.geeksforgeeks.org/spatial-database/", companies: "Google, Uber, Amazon" },
      { id: 20, title: "Database Migrations", difficulty: "Medium", gfgLink: "https://www.geeksforgeeks.org/database-migration/", youtubeLink: "https://www.youtube.com/watch?v=fMZWVOpGG-k", companies: "All Companies" }
    ]
  },
  {
    id: 4,
    title: "Module 4: Consistency vs. Availability",
    problems: [
      { id: 21, title: "What is Data Consistency?", difficulty: "Medium", youtubeLink: "https://www.youtube.com/watch?v=BHqjEjzAicA", gfgLink: "https://www.geeksforgeeks.org/acid-properties-in-dbms/", companies: "Amazon, Google, Facebook" },
      { id: 22, title: "Data Consistency Levels", difficulty: "Hard", gfgLink: "https://www.geeksforgeeks.org/consistency-in-system-design/", youtubeLink: "https://www.youtube.com/watch?v=utWnwdV9kwA", companies: "Amazon, Google" },
      { id: 23, title: "Transaction Isolation Levels", difficulty: "Hard", gfgLink: "https://www.geeksforgeeks.org/transaction-isolation-levels-dbms/", youtubeLink: "https://www.youtube.com/watch?v=4EajrPgJAk0", companies: "Amazon, Microsoft, Google" }
    ]
  },
  {
    id: 5,
    title: "Module 5: Message Queues",
    problems: [
      { id: 24, title: "What is a Message Queue?", difficulty: "Medium", youtubeLink: "https://www.youtube.com/watch?v=oUJbuFMyBDk", gfgLink: "https://www.geeksforgeeks.org/message-queues-system-design/", companies: "Amazon, Google, Netflix" },
      { id: 25, title: "What is the publisher-subscriber model?", difficulty: "Medium", youtubeLink: "https://www.youtube.com/watch?v=FMhbR_kQeHw", gfgLink: "https://www.geeksforgeeks.org/publisher-subscriber-pattern/", companies: "Amazon, Google, Facebook" },
      { id: 26, title: "What are event-driven systems?", difficulty: "Medium", youtubeLink: "https://www.youtube.com/watch?v=rJHTK2TfZ1I", gfgLink: "https://www.geeksforgeeks.org/event-driven-architecture/", companies: "Amazon, Netflix, Uber" },
      { id: 27, title: "Database as a Message Queue", difficulty: "Hard", youtubeLink: "https://www.youtube.com/watch?v=W4_aGb_MOls", gfgLink: "https://www.geeksforgeeks.org/database-as-a-message-queue/", companies: "Amazon, Google" }
    ]
  },
  {
    id: 6,
    title: "Module 6: DevOps Concepts",
    problems: [
      { id: 28, title: "What is a Single Point of Failure?", difficulty: "Medium", youtubeLink: "https://www.youtube.com/watch?v=AuuQ6hKsI8A", gfgLink: "https://www.geeksforgeeks.org/single-point-of-failure/", companies: "All Companies" },
      { id: 29, title: "What are Containers?", difficulty: "Medium", youtubeLink: "https://www.youtube.com/watch?v=cjXI-yxqGTI", gfgLink: "https://www.geeksforgeeks.org/containerization-using-docker/", companies: "Google, Amazon, Microsoft" },
      { id: 30, title: "What is Service Discovery and Heartbeats?", difficulty: "Hard", youtubeLink: "https://www.youtube.com/watch?v=GboiMJm6WlA", gfgLink: "https://www.geeksforgeeks.org/service-discovery-in-microservices/", companies: "Amazon, Google, Netflix" },
      { id: 31, title: "How to avoid Cascading Failures?", difficulty: "Hard", youtubeLink: "https://www.youtube.com/watch?v=xrizarXJgC8", gfgLink: "https://www.geeksforgeeks.org/cascading-failure-in-system-design/", companies: "Amazon, Google, Facebook" },
      { id: 32, title: "Anomaly Detection in Distributed Systems", difficulty: "Hard", youtubeLink: "https://www.youtube.com/watch?v=MBUrhkckV4c", gfgLink: "https://www.geeksforgeeks.org/anomaly-detection/", companies: "Google, Amazon, Netflix" },
      { id: 33, title: "Distributed Rate Limiting", difficulty: "Hard", gfgLink: "https://www.geeksforgeeks.org/rate-limiting-system-design/", youtubeLink: "https://www.youtube.com/watch?v=mhUQe4BKZXs", companies: "Amazon, Google, Twitter" }
    ]
  },
  {
    id: 7,
    title: "Module 7: Caching",
    problems: [
      { id: 34, title: "What is Distributed Caching?", difficulty: "Medium", youtubeLink: "https://www.youtube.com/watch?v=U3RkDLtS7uY", gfgLink: "https://www.geeksforgeeks.org/distributed-caching/", companies: "Amazon, Google, Facebook" },
      { id: 35, title: "What are Content Delivery Networks?", difficulty: "Medium", youtubeLink: "https://www.youtube.com/watch?v=Bsq5cKkS33I", gfgLink: "https://www.geeksforgeeks.org/what-is-cdn-how-it-works/", companies: "Amazon, Google, Netflix" },
      { id: 36, title: "Write Policies", difficulty: "Medium", gfgLink: "https://www.geeksforgeeks.org/cache-write-policies-in-system-design/", youtubeLink: "https://www.youtube.com/watch?v=6FyXURRVmR0", companies: "Amazon, Google" },
      { id: 37, title: "Replacement Policies", difficulty: "Medium", gfgLink: "https://www.geeksforgeeks.org/page-replacement-algorithms-in-operating-systems/", youtubeLink: "https://www.youtube.com/watch?v=dYIrkiyGyps", companies: "Google, Microsoft" }
    ]
  },
  {
    id: 8,
    title: "Module 8: Microservices",
    problems: [
      { id: 38, title: "Microservices vs. Monoliths", difficulty: "Medium", youtubeLink: "https://www.youtube.com/watch?v=y8OnoxKotPQ", gfgLink: "https://www.geeksforgeeks.org/monolithic-vs-microservices-architecture/", companies: "Amazon, Google, Netflix" },
      { id: 39, title: "How monoliths are migrated", difficulty: "Hard", youtubeLink: "https://www.youtube.com/watch?v=9I9GdSQ1bbM", gfgLink: "https://www.geeksforgeeks.org/monolith-to-microservices-migration/", companies: "Amazon, Netflix, Uber" }
    ]
  },
  {
    id: 9,
    title: "Module 9: API Gateways",
    problems: [
      { id: 40, title: "How are APIs designed?", difficulty: "Medium", youtubeLink: "https://www.youtube.com/watch?v=_YlYuNMTCc8", gfgLink: "https://www.geeksforgeeks.org/rest-api-introduction/", companies: "All Companies" },
      { id: 41, title: "What are asynchronous APIs?", difficulty: "Medium", youtubeLink: "https://www.youtube.com/watch?v=2BTVnP6_PWo", gfgLink: "https://www.geeksforgeeks.org/asynchronous-programming/", companies: "Amazon, Google, Facebook" }
    ]
  },
  {
    id: 10,
    title: "Module 10: Authentication Mechanisms",
    problems: [
      { id: 42, title: "OAuth", difficulty: "Medium", youtubeLink: "https://www.youtube.com/watch?v=996OiexHze0", gfgLink: "https://www.geeksforgeeks.org/oauth-2-0/", companies: "Google, Facebook, Microsoft" },
      { id: 43, title: "Token Based Auth", difficulty: "Medium", gfgLink: "https://www.geeksforgeeks.org/jwt-authentication-with-node-js/", youtubeLink: "https://www.youtube.com/watch?v=7Q17ubqLfaM", companies: "All Companies" },
      { id: 44, title: "Access Control Lists and Rule Engines", difficulty: "Hard", gfgLink: "https://www.geeksforgeeks.org/access-control-list-acl/", youtubeLink: "https://www.youtube.com/watch?v=C4NP8Eon3cA", companies: "Amazon, Google, Microsoft" }
    ]
  },
  {
    id: 11,
    title: "Module 11: System Design Tradeoffs",
    problems: [
      { id: 45, title: "Pull vs. Push", difficulty: "Medium", gfgLink: "https://www.geeksforgeeks.org/push-vs-pull-cdn/", youtubeLink: "https://www.youtube.com/watch?v=QepKuVYgnvo", companies: "Amazon, Google, Facebook" },
      { id: 46, title: "Memory vs. Latency", difficulty: "Medium", gfgLink: "https://www.geeksforgeeks.org/memory-hierarchy-design-and-its-characteristics/", youtubeLink: "https://www.youtube.com/watch?v=Vmb8xGD-LV8", companies: "Google, Microsoft" },
      { id: 47, title: "Throughput vs. Latency", difficulty: "Medium", gfgLink: "https://www.geeksforgeeks.org/difference-between-throughput-and-latency/", youtubeLink: "https://www.youtube.com/watch?v=r-TLSBdHe1A", companies: "All Companies" },
      { id: 48, title: "Consistency vs. Availability", difficulty: "Hard", gfgLink: "https://www.geeksforgeeks.org/cap-theorem-in-dbms/", youtubeLink: "https://www.youtube.com/watch?v=ytpJdnlu9ug", companies: "Amazon, Google, Facebook" },
      { id: 49, title: "Latency vs. Accuracy", difficulty: "Medium", gfgLink: "https://www.geeksforgeeks.org/latency-vs-accuracy-tradeoff/", youtubeLink: "https://www.youtube.com/watch?v=kxkQMfK54SM", companies: "Google, Amazon" },
      { id: 50, title: "SQL vs. NoSQL databases", difficulty: "Medium", gfgLink: "https://www.geeksforgeeks.org/difference-between-sql-and-nosql/", youtubeLink: "https://www.youtube.com/watch?v=ZS_kXvOeQ5Y", companies: "All Companies" }
    ]
  },
  {
    id: 12,
    title: "Module 12: Practice Problems",
    problems: [
      { id: 51, title: "System Design of a Live-Streaming App", difficulty: "Hard", youtubeLink: "https://www.youtube.com/watch?v=jPKTo1iGQiE", gfgLink: "https://www.geeksforgeeks.org/system-design-of-live-streaming-app/", companies: "YouTube, Twitch, Facebook" },
      { id: 52, title: "System Design of Instagram", difficulty: "Hard", youtubeLink: "https://www.youtube.com/watch?v=VJpfO6KdyWE", gfgLink: "https://www.geeksforgeeks.org/design-instagram/", companies: "Facebook, Instagram" },
      { id: 53, title: "System Design of Tinder", difficulty: "Hard", youtubeLink: "https://www.youtube.com/watch?v=tndzLznxq40", gfgLink: "https://www.geeksforgeeks.org/system-design-of-tinder/", companies: "Tinder, Bumble" },
      { id: 54, title: "System Design of WhatsApp", difficulty: "Hard", youtubeLink: "https://www.youtube.com/watch?v=vvhC64hQZMk", gfgLink: "https://www.geeksforgeeks.org/whatsapp-system-design/", companies: "Facebook, WhatsApp" },
      { id: 55, title: "System Design of TikTok", difficulty: "Hard", youtubeLink: "https://www.youtube.com/watch?v=Z-0g_aJL5Fw", gfgLink: "https://www.geeksforgeeks.org/system-design-of-tiktok/", companies: "TikTok, ByteDance" },
      { id: 56, title: "System Design of an Online Coding Judge - Part 1", difficulty: "Hard", youtubeLink: "https://www.youtube.com/watch?v=B12ydHbNick", gfgLink: "https://www.geeksforgeeks.org/design-online-judge/", companies: "LeetCode, HackerRank" },
      { id: 57, title: "System Design of an Online Coding Judge - Part 2", difficulty: "Hard", youtubeLink: "https://www.youtube.com/watch?v=QBBOTNk7ugY", gfgLink: "https://www.geeksforgeeks.org/design-online-judge/", companies: "LeetCode, HackerRank" },
      { id: 58, title: "System Design of UPI Payments", difficulty: "Hard", youtubeLink: "https://www.youtube.com/watch?v=QqBtvvHWqQE", gfgLink: "https://www.geeksforgeeks.org/upi-system-design/", companies: "Google Pay, PhonePe" },
      { id: 59, title: "System Design of IRCTC", difficulty: "Hard", youtubeLink: "https://www.youtube.com/watch?v=3psQcbPqvOk", gfgLink: "https://www.geeksforgeeks.org/irctc-system-design/", companies: "IRCTC, BookMyShow" },
      { id: 60, title: "System Design of Netflix Video Onboarding Pipeline", difficulty: "Hard", youtubeLink: "https://www.youtube.com/watch?v=psQzyFfsUGU", gfgLink: "https://www.geeksforgeeks.org/netflix-system-design/", companies: "Netflix, Amazon Prime" },
      { id: 61, title: "System Design of Doordash", difficulty: "Hard", youtubeLink: "https://www.youtube.com/watch?v=iRhSAR3ldTw", gfgLink: "https://www.geeksforgeeks.org/food-delivery-system-design/", companies: "DoorDash, Uber Eats" },
      { id: 62, title: "System Design of Amazon Online Shops", difficulty: "Hard", youtubeLink: "https://www.youtube.com/watch?v=EpASu_1dUdE", gfgLink: "https://www.geeksforgeeks.org/amazon-system-design/", companies: "Amazon, Flipkart" },
      { id: 63, title: "System Design of Google Maps", difficulty: "Hard", gfgLink: "https://www.geeksforgeeks.org/system-design-of-google-maps/", youtubeLink: "https://www.youtube.com/watch?v=jk3yvVfNvds", companies: "Google, Apple Maps" },
      { id: 64, title: "System Design of Gmail", difficulty: "Hard", gfgLink: "https://www.geeksforgeeks.org/gmail-system-design/", youtubeLink: "https://www.youtube.com/watch?v=J3UqHzpJhjI", companies: "Google, Microsoft" },
      { id: 65, title: "System Design of a Chess Website", difficulty: "Hard", gfgLink: "https://www.geeksforgeeks.org/chess-game-system-design/", youtubeLink: "https://www.youtube.com/watch?v=yBsWza2039o", companies: "Chess.com, Lichess" },
      { id: 66, title: "System Design of Uber", difficulty: "Hard", gfgLink: "https://www.geeksforgeeks.org/system-design-of-uber-app-uber-system-architecture/", youtubeLink: "https://www.youtube.com/watch?v=umWABit-wbk", companies: "Uber, Lyft" },
      { id: 67, title: "System Design of Google Docs", difficulty: "Hard", gfgLink: "https://www.geeksforgeeks.org/google-docs-system-design/", youtubeLink: "https://www.youtube.com/watch?v=2auwirNBvGg", companies: "Google, Microsoft" }
    ]
  },
  {
    id: 13,
    title: "Module 13: Additional Resources",
    problems: [
      { id: 68, title: "InterviewReady Course", difficulty: "Easy", gfgLink: "https://www.geeksforgeeks.org/system-design-tutorial/", youtubeLink: "https://www.youtube.com/watch?v=bUHFg8CZFws", companies: "All Companies" },
      { id: 69, title: "GitHub Page", difficulty: "Easy", gfgLink: "https://www.geeksforgeeks.org/system-design-resources/", youtubeLink: "https://www.youtube.com/watch?v=xpDnVSmNFX0", companies: "All Companies" },
      { id: 70, title: "Designing Data-Intensive Applications", difficulty: "Medium", gfgLink: "https://www.geeksforgeeks.org/system-design-books/", youtubeLink: "https://www.youtube.com/watch?v=hnpzNAPiC0E", companies: "All Companies" }
    ]
  }
];

export default systemDesignSheet;