import mongoose from "./server/db/mongoose";
import { Lesson } from "./server/models/Lesson";
import * as dotenv from "dotenv";

dotenv.config(); 

const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://piyushianand2128_db_user:cjdjLvrJMDDFMiKB@cluster0.074ksss.mongodb.net/?appName=Cluster0";

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
  // --- KC2: Pie Charts ---
  {
    kcId: "KC2",
    subtopicName: "Subtopic 1: Fractions & % calculations",
    order: 1,
    learningContent: "In a pie chart, we show data as parts of a whole. First, we convert the data into a fraction (part/total). Then, we change the fraction into a percentage by multiplying by 100. Finally, we convert the percentage into an angle by multiplying by 360°. Each part of the circle is called a sector, and together they make the full circle (360°).",
    exampleText: "Imagine a class where 10 students like football, 5 like cricket, and 5 like basketball (total = 20). Football = 10/20 = 1/2 = 50% → 50% of 360° = 180°. This means half the pie chart will represent football!",
    mediaUrl: "https://cdn1.byjus.com/wp-content/uploads/2020/03/Pie-Chart.png",
    videoUrl: "https://youtu.be/GjJdZaQrItg?si=xGjJhQYcLdMHY1Yo",
   animation: {
  type: "pie-chart",
  config: {
    data: [
      { label: "Football", value: 10, color: "#4f46e5" },
      { label: "Cricket", value: 5, color: "#10b981" },
      { label: "Basketball", value: 5, color: "#f59e0b" }
    ],
    options: {
      showLabels: true
    }
  }
}
  },
  {
  kcId: "KC2",
  subtopicName: "Subtopic 2: Drawing a pie chart",
  order: 2,
  learningContent: "To draw a pie chart, we first draw a circle using a compass. Then we mark the center and use a protractor to measure angles for each category. Starting from one line, we draw sectors one by one using the calculated angles. Each sector is then labeled and colored differently so that it is easy to understand.",
  exampleText: "If football has 180°, cricket has 90°, and basketball has 90°, you draw a circle, mark the center, and use a protractor to draw these angles step by step. Finally, color each part differently and add labels.",
  mediaUrl: "https://www.mathsisfun.com/data/images/pie-chart-1.svg",
  videoUrl: "https://youtu.be/t4aAOzSNabI?si=fRj4p9VQOwpWq94S&t=1",

 animation: {
  type: "pie-drawing",
  config: {
    data: [
      { label: "Football", value: 50, color: "#e11d48" },
      { label: "Cricket", value: 25, color: "#0ea5e9" },
      { label: "Basketball", value: 25, color: "#8b5cf6" }
    ],

    steps: [
      { type: "circle" },
      { type: "center-point" },
      { type: "radius" },

      { type: "sector", index: 0 },
      { type: "sector", index: 1 },
      { type: "sector", index: 2 },

      { type: "labels" }
    ],

    options: {
      animateSequentially: true,
      stepDuration: 1200,
      showAngles: true
    }
  }
}
  },
  {
    kcId: "KC2",
    subtopicName: "Subtopic 3: Problem solving using Pie charts",
    order: 3,
    learningContent: "Pie charts can help us solve real-life problems. We can find missing values, convert angles back into data, and compare different categories easily. If we know the angle, we can find the fraction by dividing by 360°. Then we can calculate the actual values.",
    exampleText: "If a sector is 90°, then it represents 90/360 = 1/4 of the total. If total students = 40, then 1/4 of 40 = 10 students. So that sector represents 10 students.",
    mediaUrl: "https://cdn.kastatic.org/ka-perseus-images/2c9c8c3c6f1a2c9c1f6c7a9a0c4c8c3d2f4d5a6b.png",
    videoUrl: "https://youtu.be/SdON8PfHoDc?si=MPu_ftCtmMzorKVx&t=3",
    animation: {
  type: "pie-chart",
  config: {
    data: [
      { label: "Target Sector (10 students)", value: 10, color: "#10b981" },
      { label: "Other Students (30)", value: 30, color: "#cbd5e1" }
    ],
    options: {
      highlightIndex: 0
    }
  }
}
  },

  // --- KC3: Basic Probability & Random Experiments ---
  {
    kcId: "KC3",
    subtopicName: "Subtopic 1: Introduction to Chance",
    order: 1,
    learningContent: "Chance tells us how likely something is to happen. Some events are certain (like the sun rising), some are impossible (like getting a 7 on a die), and some are uncertain (like rain tomorrow). Probability helps us describe these chances using numbers.",
    exampleText: "Priya carries her umbrella every day, but it doesn’t rain. One day she forgets it, and it rains heavily! This shows how chance works in real life.",
    mediaUrl: "https://www.mathsisfun.com/data/images/probability-scale.png",
    videoUrl: "https://youtu.be/7XuNVVlD98g?si=s8eK6kYOcLO3YGl5",
   animation: {
  type: "chance-scale",
  config: {
    points: [
      { label: "Impossible", value: 0 },
      { label: "Unlikely", value: 0.25 },
      { label: "Even Chance", value: 0.5 },
      { label: "Likely", value: 0.75 },
      { label: "Certain", value: 1 }
    ],
    options: {
      showValues: true
    }
  }
}
  },
  {
    kcId: "KC3",
    subtopicName: "Subtopic 2: Random Experiments & Outcomes",
    order: 2,
    learningContent: "A random experiment is an action where the result cannot be predicted exactly. Each possible result is called an outcome. Even though we know all possible outcomes, we cannot be sure which one will happen.",
    exampleText: "When you toss a coin, the outcomes are Head (H) or Tail (T). When you roll a die, the outcomes are 1, 2, 3, 4, 5, or 6.",
    mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Dice.jpg",
    videoUrl: " https://youtu.be/DVCPcXvEdq4?si=tm94eGrVIEYQWuuN",
    animation: {
  type: "coin-flip",
  config: {
    initial: "H",
    states: ["H", "T"],
    interactive: true
  }
}
  },
  {
    kcId: "KC3",
    subtopicName: "Subtopic 3: Equally Likely Outcomes",
    order: 3,
    learningContent: "When all outcomes of an experiment have the same chance of happening, they are called equally likely outcomes. This happens in fair situations like a fair coin or a fair die.",
    exampleText: "In a fair coin toss, getting Head or Tail has the same chance. So both outcomes are equally likely.",
    mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Coins.jpg",
    videoUrl: "https://youtu.be/eHJ40sSkYLE?si=kklnZVpU95F3PZgo&t=1",
 animation: {
  type: "equal-outcomes",
  config: {
    items: [
      { label: "Head" },
      { label: "Tail" }
    ],
    options: {
      equal: true
    }
  }
}
  },
  {
    kcId: "KC3",
    subtopicName: "Subtopic 4: Probability",
    order: 4,
    learningContent: "Probability is a number between 0 and 1 that tells us how likely an event is. It is calculated as: favourable outcomes divided by total outcomes. A probability closer to 1 means more likely, and closer to 0 means less likely.",
    exampleText: "For a coin toss, P(Head) = 1/2. For a die, P(getting 3) = 1/6. This means getting a 3 is less likely than getting either Head or Tail in a coin toss.",
    mediaUrl: "https://cdn1.byjus.com/wp-content/uploads/2020/02/Probability.png",
    videoUrl: "https://youtu.be/lYXDQ5-I7Qk?si=pqBMPfE-FdviMOn7",
  },
  {
    kcId: "KC3",
    subtopicName: "Subtopic 5: Events",
    order: 5,
    learningContent: "An event is a specific outcome or a group of outcomes that we are interested in. Events can have one or more outcomes depending on the situation.",
    exampleText: "When rolling a die, the event 'getting an even number' includes outcomes {2, 4, 6}. So, probability = 3/6 = 1/2.",
    mediaUrl: "https://www.onlinemathlearning.com/image-files/probability-events.png",
    videoUrl: "https://www.youtube.com/watch?v=v6gZ5LiEouQ",
   
  },
  {
    kcId: "KC3",
    subtopicName: "Subtopic 6: Probability in Real Life",
    order: 6,
    learningContent: "Probability is used in everyday life like weather forecasting, sports predictions, and games. The complementary rule helps us find the probability of an event not happening: P(not happening) = 1 − P(happening).",
    exampleText: "If the chance of rain is 1/10, then the chance of no rain is 9/10. This helps us make decisions like carrying an umbrella.",
    mediaUrl: "https://cdn1.byjus.com/wp-content/uploads/2020/02/Probability-Examples.png",
    videoUrl: "https://youtu.be/Gpvddf7QAm4?si=fbNNYcglt08FDgOY",
  
  }
];

const seedLessons = async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully!");

    const processedLessonsData = lessonsData.map(lesson => ({
      ...lesson,
      videoUrl: getEmbedUrl(lesson.videoUrl)
    }));
    console.log("Clearing old KC2 and KC3 lessons data...");
    await Lesson.deleteMany({ kcId: { $in: ["KC2", "KC3"] } });

    console.log("Seeding new lessons...");
    await Lesson.insertMany(processedLessonsData);

    console.log("✅ KC2 and KC3 Lessons seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding lessons:", error);
    process.exit(1);
  }
};

seedLessons();