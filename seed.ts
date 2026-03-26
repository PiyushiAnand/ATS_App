import mongoose from "./server/db/mongoose";
import { Lesson } from "./server/models/Lesson";

const MONGO_URI = "mongodb+srv://piyushianand2128_db_user:cjdjLvrJMDDFMiKB@cluster0.074ksss.mongodb.net/?appName=Cluster0";

console.log("Using URI:", MONGO_URI);

const lessonsData = [
  // --- KC1: Data Representation and Interpretation ---
  {
    kcId: "KC1",
    subtopicName: "Subtopic 1: Introduction to Data and Organising Data",
    order: 1,
    learningContent: "Information collected in various situations—such as runs made by a batsman in the last 10 test matches or marks scored by students in a Mathematics unit test—is called data. To draw meaningful inferences from any raw data, we need to organise it systematically.",
    exampleText: "Example: To find the average height of students, a teacher writes down the heights of all the students in her class, organises the data in a systematic manner (like a frequency table), and then interprets it accordingly.",
    mediaUrl: null, 
    videoUrl: "https://www.youtube.com/embed/n2YkbdNORp8",
    animation: {
      type: "tally-build",
      config: {
        count: 24 // Can represent 24 heights or measurements to run a tally build
      }
    }
  },
  {
    kcId: "KC1",
    subtopicName: "Subtopic 2: Pictographs",
    order: 2,
    learningContent: "A Pictograph is a pictorial representation of data using symbols. It gives a clear, visual idea of quantities at a single glance.",
    exampleText: "Example: Tracking car production over months where one car symbol stands for 100 cars. If July shows 2 and a half symbols, it denotes 250 cars (since a half-symbol denotes half of 100).",
    mediaUrl: null, 
    videoUrl: null,
    animation: {
      type: "pictograph-scale",
      config: {
        count: 3, // Represents 300 cars for August
        icon: "🚗"
      }
    }
  },
  {
    kcId: "KC1",
    subtopicName: "Subtopic 3: Bar Graphs",
    order: 3,
    learningContent: "A bar graph is a display of information using bars of uniform width, with their heights being proportional to the respective values they represent. The bars are drawn with equal gaps in between them.",
    exampleText: "Example: Number of students in Class VIII over multiple academic years. The bar heights give the exact quantity for each category (Year).",
    mediaUrl: null,
    videoUrl: null,
    animation: {
      type: "bar-grow",
      config: {
        data: [
          { label: "2003-04", value: 100 },
          { label: "2004-05", value: 200 },
          { label: "2005-06", value: 250 },
          { label: "2006-07", value: 300 },
          { label: "2007-08", value: 350 }
        ]
      }
    }
  },
  {
    kcId: "KC1",
    subtopicName: "Subtopic 4: Double Bar Graphs",
    order: 4,
    learningContent: "A Double Bar Graph is a bar graph showing two sets of data simultaneously. It is highly useful for direct comparisons of data patterns.",
    exampleText: "Example: Comparing marks obtained by a student across different subjects between two academic years (e.g., 2005-06 vs 2006-07). It allows us to pinpoint where performance improved, deteriorated, or stayed at par.",
    mediaUrl: null,
    videoUrl: null,
    animation: {
      type: "double-bar-compare",
      config: {
        data: [
          { label: "Maths", value: 30, valueB: 60 },
          { label: "S.Science", value: 50, valueB: 55 },
          { label: "Science", value: 45, valueB: 50 },
          { label: "English", value: 50, valueB: 45 },
          { label: "Hindi", value: 60, valueB: 60 }
        ]
      }
    }
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
    
    // Clear old seeded entries to avoid duplicate constraints if any exist
    await Lesson.deleteMany({ kcId: "KC1" });
    await Lesson.insertMany(lessonsData);

    console.log("✅ Lessons seeded successfully with textbook-accurate animation configs!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding lessons:", error);
    process.exit(1);
  }
};

seedLessons();