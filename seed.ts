import mongoose from "mongoose";
import { Lesson } from "./server/models/Lesson"; // Adjust the path if your model is elsewhere
import * as dotenv from "dotenv"; // 1. Import dotenv

// 2. Load the .env file (adjust the path if your .env is in a different folder)
dotenv.config(); 

// 3. Now it will successfully find your Atlas URI!
const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/cognipath";

console.log("Using URI:", MONGO_URI); // Add this to verify it's the Atlas string!
const lessonsData = [
  // --- KC1: Data Representation and Interpretation ---
  {
    kcId: "KC1",
    subtopicName: "Subtopic 1: Introduction to Data and Organising Data",
    order: 1,
    learningContent: "Information collected in various situations-such as runs made by a batsman in the last 10 IPL matches or marks scored by students in a Mathematics unit test-is called data. To draw meaningful inferences, data must be organised systematically. One common way to organise raw data is by using a frequency distribution table with tally marks.",
    exampleText: "Example: A teacher asks 20 students in a Delhi school about their favorite Indian snack. The responses are: Samosa, Vada Pav, Samosa, Dhokla... To organise this, we use tally marks where every fifth mark is a diagonal line crossing the previous four.",
    mediaUrl: null, 
    videoUrl: "https://www.youtube.com/embed/n2YkbdNORp8" // Example video URL
  },
  {
    kcId: "KC1",
    subtopicName: "Subtopic 2: Pictographs",
    order: 2,
    learningContent: "A Pictograph is a pictorial representation of data using symbols. Since data can involve large numbers, a single symbol often represents a specific quantity (a scale). For example, one symbol of a car might represent 100 actual cars.",
    exampleText: "Example: Production of tractors in a factory in Punjab: January, February. Scale: 10 tractors. In January, 3 symbols represent 30 tractors. In February, 2 symbols represent 20 tractors.",
    mediaUrl: null, 
    videoUrl: null
  },
  {
    kcId: "KC1",
    subtopicName: "Subtopic 3: Bar Graphs",
    order: 3,
    learningContent: "A Bar Graph is a display of information using bars of uniform width. The height of the bars is proportional to the values they represent. Bars are drawn with equal gaps in between them. A scale must be chosen (e.g., 1 unit length = 10 units) to fit the data on the graph.",
    exampleText: "Example: Wheat production in an Indian state (in lakh tons): 2021: 50, 2022: 70, 2023: 60. If we use a scale where 1 unit = 10 lakh tons, the bar for 2022 will be 7 units tall.",
    mediaUrl: null,
    videoUrl: null
  },
  {
    kcId: "KC1",
    subtopicName: "Subtopic 4: Double Bar Graphs",
    order: 4,
    learningContent: "A Double Bar Graph shows two sets of data simultaneously. It is primarily used for the comparison of data. For example, comparing a student's performance in Half-yearly exams versus Annual exams.",
    exampleText: "Example: Percentage of marks in different subjects for a student in Bengaluru: Maths 70|85, Science 80|75. By looking at the double bars, we can see that the student improved in Maths but their performance slightly decreased in Science.",
    mediaUrl: null,
    videoUrl: null
  },
];

const seedLessons = async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully!");

    // Clear existing lessons to prevent duplicates when running the script multiple times
    console.log("Clearing old lessons data...");
    await Lesson.deleteMany({});

    // Insert the new lessons array into the database
    console.log("Seeding new lessons...");
    await Lesson.insertMany(lessonsData);

    console.log("✅ Lessons seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding lessons:", error);
    process.exit(1);
  }
};

// Execute the function
seedLessons();