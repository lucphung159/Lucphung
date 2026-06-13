import { Schema, model, models } from "mongoose";

const LinkSchema = new Schema(
  { label: String, href: String },
  { _id: false }
);

const NewsItemSchema = new Schema(
  {
    date: String,
    type: { type: String, enum: ["paper", "award", "talk", "misc"] },
    text: String,
  },
  { _id: false }
);

const PublicationSchema = new Schema(
  {
    title: String,
    authors: String,
    venue: String,
    year: String,
    links: [LinkSchema],
  },
  { _id: false }
);

const PubSectionItemSchema = new Schema({
  badge: { type: String, default: "" },
  title: { type: String, default: "" },
  titleHref: { type: String, default: "" },
  authors: { type: String, default: "" }, // HTML string (supports <strong>, <a>)
  venue: { type: String, default: "" },
  links: { type: [LinkSchema], default: [] },
});

const PubSectionSchema = new Schema({
  title: { type: String, default: "" }, // e.g. "Recent Preprints"
  publicationsList: { type: [PubSectionItemSchema], default: [] },
});

const GroupMemberSchema = new Schema({
  name: { type: String, default: "" },
  nameHref: { type: String, default: "" },
  role: { type: String, default: "" },
  research: { type: String, default: "" },
  badge: { type: String, default: "" },
  coAdvise: { type: String, default: "" },
  image: { type: String, default: "" }, // base64
});

const ContentSchema = new Schema(
  {
    type: { type: String, default: "page_content", unique: true },
    profile: {
      name: { type: String, default: "Luc Phung" },
      title: { type: String, default: "PhD Student · Department of Computer Science" },
      university: { type: String, default: "University of Technology" },
      advisor: { type: String, default: "Prof. Jane Doe" },
      email: { type: String, default: "lucphung@example.com" },
      scholar: { type: String, default: "https://scholar.google.com" },
      twitter: { type: String, default: "" },
      facultyPage: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      youtube: { type: String, default: "" },
      instagram: { type: String, default: "" },
      researchGate: { type: String, default: "" },
      profileImage: { type: String, default: "" }, // base64
      bio: {
        type: [String], default: [
          "I am a PhD student in Computer Science at the University of Technology. My research focuses on natural language processing and machine learning, with particular interest in large language models, efficient fine-tuning, and cross-lingual transfer learning.",
          "I am broadly interested in building AI systems that are efficient, generalizable, and accessible — especially in low-resource settings.",
        ]
      },
    },
    news: {
      type: [NewsItemSchema],
      default: [],
    },
    publications: {
      type: [PublicationSchema],
      default: [],
    },
    publicationSections: {
      type: [PubSectionSchema],
      default: [],
    },
    groupMembers: {
      type: [GroupMemberSchema],
      default: [],
    },
    openings: {
      type: String,
      default: "",
    },
    blog: {
      type: String,
      default: "",
    },
    contact: {
      address: { type: String, default: "Department of Computer Science, University of Technology" },
      office: { type: String, default: "Room 404, CS Building" },
      email: { type: String, default: "lucphung@example.com" },
    },
  },
  { timestamps: true }
);

export const Content = models.Content || model("Content", ContentSchema);
