import mongoose from "mongoose";
import { Lesson } from "./server/models/Lesson";
import * as dotenv from "dotenv";

dotenv.config(); 

const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://piyushianand2128_db_user:cjdjLvrJMDDFMiKB@cluster0.074ksss.mongodb.net/?appName=Cluster0";

console.log("Using URI:", MONGO_URI);

const lessonsData = [
  // --- KC2: Pie Charts ---
  {
    kcId: "KC2",
    subtopicName: "Subtopic 1: Fractions & % calculations",
    order: 1,
    learningContent: "Concepts involve converting data to fractions/ratio (part/total), fractions to percentage (frac * 100%), and percentage to angles (% * 360). Understanding what a sector is.",
    exampleText: "Animation going from data -> fraction -> percentage -> angle.",
    mediaUrl: null, 
    videoUrl: null
  },
  {
    kcId: "KC2",
    subtopicName: "Subtopic 2: Drawing a pie chart",
    order: 2,
    learningContent: "Concepts involve how to use a compass and protractor, marking the center and radius, and labeling sectors (either color or design) based on angles.",
    exampleText: "Video of drawing a pie chart from the angles calculated in the previous subtopic.",
    mediaUrl: null, 
    videoUrl: null
  },
  {
    kcId: "KC2",
    subtopicName: "Subtopic 3: Problem solving using Pie charts",
    order: 3,
    learningContent: "Concepts involve finding missing values, reverse calculation (angle -> data), and real-life applications (like calculating amounts from a different total).",
    exampleText: "Written slides detailing real-life examples and calculations.",
    mediaUrl: null, 
    videoUrl: null
  },

  // --- KC3: Basic Probability & Random Experiments ---
  {
    kcId: "KC3",
    subtopicName: "Subtopic 1: Introduction to Chance",
    order: 1,
    learningContent: "Chance tells us how likely something is to happen. Some things are almost certain, some are 50-50, and some are almost impossible.",
    exampleText: "Priya carries her umbrella every single day of the monsoon — and it never rains. The one day she forgets it at home, it pours! That is chance.",
    mediaUrl: null, 
    videoUrl: null
  },
  {
    kcId: "KC3",
    subtopicName: "Subtopic 2: Random Experiments & Outcomes",
    order: 2,
    learningContent: "A random experiment is any activity where you cannot predict the result exactly before doing it. You can list all possible results, but you cannot say which one will actually happen.",
    exampleText: "Tossing a coin gives Head (H) or Tail (T) -> 2 outcomes. Throwing a die gives 1, 2, 3, 4, 5, or 6 -> 6 outcomes.",
    mediaUrl: null, 
    videoUrl: null
  },
  {
    kcId: "KC3",
    subtopicName: "Subtopic 3: Equally Likely Outcomes",
    order: 3,
    learningContent: "When all outcomes have the same chance of occurring, they are equally likely. For example, a fair coin or a standard die.",
    exampleText: "Before a cricket match, captains toss a coin. Neither can control whether it lands on heads or tails. Each outcome has exactly the same chance.",
    mediaUrl: null, 
    videoUrl: null
  },
  {
    kcId: "KC3",
    subtopicName: "Subtopic 4: Probability",
    order: 4,
    learningContent: "Probability measures chance with a number between 0 and 1. Formula: Probability of an Event = Number of Favourable Outcomes / Total Number of Equally Likely Outcomes.",
    exampleText: "Coin toss — P(Head) = 1 favourable outcome ÷ 2 total outcomes = 1/2. Rolling a die — P(getting 3) = 1/6.",
    mediaUrl: null, 
    videoUrl: null
  },
  {
    kcId: "KC3",
    subtopicName: "Subtopic 5: Events",
    order: 5,
    learningContent: "An event is one outcome or a collection of outcomes that we are interested in.",
    exampleText: "When you throw a die, you might only care about getting an even number. The event 'even number' = {2, 4, 6} — a group of 3 outcomes (Probability = 3/6 = 1/2).",
    mediaUrl: null, 
    videoUrl: null
  },
  {
    kcId: "KC3",
    subtopicName: "Subtopic 6: Probability in Real Life",
    order: 6,
    learningContent: "Probability is all around us: Weather forecasts, election exit polls, cricket match predictions, and medical testing. The Complementary Rule: P(event happens) + P(event does not happen) = 1.",
    exampleText: "If P(rain) = 1/10, then P(no rain) = 1 − 1/10 = 9/10.",
    mediaUrl: null, 
    videoUrl: null
  }
];

const seedLessons = async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully!");

    console.log("Clearing old KC2 and KC3 lessons data...");
    await Lesson.deleteMany({ kcId: { $in: ["KC2", "KC3"] } });

    console.log("Seeding new lessons...");
    await Lesson.insertMany(lessonsData);

    console.log("✅ KC2 and KC3 Lessons seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding lessons:", error);
    process.exit(1);
  }
};

seedLessons();