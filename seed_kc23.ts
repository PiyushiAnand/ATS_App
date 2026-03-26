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
    learningContent: "In a pie chart, we show data as parts of a whole. First, we convert the data into a fraction (part/total). Then, we change the fraction into a percentage by multiplying by 100. Finally, we convert the percentage into an angle by multiplying by 360°. Each part of the circle is called a sector, and together they make the full circle (360°).",
    exampleText: "Imagine a class where 10 students like football, 5 like cricket, and 5 like basketball (total = 20). Football = 10/20 = 1/2 = 50% → 50% of 360° = 180°. This means half the pie chart will represent football!",
    mediaUrl: "https://cdn1.byjus.com/wp-content/uploads/2020/03/Pie-Chart.png",
    videoUrl: "https://youtu.be/GjJdZaQrItg?si=xGjJhQYcLdMHY1Yo"
  },
  {
    kcId: "KC2",
    subtopicName: "Subtopic 2: Drawing a pie chart",
    order: 2,
    learningContent: "To draw a pie chart, we first draw a circle using a compass. Then we mark the center and use a protractor to measure angles for each category. Starting from one line, we draw sectors one by one using the calculated angles. Each sector is then labeled and colored differently so that it is easy to understand.",
    exampleText: "If football has 180°, cricket has 90°, and basketball has 90°, you draw a circle, mark the center, and use a protractor to draw these angles step by step. Finally, color each part differently and add labels.",
    mediaUrl: "https://www.mathsisfun.com/data/images/pie-chart-1.svg",
    videoUrl: "https://youtu.be/bqCSVof0e_k?si=ojf19LVqC1qGfNI3"
  },
  {
    kcId: "KC2",
    subtopicName: "Subtopic 3: Problem solving using Pie charts",
    order: 3,
    learningContent: "Pie charts can help us solve real-life problems. We can find missing values, convert angles back into data, and compare different categories easily. If we know the angle, we can find the fraction by dividing by 360°. Then we can calculate the actual values.",
    exampleText: "If a sector is 90°, then it represents 90/360 = 1/4 of the total. If total students = 40, then 1/4 of 40 = 10 students. So that sector represents 10 students.",
    mediaUrl: "https://cdn.kastatic.org/ka-perseus-images/2c9c8c3c6f1a2c9c1f6c7a9a0c4c8c3d2f4d5a6b.png",
    videoUrl: "https://youtu.be/lcKeZ0BJoT0?si=tQ_DLybUvTPKZShD"
  },

  // --- KC3: Basic Probability & Random Experiments ---
  {
    kcId: "KC3",
    subtopicName: "Subtopic 1: Introduction to Chance",
    order: 1,
    learningContent: "Chance tells us how likely something is to happen. Some events are certain (like the sun rising), some are impossible (like getting a 7 on a die), and some are uncertain (like rain tomorrow). Probability helps us describe these chances using numbers.",
    exampleText: "Priya carries her umbrella every day, but it doesn’t rain. One day she forgets it, and it rains heavily! This shows how chance works in real life.",
    mediaUrl: "https://www.mathsisfun.com/data/images/probability-scale.png",
    videoUrl: null
  },
  {
    kcId: "KC3",
    subtopicName: "Subtopic 2: Random Experiments & Outcomes",
    order: 2,
    learningContent: "A random experiment is an action where the result cannot be predicted exactly. Each possible result is called an outcome. Even though we know all possible outcomes, we cannot be sure which one will happen.",
    exampleText: "When you toss a coin, the outcomes are Head (H) or Tail (T). When you roll a die, the outcomes are 1, 2, 3, 4, 5, or 6.",
    mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Dice.jpg",
    videoUrl: null
  },
  {
    kcId: "KC3",
    subtopicName: "Subtopic 3: Equally Likely Outcomes",
    order: 3,
    learningContent: "When all outcomes of an experiment have the same chance of happening, they are called equally likely outcomes. This happens in fair situations like a fair coin or a fair die.",
    exampleText: "In a fair coin toss, getting Head or Tail has the same chance. So both outcomes are equally likely.",
    mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Coins.jpg",
    videoUrl: null
  },
  {
    kcId: "KC3",
    subtopicName: "Subtopic 4: Probability",
    order: 4,
    learningContent: "Probability is a number between 0 and 1 that tells us how likely an event is. It is calculated as: favourable outcomes divided by total outcomes. A probability closer to 1 means more likely, and closer to 0 means less likely.",
    exampleText: "For a coin toss, P(Head) = 1/2. For a die, P(getting 3) = 1/6. This means getting a 3 is less likely than getting either Head or Tail in a coin toss.",
    mediaUrl: "https://cdn1.byjus.com/wp-content/uploads/2020/02/Probability.png",
    videoUrl: null
  },
  {
    kcId: "KC3",
    subtopicName: "Subtopic 5: Events",
    order: 5,
    learningContent: "An event is a specific outcome or a group of outcomes that we are interested in. Events can have one or more outcomes depending on the situation.",
    exampleText: "When rolling a die, the event 'getting an even number' includes outcomes {2, 4, 6}. So, probability = 3/6 = 1/2.",
    mediaUrl: "https://www.onlinemathlearning.com/image-files/probability-events.png",
    videoUrl: null
  },
  {
    kcId: "KC3",
    subtopicName: "Subtopic 6: Probability in Real Life",
    order: 6,
    learningContent: "Probability is used in everyday life like weather forecasting, sports predictions, and games. The complementary rule helps us find the probability of an event not happening: P(not happening) = 1 − P(happening).",
    exampleText: "If the chance of rain is 1/10, then the chance of no rain is 9/10. This helps us make decisions like carrying an umbrella.",
    mediaUrl: "https://cdn1.byjus.com/wp-content/uploads/2020/02/Probability-Examples.png",
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