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

    // ✅ MEDIUM (slightly tougher + hint + animation)
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

    // ✅ HARD (more multi-step)
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

    // ✅ MEDIUM
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

    // ✅ HARD (concept + reasoning)
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

    // ✅ MEDIUM
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

    // ✅ HARD (multi-step + tricky)
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
  // ==================== KC3 ASSESSMENTS ====================
  {
  kcId: "KC3",
  order: 1,
  subtopicName: "Subtopic 1: Introduction to Chance",
  questions: [
    {
      difficulty: "Easy",
      questionText: "What does 'chance' mean?",
      options: ["A fixed result", "May or may not happen", "A formula", "A graph"],
      correctAnswer: "May or may not happen"
    },
    {
      difficulty: "Easy",
      questionText: "Which is certain?",
      options: ["Rolling 6", "Sun rising", "Winning match", "Getting heads"],
      correctAnswer: "Sun rising"
    },

    {
  difficulty: "Medium",
  questionText: "Which situation involves uncertainty?",
  options: ["2+2=4", "Water boils at 100°C", "Winning lottery", "Earth rotates"],
  correctAnswer: "Winning lottery",
  hint: { text: "Uncertainty = result not fixed.", unlockTime: 10 },

  
},

    {
      difficulty: "Medium",
      questionText: "Which event has higher chance?",
      options: ["Getting 1 on die", "Getting even number", "Getting 6", "Getting 2"],
      correctAnswer: "Getting even number",
      hint: { text: "Count favourable outcomes.", unlockTime: 10 }
    },

    {
  difficulty: "Hard",
  questionText: "A coin gave heads 7 times in a row. What is probability of head next?",
  options: ["1", "1/2", "0", "7/8"],
  correctAnswer: "1/2",
  hint: { text: "Each toss is independent.", unlockTime: 20 },

  animation: {
    type: "coin-flip",
    config: {
      sequence: ["H", "H", "H", "H", "H", "H", "H"], // 🔥 past outcomes

      nextFlip: {
        possible: ["H", "T"],
        probability: 0.5
      },

      options: {
        showHistory: true,
        animateFlips: true,
        flipDuration: 500,
        highlightNext: true,
        showProbabilities: true
      }
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
      questionText: "Random experiment means:",
      options: ["Fixed result", "Unpredictable result", "Always same", "Graph"],
      correctAnswer: "Unpredictable result"
    },
    {
      difficulty: "Easy",
      questionText: "Coin toss outcomes?",
      options: ["1", "2", "3", "6"],
      correctAnswer: "2"
    },

    {
      difficulty: "Medium",
      questionText: "Which is NOT random?",
      options: ["Rolling die", "Drawing card", "2+3", "Coin toss"],
      correctAnswer: "2+3",
      hint: { text: "Does result change?", unlockTime: 10 }
    },

    {
      difficulty: "Medium",
      questionText: "A bag has 2 red, 2 blue, 1 green. Outcomes?",
      options: ["3", "4", "5", "6"],
      correctAnswer: "3",
      hint: { text: "Outcomes = distinct results.", unlockTime: 10 }
    },

     {
  difficulty: "Hard",
  questionText: "Two coins tossed. Total outcomes?",
  options: ["2", "3", "4", "6"],
  correctAnswer: "4",
  hint: { text: "List: HH, HT, TH, TT.", unlockTime: 20 },

  animation: {
    type: "coin-flip",
    config: {
      coins: 2,

      steps: [
        { type: "flip-first-coin" },
        { type: "flip-second-coin" },

        { type: "generate-outcomes" }, // HH, HT, TH, TT
        { type: "grid-display" }       // show in 2x2 grid
      ],

      outcomes: [
        { value: "HH", highlight: true },
        { value: "HT", highlight: true },
        { value: "TH", highlight: true },
        { value: "TT", highlight: true }
      ],

      options: {
        showTree: true,          // 🔥 tree diagram (best for learning)
        showGrid: true,          // 2x2 visualization
        animateFlips: true,
        stepDuration: 800,
        highlightAll: true,
        showCount: true          // shows "Total = 4"
      }
    }
  }
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
      questionText: "Equally likely means:",
      options: ["Same time", "Same chance", "One outcome", "Same result"],
      correctAnswer: "Same chance"
    },
    {
      difficulty: "Easy",
      questionText: "Fair coin?",
      options: ["Head more", "Tail more", "Equal", "None"],
      correctAnswer: "Equal"
    },

   {
  difficulty: "Medium",
  questionText: "Bag: 4 red, 1 blue. Are outcomes equal?",
  options: ["Yes", "No", "Maybe", "Can't say"],
  correctAnswer: "No",
  hint: { text: "Count frequency.", unlockTime: 10 },

  animation: {
    type: "equal-outcomes",
    config: {
      items: [
        { label: "Red", count: 4, color: "#ef4444" },
        { label: "Blue", count: 1, color: "#3b82f6" }
      ],

      steps: [
        { type: "show-items" },          // display 4 red, 1 blue
        { type: "group-by-color" },      // group them visually
        { type: "highlight-frequency" }, // show counts
        { type: "compare" }              // compare sizes
      ],

      probabilities: [
        { label: "Red", value: "4/5", decimal: 0.8 },
        { label: "Blue", value: "1/5", decimal: 0.2 }
      ],

      options: {
        showCounts: true,
        animateGrouping: true,
        highlightDifference: true,
        showProbabilityLabels: true,
        stepDuration: 800
      }
    }
  }
},

    {
      difficulty: "Medium",
      questionText: "Which is fair?",
      options: ["Biased die", "Weighted coin", "Fair die", "Unequal balls"],
      correctAnswer: "Fair die",
      hint: { text: "Equal chance for all.", unlockTime: 10 }
    },

    {
      difficulty: "Hard",
      questionText: "A die shows 6 twice as often. Is it fair?",
      options: ["Yes", "No", "Maybe", "Equal"],
      correctAnswer: "No",
      hint: { text: "Equal outcomes required.", unlockTime: 20 }
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
      questionText: "P(head) in coin?",
      options: ["0", "1", "1/2", "2"],
      correctAnswer: "1/2"
    },
    {
      difficulty: "Easy",
      questionText: "Die outcomes?",
      options: ["2", "4", "6", "12"],
      correctAnswer: "6"
    },

    {
  difficulty: "Medium",
  questionText: "P(odd number on die)?",
  options: ["1/2", "1/3", "1/6", "2/3"],
  correctAnswer: "1/2",
  hint: { text: "Odd = 1,3,5 → 3/6.", unlockTime: 10 },

},

    {
      difficulty: "Medium",
      questionText: "P(number >4)?",
      options: ["1/6", "2/6", "3/6", "4/6"],
      correctAnswer: "2/6",
      hint: { text: "5,6 only.", unlockTime: 10 }
    },

    {
      difficulty: "Hard",
      questionText: "Bag: 3 red, 3 blue, 4 green. P(green)?",
      options: ["4/10", "3/10", "1/2", "2/5"],
      correctAnswer: "4/10",
      hint: { text: "Total = 10, green = 4.", unlockTime: 20 }
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
      questionText: "Event means:",
      options: ["Experiment", "Outcome group", "Total", "Graph"],
      correctAnswer: "Outcome group"
    },
    {
      difficulty: "Easy",
      questionText: "Even numbers?",
      options: ["1,3,5", "2,4,6", "All", "None"],
      correctAnswer: "2,4,6"
    },

   {
  difficulty: "Medium",
  questionText: "Event: multiples of 3?",
  options: ["1,2", "3,6", "2,4", "5"],
  correctAnswer: "3,6",
  hint: { text: "Multiples of 3.", unlockTime: 10 },

  animation: {
    type: "event-highlight",
    config: {
      sampleSpace: [1, 2, 3, 4, 5, 6],

      event: {
        label: "Multiples of 3",
        outcomes: [3, 6]
      },

      steps: [
        { type: "show-sample-space" },   // show all outcomes
        { type: "highlight-event" },     // highlight 3 and 6
        { type: "separate-event" },      // visually separate them
        { type: "label-event" }          // label as event
      ],

      options: {
        animateHighlight: true,
        highlightColor: "#22c55e",
        dimOthers: true,
        showLabels: true,
        stepDuration: 800,
        showSetNotation: true   // 🔥 A = {3, 6}
      }
    }
  }
},
    {
      difficulty: "Medium",
      questionText: "P(prime on die)?",
      options: ["1/6", "2/6", "3/6", "4/6"],
      correctAnswer: "3/6",
      hint: { text: "2,3,5 → 3 outcomes.", unlockTime: 10 }
    },

    {
      difficulty: "Hard",
      questionText: "Two coins: event = exactly one head. Probability?",
      options: ["1/4", "1/2", "3/4", "1"],
      correctAnswer: "1/2",
      hint: { text: "HT, TH → 2/4.", unlockTime: 20 }
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
      questionText: "Use of probability?",
      options: ["Weather", "Elections", "Quality", "All"],
      correctAnswer: "All"
    },
    {
      difficulty: "Easy",
      questionText: "P=0 means?",
      options: ["Certain", "Impossible", "Maybe", "Unknown"],
      correctAnswer: "Impossible"
    },

   {
  difficulty: "Medium",
  questionText: "P(not rain) if P(rain)=0.4?",
  options: ["0.4", "0.6", "1.4", "0"],
  correctAnswer: "0.6",
  hint: { text: "1 − P(event).", unlockTime: 10 },

  
},

    {
      difficulty: "Medium",
      questionText: "P(event)=1 means?",
      options: ["Impossible", "Certain", "Half", "Unknown"],
      correctAnswer: "Certain",
      hint: { text: "1 = 100%.", unlockTime: 10 }
    },

    {
      difficulty: "Hard",
      questionText: "Survey says win chance = 0.7. What does it mean?",
      options: ["Guaranteed win", "Likely but not certain", "Impossible", "Exact result"],
      correctAnswer: "Likely but not certain",
      hint: { text: "Probability ≠ guarantee.", unlockTime: 20 }
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