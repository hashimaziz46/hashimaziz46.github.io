import Timeline from '@/components/ui/timeline'
import ExperienceTimelineItem from '@/components/home/experience/experience-timeline-item'

const EXPERIENCES = [
  {
    index: '01',
    company: 'Geeks Ltd',
    logo: '/images/logos/geeks.webp',
    role: 'Global Project Manager',
    period: 'Oct 2025 -',
    status: { text: 'Present', tone: 'positive' as const },
    stack: ['Agile', 'Roadmapping', 'Governance', 'Change management'],
    achievement: 'Managing 18 concurrent projects with an average CSAT above 80%',
    description:
      'Lead solution design workshops and turn business requirements into Agile roadmaps, contributing to projects worth over $500K in revenue. Run weekly delivery governance sessions and built a standard offboarding framework that raised operational efficiency by 5%.'
  },
  {
    index: '02',
    company: 'CareCloud',
    logo: '/images/logos/carecloud.webp',
    role: 'Project Manager',
    period: 'Mar 2025 - May 2026',
    stack: ['JIRA', 'SOX audits', 'Vendor risk', 'QA frameworks'],
    achievement: 'Raised team efficiency by 20%+ and cut team errors by 80%',
    description:
      'Owned backlog and roadmap planning, oversaw SOX audits and vendor risk assessments with zero delays, and acted as backup PMO. Delivered the SOMOS post-acquisition transition and the Toyota leasing automation programme with a 60-person distributed team.'
  },
  {
    index: '03',
    company: 'GitStart',
    logo: '/images/logos/gitstart.webp',
    role: 'Project Manager',
    period: 'Feb 2023 - Feb 2025, 2 years',
    stack: ['Scrum', 'React', 'Node.js', 'TypeScript'],
    achievement: 'Improved sprint efficiency by 21% and development velocity by 17%',
    description:
      'Managed multiple 10+ person teams delivering for clients such as Shippeo and Drata. Wrote detailed specs for accurate estimates, broke user stories into actionable tasks, and mentored 10+ junior engineers.'
  },
  {
    index: '04',
    company: 'GitStart',
    logo: '/images/logos/gitstart.webp',
    role: 'Software Engineer',
    period: 'Mar 2022 - Feb 2025, 3 years',
    stack: ['React', 'React Native', 'Next.js', 'TypeScript', 'Nest.js', 'MongoDB', 'PostgreSQL', 'CI/CD'],
    achievement: 'Implemented 100+ telematics solutions for a client, improving data tracking and analysis',
    description:
      'Built and maintained client applications with modern JavaScript frameworks, integrated GitHub repositories and set up CI/CD pipelines for automated deployments. Recommended and implemented system updates to improve performance and code quality, ran code reviews and QA checks, and wrote test suites that caught issues early.'
  },
  {
    index: '05',
    company: 'Safeway Renewable Energy',
    logo: '/images/logos/safeway.webp',
    role: 'Website Developer & Manager',
    period: 'May 2021 - Oct 2021, 6 months',
    stack: ['Web development', 'Maintenance', 'Security'],
    achievement: 'Reduced website vulnerabilities by 8% through regular security checks',
    description:
      'Maintained and updated the company website daily, kept it fast and available, and acted on customer feedback to improve the experience.'
  }
]

const ExperienceTimeline = () => {
  return (
    <Timeline
      data={EXPERIENCES.map(({ index, ...experience }) => ({
        index,
        content: <ExperienceTimelineItem {...experience} />
      }))}
    />
  )
}

export default ExperienceTimeline
