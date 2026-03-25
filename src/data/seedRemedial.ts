export interface RemedialContent {
  kcId: string;
  title: string;
  explanation: string;
  videoUrl?: string;
}

export const seedRemedial: RemedialContent[] = [
  {
    kcId: "KC1",
    title: "Remedial: Data Representation",
    explanation: "It seems you struggled with reading and interpreting graphs. Let's review the core concepts of pictographs and bar graphs. A bar graph is a display of information using bars of uniform width...",
    videoUrl: "https://www.youtube.com/embed/n2YkbdNORp8"
  },
  {
    kcId: "KC2",
    title: "Remedial: Algebra Basics",
    explanation: "Algebra involves using letters to represent unknown numbers. Let's revisit how we form simple equations from word problems...",
    videoUrl: "https://www.youtube.com/embed/n2YkbdNORp8"
  },
  {
    kcId: "KC3",
    title: "Remedial: Geometry Foundations",
    explanation: "Geometry is all about shapes and their properties. Let's review the fundamental shapes and how to calculate their basic properties...",
    videoUrl: "https://www.youtube.com/embed/n2YkbdNORp8"
  }
];
