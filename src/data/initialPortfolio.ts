import { PortfolioData, ContactMessage, AnalyticsStats } from '../types/portfolio';

export const initialPortfolioData: PortfolioData = {
  profile: {
    name: 'Alex Rivera',
    title: 'Staff Full-Stack Engineer & Distributed Systems Architect',
    headline: 'Designing high-throughput distributed systems, modern web platforms, and agentic workflows that scale.',
    bio: 'I am a full-stack engineer and distributed systems builder with over 8 years of experience turning complex algorithmic and distributed infrastructure challenges into elegant, resilient software. Previously technical lead at high-growth infrastructure and SaaS scaleups. Passionate about TypeScript, React internals, low-latency Go/Node microservices, and human-centered design.',
    location: 'San Francisco, CA (Open to Remote / Global)',
    email: 'alex.rivera.dev@gmail.com',
    availableForWork: true,
    statusMessage: 'Available for high-impact Staff Engineer contracts & Advisory engagements',
    avatarUrl: '', // Styled SVG / avatar visualizer will be used gracefully
    resumeUrl: '#resume',
    socialLinks: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'mailto:alex.rivera.dev@gmail.com',
      website: 'https://alexrivera.dev'
    },
    metrics: [
      { label: 'Engineering Experience', value: '8+ Years', detail: 'Leading full-stack & systems teams' },
      { label: 'Active Users Served', value: '14M+', detail: 'Across high-scale platforms' },
      { label: 'Production Uptime', value: '99.99%', detail: 'Maintained across core microservices' },
      { label: 'Shipped Deployments', value: '1,400+', detail: 'Continuous delivery pipelines' }
    ]
  },
  projects: [
    {
      id: 'proj-1',
      title: 'HyperScale Telemetry & Analytics Platform',
      slug: 'hyperscale-telemetry',
      subtitle: 'Real-time observability engine processing 250k events/sec with sub-50ms query latency',
      description: 'An enterprise distributed observability pipeline and dashboard built with React 19, TypeScript, ClickHouse, and Node.js. Features live trace visualization, anomaly detection, and custom SQL analytical exploration.',
      category: 'Full Stack',
      tags: ['TypeScript', 'React 19', 'Node.js', 'ClickHouse', 'Tailwind CSS', 'WebSockets'],
      featured: true,
      liveUrl: 'https://demo.hyperscale-telemetry.io',
      githubUrl: 'https://github.com/alexrivera/hyperscale-telemetry',
      coverGradient: 'from-blue-600/20 via-indigo-600/10 to-transparent',
      sortOrder: 1,
      caseStudy: {
        summary: 'Engineered a next-generation telemetry visualizer capable of aggregating hundreds of thousands of concurrent event streams without UI thread stutters.',
        clientOrContext: 'Enterprise Cloud Observability Suite',
        role: 'Lead Architect & Core Frontend Implementer',
        timeline: '6 Months · Shipped Q4 2025',
        architecture: [
          'Virtual windowing rendering 50,000 timeline rows in 60 FPS via Canvas and React 19 concurrent features',
          'Bi-directional WebSocket streaming gateway with backpressure buffering and delta compression',
          'Fast query planner routing OLAP queries to distributed ClickHouse cluster'
        ],
        challenges: [
          'Eliminating client-side memory leaks caused by unbounded time-series ingestion',
          'Synthesizing multi-tenant permissions without slowing down real-time ingestion paths',
          'Ensuring sub-100ms dashboard hydration for cold visits'
        ],
        metrics: [
          { label: 'Query Latency', value: '38ms p95' },
          { label: 'Memory Footprint Reduction', value: '-64%' },
          { label: 'Daily Event Throughput', value: '2.1 Billion' }
        ],
        keyLearnings: 'Decoupling the telemetry stream parsing into dedicated Web Workers preserved absolute UI fluidness even during traffic spikes.'
      }
    },
    {
      id: 'proj-2',
      title: 'Cortex Agentic Workflow Orchestrator',
      slug: 'cortex-agentic-studio',
      subtitle: 'Multi-agent orchestration canvas for autonomous engineering pipelines',
      description: 'Interactive visual workflow canvas allowing development teams to compose, simulate, and trace multi-agent LLM reasoning graphs. Includes deterministic state rollback and automated tool evaluation.',
      category: 'AI & Agents',
      tags: ['React Flow', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Tailwind CSS'],
      featured: true,
      liveUrl: 'https://cortex-studio-preview.dev',
      githubUrl: 'https://github.com/alexrivera/cortex-orchestrator',
      coverGradient: 'from-emerald-600/20 via-teal-600/10 to-transparent',
      sortOrder: 2,
      caseStudy: {
        summary: 'Designed an intuitive node-based IDE for engineering teams deploying agentic LLM loops with guardrails and live debugger replay.',
        clientOrContext: 'AI Productivity Platform',
        role: 'Principal Full-Stack Engineer',
        timeline: '4 Months · Shipped Q2 2026',
        architecture: [
          'Custom directed-acyclic-graph (DAG) visualizer with zoom-to-cluster semantic rendering',
          'Execution engine tracking token consumption and branching rollbacks in real time',
          'Strict sandboxed code execution pods using lightweight container isolation'
        ],
        challenges: [
          'Visualizing non-linear asynchronous agent loops without cluttering the screen',
          'Handling streaming agent thoughts and tool call interruptions cleanly in React state'
        ],
        metrics: [
          { label: 'Developer Setup Time', value: '< 2 mins' },
          { label: 'Simulation Accuracy', value: '99.4%' },
          { label: 'Weekly Active Developers', value: '18,500+' }
        ],
        keyLearnings: 'Clean optimistic UI updates paired with immutable state snapshots made complex agent rollbacks trivial to understand for non-expert users.'
      }
    },
    {
      id: 'proj-3',
      title: 'Vortex Low-Latency Trading Terminal',
      slug: 'vortex-trading-terminal',
      subtitle: 'Institutional algorithmic order execution interface with live orderbook heatmaps',
      description: 'High-frequency algorithmic trading terminal built with WebAssembly, TypeScript, and Canvas. Delivers microsecond tick updates, custom algorithmic trigger orders, and portfolio risk simulators.',
      category: 'Cloud & Systems',
      tags: ['TypeScript', 'WebAssembly', 'Canvas API', 'Rust', 'WebSockets', 'Tailwind'],
      featured: true,
      liveUrl: 'https://vortex-terminal.markets.dev',
      githubUrl: 'https://github.com/alexrivera/vortex-terminal',
      coverGradient: 'from-amber-600/20 via-orange-600/10 to-transparent',
      sortOrder: 3,
      caseStudy: {
        summary: 'Built the zero-compromise institutional trading dashboard combining sub-millisecond execution feed visualization with rigorous risk controls.',
        clientOrContext: 'FinTech Capital Partners',
        role: 'Lead Systems & Frontend Architect',
        timeline: '8 Months · Shipped Q1 2026',
        architecture: [
          'WASM-compiled orderbook math crunching 100,000 tick updates per second off the main thread',
          'Double-buffered Canvas renderer avoiding standard DOM reflows entirely',
          'Client-side audit trail encrypted with hardware security keys'
        ],
        challenges: [
          'Garbage collector pauses during high market volatility causing missed visual frames',
          'Designing keyboard-first execution shortcuts that prevent accidental order fat-fingering'
        ],
        metrics: [
          { label: 'Frame Rendering Latency', value: '< 2.1ms' },
          { label: 'Daily Trading Volume', value: '$84M+' },
          { label: 'Zero Order Glitches', value: '100% Audit' }
        ],
        keyLearnings: 'Treating UI rendering as a fixed-budget frame pipeline rather than reactive DOM updates unlocked native-grade performance in the browser.'
      }
    },
    {
      id: 'proj-4',
      title: 'Monolith: Headless CMS & Static Site Core',
      slug: 'monolith-headless-cms',
      subtitle: 'Zero-config markdown-first content infrastructure with edge caching',
      description: 'An open-source content engine with schema validation, Git-backed version history, visual block editor, and instant edge CDN webhook invalidation.',
      category: 'Open Source',
      tags: ['TypeScript', 'Node.js', 'Express', 'SQLite', 'Tailwind CSS', 'Vite'],
      featured: false,
      liveUrl: 'https://monolith-cms.dev',
      githubUrl: 'https://github.com/alexrivera/monolith-cms',
      coverGradient: 'from-violet-600/20 via-purple-600/10 to-transparent',
      sortOrder: 4,
      caseStudy: {
        summary: 'Created a developer-friendly CMS that combines the tactile speed of local markdown files with the collaborative power of a modern cloud editor.',
        clientOrContext: 'Open Source Community',
        role: 'Author & Maintainer',
        timeline: 'Ongoing · 3.4k GitHub Stars',
        architecture: [
          'Content change reconciliation using conflict-free replicated data types (CRDTs)',
          'Automated OpenGraph card generator running serverless edge functions',
          'Lightweight zero-dependency SQLite storage engine'
        ],
        challenges: [
          'Maintaining zero npm dependencies outside core web standards',
          'Providing cross-platform deterministic schema validation'
        ],
        metrics: [
          { label: 'GitHub Stars', value: '3,420+' },
          { label: 'Bundle Size', value: '28 KB' },
          { label: 'Community PRs', value: '140+' }
        ],
        keyLearnings: 'Keeping core data primitives plain JSON and Markdown made community adoption frictionless.'
      }
    }
  ],
  skills: [
    {
      id: 'sk-1',
      name: 'TypeScript & JavaScript (ESNext)',
      category: 'Frontend',
      proficiency: 98,
      experienceYears: 8,
      highlight: 'Strict typing, AST transforms, monorepos, performance optimization'
    },
    {
      id: 'sk-2',
      name: 'React 19 & Next.js Architecture',
      category: 'Frontend',
      proficiency: 96,
      experienceYears: 7,
      highlight: 'Server Components, Concurrent Mode, custom hooks, microfrontends'
    },
    {
      id: 'sk-3',
      name: 'Tailwind CSS & Design Systems',
      category: 'Frontend',
      proficiency: 95,
      experienceYears: 6,
      highlight: 'Custom component libraries, token pipelines, WCAG AA accessibility'
    },
    {
      id: 'sk-4',
      name: 'Node.js & Express / Fastify',
      category: 'Backend & Cloud',
      proficiency: 94,
      experienceYears: 8,
      highlight: 'High-throughput async event loops, streaming APIs, microservices'
    },
    {
      id: 'sk-5',
      name: 'PostgreSQL, ClickHouse & Redis',
      category: 'Backend & Cloud',
      proficiency: 92,
      experienceYears: 7,
      highlight: 'Query indexing, distributed partitions, caching topologies'
    },
    {
      id: 'sk-6',
      name: 'Go & Low-Latency Services',
      category: 'Backend & Cloud',
      proficiency: 88,
      experienceYears: 4,
      highlight: 'Goroutine concurrency patterns, gRPC services, memory tuning'
    },
    {
      id: 'sk-7',
      name: 'Distributed Systems & Microservices',
      category: 'Systems & Architecture',
      proficiency: 92,
      experienceYears: 6,
      highlight: 'Event-driven architectures, Kafka/RabbitMQ, fault isolation'
    },
    {
      id: 'sk-8',
      name: 'Docker, Kubernetes & Cloud Run',
      category: 'DevOps & Tools',
      proficiency: 89,
      experienceYears: 6,
      highlight: 'Container orchestration, blue/green deployments, Terraform IaC'
    },
    {
      id: 'sk-9',
      name: 'CI/CD Pipelines & Testing',
      category: 'DevOps & Tools',
      proficiency: 93,
      experienceYears: 7,
      highlight: 'GitHub Actions, automated e2e pipelines, Vitest, Playwright'
    }
  ],
  timeline: [
    {
      id: 'time-1',
      type: 'work',
      title: 'Staff Systems Architect & Tech Lead',
      organization: 'Starlight Distributed Labs',
      period: '2023 — Present',
      location: 'San Francisco, CA',
      description: 'Directing the architecture and implementation of next-gen cloud observability pipelines, processing billions of daily events with 99.99% availability.',
      highlights: [
        'Architected real-time streaming dashboard reducing customer incident resolution time by 42%',
        'Mentored 14 full-stack and systems engineers across frontend, backend, and site reliability',
        'Spearheaded transition to unified TypeScript monorepo saving 120 engineering hours monthly'
      ]
    },
    {
      id: 'time-2',
      type: 'work',
      title: 'Senior Full-Stack Engineer',
      organization: 'FinVector Capital Systems',
      period: '2021 — 2023',
      location: 'New York, NY (Remote)',
      description: 'Engineered high-frequency algorithmic execution interfaces and portfolio analytics systems.',
      highlights: [
        'Rebuilt core trading console with Canvas and WebSockets achieving 60 FPS under peak tick loads',
        'Built automated risk calculator validating portfolio compliance in sub-5ms latency'
      ]
    },
    {
      id: 'time-3',
      type: 'work',
      title: 'Full-Stack Software Engineer',
      organization: 'Nexus Cloud Technologies',
      period: '2018 — 2021',
      location: 'Austin, TX',
      description: 'Delivered customer-facing cloud management dashboards and GraphQL orchestration layers.',
      highlights: [
        'Designed multi-tenant permission framework adopted by 25+ internal microservices',
        'Contributed to core design system reducing frontend bug tickets by 35%'
      ]
    },
    {
      id: 'time-4',
      type: 'education',
      title: 'B.S. in Computer Science & Applied Mathematics',
      organization: 'University of California, Berkeley',
      period: '2014 — 2018',
      location: 'Berkeley, CA',
      description: 'Focus in Distributed Systems, Algorithms, and Human-Computer Interaction. Honors Graduate.',
      highlights: [
        'President of Open Source Software Student Guild',
        'Published undergraduate paper on distributed consensus mechanisms'
      ]
    },
    {
      id: 'time-5',
      type: 'achievement',
      title: 'Keynote Speaker & Open Source Contributor',
      organization: 'ReactConf & JS World Summit',
      period: '2024 — 2025',
      location: 'Global',
      description: 'Delivered technical talks on "Zero-Latency UI Rendering in High-Throughput Web Applications".',
      highlights: [
        'Over 80,000 developer views across conference talk recordings',
        'Active maintainer of popular open-source tooling with 5,000+ total stars'
      ]
    }
  ],
  testimonials: [
    {
      id: 'test-1',
      name: 'Sarah Chen',
      role: 'VP of Engineering',
      company: 'Starlight Labs',
      avatar: '',
      quote: 'Alex is that rare 1% engineer who bridges deep low-level distributed systems thinking with exquisite frontend product sensibility. He raised our team’s architectural ceiling permanently.',
      relationship: 'Managed Alex directly at Starlight Labs',
      featured: true
    },
    {
      id: 'test-2',
      name: 'Marcus Vance',
      role: 'Head of Quantitative Trading',
      company: 'FinVector Systems',
      avatar: '',
      quote: 'When market volatility exploded, the trading terminal Alex engineered stayed rock solid at 60 FPS while competitor tools lagged. His attention to detail is truly world-class.',
      relationship: 'Product partner on Vortex Trading Core',
      featured: true
    },
    {
      id: 'test-3',
      name: 'Elena Rostova',
      role: 'Staff Product Designer',
      company: 'Cortex AI',
      avatar: '',
      quote: 'Collaborating with Alex is a dream for any designer. He respects typography, spacing math, and accessibility just as much as he respects latency and database query plans.',
      relationship: 'Design Lead on Cortex Agentic Studio',
      featured: true
    }
  ],
  lastUpdated: new Date().toISOString()
};

export const initialMessages: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'David Lindqvist',
    email: 'david@vanguard-cloud.io',
    subject: 'Staff Infrastructure Architect contract opportunity',
    message: 'Hi Alex, loved your work on the HyperScale Telemetry pipeline! We are scaling an enterprise AI cluster and would love to discuss a 6-month staff architectural contract with you.',
    budget: '$30,000 - $60,000',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    read: false,
    starred: true,
    archived: false,
    replied: false
  },
  {
    id: 'msg-2',
    name: 'Camilla Moreau',
    email: 'camilla@synthetix-ai.com',
    subject: 'Consulting on Agentic Workflow Visualizer',
    message: 'Hey Alex, saw your Cortex Studio case study. We need an expert to audit our React 19 node graph performance and optimize rendering bottlenecks. Are you free for an initial advisory call this Thursday?',
    budget: '$10,000 - $25,000',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    read: true,
    starred: false,
    archived: false,
    replied: true
  }
];

export const initialAnalytics: AnalyticsStats = {
  pageViews: 4820,
  uniqueVisitors: 3140,
  resumeDownloads: 342,
  contactSubmissions: 28,
  recentActivity: [
    { type: 'visit', timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(), detail: 'Visitor from San Francisco viewed Projects' },
    { type: 'contact', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), detail: 'New inquiry from David Lindqvist (Vanguard Cloud)' },
    { type: 'resume', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(), detail: 'Resume downloaded by visitor from London, UK' },
    { type: 'project_click', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), detail: 'Opened case study: HyperScale Telemetry' }
  ]
};
