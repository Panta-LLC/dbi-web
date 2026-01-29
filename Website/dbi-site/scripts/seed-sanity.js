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
    _id: "footer",
    _type: "footer",
    title: "Footer",
    heading: "Delta Bay Impact",
    description: "Building opportunity through community partnerships, programs, and impact-driven work.",
    email: "info@deltabayimpact.org",
    siteLinks: withKeys(
      [
        { label: "About", href: "/about" },
        { label: "Programs", href: "/programs" },
        { label: "Get Involved", href: "/get-involved" },
        { label: "Impact", href: "/impact" },
        { label: "Resources", href: "/resources" },
        { label: "Contact", href: "/contact" },
        { label: "Donate", href: "/donate" },
      ],
      "footer-link",
    ),
    socialLinks: withKeys(
      [
        { label: "Instagram", href: "https://instagram.com" },
        { label: "Facebook", href: "https://facebook.com" },
        { label: "LinkedIn", href: "https://linkedin.com" },
      ],
      "footer-social",
    ),
  },
  {
    _id: "homePage",
    _type: "homePage",
    title: "Home Page",
    hero: {
      title:
        "Building Belonging, Opportunity, and Academic Success for African American Youth",
      subtitle:
        "Delta Bay Impact partners with schools, families, and communities to support African American students through mentorship, advocacy, and culturally responsive programs that strengthen well-being, confidence, and academic success.",
      primaryCta: { label: "Learn how we support students", href: "/programs" },
      secondaryCta: { label: "Partner with us", href: "/contact" },
    },
    intro:
      "African American students and families in Contra Costa County face long-standing barriers to educational equity, connection, and access to resources. Delta Bay Impact exists to change that narrative by creating safe spaces, trusted relationships, and pathways to opportunity rooted in belonging.",
    serve: {
      title: "How we serve our community",
      description:
        "We partner with schools, families, and communities to support African American students through mentorship, advocacy, and culturally responsive programs that strengthen well-being, confidence, and academic success.",
      cta: { label: "Learn more", href: "/programs" },
      items: withKeys(
        [
          {
            title: "School-Based Mentorship and Advocacy",
            description:
              "Trusted mentors support students academically and personally while advocating for their needs within school systems.",
          },
          {
            title: "Academic Support Connections",
            description:
              "We connect students to tutoring and skill-building resources that reinforce classroom learning.",
          },
          {
            title: "Family Engagement",
            description:
              "We strengthen communication and partnership between schools and families through events and consistent outreach.",
          },
          {
            title: "Mental Health Awareness and Referrals",
            description:
              "We promote mental wellness and connect families to culturally responsive resources.",
          },
        ],
        "serve",
      ),
    },
    latest: {
      title: "The Latest",
      items: withKeys(
        [
          {
            title: "School Supply Drive",
            date: "February 14, 2026",
            description:
              "African American students and families in Contra Costa County face long-standing barriers to educational equity, connection, and access to resources.",
          },
        ],
        "latest",
      ),
    },
    partners: {
      title: "Our Partners",
      items: withKeys(
        [
          { name: "Community Health Fund" },
          { name: "Keller Canyon Mitigation Fund" },
          { name: "Antioch Community Foundation" },
        ],
        "partner",
      ),
    },
    contact: {
      title: "Contact",
      description:
        "Questions about partnership, programs, or support? Reach out to our team and we will follow up quickly.",
      cta: { label: "Get in touch", href: "/contact" },
    },
  },
  {
    _id: "aboutPage",
    _type: "aboutPage",
    title: "About Page",
    lead:
      "Delta Bay Impact empowers African American youth and families by addressing educational inequity through mentorship, advocacy, and culturally responsive support systems.",
    description:
      "Communities where African American students feel safe, supported, and confident, thriving academically, socially, and emotionally, with clear pathways to college, careers, and income mobility.",
    values: {
      title: "Our Values",
      items: withKeys(
        [
          {
            title: "Youth-Centeredness",
            description: "Students' voices and experiences guide our work.",
          },
          {
            title: "Belonging and Empowerment",
            description: "Identity, culture, and connection matter.",
          },
          {
            title: "Collaboration",
            description: "Schools, families, and communities work best together.",
          },
          {
            title: "Equity and Inclusion",
            description: "Addressing systemic barriers at their roots.",
          },
          {
            title: "Accountability",
            description: "Measuring impact and learning continuously.",
          },
        ],
        "value",
      ),
    },
    story: {
      title: "Our Story",
      description:
        "Founded in 2023, Delta Bay Impact grew from deep listening within local schools and communities. Our early pilot demonstrated that when students feel seen, supported, and connected, engagement and confidence improve. DBI was created to build on that success at scale and in partnership with schools and families.",
    },
    leadership: {
      title: "Our Leadership",
      members: withKeys(
        [
          { name: "Tiffany Francies", role: "Executive Director" },
          { name: "Tiffany Francies", role: "Executive Director" },
          { name: "Tiffany Francies", role: "Executive Director" },
          { name: "Tiffany Francies", role: "Executive Director" },
        ],
        "leader",
      ),
    },
    partners: {
      title: "Our Partners",
      items: withKeys(
        [
          { name: "Community Health Fund" },
          { name: "Keller Canyon Mitigation Fund" },
          { name: "Antioch Community Foundation" },
        ],
        "partner",
      ),
    },
    support: {
      title: "Help DBI support your child, school, or community",
      description:
        "Our goal is to support all African-American youth in Contra Costa County. If your school or community could benefit from our services, please reach out.",
      primaryCta: { label: "Learn more", href: "/programs" },
      secondaryCta: { label: "Partner with us", href: "/contact" },
    },
  },
  {
    _id: "programsPage",
    _type: "programsPage",
    title: "Programs Page",
    lead: "Overview",
    description:
      "Delta Bay Impact delivers integrated, school-based programs that address academic success, well-being, and belonging.",
    programs: {
      title: "Programs",
      items: withKeys(
        [
          {
            title: "School-Based Mentorship and Advocacy",
            description:
              "DBI mentors build trusted relationships with students, providing academic support, goal-setting, and personal development while advocating for students' educational needs.",
          },
          {
            title: "Academic Support and Tutoring Connections",
            description:
              "We connect students to tutoring, homework help, and skill-building resources that reinforce learning and confidence.",
          },
          {
            title: "Family Engagement",
            description:
              "DBI strengthens school-family partnerships through regular communication, family engagement nights, and community-based events that create shared understanding and support.",
          },
          {
            title: "Mental Health Awareness and Referrals",
            description:
              "We provide mental health education and connect students and families to culturally responsive school-based and community resources.",
          },
        ],
        "program",
      ),
      cta: { label: "Partner with Delta Bay Impact", href: "/contact" },
    },
  },
  {
    _id: "impactPage",
    _type: "impactPage",
    title: "Impact Page",
    lead:
      "We measure success by listening to students and families, partnering with schools, and tracking indicators that reflect engagement, belonging, and academic participation.",
    outcomes: {
      title: "Outcomes",
      items: [
        "Student engagement and sense of belonging",
        "Attendance and participation",
        "Family engagement and communication",
        "School partnership effectiveness",
      ],
    },
    locations: {
      title: "Where We Serve",
      items: withKeys(
        [
          { name: "Riverview Middle School", location: "Bay Point, CA" },
          { name: "Olympic High School", location: "Concord, CA" },
          { name: "Wren Elementary School", location: "Pittsburg, CA" },
        ],
        "location",
      ),
    },
    learning: {
      description:
        "Students report stronger relationships with mentors, greater engagement in school, and a clearer sense of belonging within their school communities.",
      cta: { label: "View our reports", href: "/resources" },
    },
  },
  {
    _id: "getInvolvedPage",
    _type: "getInvolvedPage",
    title: "Get Involved Page",
    lead: "Partner With Us",
    description:
      "We collaborate with schools, districts, community organizations, and funders to expand access to mentorship and support for African American youth.",
    pathways: {
      title: "Ways to Engage",
      items: [
        "School and district partnerships",
        "Community and nonprofit partnerships",
        "Board and advisory involvement",
        "Corporate sponsorships and in-kind support",
      ],
      cta: { label: "Start a conversation", href: "/contact" },
    },
  },
  {
    _id: "resourcesPage",
    _type: "resourcesPage",
    title: "Resources Page",
    lead: "Purpose",
    description:
      "This space shares updates, learning, and tools that support transparency, collaboration, and community connection.",
    items: {
      title: "What You'll Find",
      items: [
        "Program updates and announcements",
        "Family and student resources",
        "Partner spotlights",
        "Educational equity insights",
        "Annual impact and sustainability reports",
      ],
    },
  },
  {
    _id: "donatePage",
    _type: "donatePage",
    title: "Donate Page",
    lead: "Invest in Belonging and Opportunity",
    description:
      "Your support helps create safe spaces, trusted mentorship relationships, and pathways to academic success for African American youth and families.",
    support: {
      title: "How Your Gift Helps",
      items: [
        "Expands mentorship and academic support",
        "Strengthens family engagement",
        "Connects students to wellness resources",
        "Sustains school and community partnerships",
      ],
      cta: { label: "Support our work", href: "/donate" },
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
