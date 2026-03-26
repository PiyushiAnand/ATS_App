import mongoose from "./server/db/mongoose";
import * as dotenv from "dotenv";
import { Assessment } from "./server/models/Assessment"; 
import { Lesson } from "./server/models/Lesson"; 
import { Content } from "./server/models/Content"; 

dotenv.config();

const MONGO_URI = "mongodb+srv://piyushianand2128_db_user:cjdjLvrJMDDFMiKB@cluster0.074ksss.mongodb.net/?appName=Cluster0";

// All KC1 Questions extracted precisely from ET605 Project.pdf with Animations!
const kc1Assessments = [
  {
    order: 1,
    subtopicName: "Subtopic 1: Introduction to Data and Organising Data",
    questions: [
      {
        difficulty: "Easy",
        questionText: "What is the term used for the collection of information like the heights of students in a class?",
        options: ["Variable", "Data", "Equation", "Formula"],
        correctAnswer: "Data"
      },
      {
        difficulty: "Easy",
        questionText: "In a frequency table, which symbol represents the number 5?",
        options: ["Four vertical lines", "A V shape", "Four vertical lines with a diagonal cross", "An X shape"],
        correctAnswer: "Four vertical lines with a diagonal cross"
      },
      {
        difficulty: "Medium",
        questionText: "If a tally mark represents the number of mangoes sold, and you see two full bundles of 5 and three single lines, how many mangoes were sold?",
        options: ["10", "12", "13", "15"],
        correctAnswer: "13",
        hint: { text: "Each bundled block counts as 5, and each single line counts as 1.", unlockTime: 10 },
        // ✅ Added Tally Animation showing exactly 13!
        animation: { type: "tally-build", config: { count: 13 } } 
      },
      {
        difficulty: "Medium",
        questionText: "Why do we organise raw data into a systematic table?",
        options: ["To make the data look colorful.", "To draw meaningful inferences and interpret it easily.", "To increase the number of values.", "To hide the original information."],
        correctAnswer: "To draw meaningful inferences and interpret it easily.",
        hint: { text: "Think about whether it is easier to read a long list of names or a summary table.", unlockTime: 10 }
      },
      {
        difficulty: "Hard",
        questionText: "A fruit seller has 30 apples. He sells some and represents the remaining apples using tally marks as three bundles of 5 and two single lines (17). How many apples did he sell?",
        options: ["17", "13", "15", "30"],
        correctAnswer: "13",
        hint: { text: "First, calculate the number of apples remaining from the tally marks (5+5+5+2), then subtract that from the total 30.", unlockTime: 20 },
        // ✅ Added Tally Animation showing the 17 remaining apples
        animation: { type: "tally-build", config: { count: 17 } }
      }
    ]
  },
  {
    order: 2,
    subtopicName: "Subtopic 2: Pictographs",
    questions: [
      {
        difficulty: "Easy",
        questionText: "What is a pictograph?",
        options: ["A graph using only lines.", "A representation of data using symbols or pictures.", "A table with only numbers.", "A circular graph."],
        correctAnswer: "A representation of data using symbols or pictures."
      },
      {
        difficulty: "Easy",
        questionText: "If 1 symbol represents 50 items, what does half a symbol usually represent?",
        options: ["50 items", "10 items", "25 items", "100 items"],
        correctAnswer: "25 items"
      },
      {
        difficulty: "Medium",
        questionText: "A pictograph shows 5 symbols of a 'Book' for a library's collection. If the scale is 1 Book symbol = 20 books, how many total books are there?",
        options: ["5", "20", "100", "50"],
        correctAnswer: "100",
        hint: { text: "Multiply the number of symbols by the value of one symbol.", unlockTime: 10 },
        // ✅ Added Pictograph Animation with book emojis
        animation: { type: "pictograph-scale", config: { count: 5, icon: "📚" } }
      },
      {
        difficulty: "Medium",
        questionText: "In a pictograph about village electricity, 4 bulbs represent 40 houses with power. What is the scale of the pictograph?",
        options: ["1 bulb = 4 houses", "1 bulb = 10 houses", "1 bulb = 40 houses", "1 bulb = 1 house"],
        correctAnswer: "1 bulb = 10 houses",
        hint: { text: "Divide the total number of houses by the number of symbols shown.", unlockTime: 10 },
        // ✅ Added Pictograph Animation with lightbulb emojis
        animation: { type: "pictograph-scale", config: { count: 4, icon: "💡" } }
      },
      {
        difficulty: "Hard",
        questionText: "To represent 175 students where 1 symbol = 50 students, how many full and partial symbols are needed?",
        options: ["3 full symbols and one-half symbol.", "3 full symbols and one-quarter symbol.", "4 full symbols.", "2 full symbols and one-half symbol."],
        correctAnswer: "3 full symbols and one-half symbol.",
        hint: { text: "50 + 50 + 50 = 150 (3 full symbols). You need 25 more, which is half of 50.", unlockTime: 20 }
      }
    ]
  },
  {
    order: 3,
    subtopicName: "Subtopic 3: Bar Graphs",
    questions: [
      {
        difficulty: "Easy",
        questionText: "In a bar graph, what does the height of a bar represent?",
        options: ["The width of the data.", "The quantity or value for that category.", "The gap between categories.", "The color of the data."],
        correctAnswer: "The quantity or value for that category."
      },
      {
        difficulty: "Easy",
        questionText: "Which of these is a requirement for a correct bar graph?",
        options: ["Bars must have different widths.", "Gaps between bars must be unequal.", "Bars must have uniform width and equal gaps.", "No scale is needed."],
        correctAnswer: "Bars must have uniform width and equal gaps."
      },
      {
        difficulty: "Medium",
        questionText: "If the scale is 1 unit = 5 students, how tall should the bar be for a class of 35 students?",
        options: ["5 units", "35 units", "7 units", "10 units"],
        correctAnswer: "7 units",
        hint: { text: "Divide the total value (35) by the value of one unit (5).", unlockTime: 10 },
        // ✅ Added Bar Graph Animation showing the heights
        animation: { type: "bar-grow", config: { data: [{ label: "Class A", value: 35 }, { label: "Class B", value: 20 }] } }
      },
      {
        difficulty: "Medium",
        questionText: "On a bar graph showing rainfall in Mumbai, the bar for July is 15 units tall (Scale: 1 unit = 10 mm). How much rain fell in July?",
        options: ["15 mm", "150 mm", "100 mm", "25 mm"],
        correctAnswer: "150 mm",
        hint: { text: "Multiply the height of the bar by the scale.", unlockTime: 10 },
        // ✅ Added Bar Graph Animation visualizing the 15 units
        animation: { type: "bar-grow", config: { data: [{ label: "June", value: 8 }, { label: "July", value: 15 }] } }
      },
      {
        difficulty: "Hard",
        questionText: "A bar graph has a scale of 1 unit = 20 km. City A's bar is 4 units tall and City B's bar is 6 units tall. What is the total distance represented by both bars combined?",
        options: ["10 km", "100 km", "200 km", "120 km"],
        correctAnswer: "200 km",
        hint: { text: "Calculate the distance for each city separately using the scale, then add them together.", unlockTime: 20 }
      }
    ]
  },
  {
    order: 4,
    subtopicName: "Subtopic 4: Double Bar Graphs",
    questions: [
      {
        difficulty: "Easy",
        questionText: "What is the main purpose of a double bar graph?",
        options: ["To show only one set of data.", "To make the graph look busy.", "To compare two sets of data simultaneously.", "To replace a pictograph."],
        correctAnswer: "To compare two sets of data simultaneously."
      },
      {
        difficulty: "Easy",
        questionText: "In a double bar graph, how are the two sets of bars usually distinguished?",
        options: ["By making one bar wider.", "By using different colors or shading and a key (legend).", "By placing them in different graphs.", "By making one bar shorter."],
        correctAnswer: "By using different colors or shading and a key (legend)."
      },
      {
        difficulty: "Medium",
        questionText: "A double bar graph compares the sale of 'Cold Drinks' and 'Tea' in a shop. If the 'Tea' bar is much higher than the 'Cold Drink' bar in January, what does it suggest?",
        options: ["More cold drinks were sold.", "More tea was sold.", "No tea was sold.", "The shop was closed."],
        correctAnswer: "More tea was sold.",
        hint: { text: "Taller bars indicate a higher quantity for that specific category.", unlockTime: 10 },
        // ✅ Added Double Bar Chart Animation comparing Tea and Cold Drinks
        animation: { type: "double-bar-compare", config: { data: [{ label: "January", value: 30, valueB: 90 }] } }
      },
      {
        difficulty: "Medium",
        questionText: "Looking at a double bar graph of marks, what is the increase in their marks?",
        options: ["140 marks", "20 marks", "80 marks", "No increase"],
        correctAnswer: "20 marks",
        hint: { text: "Subtract the value of the first bar from the value of the second bar.", unlockTime: 10 },
        // ✅ Added Double Bar Chart Animation showing the score jump
        animation: { type: "double-bar-compare", config: { data: [{ label: "Maths", value: 60, valueB: 80 }] } }
      },
      {
        difficulty: "Hard",
        questionText: "In a double bar graph comparing rainfall (Scale: 1 unit = 5 cm), City X has a 5-unit bar and City Y has a 3-unit bar for the month of August. What is the difference in rainfall between the two cities?",
        options: ["2 cm", "10 cm", "15 cm", "5 cm"],
        correctAnswer: "10 cm",
        hint: { text: "Find the difference in units (5 - 3 = 2) and then multiply that difference by the scale (5 cm).", unlockTime: 20 }
      }
    ]
  }
];

const seedAssessments = async () => {
  try {
    console.log(`Connecting to database...`);
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully!");

    // Clear old KC1 Assessments to avoid duplicates
    console.log("Clearing old KC1 Assessments...");
    await Assessment.deleteMany({ kcId: "KC1" });

    // Loop through each subtopic configuration
    for (const subtopic of kc1Assessments) {
      console.log(`\nProcessing ${subtopic.subtopicName}...`);

      // 1. Find the corresponding Lesson document (from your seedLessons.ts)
      const lesson = await Lesson.findOne({ kcId: "KC1", order: subtopic.order });
      
      if (!lesson) {
        console.warn(`⚠️ Warning: Lesson for order ${subtopic.order} not found. Skipping assessment creation for this subtopic.`);
        continue;
      }

      const questionIds = [];

      // 2. Insert or Update the 5 Questions into the Content collection
      for (const qData of subtopic.questions) {
        // We use findOneAndUpdate with upsert to ensure the question is in the DB 
        // without creating duplicates if the script is run multiple times.
        const question = await Content.findOneAndUpdate(
          { kcId: "KC1", questionText: qData.questionText }, // Search criteria
          { ...qData, kcId: "KC1", subtopicId: subtopic.order }, // Data to insert/update
          { new: true, upsert: true }
        );
        
        questionIds.push(question._id);
      }

      // 3. Create the Assessment linking the Lesson and the 5 Questions
      await Assessment.create({
        kcId: "KC1",
        subtopicName: subtopic.subtopicName,
        lessonId: lesson._id,
        questions: questionIds,
        totalMarks: 5
      });

      console.log(`✅ Successfully created Assessment for ${subtopic.subtopicName} with 5 questions.`);
    }

    console.log("\n🎉 All KC1 Assessments Seeded Successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding Assessments:", error);
    process.exit(1);
  }
};

seedAssessments();