import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';

const terms = [
  // Required 20
  {
    term: 'VPC',
    full: 'Virtual Private Cloud',
    definition:
      "A logically isolated section of a cloud network that you control. Think of it as your own private room inside a giant shared building — other tenants can't see in, even though you're all under the same roof.",
    tags: ['networking'],
  },
  {
    term: 'CDN',
    full: 'Content Delivery Network',
    definition:
      "A worldwide network of servers that stores copies of your website's files close to your users. When someone in Tokyo visits your site hosted in New York, the CDN serves files from a nearby server instead, making the page load much faster.",
    tags: ['networking', 'performance'],
  },
  {
    term: 'Serverless',
    full: 'Serverless Computing',
    definition:
      'A model where you run code without managing any servers. You upload a function, and the cloud runs it only when needed — you pay only for the milliseconds it actually executes. AWS Lambda and Vercel Edge Functions are examples.',
    tags: ['compute', 'architecture'],
  },
  {
    term: 'IaaS',
    full: 'Infrastructure as a Service',
    definition:
      "Cloud services that provide raw computing infrastructure — virtual machines, storage, and networking — that you manage yourself. You're renting the hardware; you handle the operating system and everything above it. AWS EC2 and Google Compute Engine are IaaS.",
    tags: ['service model'],
  },
  {
    term: 'PaaS',
    full: 'Platform as a Service',
    definition:
      'A cloud layer that provides a ready-to-use environment for building and deploying applications. You focus on your code; the platform manages the OS, runtime, and infrastructure. Heroku and Google App Engine are PaaS.',
    tags: ['service model'],
  },
  {
    term: 'SaaS',
    full: 'Software as a Service',
    definition:
      "Fully finished software delivered over the internet on a subscription basis. You don't manage anything — just use the product. Gmail, Slack, and Figma are SaaS applications.",
    tags: ['service model'],
  },
  {
    term: 'Containers',
    full: 'Container Technology',
    definition:
      'A lightweight way to package an application with everything it needs to run (code, libraries, config) into a single portable unit. Unlike VMs, containers share the host OS and start in seconds. Docker is the most popular container tool.',
    tags: ['compute', 'devops'],
  },
  {
    term: 'Kubernetes',
    full: 'Kubernetes (K8s)',
    definition:
      "An open-source system for automating the deployment, scaling, and management of containerised applications. Think of it as a conductor for an orchestra of containers — it decides where each one runs, restarts failed ones, and scales up when traffic spikes.",
    tags: ['compute', 'devops'],
  },
  {
    term: 'Load Balancer',
    full: 'Load Balancer',
    definition:
      "A component that distributes incoming network traffic across multiple servers so no single server becomes overwhelmed. Like a host at a restaurant directing customers to available tables instead of everyone crowding one.",
    tags: ['networking', 'performance'],
  },
  {
    term: 'Auto-scaling',
    full: 'Auto-scaling',
    definition:
      'The ability of a cloud system to automatically add or remove compute resources based on current demand. When traffic spikes, more servers spin up; when it drops, they shut down. You pay for what you use.',
    tags: ['compute', 'performance'],
  },
  {
    term: 'Region',
    full: 'Cloud Region',
    definition:
      'A geographic area where a cloud provider has data centers. AWS has regions like "us-east-1" (Virginia) and "eu-west-1" (Ireland). Deploying closer to your users reduces latency.',
    tags: ['infrastructure'],
  },
  {
    term: 'Availability Zone',
    full: 'Availability Zone (AZ)',
    definition:
      'One or more discrete data centers within a region, each with independent power, cooling, and networking. Spreading your application across multiple AZs protects against a single data center failure.',
    tags: ['infrastructure', 'reliability'],
  },
  {
    term: 'Object Storage',
    full: 'Object Storage',
    definition:
      'A storage architecture that manages data as objects (files + metadata + a unique ID) rather than a file hierarchy. Ideal for large volumes of unstructured data like images, videos, and backups. AWS S3 and Google Cloud Storage are examples.',
    tags: ['storage'],
  },
  {
    term: 'Managed Database',
    full: 'Managed Database Service',
    definition:
      'A database where the cloud provider handles backups, patching, scaling, and failover automatically. You just connect and query — no DBA required. Examples: AWS RDS, Google Cloud SQL, DigitalOcean Managed PostgreSQL.',
    tags: ['storage', 'databases'],
  },
  {
    term: 'Edge Network',
    full: 'Edge Network',
    definition:
      'A distributed network of servers positioned as close as possible to end users — at the "edge" of the internet. Edge networks reduce latency by processing requests near users instead of routing them to a central data center.',
    tags: ['networking', 'performance'],
  },
  {
    term: 'CI/CD',
    full: 'Continuous Integration / Continuous Delivery',
    definition:
      "A development practice where code changes are automatically tested (CI) and deployed to production (CD) without manual steps. It's the pipeline that takes code from a developer's laptop to users' browsers safely and quickly.",
    tags: ['devops'],
  },
  {
    term: 'API Gateway',
    full: 'API Gateway',
    definition:
      'A service that acts as a front door for your APIs — routing requests to the right backend service, handling authentication, rate limiting, and monitoring in one place. AWS API Gateway and Kong are popular examples.',
    tags: ['networking', 'architecture'],
  },
  {
    term: 'Monolith',
    full: 'Monolithic Architecture',
    definition:
      'An application built as a single unified unit — one codebase, one deployment, all features together. Simpler to start with but harder to scale and update as the application grows.',
    tags: ['architecture'],
  },
  {
    term: 'Microservices',
    full: 'Microservices Architecture',
    definition:
      'An architecture where an application is split into many small, independent services that communicate over APIs. Each service does one thing well and can be deployed and scaled independently. More complex but highly flexible.',
    tags: ['architecture'],
  },
  {
    term: 'Firewall',
    full: 'Cloud Firewall',
    definition:
      'A security layer that controls which network traffic is allowed in or out of your cloud resources. You define rules like "allow HTTPS from anywhere" or "block all traffic except from my office IP".',
    tags: ['security', 'networking'],
  },
  // Additional 22
  {
    term: 'DNS',
    full: 'Domain Name System',
    definition:
      "The internet's phone book — it translates human-readable domain names (like example.com) into IP addresses that computers use to communicate. Without DNS, you'd need to memorize IP addresses to visit websites.",
    tags: ['networking'],
  },
  {
    term: 'SSL/TLS',
    full: 'Secure Sockets Layer / Transport Layer Security',
    definition:
      'Protocols that encrypt data in transit between a browser and a server. When you see "https://" and a padlock in your browser, TLS is protecting the connection. Most cloud providers offer free TLS certificates.',
    tags: ['security'],
  },
  {
    term: 'VM',
    full: 'Virtual Machine',
    definition:
      'A software-based emulation of a physical computer. Cloud providers run many VMs on one physical server using a hypervisor. You get your own isolated OS and compute resources without owning physical hardware.',
    tags: ['compute'],
  },
  {
    term: 'SLA',
    full: 'Service Level Agreement',
    definition:
      'A formal commitment from a cloud provider about uptime, performance, and support. An SLA of "99.9% uptime" means the service can be down at most ~8.7 hours per year. If the provider misses it, you typically get billing credits.',
    tags: ['reliability'],
  },
  {
    term: 'Latency',
    full: 'Network Latency',
    definition:
      'The time delay between when a request is sent and when a response is received — measured in milliseconds. Low latency means fast responses. Deploying closer to your users is the simplest way to reduce latency.',
    tags: ['performance', 'networking'],
  },
  {
    term: 'Bandwidth',
    full: 'Bandwidth',
    definition:
      'The maximum amount of data that can be transferred over a network connection in a given time. Cloud providers often charge for "egress bandwidth" — data leaving their network to the internet.',
    tags: ['networking'],
  },
  {
    term: 'DevOps',
    full: 'Development and Operations',
    definition:
      'A culture and set of practices that unifies software development (Dev) and IT operations (Ops) to shorten the development cycle and deliver features faster and more reliably.',
    tags: ['devops'],
  },
  {
    term: 'IaC',
    full: 'Infrastructure as Code',
    definition:
      'Managing and provisioning cloud infrastructure using configuration files instead of manual processes. Tools like Terraform and AWS CloudFormation let you define your entire infrastructure in code, version it, and reproduce it reliably.',
    tags: ['devops'],
  },
  {
    term: 'Blob Storage',
    full: 'Blob Storage',
    definition:
      "Microsoft Azure's name for object storage — a service for storing large unstructured files like images, videos, and logs. \"Blob\" stands for Binary Large Object.",
    tags: ['storage'],
  },
  {
    term: 'Cluster',
    full: 'Cluster',
    definition:
      'A group of servers (nodes) that work together as a single system. Kubernetes clusters manage groups of machines running containerised applications. Database clusters provide redundancy and high availability.',
    tags: ['compute', 'infrastructure'],
  },
  {
    term: 'Elastic',
    full: 'Elastic Scaling',
    definition:
      'The ability to dynamically scale resources up or down based on demand. An elastic system adds capacity when load increases and releases it when load drops — crucial for handling unpredictable traffic without over-provisioning.',
    tags: ['compute', 'performance'],
  },
  {
    term: 'High Availability',
    full: 'High Availability (HA)',
    definition:
      'A system design approach that ensures an application remains operational with minimal downtime, typically by eliminating single points of failure. Achieved through redundancy, failover, and multi-zone deployments.',
    tags: ['reliability', 'infrastructure'],
  },
  {
    term: 'Disaster Recovery',
    full: 'Disaster Recovery (DR)',
    definition:
      'A plan and set of procedures to recover infrastructure and data after a catastrophic failure, cyberattack, or natural disaster. Includes backup strategies, Recovery Time Objective (RTO), and Recovery Point Objective (RPO).',
    tags: ['reliability'],
  },
  {
    term: 'Replication',
    full: 'Data Replication',
    definition:
      "Copying data continuously to one or more secondary locations so it's available if the primary fails. Database read replicas also serve this purpose for performance — offloading reads from the primary.",
    tags: ['storage', 'reliability'],
  },
  {
    term: 'Reverse Proxy',
    full: 'Reverse Proxy',
    definition:
      'A server that sits in front of your application servers and forwards client requests to them. Nginx and Cloudflare act as reverse proxies, providing benefits like SSL termination, caching, and DDoS protection.',
    tags: ['networking', 'security'],
  },
  {
    term: 'Rate Limiting',
    full: 'Rate Limiting',
    definition:
      'Restricting how many requests a client can make to an API within a time window. Protects your backend from being overwhelmed by excessive or abusive traffic and is a standard feature of API gateways.',
    tags: ['security', 'networking'],
  },
  {
    term: 'Hybrid Cloud',
    full: 'Hybrid Cloud',
    definition:
      'An environment that combines private on-premises infrastructure with public cloud services, allowing data and applications to move between them. Enterprises use it to keep sensitive data on-premises while bursting into the cloud for scale.',
    tags: ['infrastructure'],
  },
  {
    term: 'Multi-tenancy',
    full: 'Multi-tenancy',
    definition:
      'An architecture where a single instance of software serves multiple customers ("tenants"), with each tenant\'s data isolated from others. SaaS products are almost always multi-tenant — one codebase, many customers.',
    tags: ['architecture'],
  },
  {
    term: 'Orchestration',
    full: 'Container Orchestration',
    definition:
      'Automated management of containerised applications across a cluster of machines — handling deployment, networking, scaling, and recovery. Kubernetes is the de-facto standard orchestration tool.',
    tags: ['compute', 'devops'],
  },
  {
    term: 'Stateless',
    full: 'Stateless Architecture',
    definition:
      "A design where each request from a client contains all the information needed to process it — no session state is stored on the server. Stateless services are easy to scale horizontally because any instance can handle any request.",
    tags: ['architecture'],
  },
  {
    term: 'Fault Tolerance',
    full: 'Fault Tolerance',
    definition:
      "The ability of a system to continue operating correctly even when some of its components fail. Built through redundancy — multiple servers, databases, and network paths — so there's no single failure point.",
    tags: ['reliability'],
  },
  {
    term: 'Egress',
    full: 'Egress Traffic',
    definition:
      "Data that flows out of a cloud provider's network to the internet or another network. Most cloud providers charge for egress traffic but offer free or cheap ingress (incoming) traffic. Egress costs are a common billing surprise.",
    tags: ['networking'],
  },

  // ── Foundations / What is the cloud ─────────────────────────────────────
  {
    term: 'Cloud Computing',
    full: 'Cloud Computing',
    definition:
      "Renting computing resources — servers, storage, databases, and software — over the internet instead of owning physical hardware. You pay for what you use, scale up or down instantly, and let the provider handle maintenance. 'The cloud' is simply someone else's computer, made available to you over the internet.",
    tags: ['basics'],
  },
  {
    term: 'On-Premises',
    full: 'On-Premises (On-Prem)',
    definition:
      "Infrastructure — servers, networking gear, storage — that a company owns, operates, and physically houses in its own building or data center. The opposite of cloud computing. On-prem gives you full control but requires capital investment, space, and an IT team to manage it.",
    tags: ['basics', 'infrastructure'],
  },
  {
    term: 'Data Center',
    full: 'Data Center',
    definition:
      'A large facility housing thousands of servers, networking equipment, and storage systems. Cloud providers own and operate massive data centers worldwide. When you deploy to "the cloud," your application runs on servers inside one of these buildings.',
    tags: ['basics', 'infrastructure'],
  },
  {
    term: 'Server',
    full: 'Server',
    definition:
      'A powerful computer that provides resources or services to other computers (clients) over a network. Servers run applications, store data, and respond to requests 24/7. In the cloud, you rent virtual servers rather than buying physical ones.',
    tags: ['basics', 'compute'],
  },
  {
    term: 'Hosting',
    full: 'Web Hosting',
    definition:
      'Renting server space so your website or application is accessible on the internet. Traditional hosting gives you a fixed amount of space on a shared server. Cloud hosting is more flexible — you get dedicated resources that scale on demand.',
    tags: ['basics'],
  },
  {
    term: 'Domain Name',
    full: 'Domain Name',
    definition:
      "The human-readable address of a website — like google.com or myapp.io. You buy a domain from a registrar (GoDaddy, Namecheap) and point it to your server's IP address using DNS records. Without a domain, users would need to type an IP address to reach your site.",
    tags: ['basics', 'networking'],
  },
  {
    term: 'IP Address',
    full: 'Internet Protocol Address',
    definition:
      "A unique numerical label (e.g., 192.168.1.1 or 2001:db8::1) assigned to every device on a network. Like a postal address for computers. IPv4 has ~4 billion addresses (running out); IPv6 has effectively unlimited. Cloud servers have public IPs so the internet can reach them.",
    tags: ['basics', 'networking'],
  },
  {
    term: 'Client',
    full: 'Client (Client-Server Model)',
    definition:
      "Any device or software that sends requests to a server. Your browser is a client — it requests web pages from servers. In cloud architecture, 'client' can also refer to a mobile app, a desktop app, or another service that calls an API.",
    tags: ['basics', 'architecture'],
  },

  // ── Compute ──────────────────────────────────────────────────────────────
  {
    term: 'vCPU',
    full: 'Virtual CPU',
    definition:
      'A virtual central processing unit assigned to a virtual machine. One vCPU typically corresponds to one thread on a physical CPU core. When a cloud provider says a VM has "4 vCPUs," it means your VM can run 4 threads of computation simultaneously.',
    tags: ['compute'],
  },
  {
    term: 'Spot Instance',
    full: 'Spot / Preemptible Instance',
    definition:
      "Unused cloud capacity sold at steep discounts (up to 90% cheaper than on-demand prices). The catch: the provider can reclaim the instance with little warning when demand increases. Great for batch processing, rendering, or fault-tolerant workloads — not for databases or user-facing services.",
    tags: ['compute', 'cost'],
  },
  {
    term: 'Reserved Instance',
    full: 'Reserved Instance / Committed Use',
    definition:
      'Pre-committing to use a specific amount of compute for 1 or 3 years in exchange for significant discounts (up to 75% vs. on-demand). Good for stable, predictable workloads. If your usage changes, you may be locked into paying for capacity you no longer need.',
    tags: ['compute', 'cost'],
  },
  {
    term: 'Bare Metal',
    full: 'Bare Metal Server',
    definition:
      "A physical server dedicated entirely to a single customer, with no virtualization layer. You get the full raw hardware performance with no sharing. Used for high-performance computing, databases, or workloads that can't tolerate the overhead of a hypervisor.",
    tags: ['compute'],
  },
  {
    term: 'GPU Instance',
    full: 'GPU Instance',
    definition:
      'A virtual machine equipped with one or more graphics processing units (GPUs). GPUs are massively parallel processors, originally built for graphics but now essential for training AI/ML models, scientific simulations, and video transcoding.',
    tags: ['compute'],
  },
  {
    term: 'Cold Start',
    full: 'Cold Start',
    definition:
      'The delay that occurs when a serverless function or a free-tier service starts up after a period of inactivity. The platform needs to allocate resources and initialize the runtime before the first request can be handled. This can add hundreds of milliseconds of latency.',
    tags: ['compute', 'performance'],
  },
  {
    term: 'Hypervisor',
    full: 'Hypervisor',
    definition:
      'Software that creates and manages virtual machines by abstracting physical hardware. It allows multiple VMs to share the same physical server while staying isolated from each other. AWS uses Nitro; VMware ESXi and KVM are common hypervisors.',
    tags: ['compute', 'infrastructure'],
  },

  // ── Storage ───────────────────────────────────────────────────────────────
  {
    term: 'Block Storage',
    full: 'Block Storage',
    definition:
      'Low-level, high-performance storage that works like a virtual hard drive attached to your server. Data is stored in fixed-size blocks with no metadata. Ideal for databases and operating systems. AWS EBS and Google Persistent Disk are block storage products.',
    tags: ['storage'],
  },
  {
    term: 'File Storage',
    full: 'File Storage / NFS',
    definition:
      "A shared file system accessible by multiple servers simultaneously over a network, just like a shared folder on a company's network drive. Useful when multiple servers need to read and write the same files. AWS EFS and Azure Files are examples.",
    tags: ['storage'],
  },
  {
    term: 'Snapshot',
    full: 'Snapshot',
    definition:
      'A point-in-time copy of a disk or database volume. Snapshots are used for backups and disaster recovery — if something breaks, you can restore to a previous snapshot. Most cloud providers take snapshots incrementally (only changed data is stored).',
    tags: ['storage', 'reliability'],
  },
  {
    term: 'Archive Storage',
    full: 'Archive / Cold Storage',
    definition:
      'Extremely cheap storage for data that is rarely or never accessed — old logs, regulatory records, long-term backups. Retrieval can take minutes or hours. AWS Glacier and Azure Archive are examples. Costs can be 95% cheaper than standard object storage.',
    tags: ['storage', 'cost'],
  },
  {
    term: 'Data Lifecycle',
    full: 'Data Lifecycle Policy',
    definition:
      'Automated rules that move data between storage tiers as it ages. For example: "keep files in fast storage for 30 days, then move to archive storage." This optimizes cost without manual intervention.',
    tags: ['storage', 'cost'],
  },

  // ── Databases ─────────────────────────────────────────────────────────────
  {
    term: 'SQL',
    full: 'Structured Query Language',
    definition:
      "The standard language for querying and manipulating relational databases. You use SQL to select, insert, update, and delete data. \"SELECT * FROM users WHERE age > 18\" is a SQL query. Almost every relational database (PostgreSQL, MySQL, SQLite) uses SQL.",
    tags: ['databases'],
  },
  {
    term: 'NoSQL',
    full: 'NoSQL Database',
    definition:
      "Databases that store data in formats other than traditional tables — documents (JSON), key-value pairs, graphs, or wide columns. Designed for flexibility, horizontal scaling, and large volumes of unstructured data. MongoDB, Redis, and DynamoDB are NoSQL databases.",
    tags: ['databases'],
  },
  {
    term: 'PostgreSQL',
    full: 'PostgreSQL',
    definition:
      "The world's most advanced open-source relational database. Known for its reliability, rich feature set (JSON support, full-text search, complex queries), and ACID compliance. The default choice for most new web applications. Available as a managed service on every major cloud.",
    tags: ['databases'],
  },
  {
    term: 'MySQL',
    full: 'MySQL',
    definition:
      "One of the world's most widely used open-source relational databases. Known for speed and simplicity. Powers many websites including WordPress, Wikipedia, and countless web apps. Often used with PHP in the classic LAMP stack (Linux, Apache, MySQL, PHP).",
    tags: ['databases'],
  },
  {
    term: 'Redis',
    full: 'Redis',
    definition:
      "An in-memory data store used as a cache, session store, or message broker. Reads and writes are extremely fast because data lives in RAM. Often used to cache database query results so the same expensive query doesn't hit the database every time.",
    tags: ['databases', 'performance'],
  },
  {
    term: 'Cache',
    full: 'Caching',
    definition:
      "Storing the result of an expensive operation (database query, API call, computation) in fast temporary storage so future requests get the answer instantly without repeating the work. Redis and Memcached are popular caching tools. 'Cache hit' = found in cache; 'cache miss' = had to compute fresh.",
    tags: ['databases', 'performance'],
  },
  {
    term: 'ACID',
    full: 'ACID Transactions',
    definition:
      "A set of properties guaranteeing database transactions are processed reliably: Atomicity (all or nothing), Consistency (data stays valid), Isolation (transactions don't interfere with each other), Durability (committed data survives crashes). Critical for financial systems and anything where data integrity matters.",
    tags: ['databases', 'reliability'],
  },
  {
    term: 'Connection Pooling',
    full: 'Database Connection Pooling',
    definition:
      'Reusing a set of pre-established database connections rather than opening a new one for every request. Opening a database connection is expensive. A connection pool maintains a queue of ready connections, dramatically improving performance under load.',
    tags: ['databases', 'performance'],
  },
  {
    term: 'Migration',
    full: 'Database Migration',
    definition:
      "A versioned script that modifies a database's structure (schema) in a controlled, repeatable way. Migrations let teams track changes to the database alongside application code in version control. Example: \"add email column to users table.\"",
    tags: ['databases', 'devops'],
  },
  {
    term: 'ORM',
    full: 'Object-Relational Mapper',
    definition:
      "A library that lets you interact with a database using your programming language's objects instead of writing raw SQL. Prisma, Sequelize, and SQLAlchemy are ORMs. They generate SQL for you and map database rows to objects in your code.",
    tags: ['databases'],
  },

  // ── Networking ────────────────────────────────────────────────────────────
  {
    term: 'Subnet',
    full: 'Subnet (Subnetwork)',
    definition:
      "A subdivision of a larger IP network. In cloud VPCs, you create subnets to organize resources. 'Public subnets' have internet access; 'private subnets' do not. Databases typically live in private subnets — they don't need to be directly reachable from the internet.",
    tags: ['networking'],
  },
  {
    term: 'NAT Gateway',
    full: 'NAT Gateway',
    definition:
      'Network Address Translation Gateway — allows resources in a private subnet to initiate outbound connections to the internet (e.g., to download packages) without being directly exposed to incoming internet traffic. A one-way internet door for your private resources.',
    tags: ['networking', 'security'],
  },
  {
    term: 'Port',
    full: 'Network Port',
    definition:
      "A logical endpoint for network communication. Different services listen on different ports: HTTP = 80, HTTPS = 443, SSH = 22, PostgreSQL = 5432. Firewalls control which ports are open. When you see 'localhost:3000,' the 3000 is the port your dev server runs on.",
    tags: ['networking'],
  },
  {
    term: 'DNS Record',
    full: 'DNS Record',
    definition:
      "An entry in a DNS zone file that maps a domain name to something useful. Common types: A record (maps domain to IP address), CNAME (maps domain to another domain), MX (email server), TXT (verification strings). You configure these when setting up a custom domain.",
    tags: ['networking'],
  },
  {
    term: 'HTTPS',
    full: 'Hypertext Transfer Protocol Secure',
    definition:
      "HTTP encrypted with TLS. The 's' means data between your browser and the server is encrypted so no one can eavesdrop. Required for any site handling logins, payments, or personal data. Modern browsers show warnings for HTTP-only sites. Most cloud platforms provision TLS certificates automatically.",
    tags: ['networking', 'security'],
  },
  {
    term: 'WebSocket',
    full: 'WebSocket',
    definition:
      "A protocol that enables real-time, two-way communication between a browser and server over a persistent connection. Unlike HTTP (request → response), a WebSocket stays open so the server can push data to the client instantly — perfect for chat apps, live dashboards, and multiplayer games.",
    tags: ['networking', 'architecture'],
  },
  {
    term: 'TCP/IP',
    full: 'Transmission Control Protocol / Internet Protocol',
    definition:
      "The foundational communication protocol of the internet. IP handles addressing (where to send data); TCP ensures reliable delivery (data arrives in order, nothing is lost). Almost all internet communication uses TCP/IP underneath.",
    tags: ['networking'],
  },

  // ── Security ──────────────────────────────────────────────────────────────
  {
    term: 'IAM',
    full: 'Identity and Access Management',
    definition:
      "A framework for controlling who (users, services, APIs) can do what with your cloud resources. In AWS IAM, you create roles and policies: 'this Lambda function can read from S3 but cannot write.' Proper IAM is the foundation of cloud security — follow the principle of least privilege.",
    tags: ['security'],
  },
  {
    term: 'Zero Trust',
    full: 'Zero Trust Security',
    definition:
      "A security model built on 'never trust, always verify.' Every user, device, and service must authenticate and be authorized before accessing any resource — even if they're inside the corporate network. The opposite of the old castle-and-moat approach where everything inside the perimeter was trusted.",
    tags: ['security'],
  },
  {
    term: 'OAuth 2.0',
    full: 'OAuth 2.0',
    definition:
      "An authorization framework that lets users grant third-party apps limited access to their accounts without sharing their password. 'Sign in with Google' uses OAuth — you authorize Google to share your name and email without giving the app your Google password.",
    tags: ['security'],
  },
  {
    term: 'JWT',
    full: 'JSON Web Token',
    definition:
      "A compact, self-contained token that securely transmits information between parties as a JSON object. Commonly used for authentication: after logging in, the server gives you a JWT; you include it in future requests to prove your identity. JWTs are signed but not encrypted — don't put sensitive data in them.",
    tags: ['security'],
  },
  {
    term: 'MFA',
    full: 'Multi-Factor Authentication',
    definition:
      "A security mechanism requiring users to prove their identity using two or more factors: something you know (password), something you have (phone/authenticator app), or something you are (fingerprint). Even if a password is stolen, an attacker can't log in without the second factor.",
    tags: ['security'],
  },
  {
    term: 'Encryption at Rest',
    full: 'Encryption at Rest',
    definition:
      "Data encrypted while stored on disk, so even if someone physically steals a hard drive, the data is unreadable without the decryption key. Most cloud providers encrypt storage by default today. Important for compliance (GDPR, HIPAA).",
    tags: ['security'],
  },
  {
    term: 'Secrets Manager',
    full: 'Secrets Manager',
    definition:
      "A secure service for storing sensitive configuration — API keys, database passwords, OAuth credentials — outside your application code. Instead of hardcoding 'DB_PASSWORD=abc123' in your code (a serious security risk), your app fetches the secret at runtime from a secrets manager like AWS Secrets Manager or HashiCorp Vault.",
    tags: ['security', 'devops'],
  },
  {
    term: 'WAF',
    full: 'Web Application Firewall',
    definition:
      "A layer of security that filters HTTP/HTTPS traffic to your application, blocking common attacks like SQL injection, cross-site scripting (XSS), and malicious bots. Sits in front of your web server or CDN. AWS WAF and Cloudflare WAF are popular options.",
    tags: ['security', 'networking'],
  },
  {
    term: 'CORS',
    full: 'Cross-Origin Resource Sharing',
    definition:
      "A browser security mechanism that controls which domains can make API requests to your server. If your frontend at app.com tries to call an API at api.differentdomain.com, the browser checks CORS headers. Developers often encounter this as a frustrating 'CORS error' when building web apps.",
    tags: ['security', 'networking'],
  },

  // ── Monitoring / Observability ────────────────────────────────────────────
  {
    term: 'Logging',
    full: 'Application Logging',
    definition:
      "Recording events, errors, and informational messages from your application as it runs. Logs are your primary debugging tool — when something breaks, you read the logs to understand what happened. Cloud providers offer centralized logging services (AWS CloudWatch, GCP Cloud Logging) that aggregate logs from all your servers.",
    tags: ['monitoring'],
  },
  {
    term: 'Metrics',
    full: 'Application Metrics',
    definition:
      "Numerical measurements of system behavior over time — CPU usage, request count, error rate, response time. Unlike logs (discrete events), metrics are aggregated numbers you graph and alert on. A high error rate metric triggers an alert before users even report a problem.",
    tags: ['monitoring'],
  },
  {
    term: 'Distributed Tracing',
    full: 'Distributed Tracing',
    definition:
      "Tracking a single request as it flows through multiple services in a microservices architecture. When a user action triggers calls to 5 different services, tracing shows you exactly where time was spent and where errors occurred. Tools like Jaeger and AWS X-Ray provide distributed tracing.",
    tags: ['monitoring', 'architecture'],
  },
  {
    term: 'APM',
    full: 'Application Performance Monitoring',
    definition:
      "Software that monitors the performance of your application end-to-end — from user browser to database query. APM tools like Datadog, New Relic, and Sentry identify slow code paths, memory leaks, and error hotspots in production.",
    tags: ['monitoring'],
  },
  {
    term: 'Uptime',
    full: 'Uptime / Availability',
    definition:
      'The percentage of time a service is operational and accessible to users. "Five nines" (99.999%) availability allows only ~5 minutes of downtime per year. Cloud SLAs typically guarantee 99.9% (8.7 hrs/year downtime) to 99.99% (52 mins/year). Tracked by uptime monitoring services that ping your site every minute.',
    tags: ['monitoring', 'reliability'],
  },
  {
    term: 'Alert',
    full: 'Monitoring Alert',
    definition:
      "An automated notification triggered when a metric crosses a defined threshold. Examples: 'alert me if error rate exceeds 1%' or 'page the on-call engineer if CPU stays above 90% for 5 minutes.' Alerts are the early warning system for production incidents.",
    tags: ['monitoring'],
  },
  {
    term: 'SLO',
    full: 'Service Level Objective',
    definition:
      "An internal reliability target your team sets for your service — for example, '99.9% of requests will complete in under 200ms.' Unlike an SLA (a legal contract with customers), an SLO is an internal goal used to measure and improve reliability over time.",
    tags: ['monitoring', 'reliability'],
  },
  {
    term: 'RTO',
    full: 'Recovery Time Objective',
    definition:
      "The maximum acceptable time to restore a system after a failure. If your RTO is 1 hour, your disaster recovery plan must get everything running within 60 minutes of an outage. Shorter RTOs require more expensive redundancy and automation.",
    tags: ['monitoring', 'reliability'],
  },
  {
    term: 'RPO',
    full: 'Recovery Point Objective',
    definition:
      "The maximum acceptable amount of data loss measured in time. An RPO of 1 hour means you can afford to lose up to 1 hour of data. If your database is backed up every hour and fails at 11:58, you might lose up to 58 minutes of transactions.",
    tags: ['monitoring', 'reliability'],
  },

  // ── Cost & Billing ────────────────────────────────────────────────────────
  {
    term: 'Free Tier',
    full: 'Cloud Free Tier',
    definition:
      "Limited free usage offered by cloud providers to get started without a credit card or at no cost. AWS offers 12 months of free services for new accounts. GCP and Cloudflare have always-free tiers with no time limit. Free tiers are great for learning and small projects but have strict usage caps.",
    tags: ['cost'],
  },
  {
    term: 'FinOps',
    full: 'Financial Operations for Cloud',
    definition:
      "The practice of managing and optimizing cloud costs. FinOps teams track spending by team/product, identify waste (idle resources, oversized instances), and implement budgets and alerts. As cloud bills grow, FinOps becomes critical — unmanaged cloud spend is a common source of budget overruns.",
    tags: ['cost'],
  },
  {
    term: 'Cost Allocation Tags',
    full: 'Cost Allocation Tags',
    definition:
      'Labels you apply to cloud resources (servers, databases, storage) to track spending by project, team, or environment. For example, tagging all resources for "Project Alpha" lets you see exactly what that project costs each month on your cloud bill.',
    tags: ['cost'],
  },
  {
    term: 'Ingress',
    full: 'Ingress Traffic',
    definition:
      "Data flowing into a cloud provider's network from the internet. Ingress is almost always free — cloud providers want data to come in. Contrast with egress (outbound), which is typically charged. This asymmetry is why it's cheap to upload to the cloud but expensive to download large datasets.",
    tags: ['networking', 'cost'],
  },

  // ── Architecture / Patterns ────────────────────────────────────────────────
  {
    term: 'REST API',
    full: 'RESTful API',
    definition:
      "An architectural style for building APIs using standard HTTP methods: GET (read), POST (create), PUT (update), DELETE (remove). Most web services expose REST APIs. When your mobile app fetches your Twitter feed, it calls a REST API. Simple, widely understood, and works with any programming language.",
    tags: ['architecture'],
  },
  {
    term: 'GraphQL',
    full: 'GraphQL',
    definition:
      'A query language for APIs where clients ask for exactly the data they need — no more, no less. Unlike REST (where the server decides what to return), GraphQL lets the client specify the exact fields it wants. Reduces over-fetching and under-fetching of data. Developed by Facebook.',
    tags: ['architecture'],
  },
  {
    term: 'Message Queue',
    full: 'Message Queue',
    definition:
      "A buffer that decouples services from each other. Service A drops a message in the queue; Service B picks it up when ready. If Service B is slow or temporarily down, messages wait in the queue rather than causing failures. AWS SQS, RabbitMQ, and Apache Kafka are popular message queues.",
    tags: ['architecture'],
  },
  {
    term: 'Pub/Sub',
    full: 'Publish / Subscribe Pattern',
    definition:
      "A messaging pattern where publishers broadcast events to a topic, and any number of subscribers receive those events independently. Unlike a queue (one consumer per message), pub/sub allows many services to react to the same event. Google Cloud Pub/Sub and AWS SNS implement this pattern.",
    tags: ['architecture'],
  },
  {
    term: 'Event-Driven',
    full: 'Event-Driven Architecture',
    definition:
      "An architecture where services communicate through events rather than direct calls. When something happens (user signs up, order placed), an event is published. Other services subscribe and react independently. Loosely coupled, highly scalable, but can be harder to debug than direct API calls.",
    tags: ['architecture'],
  },
  {
    term: 'Webhook',
    full: 'Webhook',
    definition:
      'An HTTP callback triggered when a specific event occurs in an external service. Instead of polling an API every minute asking "did anything change?", a webhook lets the service call your URL when something happens. Stripe sends webhooks when a payment succeeds; GitHub sends webhooks when code is pushed.',
    tags: ['architecture', 'networking'],
  },
  {
    term: 'Blue/Green Deployment',
    full: 'Blue/Green Deployment',
    definition:
      'A deployment strategy with two identical production environments: "blue" (current) and "green" (new version). You deploy the new version to green, test it, then switch traffic from blue to green in one step. Instant rollback: just switch traffic back to blue if something breaks.',
    tags: ['devops', 'architecture'],
  },
  {
    term: 'Canary Deployment',
    full: 'Canary Deployment',
    definition:
      'Gradually rolling out a new version to a small percentage of users first — say, 5% — before going to 100%. Named after the "canary in a coal mine." If the canary (5% cohort) shows errors, you stop the rollout before it affects everyone. Reduces risk of large-scale incidents from bad deploys.',
    tags: ['devops', 'architecture'],
  },
  {
    term: 'gRPC',
    full: 'gRPC Remote Procedure Call',
    definition:
      "A high-performance, open-source framework for service-to-service communication, developed by Google. Uses Protocol Buffers (binary format) instead of JSON, making it much faster. Common in microservices and Kubernetes environments where services need to communicate efficiently at high volume.",
    tags: ['architecture'],
  },

  // ── DevOps / Tooling ──────────────────────────────────────────────────────
  {
    term: 'Docker',
    full: 'Docker',
    definition:
      "The most popular tool for building and running containers. Docker packages your application and its dependencies into a container image — a portable snapshot that runs identically on any machine. 'It works on my machine' problems go away when you ship a Docker container.",
    tags: ['devops', 'compute'],
  },
  {
    term: 'Helm',
    full: 'Helm',
    definition:
      "The package manager for Kubernetes. Helm charts are pre-packaged application definitions that you can install into a Kubernetes cluster with a single command. Instead of writing dozens of Kubernetes YAML files from scratch, you run 'helm install nginx' and Helm handles the complexity.",
    tags: ['devops'],
  },
  {
    term: 'GitOps',
    full: 'GitOps',
    definition:
      "Using Git as the single source of truth for both application code and infrastructure configuration. When you push a change to Git, an automated system (like ArgoCD or Flux) applies it to your infrastructure. Everything is version-controlled, auditable, and reproducible.",
    tags: ['devops'],
  },
  {
    term: 'Pipeline',
    full: 'CI/CD Pipeline',
    definition:
      'An automated sequence of steps that code passes through from commit to production: build → test → security scan → deploy. Pipelines ensure every change is validated before going live. If any step fails, the pipeline stops and the change is not deployed.',
    tags: ['devops'],
  },
  {
    term: 'Container Registry',
    full: 'Container Registry',
    definition:
      "A storage service for Docker container images. When you build a Docker image, you push it to a registry; your servers pull it from there to run. Docker Hub is the public registry; AWS ECR, GCR, and GitHub Container Registry are private registries for your own images.",
    tags: ['devops', 'compute'],
  },
  {
    term: 'Environment Variables',
    full: 'Environment Variables',
    definition:
      "Dynamic configuration values set outside your application code — things like database URLs, API keys, and feature flags. Instead of hardcoding 'DB_URL=postgres://localhost' in your code, you set it as an environment variable so the same code runs in dev, staging, and production with different configs.",
    tags: ['devops'],
  },
  {
    term: 'Staging Environment',
    full: 'Staging Environment',
    definition:
      "A production-like environment for testing before releasing to real users. Staging mirrors production as closely as possible — same infrastructure, same data structure, real external services. Changes are deployed to staging first for QA, then promoted to production after approval.",
    tags: ['devops'],
  },
  {
    term: 'Rollback',
    full: 'Deployment Rollback',
    definition:
      "Reverting to a previous working version of your application after a bad deployment causes errors or downtime. A fast rollback capability is critical for minimizing the impact of production incidents. Blue/green deployments make rollback near-instant by switching traffic back to the old version.",
    tags: ['devops', 'reliability'],
  },

  // ── Cloud-specific Services ────────────────────────────────────────────────
  {
    term: 'AWS Lambda',
    full: 'AWS Lambda',
    definition:
      "Amazon's serverless compute service. You upload code (Python, Node.js, Java, etc.) and Lambda runs it in response to events — an HTTP request, a file upload, a database change. You pay only for execution time measured in milliseconds. No servers to manage.",
    tags: ['compute'],
  },
  {
    term: 'AWS EC2',
    full: 'Amazon EC2',
    definition:
      "Amazon Elastic Compute Cloud — AWS's virtual machine service. You choose a size (CPU, RAM), pick an OS, and get a server running in minutes. The most flexible but most complex way to deploy on AWS. You control the OS, software, and configuration.",
    tags: ['compute'],
  },
  {
    term: 'AWS S3',
    full: 'Amazon S3',
    definition:
      "Amazon Simple Storage Service — the original and most widely used cloud object storage. Stores files (objects) in 'buckets.' Virtually unlimited capacity, eleven 9s of durability (99.999999999%). Used for everything from website assets and application uploads to big data and backups.",
    tags: ['storage'],
  },
  {
    term: 'AWS RDS',
    full: 'Amazon RDS',
    definition:
      "Amazon Relational Database Service — a managed database platform supporting PostgreSQL, MySQL, MariaDB, Oracle, and SQL Server. AWS handles backups, patching, failover, and scaling. You just connect and run queries. Removes most database administration overhead.",
    tags: ['databases'],
  },
  {
    term: 'Cloudflare Pages',
    full: 'Cloudflare Pages',
    definition:
      "Cloudflare's platform for deploying static sites and frontend frameworks (Next.js, Astro, SvelteKit). Connects to your Git repo, builds on push, and deploys to Cloudflare's global edge network. Generous free tier with unlimited sites, unlimited bandwidth, and 500 builds/month.",
    tags: ['compute'],
  },
  {
    term: 'Firebase',
    full: 'Firebase (Google)',
    definition:
      "Google's app development platform providing a suite of backend-as-a-service tools: real-time database, authentication, cloud functions, hosting, and push notifications. Popular for building mobile apps quickly without managing a backend. Part of Google Cloud.",
    tags: ['compute', 'databases'],
  },
  {
    term: 'Vercel KV',
    full: 'Vercel KV / Edge Config',
    definition:
      "Vercel's serverless Redis-compatible key-value store and low-latency edge configuration service. Designed to work seamlessly with Vercel deployments. Edge Config updates propagate globally in milliseconds and are read before a request hits your function.",
    tags: ['databases', 'compute'],
  },
];

const ALL_TAGS = ['All', ...Array.from(new Set(terms.flatMap((t) => t.tags))).sort()];

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.03, duration: 0.2 } }),
};

export default function GlossaryPage() {
  usePageTitle('Cloud Glossary');
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState('All');

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return terms.filter((t) => {
      const matchesTag = activeTag === 'All' || t.tags.includes(activeTag);
      const matchesQuery =
        !q ||
        t.term.toLowerCase().includes(q) ||
        (t.full && t.full.toLowerCase().includes(q)) ||
        t.definition.toLowerCase().includes(q);
      return matchesTag && matchesQuery;
    });
  }, [query, activeTag]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-3xl mx-auto px-4 py-10"
    >
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Cloud Glossary
          </h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          {terms.length} plain-English definitions — from complete beginner to advanced cloud concepts.
        </p>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search terms or definitions…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {ALL_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
              activeTag === tag
                ? 'bg-primary-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {filtered.length !== terms.length && (
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
          Showing {filtered.length} of {terms.length} terms
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400 dark:text-slate-500 text-sm">
          No terms match "{query}". Try a different search.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((t, i) => (
            <motion.div
              key={t.term}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="bg-white dark:bg-slate-900 rounded-card border border-slate-200 dark:border-slate-700 p-5 shadow-card"
            >
              <div className="mb-2">
                <span className="font-bold text-slate-900 dark:text-white text-base">{t.term}</span>
                {t.full && t.full !== t.term && (
                  <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">— {t.full}</span>
                )}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{t.definition}</p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
