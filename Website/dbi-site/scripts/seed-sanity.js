require("dotenv").config({ path: ".env.local" });
require("dotenv").config({ path: ".env" });

const { createClient } = require("@sanity/client");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-22";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  throw new Error(
    "Missing env vars. Set NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and SANITY_API_WRITE_TOKEN.",
  );
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const withKeys = (items, prefix) =>
  items.map((item, index) => ({
    _key: `${prefix}-${index}`,
    ...item,
  }));

const documents = [
  {
    _id: "homePage",
    _type: "homePage",
    title: "Home Page",
    hero: {
      title:
        "Building Belonging, Opportunity, and Academic Success for African American Youth",
      subtitle:
        "We partner with schools, families, and communities to support African American students through mentorship, advocacy, and culturally responsive programs that strengthen well-being, confidence, and academic success.",
      primaryCta: { label: "Learn how we support students", href: "/programs" },
      secondaryCta: { label: "Partner with us", href: "/contact" },
    },
    whatWeDoHeading: { title: "What We Do" },
    whatWeDoItems: withKeys(
      [
        {
          title: "School-Based Mentorship & Advocacy",
          description:
            "Trusted mentors support students academically and personally while advocating for their needs within school systems.",
        },
        {
          title: "Academic Support Connections",
          description:
            "Tutoring, enrichment, and progress monitoring designed for student growth.",
        },
        {
          title: "Family Engagement",
          description:
            "Partnerships that strengthen family-school relationships and shared success.",
        },
        {
          title: "Mental Health Awareness & Referrals",
          description:
            "Supportive pathways to counseling, wellness, and community resources.",
        },
      ],
      "whatWeDo",
    ),
    impactHeading: { title: "Our Impact" },
    impactCards: withKeys(
      [
        {
          value: "65 - 75",
          label: "Students Served in 2024-25",
        },
        {
          value: "Increased",
          label: "Student Engagement and Sense of Belonging",
        },
        {
          value: "Strong, trusted",
          label: "Partnerships with school administrators and staff",
        },
      ],
      "impact",
    ),
    sponsorsHeading: { title: "Our Sponsors" },
    sponsors: [
      "Community Health Fund",
      "Keller Canyon Mitigation Fund",
      "Antioch Community Foundation",
    ],
  },
  {
    _id: "aboutPage",
    _type: "aboutPage",
    title: "About Page",
    pageHeader: {
      title: "About Delta Bay Impact",
      subtitle:
        "DBI exists to uplift African American youth in Contra Costa communities through mentorship, advocacy, and community-rooted partnerships.",
    },
    storyHeading: {
      eyebrow: "Our Story",
      title: "Community-rooted work, built for lasting change.",
      description:
        "DBI partners with schools and families to address the cultural, academic, and social needs of students. Our team provides mentorship, advocacy, and support that centers belonging and opportunity.",
    },
    missionPillars: withKeys(
      [
        {
          title: "Educate",
          description:
            "Academic support, tutoring, and enrichment that build confidence and belonging.",
        },
        {
          title: "Advocate",
          description:
            "Culturally responsive mentorship and school partnerships that elevate student voice.",
        },
        {
          title: "Elevate",
          description:
            "Wrap-around family supports and community programs that create pathways to success.",
        },
      ],
      "pillar",
    ),
    valuesHeading: {
      eyebrow: "Values",
      title: "The principles that guide our work.",
    },
    values: withKeys(
      [
        {
          title: "Belonging",
          description:
            "Students and families deserve spaces that reflect their stories and celebrate their identity.",
        },
        {
          title: "Partnership",
          description:
            "We work alongside schools, caregivers, and community leaders to create shared success.",
        },
        {
          title: "Accountability",
          description:
            "We track outcomes and stay transparent about our impact and growth areas.",
        },
      ],
      "value",
    ),
    cta: {
      title: "Connect with our team.",
      description:
        "Let’s talk about how DBI can support your students, family, or community.",
      primaryCta: { label: "Request program info", href: "/contact" },
    },
  },
  {
    _id: "programsPage",
    _type: "programsPage",
    title: "Programs Page",
    pageHeader: {
      title: "Our Programs",
      subtitle:
        "DBI delivers mentorship, academic support, and family engagement programs that meet students where they are.",
    },
    programsHeading: {
      eyebrow: "Programs",
      title: "Designed with students, families, and schools.",
    },
    programs: withKeys(
      [
        {
          eyebrow: "Students",
          title: "Student Mentorship Circles",
          description:
            "Weekly small-group sessions that build leadership, academic skills, and peer connection.",
        },
        {
          eyebrow: "Families",
          title: "Family Engagement Nights",
          description:
            "Trusted spaces for parents and guardians to connect with DBI staff and school partners.",
        },
        {
          eyebrow: "Schools",
          title: "School Partnership Model",
          description:
            "Collaborative program design, coaching, and campus support tailored to school needs.",
        },
      ],
      "program",
    ),
    accessHeading: {
      eyebrow: "Program Access",
      title: "How students and families can join.",
      description:
        "Programs are offered in collaboration with partner schools and community sites. Contact DBI for schedules, locations, and enrollment details.",
    },
    cta: {
      title: "Ready to connect?",
      description:
        "We can help match students and families to the right program.",
      primaryCta: { label: "Request program info", href: "/contact" },
    },
  },
  {
    _id: "impactPage",
    _type: "impactPage",
    title: "Impact Page",
    pageHeader: {
      title: "Impact",
      subtitle:
        "DBI measures impact through student success, family engagement, and trusted partnerships.",
    },
    highlightsHeading: {
      eyebrow: "Highlights",
      title: "What partners share about DBI.",
    },
    impactHighlights: withKeys(
      [
        {
          title: "Stronger attendance and engagement",
          description:
            "Students report higher confidence and improved school attendance after DBI support.",
        },
        {
          title: "Culturally responsive mentorship",
          description:
            "Mentors reflect the lived experiences of students and provide consistent encouragement.",
        },
        {
          title: "Family-school connection",
          description:
            "Families gain access to resources, advocacy, and school communication channels.",
        },
      ],
      "highlight",
    ),
    outcomesHeading: {
      eyebrow: "Outcomes",
      title: "Student, family, and school outcomes.",
    },
    outcomes: withKeys(
      [
        {
          title: "Student belonging",
          description:
            "Students describe DBI spaces as safe, affirming, and motivating.",
        },
        {
          title: "Family trust",
          description:
            "Parents report stronger connections with school staff and resources.",
        },
        {
          title: "School partnership",
          description:
            "Educators gain a reliable partner that helps reach and retain students.",
        },
      ],
      "outcome",
    ),
    cta: {
      title: "Partner with DBI.",
      description:
        "Learn how DBI can support student outcomes in your school or district.",
      primaryCta: { label: "Start a school partnership", href: "/contact" },
    },
  },
  {
    _id: "getInvolvedPage",
    _type: "getInvolvedPage",
    title: "Get Involved Page",
    pageHeader: {
      title: "Get Involved",
      subtitle:
        "Join the DBI community as a student, family, school partner, or supporter.",
    },
    pathwaysHeading: {
      eyebrow: "Pathways",
      title: "Ways to connect with DBI.",
    },
    options: withKeys(
      [
        {
          eyebrow: "Students",
          title: "Join a DBI program",
          description:
            "Explore mentorship, after-school programs, and leadership development for youth.",
        },
        {
          eyebrow: "Schools",
          title: "Start a partnership",
          description:
            "Collaborate with DBI to launch culturally responsive programming in your school.",
        },
        {
          eyebrow: "Partners",
          title: "Donate or sponsor",
          description:
            "Invest in sustainable, community-led change for African American youth.",
        },
      ],
      "involved",
    ),
    cta: {
      title: "Let’s build a plan together.",
      description:
        "Tell us how you want to get involved and we’ll follow up with next steps.",
      primaryCta: { label: "Contact DBI", href: "/contact" },
    },
  },
  {
    _id: "resourcesPage",
    _type: "resourcesPage",
    title: "Resources Page",
    pageHeader: {
      title: "Resources",
      subtitle: "Curated support for students, families, and community partners.",
    },
    resourcesHeading: {
      eyebrow: "Resource Library",
      title: "Tools to help your community thrive.",
    },
    resources: withKeys(
      [
        {
          title: "Family resources",
          description:
            "Guides for navigating school systems, advocacy tips, and community contacts.",
        },
        {
          title: "Student pathways",
          description:
            "Enrichment opportunities, scholarships, and partner programs for students.",
        },
        {
          title: "Partner toolkit",
          description:
            "Collaboration overview, outcomes highlights, and DBI service menu.",
        },
      ],
      "resource",
    ),
    cta: {
      title: "Need a specific resource?",
      description: "Reach out and we’ll connect you with the right information.",
      primaryCta: { label: "Contact DBI", href: "/contact" },
    },
  },
  {
    _id: "donatePage",
    _type: "donatePage",
    title: "Donate Page",
    pageHeader: {
      title: "Donate or Partner",
      subtitle:
        "Your support creates pathways to belonging and success for African American youth.",
    },
    supportHeading: {
      eyebrow: "Support DBI",
      title: "Ways to invest in the mission.",
    },
    supportOptions: withKeys(
      [
        {
          title: "Individual giving",
          description:
            "Provide direct support for mentoring programs, student supplies, and family engagement.",
        },
        {
          title: "Corporate partners",
          description:
            "Sponsor cohort programs, leadership summits, or community events.",
        },
        {
          title: "Foundations & grants",
          description:
            "Collaborate on multi-year investments that sustain community-led change.",
        },
      ],
      "support",
    ),
    cta: {
      title: "Let’s talk about partnership.",
      description:
        "We welcome conversations about sponsorships, grants, and collaborative programming.",
      primaryCta: { label: "Contact DBI", href: "/contact" },
    },
  },
  {
    _id: "contactPage",
    _type: "contactPage",
    title: "Contact Page",
    pageHeader: {
      title: "Contact DBI",
      subtitle:
        "Tell us how we can support your student, family, or school community.",
    },
    contactHeading: {
      eyebrow: "Connect",
      title: "We are ready to hear from you.",
      description:
        "Share your needs and we’ll follow up with program details, partnership options, or donation information.",
    },
    contactForm: {
      firstNamePlaceholder: "First name",
      lastNamePlaceholder: "Last name",
      emailPlaceholder: "Email address",
      organizationPlaceholder: "Organization or school",
      messagePlaceholder: "How can we help?",
      submitLabel: "Send message",
    },
    contactDetails: {
      eyebrow: "Contact Details",
      email: "info@deltabayimpact.org",
      phone: "(000) 000-0000",
      responseNote:
        "We respond within two business days and will connect you with the right program lead.",
    },
  },
];

async function run() {
  const results = await Promise.all(
    documents.map((doc) => client.createOrReplace(doc)),
  );
  console.log(`Seeded ${results.length} documents.`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
