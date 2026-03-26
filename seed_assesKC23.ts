import mongoose from "./server/db/mongoose";
import * as dotenv from "dotenv";
import { Assessment } from "./server/models/Assessment"; 
import { Lesson } from "./server/models/Lesson"; 
import { Content } from "./server/models/Content"; 

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://piyushianand2128_db_user:cjdjLvrJMDDFMiKB@cluster0.074ksss.mongodb.net/?appName=Cluster0";

const kcAssessmentsData = [
  // ==================== KC2 ASSESSMENTS ====================
  {
    kcId: "KC2",
    order: 1,
    subtopicName: "Subtopic 1: Fractions & % calculations",
    questions: [
      { difficulty: "Easy", questionText: "A pie chart represents:", options: ["Only numbers", "Part-to-part comparison", "Part-to-whole relationship", "Only percentages"], correctAnswer: "Part-to-whole relationship" },
      { difficulty: "Easy", questionText: "What is a 'sector' in a pie chart?", options: ["A straight line", "A slice representing a category", "The center point", "The radius"], correctAnswer: "A slice representing a category" },
      { difficulty: "Medium", questionText: "A class has 40 students. 10 like chocolate cake. What fraction is this?", options: ["1/2", "1/4", "3/4", "2/5"], correctAnswer: "1/4" },
      { difficulty: "Medium", questionText: "Convert 25% into an angle for a pie chart.", options: ["45°", "60°", "90°", "120°"], correctAnswer: "90°", hint: { text: "(25% x 360 = 90°)", unlockTime: 10 } },
      { difficulty: "Hard", questionText: "A pie chart shows a sector of 72°. What fraction of the total does it represent?", options: ["1/4", "1/5", "1/6", "1/8"], correctAnswer: "1/5", hint: { text: "(72 / 360 = 1/5)", unlockTime: 20 } }
    ]
  },
  {
    kcId: "KC2",
    order: 2,
    subtopicName: "Subtopic 2: Drawing a Pie Chart",
    questions: [
      { difficulty: "Easy", questionText: "Which tool is used to measure angles?", options: ["Compass", "Ruler", "Protractor", "Divider"], correctAnswer: "Protractor" },
      { difficulty: "Easy", questionText: "What is the first step in drawing a pie chart?", options: ["Coloring sectors", "Drawing a circle", "Labeling", "Measuring angles"], correctAnswer: "Drawing a circle" },
      { difficulty: "Medium", questionText: "If a sector angle is 180°, what portion of the circle does it represent?", options: ["1/4", "1/3", "1/2", "3/4"], correctAnswer: "1/2" },
      { difficulty: "Medium", questionText: "A category has 20% data. What angle should you draw?", options: ["36°", "72°", "90°", "108°"], correctAnswer: "72°", hint: { text: "(20% x 360 = 72°)", unlockTime: 10 } },
      { difficulty: "Hard", questionText: "While drawing a pie chart, the sum of all sector angles must be:", options: ["180°", "270°", "360°", "Depends on data"], correctAnswer: "360°" }
    ]
  },
  {
    kcId: "KC2",
    order: 3,
    subtopicName: "Subtopic 3: Problem Solving Using Pie Charts",
    questions: [
      { difficulty: "Easy", questionText: "The pie chart shows flour takes the biggest portion. What does it mean?", options: ["Flour is least used", "Flour is most used", "Flour is not used", "Flour is optional"], correctAnswer: "Flour is most used" },
      { difficulty: "Easy", questionText: "If sugar is 25% of the chart, what does it represent?", options: ["Half of ingredients", "One-fourth of ingredients", "One-third of ingredients", "All ingredients"], correctAnswer: "One-fourth of ingredients" },
      { difficulty: "Medium", questionText: "If butter occupies 90° in the pie chart, what percentage is it?", options: ["20%", "25%", "30%", "35%"], correctAnswer: "25%", hint: { text: "(90 / 360 × 100 = 25%)", unlockTime: 10 } },
      { difficulty: "Medium", questionText: "The total cake weight is 2 kg. If chocolate is 50%, how much chocolate is used?", options: ["500 g", "1 kg", "1.5 kg", "2 kg"], correctAnswer: "1 kg" },
      { difficulty: "Hard", questionText: "A sector for milk is 60°. Total cake weight is 3 kg. How much milk is used?", options: ["0.25 kg", "0.5 kg", "1 kg", "1.5 kg"], correctAnswer: "0.5 kg", hint: { text: "(60 / 360 = 1/6 → 1/6 of 3 kg = 0.5 kg)", unlockTime: 20 } }
    ]
  },

  // ==================== KC3 ASSESSMENTS ====================
  {
    kcId: "KC3",
    order: 1,
    subtopicName: "Subtopic 1: Introduction to Chance",
    questions: [
      { difficulty: "Easy", questionText: "What does 'chance' mean?", options: ["A fixed, known result", "Something that may or may not happen", "A maths formula", "A type of graph"], correctAnswer: "Something that may or may not happen" },
      { difficulty: "Easy", questionText: "Which of these is certain to happen?", options: ["Getting a 6 when you roll a die", "The sun rising tomorrow", "Your team winning the cricket match", "Getting heads on a coin flip"], correctAnswer: "The sun rising tomorrow" },
      { difficulty: "Medium", questionText: "Which situation involves chance?", options: ["3 × 4 = 12", "Water freezes at 0°C", "Winning a lucky draw", "Earth orbiting the sun"], correctAnswer: "Winning a lucky draw", hint: { text: "Which result cannot be known in advance?", unlockTime: 10 } },
      { difficulty: "Medium", questionText: "Why do we study chance?", options: ["To make uncertainty disappear", "To understand how likely events are", "To create equations", "To draw bar graphs"], correctAnswer: "To understand how likely events are", hint: { text: "Chance helps us predict — not guarantee.", unlockTime: 10 } },
      { difficulty: "Hard", questionText: "Ravi says: 'I got tails 5 times in a row, so I must get heads next.' Is he right?", options: ["Yes — it balances out each turn", "No — each coin flip is independent of the last", "Yes — tails cannot occur 6 times in a row", "No — coins always give tails"], correctAnswer: "No — each coin flip is independent of the last", hint: { text: "Does a coin 'remember' what it showed last time?", unlockTime: 20 } }
    ]
  },
  {
    kcId: "KC3",
    order: 2,
    subtopicName: "Subtopic 2: Random Experiments & Outcomes",
    questions: [
      { difficulty: "Easy", questionText: "What makes an experiment 'random'?", options: ["It has a fixed, known result", "Its result cannot be predicted in advance", "It involves drawing graphs", "It always gives the same outcome"], correctAnswer: "Its result cannot be predicted in advance" },
      { difficulty: "Easy", questionText: "How many outcomes does tossing a fair coin have?", options: ["1", "2", "3", "6"], correctAnswer: "2" },
      { difficulty: "Medium", questionText: "Which of the following is NOT a random experiment?", options: ["Rolling a die", "Drawing a card from a shuffled deck", "Calculating 12 × 5", "Tossing a coin"], correctAnswer: "Calculating 12 × 5", hint: { text: "Is the result always fixed?", unlockTime: 10 } },
      { difficulty: "Medium", questionText: "A bag has a red, a blue, and a green ball. You pick one without looking. How many outcomes are there?", options: ["1", "2", "3", "6"], correctAnswer: "3", hint: { text: "Count the possible balls you could pick.", unlockTime: 10 } },
      { difficulty: "Hard", questionText: "You try to start a scooter. Which best describes the possible outcomes?", options: ["Only 'starts' is an outcome", "'Starts' and 'does not start'", "Only 'does not start' is an outcome", "No outcomes exist"], correctAnswer: "'Starts' and 'does not start'", hint: { text: "Outcomes = all possible results, including failure.", unlockTime: 20 } }
    ]
  },
  {
    kcId: "KC3",
    order: 3,
    subtopicName: "Subtopic 3: Equally Likely Outcomes",
    questions: [
      { difficulty: "Easy", questionText: "What does 'equally likely' mean?", options: ["All outcomes happen at the same time", "Each outcome has the same chance of occurring", "Only one outcome is possible", "Outcomes are always the same"], correctAnswer: "Each outcome has the same chance of occurring" },
      { difficulty: "Easy", questionText: "On a fair coin, the chance of getting Heads compared to Tails is:", options: ["Head is more likely", "Tail is more likely", "Both are equally likely", "Neither can occur"], correctAnswer: "Both are equally likely" },
      { difficulty: "Medium", questionText: "You have a bag with 5 red balls and 1 blue ball. Are the outcomes equally likely?", options: ["Yes — there are still only 2 colours", "No — red has a much greater chance", "Yes — all experiments are equally likely", "Cannot be determined"], correctAnswer: "No — red has a much greater chance", hint: { text: "More red balls = more chances of picking red.", unlockTime: 10 } },
      { difficulty: "Medium", questionText: "Which experiment produces equally likely outcomes?", options: ["Guessing a friend's favourite colour", "Predicting tomorrow's weather", "Throwing a standard fair die", "Picking from a bag with different numbers of balls"], correctAnswer: "Throwing a standard fair die", hint: { text: "A fair die means every face has an equal chance.", unlockTime: 10 } },
      { difficulty: "Hard", questionText: "A die is 'loaded' — the number 6 is slightly heavier so it faces down more. Are the outcomes equally likely?", options: ["Yes — a die always has 6 faces", "No — some numbers appear more often than others", "Yes — all six numbers can still appear", "Cannot say without more data"], correctAnswer: "No — some numbers appear more often than others", hint: { text: "Loading changes the fairness of the die.", unlockTime: 20 } }
    ]
  },
  {
    kcId: "KC3",
    order: 4,
    subtopicName: "Subtopic 4: Probability",
    questions: [
      { difficulty: "Easy", questionText: "What is the probability of getting Heads when tossing a fair coin?", options: ["0", "1", "1/2", "2"], correctAnswer: "1/2" },
      { difficulty: "Easy", questionText: "When rolling a die, how many total outcomes are there?", options: ["2", "4", "6", "12"], correctAnswer: "6" },
      { difficulty: "Medium", questionText: "What is the probability of rolling a 4 on a fair die?", options: ["4/6", "1/4", "1/6", "1"], correctAnswer: "1/6", hint: { text: "Only one face shows 4, out of 6 faces.", unlockTime: 10 } },
      { difficulty: "Medium", questionText: "What is the probability of rolling a number greater than 6 on a standard die?", options: ["1/6", "6/6", "1/2", "0"], correctAnswer: "0", hint: { text: "A standard die only has 1–6. Getting >6 is impossible.", unlockTime: 10 } },
      { difficulty: "Hard", questionText: "A bag has 4 red and 2 yellow balls. What is the probability of picking a red ball?", options: ["1/6", "2/6 = 1/3", "4/6 = 2/3", "4/2"], correctAnswer: "4/6 = 2/3", hint: { text: "4 red balls out of 6 total balls.", unlockTime: 20 } }
    ]
  },
  {
    kcId: "KC3",
    order: 5,
    subtopicName: "Subtopic 5: Events",
    questions: [
      { difficulty: "Easy", questionText: "What is an event in probability?", options: ["The experiment itself", "One or more outcomes we are interested in", "The total number of outcomes", "A type of graph"], correctAnswer: "One or more outcomes we are interested in" },
      { difficulty: "Easy", questionText: "The even numbers on a die are:", options: ["1, 3, 5", "2, 4, 6", "All 6 numbers", "Only 2 and 4"], correctAnswer: "2, 4, 6" },
      { difficulty: "Medium", questionText: "How many outcomes make up the event 'getting an even number on a die'?", options: ["2", "3", "6", "1"], correctAnswer: "3", hint: { text: "Count the even numbers: {2, 4, 6}", unlockTime: 10 } },
      { difficulty: "Medium", questionText: "What is the probability of getting a prime number on a die? (Prime numbers: 2, 3, 5)", options: ["1/6", "2/6", "3/6 = 1/2", "5/6"], correctAnswer: "3/6 = 1/2", hint: { text: "3 prime numbers out of 6 total outcomes.", unlockTime: 10 } },
      { difficulty: "Hard", questionText: "Which of the following is NOT an event when tossing two coins?", options: ["Getting two Heads (HH)", "Getting one Head and one Tail", "Getting three Heads", "Getting at least one Tail"], correctAnswer: "Getting three Heads", hint: { text: "You only have two coins. Three heads is impossible.", unlockTime: 20 } }
    ]
  },
  {
    kcId: "KC3",
    order: 6,
    subtopicName: "Subtopic 6: Probability in Real Life",
    questions: [
      { difficulty: "Easy", questionText: "Which of the following is a real-life use of probability?", options: ["Weather forecasting", "Election predictions", "Quality checks in factories", "All of the above"], correctAnswer: "All of the above" },
      { difficulty: "Easy", questionText: "If P(rain today) = 0, what does that mean?", options: ["It will definitely rain", "There is a small chance of rain", "It is impossible for it to rain today", "We do not know if it will rain"], correctAnswer: "It is impossible for it to rain today" },
      { difficulty: "Medium", questionText: "P(event) = 1 means:", options: ["The event is impossible", "The event is equally likely to happen or not", "The event is certain to happen", "The event has not been defined"], correctAnswer: "The event is certain to happen", hint: { text: "P = 1 means 100% certain.", unlockTime: 10 } },
      { difficulty: "Medium", questionText: "The Meteorological Department says P(rain) = 3/10. What is the probability of no rain?", options: ["3/10", "7/10", "1/10", "10/3"], correctAnswer: "7/10", hint: { text: "P(no rain) = 1 − P(rain) = 1 − 3/10 = 7/10", unlockTime: 10 } },
      { difficulty: "Hard", questionText: "An exit poll surveys 500 people as they leave a polling booth. It predicts Candidate A will win with P = 3/5. Why might this prediction be wrong?", options: ["Probability can never be applied to elections", "The sample may not represent all voters accurately", "P = 3/5 means Candidate A definitely wins", "Exit polls are always perfectly accurate"], correctAnswer: "The sample may not represent all voters accurately", hint: { text: "Probability from samples gives estimates, not guarantees.", unlockTime: 20 } }
    ]
  }
];

const seedAssessments = async () => {
  try {
    console.log(`Connecting to database...`);
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully!");

    console.log("Clearing old KC2 and KC3 Assessments...");
    await Assessment.deleteMany({ kcId: { $in: ["KC2", "KC3"] } });

    for (const subtopic of kcAssessmentsData) {
      console.log(`\nProcessing ${subtopic.kcId} - ${subtopic.subtopicName}...`);

      const lesson = await Lesson.findOne({ kcId: subtopic.kcId, order: subtopic.order });
      
      if (!lesson) {
        console.warn(`⚠️ Warning: Lesson for ${subtopic.kcId} order ${subtopic.order} not found. Skipping assessment creation for this subtopic.`);
        continue;
      }

      const questionIds = [];

      for (const qData of subtopic.questions) {
        const question = await Content.findOneAndUpdate(
          { kcId: subtopic.kcId, questionText: qData.questionText }, 
          { ...qData, kcId: subtopic.kcId, subtopicId: subtopic.order },
          { new: true, upsert: true }
        );
        
        questionIds.push(question._id);
      }

      await Assessment.create({
        kcId: subtopic.kcId,
        subtopicName: subtopic.subtopicName,
        lessonId: lesson._id,
        questions: questionIds,
        totalMarks: 5
      });

      console.log(`✅ Successfully created Assessment for ${subtopic.kcId} - ${subtopic.subtopicName} with 5 questions.`);
    }

    console.log("\n🎉 All KC2 and KC3 Assessments Seeded Successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding Assessments:", error);
    process.exit(1);
  }
};

seedAssessments();