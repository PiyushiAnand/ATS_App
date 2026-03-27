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
    {
      difficulty: "Easy",
      questionText: "A pie chart represents:",
      options: ["Only numbers", "Part-to-part comparison", "Part-to-whole relationship", "Only percentages"],
      correctAnswer: "Part-to-whole relationship"
    },
    {
      difficulty: "Easy",
      questionText: "What is a 'sector' in a pie chart?",
      options: ["A straight line", "A slice representing a category", "The center point", "The radius"],
      correctAnswer: "A slice representing a category"
    },
    {
      difficulty: "Medium",
      questionText: "A class has 40 students. 15 like chocolate cake. What fraction represents this?",
      options: ["3/8", "1/4", "1/2", "5/8"],
      correctAnswer: "3/8",
      hint: { text: "Fraction = part / total → 15 / 40 → simplify.", unlockTime: 10 },
      animation: {
        type: "pie-chart",
        config: {
          data: [
            { label: "Chocolate", value: 15 },
            { label: "Others", value: 25 }
          ]
        }
      }
    },
    {
      difficulty: "Medium",
      questionText: "Convert 12.5% into an angle for a pie chart.",
      options: ["30°", "45°", "60°", "90°"],
      correctAnswer: "45°",
      hint: { text: "Angle = % × 360 → 12.5% = 12.5/100.", unlockTime: 10 }
    },
    {
      difficulty: "Hard",
      questionText: "A pie chart sector is 108°. If total students are 200, how many students does it represent?",
      options: ["50", "60", "80", "100"],
      correctAnswer: "60",
      hint: { text: "First find fraction: 108/360 → then multiply by 200.", unlockTime: 20 },
      animation: {
        type: "pie-chart",
        config: {
          data: [
            { label: "Target", value: 108 },
            { label: "Remaining", value: 252 }
          ]
        }
      }
    }
  ]
},
{
  kcId: "KC2",
  order: 2,
  subtopicName: "Subtopic 2: Drawing a Pie Chart",
  questions: [
    {
      difficulty: "Easy",
      questionText: "Which tool is used to measure angles?",
      options: ["Compass", "Ruler", "Protractor", "Divider"],
      correctAnswer: "Protractor"
    },
    {
      difficulty: "Easy",
      questionText: "What is the first step in drawing a pie chart?",
      options: ["Coloring sectors", "Drawing a circle", "Labeling", "Measuring angles"],
      correctAnswer: "Drawing a circle"
    },
    {
      difficulty: "Medium",
      questionText: "If a sector angle is 144°, what portion of the circle does it represent?",
      options: ["2/5", "1/2", "3/4", "1/3"],
      correctAnswer: "2/5",
      hint: { text: "Fraction = angle / 360 → 144 / 360.", unlockTime: 10 }
    },
    {
      difficulty: "Medium",
      questionText: "A category has 35% data. What angle should you draw?",
      options: ["96°", "108°", "126°", "140°"],
      correctAnswer: "126°",
      hint: { text: "Angle = 35% × 360.", unlockTime: 10 },
      animation: {
        type: "pie-drawing",
        config: {
          data: [
            { label: "126° Sector", value: 126, color: "#e11d48" },
            { label: "Remaining", value: 234, color: "#e5e7eb" }
          ],
          steps: [
            { type: "circle" },
            { type: "center-point" },
            { type: "radius" },
            { type: "sector", index: 0 }
          ],
          options: {
            showAngles: true,
            stepDuration: 1000
          }
        }
      }
    },
    {
      difficulty: "Hard",
      questionText: "You drew sectors of 120°, 100°, and 80°. What mistake have you made?",
      options: [
        "Angles are too small",
        "Total exceeds 360°",
        "Total is less than 360°",
        "No mistake"
      ],
      correctAnswer: "Total is less than 360°",
      hint: { text: "Add all angles → should be exactly 360°.", unlockTime: 20 }
    }
  ]
},
{
  kcId: "KC2",
  order: 3,
  subtopicName: "Subtopic 3: Problem Solving Using Pie Charts",
  questions: [
    {
      difficulty: "Easy",
      questionText: "The pie chart shows flour takes the biggest portion. What does it mean?",
      options: ["Flour is least used", "Flour is most used", "Flour is not used", "Flour is optional"],
      correctAnswer: "Flour is most used"
    },
    {
      difficulty: "Easy",
      questionText: "If sugar is 25% of the chart, what does it represent?",
      options: ["Half", "One-fourth", "One-third", "All"],
      correctAnswer: "One-fourth"
    },
    {
      difficulty: "Medium",
      questionText: "If butter occupies 72° in the pie chart, what percentage is it?",
      options: ["15%", "20%", "25%", "30%"],
      correctAnswer: "20%",
      hint: { text: "(72 / 360) × 100.", unlockTime: 10 }
    },
    {
      difficulty: "Medium",
      questionText: "Total cake weight is 3 kg. A sector is 120°. How much cake does it represent?",
      options: ["0.5 kg", "1 kg", "1.5 kg", "2 kg"],
      correctAnswer: "1 kg",
      hint: { text: "120/360 = 1/3 → 1/3 of 3 kg.", unlockTime: 10 },
      animation: {
        type: "pie-chart",
        config: {
          data: [
            { label: "Target", value: 120 },
            { label: "Remaining", value: 240 }
          ]
        }
      }
    },
    {
      difficulty: "Hard",
      questionText: "A pie chart shows 3 categories: A = 90°, B = 120°, C = ?. If total value is 600, find value of C.",
      options: ["150", "200", "250", "300"],
      correctAnswer: "250",
      hint: {
        text: "First find missing angle: 360 − (90 + 120). Then convert to fraction of 600.",
        unlockTime: 20
      },
      animation: {
        type: "pie-chart",
        config: {
          data: [
            { label: "A", value: 90 },
            { label: "B", value: 120 },
            { label: "C", value: 150 }
          ]
        }
      }
    }
  ]
},

  // ==================== KC3 ASSESSMENTS (UPDATED) ====================
  {
    kcId: "KC3",
    order: 1,
    subtopicName: "Subtopic 1: Introduction to Chance",
    questions: [
      {
        difficulty: "Easy",
        questionText: "What does 'chance' mean?",
        options: [
          "A fixed, known result",
          "Something that may or may not happen",
          "A maths formula",
          "A type of graph"
        ],
        correctAnswer: "Something that may or may not happen",
        hint: { text: "Think about something you are NOT sure will happen — like whether it will rain tomorrow.", unlockTime: 10 }
      },
      {
        difficulty: "Easy",
        questionText: "Which of these is certain to happen?",
        options: [
          "Getting a 6 when you roll a die",
          "The sun rising tomorrow",
          "Your team winning the cricket match",
          "Getting heads on a coin flip"
        ],
        correctAnswer: "The sun rising tomorrow",
        hint: { text: "Which one happens every single day, without fail, no matter what?", unlockTime: 10 }
      },
      {
        difficulty: "Medium",
        questionText: "Which situation involves chance?",
        options: [
          "3 × 4 = 12",
          "Water freezes at 0°C",
          "Winning a lucky draw",
          "Earth orbiting the sun"
        ],
        correctAnswer: "Winning a lucky draw",
        hint: { text: "Which result cannot be known in advance?", unlockTime: 10 }
      },
      {
        difficulty: "Medium",
        questionText: "Why do we study chance?",
        options: [
          "To make uncertainty disappear",
          "To understand how likely events are",
          "To create equations",
          "To draw bar graphs"
        ],
        correctAnswer: "To understand how likely events are",
        hint: { text: "Chance helps us predict — not guarantee.", unlockTime: 10 }
      },
      {
        difficulty: "Hard",
        questionText: "Ravi says: “I got tails 5 times in a row, so I must get heads next.” Is he right?",
        options: [
          "Yes — it balances out each turn",
          "No — each coin flip is independent of the last",
          "Yes — tails cannot occur 6 times in a row",
          "No — coins always give tails"
        ],
        correctAnswer: "No — each coin flip is independent of the last",
        hint: { text: "Does a coin “remember” what it showed last time?", unlockTime: 20 },
        animation: {
          type: "coin-flip",
          config: {
            sequence: ["T", "T", "T", "T", "T"],
            nextFlip: { possible: ["H", "T"], probability: 0.5 },
            options: { showHistory: true, animateFlips: true, flipDuration: 500, highlightNext: true, showProbabilities: true }
          }
        }
      }
    ]
  },
  {
    kcId: "KC3",
    order: 2,
    subtopicName: "Random Experiments & Outcomes",
    questions: [
      {
        difficulty: "Easy",
        questionText: "What makes an experiment 'random'?",
        options: [
          "It has a fixed, known result",
          "Its result cannot be predicted in advance",
          "It involves drawing graphs",
          "It always gives the same outcome"
        ],
        correctAnswer: "Its result cannot be predicted in advance",
        hint: { text: "Think about whether you can know the result before doing the experiment.", unlockTime: 10 }
      },
      {
        difficulty: "Easy",
        questionText: "How many outcomes does tossing a fair coin have?",
        options: ["1", "2", "3", "6"],
        correctAnswer: "2",
        hint: { text: "What are the two possible sides of a coin?", unlockTime: 10 }
      },
      {
        difficulty: "Medium",
        questionText: "Which of the following is NOT a random experiment?",
        options: [
          "Rolling a die",
          "Drawing a card from a shuffled deck",
          "Calculating 12 × 5",
          "Tossing a coin"
        ],
        correctAnswer: "Calculating 12 × 5",
        hint: { text: "Is the result always fixed, or can it change?", unlockTime: 10 }
      },
      {
        difficulty: "Medium",
        questionText: "A bag has a red, a blue, and a green ball. You pick one without looking. How many outcomes are there?",
        options: ["1", "2", "3", "6"],
        correctAnswer: "3",
        hint: { text: "Count how many different balls you could possibly pick.", unlockTime: 10 }
      },
      {
        difficulty: "Hard",
        questionText: "You try to start a scooter. Which best describes the possible outcomes?",
        options: [
          "Only 'starts' is an outcome",
          "'Starts' and 'does not start'",
          "Only 'does not start' is an outcome",
          "No outcomes exist"
        ],
        correctAnswer: "'Starts' and 'does not start'",
        hint: { text: "Think of all possible results, including success and failure.", unlockTime: 20 }
      }
    ]
  },
  {
    kcId: "KC3",
    order: 3,
    subtopicName: "Equally Likely Outcomes",
    questions: [
      {
        difficulty: "Easy",
        questionText: "What does 'equally likely' mean?",
        options: [
          "All outcomes happen at the same time",
          "Each outcome has the same chance of occurring",
          "Only one outcome is possible",
          "Outcomes are always the same"
        ],
        correctAnswer: "Each outcome has the same chance of occurring",
        hint: { text: "Think: do all outcomes have an equal chance, or not?", unlockTime: 10 }
      },
      {
        difficulty: "Easy",
        questionText: "On a fair coin, the chance of getting Heads compared to Tails is:",
        options: [
          "Head is more likely",
          "Tail is more likely",
          "Both are equally likely",
          "Neither can occur"
        ],
        correctAnswer: "Both are equally likely",
        hint: { text: "A fair coin has no bias—both sides are balanced.", unlockTime: 10 }
      },
      {
        difficulty: "Medium",
        questionText: "You have a bag with 5 red balls and 1 blue ball. Are the outcomes equally likely?",
        options: [
          "Yes — there are still only 2 colours",
          "No — red has a much greater chance",
          "Yes — all experiments are equally likely",
          "Cannot be determined"
        ],
        correctAnswer: "No — red has a much greater chance",
        hint: { text: "More items of one type means a higher chance of picking it.", unlockTime: 10 },
        animation: {
          type: "equal-outcomes",
          config: {
            items: [
              { label: "Red", count: 5, color: "#ef4444" },
              { label: "Blue", count: 1, color: "#3b82f6" }
            ],
            steps: [{ type: "show-items" }, { type: "group-by-color" }, { type: "highlight-frequency" }, { type: "compare" }],
            options: { showCounts: true, animateGrouping: true, highlightDifference: true, showProbabilityLabels: true, stepDuration: 800 }
          }
        }
      },
      {
        difficulty: "Medium",
        questionText: "Which experiment produces equally likely outcomes?",
        options: [
          "Guessing a friend's favourite colour",
          "Predicting tomorrow's weather",
          "Throwing a standard fair die",
          "Picking from a bag with different numbers of balls"
        ],
        correctAnswer: "Throwing a standard fair die",
        hint: { text: "Look for situations where every outcome has the same probability.", unlockTime: 10 }
      },
      {
        difficulty: "Hard",
        questionText: "A die is 'loaded' — the number 6 is slightly heavier so it faces down more. Are the outcomes equally likely?",
        options: [
          "Yes — a die always has 6 faces",
          "No — some numbers appear more often than others",
          "Yes — all six numbers can still appear",
          "Cannot say without more data"
        ],
        correctAnswer: "No — some numbers appear more often than others",
        hint: { text: "If something is not fair or balanced, some outcomes become more likely than others.", unlockTime: 20 }
      }
    ]
  },
  {
    kcId: "KC3",
    order: 4,
    subtopicName: "Probability",
    questions: [
      {
        difficulty: "Easy",
        questionText: "A fair coin is tossed one time. What is the probability of getting Heads?",
        options: ["0", "1", "1/2", "2"],
        correctAnswer: "1/2",
        hint: { text: "A coin has two possible outcomes — Head and Tail. Both have equal chance.", unlockTime: 10 }
      },
      {
        difficulty: "Easy",
        questionText: "A standard die is rolled once. How many possible outcomes can you get?",
        options: ["2", "4", "6", "12"],
        correctAnswer: "6",
        hint: { text: "Look at the numbers on a die. Count all the faces carefully.", unlockTime: 10 }
      },
      {
        difficulty: "Medium",
        questionText: "A fair die is rolled once. What is the probability of getting an even number?",
        options: ["1/6", "2/6", "3/6", "4/6"],
        correctAnswer: "3/6",
        hint: { text: "Even numbers on a die are 2, 4, and 6. Count them and compare with total outcomes.", unlockTime: 10 }
      },
      {
        difficulty: "Medium",
        questionText: "A fair die is rolled once. What is the probability of getting a number less than 3?",
        options: ["1/6", "2/6", "3/6", "5/6"],
        correctAnswer: "2/6",
        hint: { text: "Numbers less than 3 are 1 and 2. Count how many such outcomes are possible.", unlockTime: 10 }
      },
      {
        difficulty: "Hard",
        questionText: "A bag contains 3 red balls, 2 blue balls, and 1 green ball. One ball is picked at random. What is the probability that the ball picked is not blue?",
        options: ["2/6", "3/6", "4/6", "5/6"],
        correctAnswer: "4/6",
        hint: { text: "First find the total number of balls. Then count balls that are not blue (red + green).", unlockTime: 20 }
      }
    ]
  },
  {
    kcId: "KC3",
    order: 5,
    subtopicName: "Events",
    questions: [
      {
        difficulty: "Easy",
        questionText: "Which of the following best describes an event in probability?",
        options: [
          "The process of performing an experiment",
          "One or more outcomes we are interested in",
          "The total number of all possible outcomes",
          "A graphical representation of data"
        ],
        correctAnswer: "One or more outcomes we are interested in",
        hint: { text: "An event focuses only on the outcomes you care about, not all outcomes.", unlockTime: 10 }
      },
      {
        difficulty: "Easy",
        questionText: "Which set correctly represents the event “getting an even number” when rolling a die?",
        options: ["{1, 3, 5}", "{2, 4, 6}", "{1, 2, 3, 4, 5, 6}", "{2, 4}"],
        correctAnswer: "{2, 4, 6}",
        hint: { text: "Even numbers are divisible by 2.", unlockTime: 10 }
      },
      {
        difficulty: "Medium",
        questionText: "How many outcomes are there in the event “getting an even number” when rolling a die?",
        options: ["2", "3", "6", "1"],
        correctAnswer: "3",
        hint: { text: "List the outcomes in the event first, then count them.", unlockTime: 10 }
      },
      {
        difficulty: "Medium",
        questionText: "What is the probability of getting a prime number when rolling a fair die? (Prime numbers: 2, 3, 5)",
        options: ["1/6", "2/6", "3/6 = 1/2", "5/6"],
        correctAnswer: "3/6 = 1/2",
        hint: { text: "Probability = (number of favourable outcomes) ÷ (total outcomes).", unlockTime: 10 },
        animation: {
          type: "event-highlight",
          config: {
            sampleSpace: [1, 2, 3, 4, 5, 6],
            event: { label: "Prime Numbers", outcomes: [2, 3, 5] },
            steps: [{ type: "show-sample-space" }, { type: "highlight-event" }, { type: "separate-event" }, { type: "label-event" }],
            options: { animateHighlight: true, highlightColor: "#22c55e", dimOthers: true, showLabels: true, stepDuration: 800, showSetNotation: true }
          }
        }
      },
      {
        difficulty: "Hard",
        questionText: "Which of the following cannot be considered a valid event when tossing two coins?",
        options: [
          "Getting two Heads (HH)",
          "Getting one Head and one Tail",
          "Getting three Heads",
          "Getting at least one Tail"
        ],
        correctAnswer: "Getting three Heads",
        hint: { text: "Compare the number of coins with the number of heads mentioned—can that outcome exist?", unlockTime: 20 }
      }
    ]
  },
  {
    kcId: "KC3",
    order: 6,
    subtopicName: "Probability in Real Life",
    questions: [
      {
        difficulty: "Easy",
        questionText: "Which of the following is a real-life use of probability?",
        options: [
          "Weather forecasting",
          "Election predictions",
          "Quality checks in factories",
          "All of the above"
        ],
        correctAnswer: "All of the above",
        hint: { text: "Think about where we use chances to make predictions in daily life.", unlockTime: 10 }
      },
      {
        difficulty: "Easy",
        questionText: "If P(rain today) = 0, what does that mean?",
        options: [
          "It will definitely rain",
          "There is a small chance of rain",
          "It is impossible for it to rain today",
          "We do not know if it will rain"
        ],
        correctAnswer: "It is impossible for it to rain today",
        hint: { text: "A probability of 0 means the event cannot happen at all.", unlockTime: 10 }
      },
      {
        difficulty: "Medium",
        questionText: "P(event) = 1 means:",
        options: [
          "The event is impossible",
          "The event is equally likely to happen or not",
          "The event is certain to happen",
          "The event has not been defined"
        ],
        correctAnswer: "The event is certain to happen",
        hint: { text: "P = 1 means 100% chance — it will definitely occur.", unlockTime: 10 }
      },
      {
        difficulty: "Medium",
        questionText: "The Meteorological Department says P(rain) = 3/10. What is the probability of no rain?",
        options: ["3/10", "7/10", "1/10", "10/3"],
        correctAnswer: "7/10",
        hint: { text: "Total probability is always 1. So subtract: 1 − 3/10.", unlockTime: 10 }
      },
      {
        difficulty: "Hard",
        questionText: "An exit poll surveys 500 people as they leave a polling booth. It predicts Candidate A will win with P = 3/5. Why might this prediction be wrong?",
        options: [
          "Probability can never be applied to elections",
          "The sample may not represent all voters accurately",
          "P = 3/5 means Candidate A definitely wins",
          "Exit polls are always perfectly accurate"
        ],
        correctAnswer: "The sample may not represent all voters accurately",
        hint: { text: "Think: does asking only some people always reflect everyone’s opinion?", unlockTime: 20 }
      }
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