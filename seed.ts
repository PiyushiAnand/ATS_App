import mongoose from "./server/db/mongoose";
import { Lesson } from "./server/models/Lesson";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ats-app-db";

console.log("Using URI:", MONGO_URI);
const getEmbedUrl = (url) => {
  if (!url) return '';
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1].split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes('youtube.com/watch')) {
    const urlObj = new URL(url);
    const videoId = urlObj.searchParams.get('v');
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url; 
};
const lessonsData = [
  // --- KC1 ---
  {
    kcId: "KC1",
    subtopicName: "Subtopic 1: Introduction to Data and Organising Data",
    order: 1,
    learningContent:
      "Data means information that we collect. For example, marks of students, runs scored in a match, or favourite foods of friends. When data is messy, it is hard to understand. So, we organise it in a simple way. One easy method is using tally marks, where we count and group things in sets of 5.",
    exampleText:
      "Suppose you ask 20 classmates their favourite snack. Instead of writing a long list, you use tally marks. For every 'Samosa', you draw a line. When you reach 5, you draw a line across the previous 4 to make a group. This makes counting quick and easy!",
    mediaUrl: null,
    videoUrl: "https://youtu.be/zF_dBk8EPDk?si=qjSom_kHQPQ_-bTM",
    animation: {
      type: "tally-build",
      config: {
        count: 20,
      },
    },
  },

  {
    kcId: "KC1",
    subtopicName: "Subtopic 2: Pictographs",
    order: 2,
    learningContent:
      "A pictograph shows data using pictures or symbols. It helps us understand information quickly. Each picture stands for a fixed number. This number is called the scale.",
    exampleText:
      "Imagine a chart showing cars made in a factory. If 1 car picture means 100 cars, then 2 pictures mean 200 cars. If you see half a picture, it means 50 cars.",
    mediaUrl: null,
    videoUrl: "https://youtu.be/V4vijfX-3u0?si=wc8Iz7qGTw6dT5sq",
    animation: {
      type: "pictograph-scale",
      config: {
        count: 3,
        icon: "🚗",
        scale: 100,
      },
    },
  },

  {
    kcId: "KC1",
    subtopicName: "Subtopic 3: Bar Graphs",
    order: 3,
    learningContent:
      "A bar graph shows data using bars. Each bar represents a value, and taller bars mean bigger values. All bars have the same width and equal gaps between them.",
    exampleText:
      "Suppose a teacher records the number of students in different years. Each year is shown with a bar. The taller the bar, the more students there are in that year.",
    mediaUrl: null,
    videoUrl: "https://youtu.be/l8kR7ScrfQA?si=NAql5m_zFXhIue6p",
    animation: {
      type: "bar-grow",
      config: {
        data: [
          { label: "2021", value: 50 },
          { label: "2022", value: 70 },
          { label: "2023", value: 60 },
        ],
      },
    },
  },

  {
    kcId: "KC1",
    subtopicName: "Subtopic 4: Double Bar Graphs",
    order: 4,
    learningContent:
      "A double bar graph is used to compare two sets of data. For each category, two bars are shown side by side. This helps us easily see the difference.",
    exampleText:
      "Suppose you compare your marks in Maths and Science for two years. For each subject, you draw two bars—one for last year and one for this year. This helps you see where you improved.",
    mediaUrl: null,
    videoUrl: "https://youtu.be/4UQAD3xTSLk?si=vuQVRDjZ6neSn5sk",
    animation: {
      type: "double-bar-compare",
      config: {
        data: [
          { label: "Maths", value: 30, valueB: 60 },
          { label: "Science", value: 50, valueB: 55 },
          { label: "English", value: 45, valueB: 50 },
        ],
      },
    },
  },
];

const seedLessons = async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(MONGO_URI);

    console.log("Connected successfully!");
    console.log("Seeding new lessons...");
    console.log("Mongoose connection state:", mongoose.connection.readyState);
    console.log("Model DB state:", Lesson.db.readyState);
    
    const processedLessonsData = lessonsData.map(lesson => ({
      ...lesson,
      videoUrl: getEmbedUrl(lesson.videoUrl)
    }));
    // Clear old seeded entries to avoid duplicate constraints if any exist
    await Lesson.deleteMany({ kcId: "KC1" });
    await Lesson.insertMany(processedLessonsData);

    console.log("✅ Lessons seeded successfully with textbook-accurate animation configs!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding lessons:", error);
    process.exit(1);
  }
};

seedLessons();