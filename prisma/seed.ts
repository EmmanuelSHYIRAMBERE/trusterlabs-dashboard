import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Get the first user to use as author
  const author = await prisma.user.findFirst();
  if (!author) {
    console.error('No user found. Create a user first before seeding blogs.');
    process.exit(1);
  }

  const posts = [
    {
      title: 'Understanding Zero Trust Architecture in Modern Enterprises',
      slug: 'understanding-zero-trust-architecture',
      excerpt: 'Zero Trust is no longer optional. Learn how leading organizations are implementing "never trust, always verify" to protect critical assets.',
      content: `## What is Zero Trust?

Zero Trust is a security framework that requires **all users**, whether inside or outside the organization's network, to be authenticated, authorized, and continuously validated before being granted access to applications and data.

## Core Principles

- **Verify explicitly** — Always authenticate and authorize based on all available data points
- **Use least privilege access** — Limit user access with just-in-time and just-enough-access
- **Assume breach** — Minimize blast radius, segment access, and verify end-to-end encryption

## Implementation Roadmap

### Phase 1: Identity
Start with strong identity verification using MFA and conditional access policies.

### Phase 2: Devices
Ensure all devices accessing resources are enrolled and compliant.

### Phase 3: Network
Micro-segment networks to prevent lateral movement.

## Conclusion

Zero Trust is a journey, not a destination. Organizations that adopt it incrementally see measurable reductions in breach impact and dwell time.`,
      category: 'Policy & Governance',
      tags: ['zero-trust', 'enterprise-security', 'architecture'],
      featured: true,
      readTime: 7,
      status: 'Published',
      publishedDate: new Date('2024-11-10'),
    },
    {
      title: 'Top 10 Cyber Threats Facing Africa in 2025',
      slug: 'top-10-cyber-threats-africa-2025',
      excerpt: 'From ransomware targeting financial institutions to state-sponsored espionage, Africa faces a rapidly evolving threat landscape.',
      content: `## The Growing Threat Landscape

Africa's rapid digital transformation has made it an increasingly attractive target for cybercriminals. Here are the top threats organizations must prepare for in 2025.

## 1. Ransomware-as-a-Service (RaaS)

Criminal groups now offer ransomware kits to affiliates, dramatically lowering the barrier to entry.

## 2. Business Email Compromise (BEC)

BEC attacks targeting African financial institutions have grown **300%** year-over-year.

## 3. Mobile Banking Trojans

With mobile money dominating financial transactions across the continent, trojans targeting M-Pesa, MTN Mobile Money, and similar platforms are surging.

## 4. Supply Chain Attacks

Attackers compromise trusted software vendors to gain access to downstream customers.

## 5. Phishing via Social Media

Sophisticated spear-phishing campaigns leveraging LinkedIn and WhatsApp are increasingly common.

## Recommendations

- Invest in threat intelligence sharing between organizations
- Conduct regular security awareness training
- Implement robust incident response plans

> "The question is no longer *if* you will be attacked, but *when*." — CISA`,
      category: 'Threat Intelligence',
      tags: ['africa', 'ransomware', 'threat-landscape', '2025'],
      featured: true,
      readTime: 9,
      status: 'Published',
      publishedDate: new Date('2024-12-01'),
    },
    {
      title: 'Incident Response Playbook: Handling a Data Breach',
      slug: 'incident-response-playbook-data-breach',
      excerpt: 'A step-by-step guide for security teams to contain, eradicate, and recover from a data breach while minimizing business impact.',
      content: `## Overview

When a data breach occurs, every minute counts. This playbook provides a structured approach to incident response based on the **NIST SP 800-61** framework.

## Phase 1: Preparation

Before an incident occurs, ensure you have:

\`\`\`
- Incident Response Team (IRT) contacts documented
- Communication templates ready
- Forensic tools pre-installed on jump hosts
- Legal and PR teams briefed
\`\`\`

## Phase 2: Detection & Analysis

| Indicator | Possible Cause |
|-----------|---------------|
| Unusual outbound traffic | Data exfiltration |
| Failed login spikes | Credential stuffing |
| Unexpected admin accounts | Persistence mechanism |

## Phase 3: Containment

**Short-term containment:**
- Isolate affected systems from the network
- Preserve evidence (memory dumps, logs)

**Long-term containment:**
- Patch the exploited vulnerability
- Reset compromised credentials

## Phase 4: Eradication & Recovery

1. Remove malware and backdoors
2. Restore from clean backups
3. Monitor for re-infection

## Phase 5: Post-Incident Activity

Document lessons learned and update your playbook within **72 hours** of resolution.`,
      category: 'Incident Response',
      tags: ['incident-response', 'data-breach', 'playbook', 'NIST'],
      featured: false,
      readTime: 12,
      status: 'Published',
      publishedDate: new Date('2025-01-15'),
    },
    {
      title: 'Building a Cybersecurity Culture: From Awareness to Behavior Change',
      slug: 'building-cybersecurity-culture',
      excerpt: 'Technical controls alone are not enough. Discover how to transform your workforce into a human firewall through effective security awareness programs.',
      content: `## Why Culture Matters

According to the **2024 Verizon DBIR**, 74% of all breaches involve the human element. No amount of technology can fully compensate for employees who click phishing links or reuse passwords.

## The Awareness-to-Behavior Gap

Most organizations run annual security awareness training and call it done. The problem? **Awareness does not equal behavior change.**

### What Actually Works

- **Simulated phishing campaigns** — Regular, realistic simulations with immediate feedback
- **Micro-learning** — Short, frequent lessons rather than annual marathons
- **Gamification** — Leaderboards and rewards for secure behavior
- **Role-based training** — Finance teams need different training than developers

## Measuring Success

Track these KPIs:

\`\`\`
Phishing click rate (target: < 5%)
Reporting rate (target: > 70%)
Password manager adoption
MFA enrollment rate
\`\`\`

## Executive Buy-In

Security culture starts at the top. When the CEO participates in phishing simulations and talks openly about security, the message resonates throughout the organization.

## Conclusion

Invest in your people as much as your technology. A security-aware workforce is your most resilient defense.`,
      category: 'Security Awareness',
      tags: ['security-culture', 'awareness-training', 'human-firewall'],
      featured: false,
      readTime: 8,
      status: 'Published',
      publishedDate: new Date('2025-02-20'),
    },
    {
      title: 'GDPR & African Data Protection Laws: What You Need to Know',
      slug: 'gdpr-african-data-protection-laws',
      excerpt: 'As African nations roll out their own data protection frameworks, organizations must navigate a complex web of compliance requirements.',
      content: `## The Regulatory Landscape

Data protection regulation is accelerating across Africa. With the **GDPR** setting a global benchmark, many African nations are enacting their own frameworks.

## Key Frameworks

### Nigeria — NDPR (2019)
The Nigeria Data Protection Regulation requires organizations processing Nigerian citizens' data to:
- Register with NITDA
- Conduct Data Protection Impact Assessments (DPIAs)
- Appoint a Data Protection Officer (DPO)

### Kenya — Data Protection Act (2019)
Kenya's DPA closely mirrors GDPR, establishing rights for data subjects including:
- Right of access
- Right to rectification
- Right to erasure

### South Africa — POPIA (2021)
The Protection of Personal Information Act came into full effect in 2021, with significant penalties for non-compliance.

### Rwanda — Law No. 058/2021
Rwanda's data protection law establishes the National Cyber Security Authority (NCSA) as the supervisory body.

## Compliance Checklist

- [ ] Map all personal data flows
- [ ] Update privacy notices
- [ ] Implement data subject request processes
- [ ] Train staff on data handling
- [ ] Review third-party data processor agreements

## Penalties

Non-compliance can result in fines up to **4% of annual global turnover** under GDPR-aligned frameworks.

> Organizations operating across multiple African jurisdictions should conduct a gap analysis against each applicable law.`,
      category: 'Policy & Governance',
      tags: ['GDPR', 'data-protection', 'compliance', 'Africa', 'POPIA'],
      featured: false,
      readTime: 10,
      status: 'Draft',
      publishedDate: null,
    },
  ];

  console.log('Seeding 5 blog posts...');

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        ...post,
        backdropImages: [],
        views: Math.floor(Math.random() * 2000) + 100,
        engagement: Math.floor(Math.random() * 300) + 10,
        authorId: author.id,
      },
    });
    console.log(`  ✓ ${post.title}`);
  }

  console.log('Done.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
