import { site } from "@/lib/site";

const personId = `${site.url}/#erkan-ercan`;

const profileGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      description: site.description,
      inLanguage: "en",
      publisher: { "@id": personId },
    },
    {
      "@type": "ProfilePage",
      "@id": `${site.url}/#profile-page`,
      url: site.url,
      name: site.title,
      description: site.description,
      inLanguage: "en",
      dateModified: "2026-09-05",
      isPartOf: { "@id": `${site.url}/#website` },
      about: { "@id": personId },
      mainEntity: { "@id": personId },
    },
    {
      "@type": "Person",
      "@id": personId,
      name: site.name,
      url: site.url,
      email: `mailto:${site.email}`,
      jobTitle: "Software Engineer",
      description:
        "Software engineer and product builder behind Sablebook and 73Kit.",
      sameAs: [site.github, site.linkedin],
      knowsAbout: [
        "Frontend engineering",
        "Full-stack engineering",
        "Software architecture",
        "TypeScript",
        "React",
        "Next.js",
        "Node.js",
        "Local-first web applications",
        "Conversational booking software",
        "Amateur radio software",
      ],
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://sablebook.com/#software",
      name: "Sablebook",
      url: "https://sablebook.com",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "A WhatsApp-first booking and operations system for salons, designed so conversations, calendars, and payments stay in agreement.",
      creator: { "@id": personId },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://73kit.erkan.dev/#software",
      name: "73Kit Radio CPS",
      url: "https://73kit.erkan.dev",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web browser",
      description:
        "A local-first browser tool for reading, backing up, editing, reviewing, and writing amateur-radio Codeplugs.",
      creator: { "@id": personId },
    },
  ],
};

export function ProfileStructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(profileGraph).replace(/</g, "\\u003c"),
      }}
    />
  );
}
