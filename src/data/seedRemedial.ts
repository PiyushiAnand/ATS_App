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
    explanation:
      "It looks like you're finding data representation a bit tricky — that's completely okay! 😊\n\n" +
      "Let's go over how data can be shown using simple methods like tally marks, pictographs, and bar graphs.\n\n" +
      "Focus on:\n" +
      "• Counting correctly using groups (like tally marks in sets of 5)\n" +
      "• Understanding what each symbol or bar represents\n" +
      "• Reading data carefully before answering\n\n" +
      "Watch the video below and then try the questions again. You’ve got this!",
    videoUrl: "https://youtu.be/8eDW4zjIxY8?si=zcObly1EGA85M4W2"
  },
  {
    kcId: "KC2",
    title: "Remedial: Algebra Basics",
    explanation:
      "Algebra can feel confusing at first, but it's just a way of representing unknown values using letters.\n\n" +
      "In this lesson, we’ll revisit:\n" +
      "• How to translate words into simple equations\n" +
      "• What variables (like x or y) mean\n" +
      "• How to solve basic equations step by step\n\n" +
      "Take your time with the video and try to follow along with examples. Practice will make it much easier!",
    videoUrl: "https://www.youtube.com/embed/n2YkbdNORp8"
  },
  {
    kcId: "KC3",
    title: "Remedial: Geometry Foundations",
    explanation:
      "Geometry is all about understanding shapes and how they behave.\n\n" +
      "Let’s strengthen your basics by reviewing:\n" +
      "• Common shapes (triangle, square, circle, etc.)\n" +
      "• Their properties (sides, angles, edges)\n" +
      "• Simple ways to measure or compare them\n\n" +
      "Watch carefully and try to visualize each concept — geometry becomes much easier when you can picture it!",
    videoUrl: "https://www.youtube.com/embed/n2YkbdNORp8"
  }
];
