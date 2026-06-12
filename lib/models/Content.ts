import mongoose, { Schema, model, models } from "mongoose";

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

const ContentSchema = new Schema(
  {
    type: { type: String, default: "page_content", unique: true },
    profile: {
      name: { type: String, default: "Luc Phung" },
      title: { type: String, default: "PhD Student · Department of Computer Science" },
      university: { type: String, default: "University of Technology" },
      advisor: { type: String, default: "Prof. Jane Doe" },
      email: { type: String, default: "lucphung@example.com" },
      github: { type: String, default: "https://github.com/lucphung159" },
      scholar: { type: String, default: "https://scholar.google.com" },
      linkedin: { type: String, default: "https://linkedin.com" },
      bio: { type: [String], default: [
        "I am a PhD student in Computer Science at the University of Technology. My research focuses on natural language processing and machine learning, with particular interest in large language models, efficient fine-tuning, and cross-lingual transfer learning.",
        "I am broadly interested in building AI systems that are efficient, generalizable, and accessible — especially in low-resource settings. I collaborate closely with researchers across industry and academia on both fundamental and applied problems.",
        "Before my PhD, I received my B.Sc. in Computer Science from ABC University, where I worked on sequence modeling and information retrieval.",
      ]},
    },
    news: {
      type: [NewsItemSchema],
      default: [
        { date: "Jun 2026", type: "talk", text: 'Gave a talk on "Modern AI Applications in Industry" at TechConf 2026.' },
        { date: "Mar 2026", type: "paper", text: 'New paper accepted at ICML 2026: "Scalable Representation Learning for Large Language Models".' },
        { date: "Jan 2026", type: "award", text: "Received the Outstanding Researcher Award from XYZ Institute." },
        { date: "Oct 2025", type: "misc", text: "Started a new research collaboration with the AI Lab at University of Technology." },
      ],
    },
    publications: {
      type: [PublicationSchema],
      default: [
        {
          title: "Scalable Representation Learning for Large Language Models",
          authors: "Luc Phung, Jane Doe, John Smith",
          venue: "International Conference on Machine Learning (ICML)",
          year: "2026",
          links: [{ label: "Paper", href: "#" }, { label: "Code", href: "#" }],
        },
        {
          title: "Efficient Fine-tuning of Foundation Models via Adapter Networks",
          authors: "Luc Phung, Alice Wang, Bob Chen",
          venue: "Advances in Neural Information Processing Systems (NeurIPS)",
          year: "2025",
          links: [{ label: "Paper", href: "#" }, { label: "Code", href: "#" }],
        },
      ],
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
