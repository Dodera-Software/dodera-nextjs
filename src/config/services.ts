/**
 * Detailed content for each service page.
 *
 * Each entry maps to a route under /services/[slug]
 * and powers the shared ServicePageLayout component.
 */

import type { ServicePageData } from "@/types";

export const SERVICE_PAGES: Record<string, ServicePageData> = {
    /* ──────────────────────────────────────────────────────
     * AI Development (parent)
     * ────────────────────────────────────────────────────── */
    "ai-development": {
        slug: "ai-development",
        metaTitle: "AI Development Services - Custom Agents & Automations",
        metaDescription:
            "We build production-grade AI systems - from custom agents and workflow automations to intelligent data pipelines. Based in Romania, serving clients internationally.",
        keywords: [
            "AI development",
            "custom AI agents",
            "AI automation",
            "intelligent workflows",
            "machine learning",
            "AI consulting",
            "Romania AI company",
        ],
        canonical: "/services/ai-development",
        heroLabel: "AI Development",
        heroTitle: "Intelligent Systems that",
        heroHighlight: "Scale Your Business.",
        heroDescription:
            "From custom AI agents to full workflow automations, we engineer intelligent systems that handle the repetitive work so your team can focus on strategy and growth.",
        sections: [
            {
                title: "Why Invest in AI Development?",
                content:
                    "Artificial intelligence is no longer a futuristic concept - it's a competitive necessity. Businesses that adopt AI-driven workflows see measurable gains in efficiency, accuracy, and speed-to-market. Whether you need to automate data processing, build conversational agents, or create intelligent decision-support systems, our team delivers production-ready solutions built on proven architectures.",
                bullets: [
                    "Reduce manual workload by up to 80% with intelligent automation",
                    "Make data-driven decisions faster with AI-powered analytics",
                    "Scale operations without proportionally scaling headcount",
                    "Improve customer experience with 24/7 AI-powered interactions",
                ],
            },
            {
                title: "Our AI Development Approach",
                content:
                    "We follow a rigorous, phased approach to AI development. Every project begins with a deep audit of your existing systems, data landscape, and business objectives. From there, we architect a solution that integrates seamlessly with your tech stack - no rip-and-replace required. Our iterative development cycles ensure you see value early and often, with continuous feedback loops built into every sprint.",
            },
            {
                title: "Technologies We Use",
                content:
                    "Our AI engineering team works with the latest frameworks and platforms to deliver robust, scalable solutions tailored to your needs.",
                bullets: [
                    "OpenAI GPT, Claude, and open-source LLMs (Llama, Mistral)",
                    "Laravel, Node.js, and Java for backend orchestration",
                    "n8n for workflow automation and task orchestration",
                    "Databases: MySQL, PostgreSQL, MongoDB",
                    "MCP (Model Context Protocol) server architecture",
                    "Cloud deployment on AWS and Azure",
                ],
            },
            {
                title: "Industries We Serve",
                content:
                    "Our AI solutions span verticals from fintech and healthcare to logistics and e-commerce. We understand the regulatory and performance requirements of each domain and build systems that meet enterprise-grade compliance and reliability standards.",
                bullets: [
                    "Financial services - fraud detection, risk scoring, document processing",
                    "Healthcare - clinical decision support, medical record indexing",
                    "E-commerce - personalization engines, inventory forecasting",
                    "Logistics - route optimization, demand prediction",
                ],
            },
        ],
        childServices: [
            {
                iconName: "Bot",
                label: "Custom AI Agents",
                description: "We engineer autonomous AI agents that reason, act, and learn - handling complex multi-step tasks with minimal human oversight so your team can focus on what matters.",
                href: "/services/ai-development/custom-ai-agents",
            },
            {
                iconName: "N8nIcon",
                label: "AI Powered Automations",
                description: "We build intelligent automation systems powered by n8n and AI that transform manual, error-prone processes into streamlined, self-executing workflows.",
                href: "/services/ai-development/ai-powered-automations",
            },
        ],
        faqs: [
            {
                question: "How long does a typical AI project take?",
                answer: "Most AI projects range from 6 to 16 weeks depending on complexity. A focused automation or agent can be delivered in as little as 4 weeks, while enterprise-scale AI platforms may require 3–6 months of iterative development.",
            },
            {
                question: "Do you work with our existing data infrastructure?",
                answer: "Absolutely. We design every solution to integrate with your current tech stack - whether that's a legacy SQL database, a modern data lake, or third-party APIs. No rip-and-replace required.",
            },
            {
                question: "What's the difference between an AI agent and a simple automation?",
                answer: "An automation follows a predefined set of rules (if X, then Y). An AI agent uses language models and reasoning to make context-aware decisions, handle ambiguous inputs, and adapt to new situations without explicit programming for each case.",
            },
            {
                question: "Do you provide ongoing support after deployment?",
                answer: "Yes. We offer maintenance and support packages that include monitoring, updates, and improvements to ensure your AI solution continues to perform optimally as your business evolves.",
            },
        ],
        relatedServices: [
            { label: "Custom AI Agents", href: "/services/ai-development/custom-ai-agents" },
            { label: "AI Powered Automations", href: "/services/ai-development/ai-powered-automations" },
            { label: "Technical Documentation", href: "/services/technical-documentation" },
        ],
    },

    "ai-development/custom-ai-agents": {
        slug: "custom-ai-agents",
        parentSlug: "ai-development",
        metaTitle: "Custom AI Agents - Autonomous Task Execution",
        metaDescription:
            "We build custom AI agents that autonomously handle complex tasks - from customer support bots to data-processing pipelines. Production-grade, secure, and scalable.",
        keywords: [
            "custom AI agents",
            "autonomous agents",
            "AI chatbot development",
            "LLM agents",
            "AI task automation",
            "intelligent agents",
        ],
        canonical: "/services/ai-development/custom-ai-agents",
        heroLabel: "Custom AI Agents",
        heroTitle: "Autonomous Agents that",
        heroHighlight: "Work for You.",
        heroDescription:
            "We engineer AI agents that reason, act, and learn - handling complex multi-step tasks with minimal human oversight. From customer support to internal operations, your agent works 24/7.",
        sections: [
            {
                title: "What Are Custom AI Agents?",
                content:
                    "AI agents go beyond simple chatbots. They are autonomous systems that can reason about multi-step problems, call external tools and APIs, retrieve relevant context from your knowledge base, and take actions in the real world. Our custom agents are built on top of state-of-the-art language models and are fine-tuned for your specific domain and use cases.",
                highlights: ["AI agents", "autonomous systems", "take actions in the real world"],
                bullets: [
                    "Multi-step reasoning and planning capabilities",
                    "Tool-use and API integration (databases, CRMs, ERPs)",
                    "Human-in-the-loop escalation for edge cases",
                ],
            },
            {
                title: "Use Cases for AI Agents",
                content:
                    "Our clients deploy AI agents across a wide range of business functions. Each agent is purpose-built for the task at hand, with guardrails and monitoring to ensure reliability.",
                bullets: [
                    "Customer support - resolve tickets, answer FAQs, escalate complex issues",
                    "Sales - qualify leads, schedule meetings, draft proposals",
                    "Operations - process invoices, reconcile data, generate reports",
                    "Engineering - code review agents, CI/CD pipeline assistants, documentation bots",
                ],
            },
            {
                title: "How We Build AI Agents",
                content:
                    "Our agent development process is methodical and transparent. We start with a capability audit to understand exactly what your agent needs to do, then design the agent's tool set, memory architecture, and guardrails. Development happens in agile sprints with weekly demos, and we deploy with comprehensive monitoring dashboards so you always know how your agent is performing.",
            },
            {
                title: "Security & Compliance",
                content:
                    "Every agent we build follows security best practices. We implement role-based access controls, audit logging, prompt injection defenses, and data encryption at rest and in transit.",
            },
        ],
        faqs: [
            {
                question: "Can AI agents replace human employees?",
                answer: "AI agents are designed to augment your team, not replace it. They handle repetitive, time-consuming tasks so your people can focus on strategic, creative, and relationship-driven work. Most clients see their agents handling 60–80% of routine queries while humans manage complex escalations.",
            },
            {
                question: "Can AI agents integrate with our existing systems?",
                answer: "Yes. Our agents are designed to integrate seamlessly with your existing tech stack - whether that's CRMs like Salesforce, communication tools like Slack, databases, APIs, or custom internal systems. We build robust integrations that ensure your agent can access the data and tools it needs to perform its tasks effectively.",
            },
            {
                question: "What LLMs do you use for agents?",
                answer: "We work with OpenAI GPT, Anthropic Claude, and open-source models like Llama and Mistral. The choice depends on your requirements for performance, cost, data privacy, and latency.",
            },
            {
                question: "How long does it take to build a custom AI agent?",
                answer: "Development timelines vary based on complexity and scope. A focused single-purpose agent typically takes 3–6 weeks from requirements to deployment, while more sophisticated multi-agent systems with extensive integrations can take 8–16 weeks. We provide a detailed timeline after our initial capability audit.",
            },
        ],
        relatedServices: [
            { label: "AI Development", href: "/services/ai-development" },
            { label: "AI Powered Automations", href: "/services/ai-development/ai-powered-automations" },
            { label: "Software Development", href: "/services/software-development" },
        ],
    },

    "ai-development/ai-powered-automations": {
        slug: "ai-powered-automations",
        parentSlug: "ai-development",
        metaTitle: "AI-Powered Automations - Intelligent Workflow Automation",
        metaDescription:
            "Automate complex business workflows with AI-powered systems. We build intelligent automations that handle data processing, approvals, notifications, and more.",
        keywords: [
            "AI automation",
            "workflow automation",
            "intelligent automation",
            "business process automation",
            "AI workflows",
            "robotic process automation",
        ],
        canonical: "/services/ai-development/ai-powered-automations",
        heroLabel: "AI-Powered Automations",
        heroTitle: "Workflows that",
        heroHighlight: "Run Themselves.",
        heroDescription:
            "We build intelligent automation systems that transform manual, error-prone processes into streamlined, self-executing workflows - saving your team hours every week.",
        sections: [
            {
                title: "What Is AI-Powered Automation?",
                content:
                    "AI-powered automation goes beyond traditional rule-based workflows. By combining large language models with process orchestration, we create systems that can understand unstructured data, make nuanced decisions, and adapt to edge cases that would break conventional automation. The result: workflows that handle the messy, real-world complexity your business faces every day.",
                highlights: ["AI-powered automation", "large language models", "unstructured data"],
                bullets: [
                    "Process unstructured documents (PDFs, emails, images) with AI extraction",
                    "Make context-aware routing and approval decisions",
                    "Handle exceptions intelligently without human intervention",
                    "Continuously improve through feedback loops and analytics",
                ],
            },
            {
                title: "Common Automation Use Cases",
                content:
                    "From back-office operations to customer-facing processes, our automations streamline workflows and eliminate manual work across every department.",
                bullets: [
                    "Invoice processing and accounts payable automation",
                    "Employee onboarding and HR workflow automation",
                    "Contract review and approval routing",
                    "Customer communication and follow-up sequences",
                    "Data migration and synchronization between systems",
                    "Report generation and distribution",
                ],
            },
            {
                title: "Integration With Your Existing Tools",
                content:
                    "Our automations are designed to plug into the tools you already use. Whether it's Slack, Salesforce, HubSpot, Jira, or your custom ERP, we build robust integrations that ensure data flows seamlessly across your entire tech stack. No silos, no manual data entry, no context-switching.",
            },
            {
                title: "Automation Tools & Platforms",
                content:
                    "We leverage powerful automation platforms like n8n to build, deploy, and manage intelligent workflows. n8n gives us the flexibility to create complex automation logic, connect to hundreds of APIs, and build custom integrations tailored to your exact requirements. Combined with AI capabilities, we transform standard workflow automation into intelligent systems that adapt and learn.",
            },
        ],
        faqs: [
            {
                question: "How is AI automation different from tools like Zapier?",
                answer: "Tools like Zapier are great for simple if-then integrations. AI-powered automation handles complex, multi-step workflows that involve unstructured data, judgment calls, and contextual decision-making. Think of it as the difference between a simple email filter and a trained operations assistant.",
            },
            {
                question: "How long does it take to implement an automation?",
                answer: "Implementation timelines depend on the complexity of the workflow and integrations required. Simple automations can be deployed in 2–4 weeks, while more complex multi-system automations typically take 6–10 weeks from requirements to production deployment.",
            },
            {
                question: "Can automations handle edge cases and errors?",
                answer: "Yes. Unlike rigid rule-based systems, our AI-powered automations can reason about exceptions and route them appropriately - either handling them autonomously or escalating to a human reviewer with full context provided.",
            },
            {
                question: "Do you provide ongoing support after deployment?",
                answer: "Absolutely. We offer maintenance and support packages that include monitoring, performance optimization, and iterative improvements based on usage analytics. Your automations get smarter over time.",
            },
        ],
        relatedServices: [
            { label: "AI Development", href: "/services/ai-development" },
            { label: "Custom AI Agents", href: "/services/ai-development/custom-ai-agents" },
            { label: "Enterprise Platforms", href: "/services/software-development/enterprise-platforms" },
        ],
    },

    "software-development": {
        slug: "software-development",
        metaTitle: "Software Development Services - From Idea to Production",
        metaDescription:
            "End-to-end custom software development. We build MVPs, enterprise platforms, and SaaS products using .NET, Laravel, Nuxt, React, and modern full-stack architectures.",
        keywords: [
            "software development",
            "custom software",
            "full-stack development",
            ".NET development",
            "Laravel development",
            "Nuxt development",
            "React development",
            "Romania software company",
        ],
        canonical: "/services/software-development",
        heroLabel: "Software Development",
        heroTitle: "Code that",
        heroHighlight: "Ships & Scales.",
        heroDescription:
            "From MVPs to enterprise-grade platforms, we architect and build custom software that performs under pressure. Our full-stack team delivers production-ready code in agile sprints.",
        sections: [
            {
                title: "End-to-End Software Engineering",
                content:
                    "We handle every phase of the software development lifecycle - from requirements gathering and system design to implementation, testing, deployment, and long-term maintenance. Our engineering team has deep expertise across frontend, backend, and infrastructure, delivering cohesive solutions that meet enterprise performance standards.",
                bullets: [
                    "Architecture design and technical specification",
                    "Frontend development (React, Vue, Nuxt, Next.js)",
                    "Backend development (Laravel, Node.js)",
                    "Database design and optimization (PostgreSQL, MySQL, MongoDB)",
                    "CI/CD pipelines and automated testing",
                    "Cloud infrastructure and DevOps (AWS, Azure)",
                ],
            },
            {
                title: "Our Tech Stack",
                content:
                    "We're opinionated about technology choices because it directly impacts maintainability, performance, and developer velocity. We select the right stack for each project based on your constraints and goals - never a one-size-fits-all approach.",
                bullets: [
                    "Laravel / PHP - rapid prototyping, admin panels, CMS",
                    "Nuxt / Vue - server-rendered frontends, SEO-first applications",
                    "React / Next.js - dynamic SPAs, dashboards, complex UIs",
                    "TypeScript - end-to-end type safety across the stack",
                    "PostgreSQL, Redis, Elasticsearch - data layer excellence",
                ],
            },
            {
                title: "Quality & Testing",
                content:
                    "Quality is not an afterthought. We write comprehensive automated tests, perform code reviews on every pull request, and maintain strict CI/CD pipelines that prevent regressions. Our standard test suite covers unit tests, integration tests, and end-to-end tests with tools like Vitest, Playwright, and xUnit.",
            },
            {
                title: "Beyond Development",
                content:
                    "Rigorous code is our foundation, but successful projects require more. We provide project management to keep timelines on track, n8n-powered automation workflows to streamline operations, content scaling strategies, and web analytics implementation to measure what matters.",
            },
            {
                title: "Post-Launch Support",
                content:
                    "Shipping is just the beginning. We offer ongoing maintenance, performance monitoring, and iterative feature development. Our support packages are designed to keep your application healthy, secure, and evolving with your business needs.",
            },
        ],
        childServices: [
            {
                iconName: "Rocket",
                label: "MVP to Market",
                description: "Go from idea to first users fast. We build lean, functional MVPs designed to validate your business hypothesis and ship in weeks, not months.",
                href: "/services/software-development/mvp-to-market",
            },
            {
                iconName: "Building2",
                label: "Enterprise Platforms",
                description: "Platforms built for scale. We architect enterprise systems that handle millions of transactions and meet strict compliance and availability standards.",
                href: "/services/software-development/enterprise-platforms",
            },
            {
                iconName: "Cloud",
                label: "SaaS Products",
                description: "Launch your SaaS with multi-tenant architecture, subscription billing, and the operational tooling you need to scale from first customer to thousands.",
                href: "/services/software-development/saas-products",
            },
        ],
        faqs: [
            {
                question: "What size projects do you take on?",
                answer: "We work on projects ranging from focused 4-week MVPs to multi-year enterprise platform builds. Our sweet spot is mid-to-large projects where architecture decisions, scalability, and long-term maintainability have real impact on your business success.",
            },
            {
                question: "Do you work with existing codebases?",
                answer: "Yes. Many of our engagements involve taking over, refactoring, or extending existing applications. We start with a thorough code audit to understand technical debt and recommend a pragmatic improvement roadmap.",
            },
            {
                question: "How do you handle project management?",
                answer: "We use agile methodology with 2-week sprints, daily standups, and weekly client demos. You'll have full visibility into progress through our project board, and a dedicated project manager serves as your single point of contact.",
            },
            {
                question: "Can you scale the team up or down as needed?",
                answer: "Absolutely. Our team structure is flexible. We can ramp up additional engineers for time-sensitive milestones and scale down during maintenance phases, ensuring you only pay for the capacity you need.",
            },
        ],
        relatedServices: [
            { label: "MVP to Market", href: "/services/software-development/mvp-to-market" },
            { label: "Enterprise Platforms", href: "/services/software-development/enterprise-platforms" },
            { label: "SaaS Products", href: "/services/software-development/saas-products" },
        ],
    },

    "software-development/mvp-to-market": {
        slug: "mvp-to-market",
        parentSlug: "software-development",
        metaTitle: "MVP Development - Go From Idea to Market Fast",
        metaDescription:
            "Launch your MVP in weeks, not months. We build lean, functional minimum viable products with modern tech stacks, designed to validate your idea and attract early users.",
        keywords: [
            "MVP development",
            "minimum viable product",
            "startup development",
            "product launch",
            "rapid prototyping",
            "lean startup",
        ],
        canonical: "/services/software-development/mvp-to-market",
        heroLabel: "MVP to Market",
        heroTitle: "From Idea to",
        heroHighlight: "First Users - Fast.",
        heroDescription:
            "We build lean, functional MVPs designed to validate your business hypothesis and attract early adopters. Ship in weeks instead of months with our battle-tested development process.",
        sections: [
            {
                title: "What is an MVP?",
                content:
                    "An MVP (Minimum Viable Product) is the first working version of your product - focused enough to build quickly, but real enough for actual users to try. The goal is to validate whether people want what you're building before investing months into the full product. It's not a throwaway demo; it's a shippable product with just enough features to test your core assumption.",
                highlights: ["MVP", "Minimum Viable Product", "first working version"],
                bullets: [
                    "Core feature set built around a single user problem",
                    "Real users, real feedback - before major investment",
                    "Production-ready code that grows into the full product",
                    "Ships in weeks, not months",
                ],
            },
            {
                title: "Why Build an MVP?",
                content:
                    "The biggest risk for any new product isn't technical failure - it's building something nobody wants. An MVP lets you test your core hypothesis with real users before investing months or years in full product development. We help you define the smallest feature set that delivers real value, build it fast, and get it into the hands of early adopters.",
                bullets: [
                    "Validate product-market fit before major investment",
                    "Gather real user feedback to guide your roadmap",
                    "Attract seed funding with a working product demo",
                    "Reduce risk by testing assumptions early",
                ],
            },
            {
                title: "What You Get",
                content:
                    "Your MVP isn't throwaway code. We build on solid foundations so you can scale without rewriting. Every MVP we deliver includes production-grade infrastructure, automated testing, CI/CD, and comprehensive documentation.",
                bullets: [
                    "Production-ready codebase (not a prototype)",
                    "Responsive web application or API",
                    "Authentication and user management",
                    "Admin dashboard",
                    "Analytics and event tracking",
                    "Full source code ownership",
                ],
            },
        ],
        faqs: [
            {
                question: "How long does it take to build an MVP?",
                answer: "Most MVPs take 4–8 weeks from kickoff to launch, depending on complexity. A simple SaaS tool might take 4–5 weeks, while a marketplace or platform with multiple user roles could take 6–8 weeks.",
            },
            {
                question: "What's included in your MVP development process?",
                answer: "Our MVP process includes discovery and requirements gathering, technical architecture design, agile development sprints, comprehensive testing, deployment to production, and post-launch support. You get production-ready code, full documentation, and analytics setup to measure traction from day one.",
            },
            {
                question: "Can the MVP code scale to a full product?",
                answer: "Absolutely. We intentionally build MVPs on the same architectures and tech stacks we use for enterprise projects. The codebase is clean, tested, and designed to scale - not throwaway prototype code.",
            },
            {
                question: "Do you help with product strategy and scope definition?",
                answer: "Yes. Our discovery phase includes product strategy sessions where we help you identify the core value proposition, define user personas, and ruthlessly prioritize features to ship the leanest possible MVP.",
            },
        ],
        relatedServices: [
            { label: "Software Development", href: "/services/software-development" },
            { label: "SaaS Products", href: "/services/software-development/saas-products" },
            { label: "Enterprise Platforms", href: "/services/software-development/enterprise-platforms" },
        ],
    },

    "software-development/enterprise-platforms": {
        slug: "enterprise-platforms",
        parentSlug: "software-development",
        metaTitle: "Enterprise Platform Development - Scalable & Secure",
        metaDescription:
            "We build enterprise-grade platforms that handle millions of transactions, meet compliance standards, and scale with your business. .NET, Laravel, and modern cloud architecture.",
        keywords: [
            "enterprise platform development",
            "enterprise software",
            "scalable platforms",
            "enterprise architecture",
            ".NET enterprise",
            "cloud platforms",
        ],
        canonical: "/services/software-development/enterprise-platforms",
        heroLabel: "Enterprise Platforms",
        heroTitle: "Platforms Built for",
        heroHighlight: "Enterprise Scale.",
        heroDescription:
            "We architect and build enterprise platforms that handle millions of transactions, meet strict compliance requirements, and scale effortlessly with your growth.",
        sections: [
            {
                title: "What is an Enterprise Platform?",
                content:
                    "An enterprise platform is a large-scale software system built to power the core operations of a mid-to-large organisation. It connects departments, handles high volumes of data and transactions, and integrates with existing tools like ERP and CRM - all while meeting strict requirements around security, compliance, and uptime, and supporting hundreds or thousands of users at the same time.",
                highlights: ["enterprise platform", "security, compliance, and uptime", "ERP and CRM"],
                bullets: [
                    "High-volume transaction processing and data management",
                    "Integrations with ERP, CRM, HR, and legacy systems",
                    "Role-based access control and full audit logging",
                    "Built to compliance standards (SOC 2, GDPR, HIPAA)",
                ],
            },
            {
                title: "Enterprise-Grade Engineering",
                content:
                    "Enterprise platforms require a fundamentally different approach than startups or small applications. We bring deep experience in building systems that serve thousands of concurrent users, process mission-critical data, and meet the security, compliance, and availability standards that enterprise clients demand.",
                bullets: [
                    "Microservices and event-driven architectures",
                    "99.9%+ uptime with multi-region deployment",
                    "Horizontal scaling and auto-provisioning",
                    "Role-based access control and audit logging",
                ],
            },
            {
                title: "System Integration",
                content:
                    "Enterprise platforms rarely exist in isolation. We specialize in integrating your new platform with existing CRM, ERP, payroll, billing, and legacy systems through robust API layers and message queues. Our integration work ensures zero data loss and minimal disruption to existing workflows.",
            },
            {
                title: "Performance & Reliability",
                content:
                    "We engineer for performance from day one. Our platforms are load-tested, stress-tested, and chaos-engineered to ensure they perform under the most demanding conditions. We implement comprehensive observability stacks (Prometheus, Grafana, Sentry) so you always know exactly how your system is performing.",
                bullets: [
                    "Sub-200ms API response times at scale",
                    "Automated failover and disaster recovery",
                    "Real-time monitoring and alerting",
                    "Automated scaling based on demand patterns",
                ],
            },
            {
                title: "Migration & Modernization",
                content:
                    "If you're running on legacy technology, we can help you modernize incrementally - no big-bang rewrites. We use the strangler fig pattern to progressively replace legacy components while keeping your business running. It's lower risk, and you see value faster.",
            },
        ],
        faqs: [
            {
                question: "How do you handle legacy system migration?",
                answer: "We use the strangler fig pattern - progressively replacing legacy components with modern equivalents while the old system remains operational. This minimizes risk, avoids downtime, and delivers value incrementally.",
            },
            {
                question: "What compliance standards do you build for?",
                answer: "We have experience building platforms that meet SOC 2 Type II, GDPR, HIPAA, and PCI-DSS requirements. We implement the necessary controls from the architecture phase, not as an afterthought.",
            },
            {
                question: "Can you take over an existing enterprise codebase?",
                answer: "Yes. We regularly inherit and improve existing codebases. Our onboarding process includes a thorough code audit, architecture review, and technical debt assessment so we can hit the ground running.",
            },
            {
                question: "How do you ensure knowledge transfer?",
                answer: "We produce comprehensive technical documentation, API references, architecture decision records (ADRs), and runbooks. We also conduct hands-on training sessions with your internal team during the handover phase.",
            },
        ],
        relatedServices: [
            { label: "Software Development", href: "/services/software-development" },
            { label: "SaaS Products", href: "/services/software-development/saas-products" },
            { label: "AI Development", href: "/services/ai-development" },
        ],
    },

    "software-development/saas-products": {
        slug: "saas-products",
        parentSlug: "software-development",
        metaTitle: "SaaS Product Development - Build & Launch Your SaaS",
        metaDescription:
            "We build SaaS products from scratch - multi-tenant architecture, subscription billing, user management, and everything you need to launch and scale a software-as-a-service business.",
        keywords: [
            "SaaS development",
            "SaaS product",
            "multi-tenant architecture",
            "subscription billing",
            "SaaS platform",
            "cloud SaaS",
        ],
        canonical: "/services/software-development/saas-products",
        heroLabel: "SaaS Products",
        heroTitle: "Launch Your",
        heroHighlight: "SaaS Product.",
        heroDescription:
            "We build production-ready SaaS platforms with multi-tenant architecture, subscription billing, and the operational tooling you need to scale from first customer to thousands.",
        sections: [
            {
                title: "What is a SaaS Product?",
                content:
                    "A SaaS product (Software as a Service) is software delivered over the internet and billed by subscription - no installation required. Users access it from any browser, and the provider manages all infrastructure, updates, and security behind the scenes. It's the dominant model for modern software because it's easy to adopt, easy to scale, and creates predictable recurring revenue.",
                highlights: ["SaaS", "Software as a Service", "no installation required"],
                bullets: [
                    "Multi-tenant architecture with isolated customer data",
                    "Subscription billing with trial periods and plan tiers",
                    "Self-service onboarding and user management",
                    "Accessible from any browser, on any device",
                ],
            },
            {
                title: "SaaS Architecture Done Right",
                content:
                    "Building a SaaS product is fundamentally different from building a one-off application. You need multi-tenancy, subscription management, usage metering, role-based access, and an operational layer for onboarding, billing, and customer support. We've built these systems multiple times and know where the pitfalls are.",
                bullets: [
                    "Multi-tenant architecture with data isolation",
                    "Stripe / Paddle subscription billing integration",
                    "Usage metering and plan-based feature gating",
                    "Organization and team management",
                    "Self-service onboarding flows",
                ],
            },
            {
                title: "Core SaaS Features We Build",
                content:
                    "Every SaaS product shares a common set of infrastructure requirements. We've developed reusable patterns and components that accelerate delivery without compromising customization.",
                bullets: [
                    "Authentication (OAuth, SSO, MFA)",
                    "User management and role-based permissions",
                    "Subscription billing and invoicing",
                    "Admin dashboard and analytics",
                    "API layer for third-party integrations",
                    "Email notifications and lifecycle messaging",
                    "Audit logging and compliance controls",
                ],
            },
            {
                title: "Growth-Ready Infrastructure",
                content:
                    "We deploy SaaS products on cloud-native infrastructure designed to scale with your customer base. Whether you're onboarding your first 10 users or your 10,000th, the platform handles the load without architecture changes or performance degradation.",
            },
            {
                title: "From Launch to Scale",
                content:
                    "Launching is just step one. We offer ongoing development partnerships that include feature development, performance optimization, and infrastructure scaling as your user base grows. Our clients typically engage us for 6–18 months of post-launch iteration and growth engineering.",
            },
        ],
        faqs: [
            {
                question: "How long does it take to build a SaaS product?",
                answer: "A full-featured SaaS MVP typically takes 8–14 weeks. This includes authentication, billing, core features, admin panel, and deployment. More complex products with extensive integrations may take 4–6 months.",
            },
            {
                question: "Do you handle the billing and subscription logic?",
                answer: "Yes. We integrate with Stripe or Paddle to handle subscriptions, invoicing, plan upgrades/downgrades, trial periods, and usage-based billing. The entire billing flow is production-ready at launch.",
            },
            {
                question: "Can you build both B2B and B2C SaaS?",
                answer: "Absolutely. We've built both B2B platforms (with organization management, SSO, and compliance features) and B2C products (with consumer onboarding, freemium tiers, and viral growth mechanics).",
            },
            {
                question: "What about ongoing development after launch?",
                answer: "Most of our SaaS clients engage us for ongoing development beyond the initial launch. We typically structure this as a monthly retainer covering feature development, bug fixes, performance optimization, and infrastructure management.",
            },
        ],
        relatedServices: [
            { label: "Software Development", href: "/services/software-development" },
            { label: "MVP to Market", href: "/services/software-development/mvp-to-market" },
            { label: "Enterprise Platforms", href: "/services/software-development/enterprise-platforms" },
        ],
    },

    /* ──────────────────────────────────────────────────────
     * Presentation Websites (parent)
     * ────────────────────────────────────────────────────── */
    "presentation-websites": {
        slug: "presentation-websites",
        metaTitle: "Presentation Website Design & Development - Stunning Sites That Convert",
        metaDescription:
            "We design and build high-performance presentation websites that make a lasting first impression. Fast, SEO-optimised, and crafted to convert visitors into leads.",
        keywords: [
            "presentation website",
            "business website design",
            "landing page development",
            "brand website",
            "company website",
            "conversion website",
            "web design Romania",
        ],
        canonical: "/services/presentation-websites",
        heroLabel: "Presentation Websites",
        heroTitle: "Websites That Make You",
        heroHighlight: "Stand Out.",
        heroDescription:
            "Your website is your most powerful sales tool. We design and build polished, fast-loading presentation websites that showcase your brand with precision and convert visitors into qualified leads.",
        sections: [
            {
                title: "Why Your Presentation Website Matters",
                content:
                    "In a competitive digital landscape, your website is often the first - and most critical - touchpoint with potential clients. A generic template site signals mediocrity; a custom, strategically designed presentation website signals credibility, expertise, and attention to detail. We build websites that reinforce your brand narrative and guide visitors toward the action you want them to take.",
                bullets: [
                    "First impressions formed in under 50 milliseconds",
                    "Professional design increases trust and conversion rates by 38%",
                    "Mobile-first experience reaching users on every device",
                    "SEO-optimised structure driving organic discovery",
                ],
            },
            {
                title: "Our Design & Development Process",
                content:
                    "We combine strategic thinking with meticulous craftsmanship. Every presentation website we build starts with a brand and audience discovery phase - understanding who you're talking to, what they need to hear, and what action you want them to take. We then craft a visual identity and information architecture that serves those goals before writing a single line of code.",
                bullets: [
                    "Brand discovery and messaging strategy sessions",
                    "Custom wireframes and high-fidelity design mockups",
                    "Pixel-perfect development with smooth animations",
                    "Performance optimisation for Core Web Vitals",
                    "Analytics and conversion tracking setup",
                ],
            },
            {
                title: "Built for Speed, Built to Last",
                content:
                    "Beautiful design means nothing if the site loads slowly or breaks on mobile. Every website we ship is built on modern frameworks (Next.js, Nuxt, or similar), optimised for perfect Core Web Vitals scores, and deployed on edge infrastructure for sub-second load times anywhere in the world.",
                bullets: [
                    "Next.js / Nuxt for blazing-fast performance",
                    "Image optimisation and lazy loading",
                    "Semantic HTML for accessibility and SEO",
                    "SSL, security headers, and best practices baked in",
                    "CMS integration (Prismic, Sanity, or WordPress) for easy updates",
                ],
            },
            {
                title: "SEO & Lead Generation Built In",
                content:
                    "We don't just build beautiful websites - we build websites that rank and convert. Our development process bakes in SEO best practices from the start: structured data markup, semantic heading hierarchy, fast page speeds, and keyword-optimised content architecture. We also integrate contact forms, lead capture flows, and analytics dashboards so you can measure ROI from day one.",
            },
        ],
        childServices: [
            {
                iconName: "Globe",
                label: "Business Showcase Sites",
                description: "We craft bespoke, high-impact business showcase websites that position your brand as the authority in your market - beautifully designed, conversion-optimised, and built to impress.",
                href: "/services/presentation-websites/business-showcase-sites",
            },
        ],
        faqs: [
            {
                question: "How long does it take to build a presentation website?",
                answer: "Most presentation websites are delivered in 3–6 weeks. A focused single-page or brochure site typically takes 2–3 weeks, while a larger multi-page site with custom animations and CMS integration takes 4–6 weeks. We provide a detailed timeline after the initial discovery session.",
            },
            {
                question: "Do you provide copywriting as well?",
                answer: "Yes. We offer content strategy and copywriting as part of our full-service packages. Our team understands how to craft messaging that resonates with your target audience and drives the desired action - enquiry, sign-up, or purchase.",
            },
            {
                question: "Will I be able to update the website myself?",
                answer: "Absolutely. We integrate a user-friendly CMS (Prismic, Sanity, or headless WordPress) so you can update text, images, and pages without touching code. We also provide a handover session and documentation so your team feels confident managing the site.",
            },
            {
                question: "Is SEO included?",
                answer: "Yes. On-page SEO is built into every project as standard: semantic HTML, structured data, optimised meta tags, image alt text, and Core Web Vitals compliance. For ongoing SEO content and link-building, we offer separate retainer packages.",
            },
            {
                question: "What makes your websites different from a template?",
                answer: "Everything. Template sites look like template sites - visitors can tell instantly. Our websites are custom-designed from scratch around your brand, audience, and conversion goals. The result is a site that feels uniquely yours and performs significantly better than any off-the-shelf solution.",
            },
        ],
        relatedServices: [
            { label: "Business Showcase Sites", href: "/services/presentation-websites/business-showcase-sites" },
            { label: "Software Development", href: "/services/software-development" },
            { label: "AI Development", href: "/services/ai-development" },
        ],
    },

    "presentation-websites/business-showcase-sites": {
        slug: "business-showcase-sites",
        parentSlug: "presentation-websites",
        metaTitle: "Business Showcase Sites - Custom Brand Websites That Convert",
        metaDescription:
            "We design and build bespoke business showcase websites that establish authority, communicate your value, and generate qualified leads. Premium design backed by performance engineering.",
        keywords: [
            "business showcase website",
            "brand website design",
            "company website development",
            "corporate website",
            "professional website design",
            "custom business site",
        ],
        canonical: "/services/presentation-websites/business-showcase-sites",
        heroLabel: "Business Showcase Sites",
        heroTitle: "Your Brand, Presented",
        heroHighlight: "Flawlessly.",
        heroDescription:
            "We craft bespoke business showcase websites built to position your brand as the authority in your market - combining premium visual design, sharp messaging, and conversion-focused architecture.",
        sections: [
            {
                title: "What Is a Business Showcase Site?",
                content:
                    "A business showcase site is your brand's digital headquarters - a carefully crafted, multi-page website that communicates who you are, what you do, why clients should choose you, and what it's like to work with you. Unlike a landing page or a blog, a showcase site tells your complete brand story with visual depth, case studies, team profiles, service overviews, and social proof.",
                highlights: ["business showcase site", "digital headquarters", "brand story"],
                bullets: [
                    "Homepage with a compelling hero and value proposition",
                    "Services or product overview pages",
                    "About page with team, story, and values",
                    "Case studies and social proof sections",
                    "Contact and lead capture flows",
                ],
            },
            {
                title: "Our Approach to Brand Presentation",
                content:
                    "We don't just replicate what you describe - we help you think more clearly about your positioning and audience. Our discovery process uncovers the gap between how you currently present yourself and how you should, then closes that gap with design and copy that earns immediate trust from your ideal clients.",
                bullets: [
                    "Brand and positioning strategy workshops",
                    "Audience analysis and messaging hierarchy",
                    "Custom visual identity direction",
                    "Competitor landscape review",
                ],
            },
            {
                title: "Performance & Quality Assurance",
                content:
                    "Every showcase site we ship passes our rigorous quality benchmark: Lighthouse scores of 95+ across performance, accessibility, and SEO; cross-browser and cross-device testing; sub-2-second load times on mobile; and full WCAG 2.1 accessibility compliance. Premium presentation demands premium engineering.",
                bullets: [
                    "Lighthouse performance score 95+",
                    "Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms",
                    "Mobile, tablet, and desktop testing across major browsers",
                    "Accessibility-first semantic HTML and ARIA attributes",
                    "Automated deployment pipeline with staging environment",
                ],
            },
            {
                title: "Post-Launch Support",
                content:
                    "Launch is the beginning, not the end. We offer ongoing maintenance retainers to keep your site updated, secure, and performing optimally as your business evolves. Whether it's adding a new service page, refreshing copy, or integrating a new tool, we're your long-term web partner.",
            },
        ],
        faqs: [
            {
                question: "How involved do I need to be in the design process?",
                answer: "As involved as you want to be. At minimum, we need a brand discovery session at the start and your feedback at two key review milestones (design mockup and staging launch). If you want more input throughout, we welcome it - we tailor our collaboration style to what works best for you.",
            },
            {
                question: "Do you design the logo and brand identity too?",
                answer: "We can assist with brand identity direction, but dedicated logo design and full brand identity systems are a separate engagement. If you already have brand assets, we'll use them with precision. If you need a full brand identity, we'll recommend our trusted design partners.",
            },
            {
                question: "Can you integrate third-party tools like CRM or live chat?",
                answer: "Absolutely. We commonly integrate HubSpot, Intercom, Crisp, Calendly, Mailchimp, and custom webhooks. If the tool has an API or embed code, we can integrate it cleanly without impacting performance.",
            },
            {
                question: "What if I need changes after launch?",
                answer: "We offer flexible post-launch support packages. Minor updates (copy changes, image swaps) are typically handled within 24-48 hours. Feature additions and new pages are scoped and quoted separately. Most clients opt for a monthly retainer for ongoing peace of mind.",
            },
        ],
        relatedServices: [
            { label: "Presentation Websites", href: "/services/presentation-websites" },
            { label: "Software Development", href: "/services/software-development" },
            { label: "Technical Documentation", href: "/services/technical-documentation" },
        ],
    },

    "technical-documentation": {
        slug: "technical-documentation",
        metaTitle: "Technical Documentation Services - Knowledge Systems & AI-Ready Docs",
        metaDescription:
            "Transform your codebase and internal docs into AI-ready knowledge bases. We build documentation systems that make your team's expertise searchable and actionable.",
        keywords: [
            "technical documentation",
            "documentation systems",
            "knowledge base",
            "API documentation",
            "codebase documentation",
            "AI-ready documentation",
            "knowledge indexing",
        ],
        canonical: "/services/technical-documentation",
        heroLabel: "Technical Documentation",
        heroTitle: "Documentation that",
        heroHighlight: "Actually Works.",
        heroDescription:
            "We transform chaotic codebases and scattered internal docs into structured, AI-ready knowledge systems that make your team's expertise searchable, accessible, and actionable.",
        sections: [
            {
                title: "Why Documentation Matters",
                content:
                    "Poor documentation is one of the biggest hidden costs in software organizations. It leads to duplicated effort, longer onboarding times, tribal knowledge silos, and slower development velocity. We build documentation systems that solve these problems systematically - not just writing docs, but creating the infrastructure that keeps them alive and useful.",
                bullets: [
                    "Reduce new developer onboarding time by 50–70%",
                    "Eliminate tribal knowledge silos and single points of failure",
                    "Enable AI-powered search across your entire knowledge base",
                    "Improve code quality through architecture documentation",
                ],
            },
            {
                title: "What We Document",
                content:
                    "We handle the full spectrum of technical documentation, from high-level architecture overviews to detailed API references and operational runbooks.",
                bullets: [
                    "API references (OpenAPI / Swagger, GraphQL schemas)",
                    "Architecture decision records (ADRs)",
                    "System design documents and data flow diagrams",
                    "Developer onboarding guides",
                    "Operational runbooks and incident response playbooks",
                    "User-facing product documentation",
                ],
            },
            {
                title: "AI-Ready Knowledge Bases",
                content:
                    "The next frontier of documentation is making it machine-readable. We structure and index your documentation so it can be consumed by AI coding assistants, internal chatbots, and automated support systems. Your docs become a living, queryable knowledge base - not just static pages gathering dust.",
            },
            {
                title: "Documentation as Code",
                content:
                    "We treat documentation like code - versioned in Git, reviewed in pull requests, tested in CI, and deployed automatically. This ensures docs stay in sync with your codebase and never become stale. We use tools like Docusaurus, MkDocs, Mintlify, and custom static site generators optimized for developer experience.",
            },
        ],
        childServices: [
            {
                iconName: "BookOpen",
                label: "Documentation Systems",
                description: "We design and deploy scalable documentation infrastructure - developer portals, API references, internal wikis, and AI-indexed knowledge bases that grow with your team.",
                href: "/services/technical-documentation/documentation-systems",
            },
        ],
        faqs: [
            {
                question: "Can you document an existing codebase?",
                answer: "Yes. We specialize in reverse-engineering existing codebases to produce comprehensive documentation - from architecture overviews to API references. Our process combines automated code analysis with developer interviews to capture both the 'what' and the 'why'.",
            },
            {
                question: "What tools do you use for documentation?",
                answer: "We use the right tool for each project: Docusaurus for developer portals, MkDocs for internal wikis, Mintlify for API docs, and custom solutions when off-the-shelf doesn't fit. All our setups support docs-as-code workflows with Git versioning.",
            },
            {
                question: "How do you keep documentation from going stale?",
                answer: "We integrate documentation into your CI/CD pipeline with automated checks that flag when code and docs drift apart. We also set up style guides, templates, and review processes that make it easy for your team to maintain docs going forward.",
            },
            {
                question: "What is AI-ready documentation?",
                answer: "AI-ready documentation is structured, semantically tagged, and indexed in a way that makes it consumable by AI systems - such as coding assistants, RAG pipelines, and internal chatbots. We optimize your docs for both human readability and machine consumption.",
            },
        ],
        relatedServices: [
            { label: "Documentation Systems", href: "/services/technical-documentation/documentation-systems" },
            { label: "AI Development", href: "/services/ai-development" },
            { label: "Software Development", href: "/services/software-development" },
        ],
    },

    "technical-documentation/documentation-systems": {
        slug: "documentation-systems",
        parentSlug: "technical-documentation",
        metaTitle: "Documentation Systems - Scalable Knowledge Infrastructure",
        metaDescription:
            "We build and deploy scalable documentation systems - developer portals, API references, internal wikis, and AI-indexed knowledge bases. Docs that evolve with your product.",
        keywords: [
            "documentation systems",
            "developer portal",
            "API documentation platform",
            "internal wiki",
            "knowledge management",
            "docs-as-code",
        ],
        canonical: "/services/technical-documentation/documentation-systems",
        heroLabel: "Documentation Systems",
        heroTitle: "Knowledge Infrastructure that",
        heroHighlight: "Scales With You.",
        heroDescription:
            "We design and deploy documentation systems that serve as the single source of truth for your organization - developer portals, API references, internal wikis, and AI-indexed knowledge bases.",
        sections: [
            {
                title: "What Are Documentation Systems?",
                content:
                    "A documentation system is more than a collection of markdown files. It's the infrastructure - the tooling, workflows, search, navigation, and deployment pipeline - that makes documentation discoverable, maintainable, and useful at scale. We build systems that grow with your team and product complexity.",
                highlights: ["documentation system", "discoverable, maintainable", "grow with your team"],
                bullets: [
                    "Custom-designed developer portals and documentation sites",
                    "Full-text search with AI-powered semantic search",
                    "Role-based access for internal vs. public docs",
                    "Automated deployment from Git repositories",
                    "Version-controlled documentation with changelog tracking",
                ],
            },
            {
                title: "Developer Portals",
                content:
                    "For companies with public APIs, SDKs, or developer ecosystems, a polished developer portal is essential. We build portals that include interactive API playgrounds, code samples in multiple languages, authentication guides, and comprehensive reference documentation that developers actually enjoy using.",
            },
            {
                title: "Internal Knowledge Bases",
                content:
                    "Your team's collective knowledge is one of your most valuable assets. We build internal knowledge bases that capture architecture decisions, operational procedures, tribal knowledge, and institutional context. With AI-powered search, any team member can find answers in seconds instead of interrupting a colleague.",
                bullets: [
                    "Architecture decision records (ADRs) with search",
                    "Operational runbooks and incident response guides",
                    "Onboarding paths for new engineers",
                    "Cross-team knowledge sharing and discovery",
                ],
            },
            {
                title: "AI Indexing & Semantic Search",
                content:
                    "We embed your documentation into vector databases that power AI-driven search and retrieval. This enables your team (and your AI tools) to find precise answers across thousands of pages of documentation using natural language queries - no more keyword-guessing or scrolling through outdated wikis.",
            },
        ],
        faqs: [
            {
                question: "What platforms do you build documentation systems on?",
                answer: "We build custom documentation solutions using our own automated workflow powered by MCP tools and Claude Code. This approach gives us full control over content generation, structure, and integration with your codebase, delivering documentation that stays in sync with your actual implementation.",
            },
            {
                question: "Can you migrate our existing documentation?",
                answer: "Yes. We handle migrations from Confluence, Notion, Google Docs, GitHub wikis, and custom systems. We restructure content during migration to improve navigation, eliminate duplication, and optimize for searchability.",
            },
            {
                question: "How does AI-powered search work?",
                answer: "We embed your documentation content into a vector database using AI models. When a user searches, their query is matched against these embeddings to find semantically relevant content - even if the exact keywords don't match. This is far more powerful than traditional keyword search.",
            },
            {
                question: "Can the documentation system integrate with our codebase?",
                answer: "Absolutely. We set up CI pipelines that automatically extract API schemas, type definitions, and code examples from your repository and inject them into the documentation site. When your code changes, your docs update automatically.",
            },
        ],
        relatedServices: [
            { label: "Technical Documentation", href: "/services/technical-documentation" },
            { label: "AI Development", href: "/services/ai-development" },
            { label: "Custom AI Agents", href: "/services/ai-development/custom-ai-agents" },
        ],
    },
};

/** Ordered array of all service page slugs for sitemap / programmatic use. */
export const SERVICE_PAGE_SLUGS = Object.keys(SERVICE_PAGES);
