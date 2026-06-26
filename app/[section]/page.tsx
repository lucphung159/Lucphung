import { notFound } from "next/navigation";
import SitePage from "../SitePage";

type InitialTab = "publications" | "labMembers" | "aboutMe" | "openings";

export const revalidate = 0;

const sectionMap: Record<string, { initialTab: InitialTab; focusContact?: boolean }> = {
  about: { initialTab: "aboutMe" },
  group: { initialTab: "labMembers" },
  publications: { initialTab: "publications" },
  publication: { initialTab: "publications" },
  openings: { initialTab: "openings" },
  opening: { initialTab: "openings" },
  contact: { initialTab: "aboutMe", focusContact: true },
};

export default async function SectionPage({ params }: { params: { section: string } }) {
  const section = sectionMap[params.section.toLowerCase()];

  if (!section) {
    notFound();
  }

  return <SitePage initialTab={section.initialTab} focusContact={section.focusContact} />;
}
