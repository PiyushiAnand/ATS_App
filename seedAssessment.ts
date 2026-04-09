import mongoose from "./server/db/mongoose";
import * as dotenv from "dotenv";
import { Assessment } from "./server/models/Assessment"; 
import { Lesson } from "./server/models/Lesson"; 
import { Content } from "./server/models/Content"; 

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ats-app-db";

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
        questionText: "Given tally mark represents the number of mangoes sold, how many mangoes were sold?",
        options: ["10", "12", "13", "15"],
        correctAnswer: "13",
        hint: { text: "Each bundled block counts as 5, and each single line counts as 1.", unlockTime: 10 },
        // ✅ Added Tally Animation showing exactly 13!
        animation: { type: "tally-build", config: { count: 13 } } 
      },
      {
        difficulty: "Medium",
        questionText: "What is the primary advantage of organizing a large set of raw data into a frequency distribution table?",
        options: [
          "It allows us to quickly identify patterns and see how often specific values occur.",
          "It automatically calculates the exact mean, median, and mode of the dataset.",
          "It removes any outliers or mistakes made during the data collection process.",
          "It increases the total number of observations to make the data more reliable."
        ],
        correctAnswer: "It allows us to quickly identify patterns and see how often specific values occur.",
        hint: { text: "Think about what a table actually does. Does it do the math for you, or does it just arrange the numbers so you can count them easily?", unlockTime: 10 },
        remedialExplanation: "Organizing data into a table helps us group information to see trends (like which score was the most common). However, it doesn't do the math for you, it doesn't remove bad data, and it definitely doesn't add more data to your set."
      },
      {
        difficulty: "Hard",
        questionText: "A fruit seller starts the day with 50 apples. The tally marks below show the number of apples he sold in the morning. In the afternoon, he sold exactly half as many apples as he did in the morning. How many apples does he have left at the end of the day?",
        options: ["16", "24", "26", "34"],
        correctAnswer: "26",
        hint: { text: "Step 1: Count the tally marks to find the morning sales. Step 2: Halve that number for the afternoon sales. Step 3: Subtract total sales from 50.", unlockTime: 20 },
        // ✅ Tally Animation showing the 16 apples sold in the morning
        animation: { type: "tally-build", config: { count: 16 } },
        remedialExplanation: "First, the tally marks show 16 apples sold in the morning (3 groups of 5, plus 1). In the afternoon, he sold half of that, which is 8 apples. Total sold = 16 + 8 = 24. To find what is left, subtract the sold apples from the starting amount: 50 - 24 = 26 apples left."
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
        questionText: "A pictograph shows 4 full 'Book' symbols and 1 half 'Book' symbol for a library's collection. If the scale is 1 full symbol = 20 books, how many total books are in the collection?",
        options: ["80", "90", "100", "120"],
        correctAnswer: "90",
        hint: { text: "Calculate the value of the 4 full symbols first (4 × 20), then add the value of the half symbol (half of 20).", unlockTime: 10 },
        // ✅ Added Pictograph Animation with 4.5 book emojis
        animation: { type: "pictograph-scale", config: { count: 4.5, icon: "📚" } },
        remedialExplanation: "4 full symbols represent 80 books (4 × 20). A half symbol represents half of the scale, which is 10 books (20 ÷ 2). Adding them together gives 80 + 10 = 90 books."
      },
      {
        difficulty: "Medium",
        questionText: "In a pictograph, Village A's electricity is represented by 4 bulbs, which equals 40 houses. If Village B is represented by 7 bulbs using the exact same scale, how many houses have electricity in Village B?",
        options: ["70", "28", "10", "110"],
        correctAnswer: "70",
        hint: { text: "First, find the scale by dividing Village A's houses by its bulbs. Then, multiply that scale by Village B's bulbs.", unlockTime: 10 },
        // ✅ Added Pictograph Animation with lightbulb emojis
        animation: { type: "pictograph-scale", config: { count: 7, icon: "💡" } },
        remedialExplanation: "First, determine the scale: 40 houses ÷ 4 bulbs = 10 houses per bulb. Since Village B has 7 bulbs, multiply 7 by the scale of 10 to get 70 houses."
      },
      {
        difficulty: "Hard",
        questionText: "A school needs to represent its 225 students on a pictograph where 1 full symbol = 50 students. If the teacher has already drawn 2 full symbols, what else needs to be drawn to complete the chart?",
        options: [
          "2 full symbols and 1 half symbol.", 
          "4 full symbols and 1 half symbol.", 
          "2 full symbols and 1 quarter symbol.", 
          "3 full symbols and 1 half symbol."
        ],
        correctAnswer: "2 full symbols and 1 half symbol.",
        hint: { text: "The total needed is 225. The 2 symbols already drawn represent 100 students. How many more students do you need to represent?", unlockTime: 20 },
        remedialExplanation: "The total target is 225. The 2 drawn symbols account for 100 students (2 × 50). This leaves 125 students to be drawn (225 - 100). To represent 125 students, you need 2 full symbols (100) and exactly half of another symbol (25). If a student picks '4 full and 1 half', they forgot to subtract the symbols already drawn!"
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
        questionText: "A bar graph uses a scale of 1 unit = 5 students. Class A has 35 students and Class B has 20 students. How much taller is the bar for Class A compared to the bar for Class B?",
        options: ["3 units", "15 units", "7 units", "4 units"],
        correctAnswer: "3 units",
        hint: { text: "Find the height of Class A's bar, then find the height of Class B's bar, and subtract the two.", unlockTime: 10 },
        // ✅ Bar Graph Animation showing the heights
        animation: { type: "bar-grow", config: { data: [{ label: "Class A", value: 35 }, { label: "Class B", value: 20 }] } },
        remedialExplanation: "First, find the bar heights. Class A needs a bar 7 units tall (35 ÷ 5). Class B needs a bar 4 units tall (20 ÷ 5). The difference in height is 7 - 4 = 3 units. If you picked 15, you found the difference in students, not the difference in units!"
      },
      {
        difficulty: "Medium",
        questionText: "A bar graph shows rainfall with a scale of 1 unit = 10 mm. If the bar for June is 8 units tall and the bar for July is 15 units tall, how much MORE rainfall did the city receive in July than in June?",
        options: ["70 mm", "150 mm", "80 mm", "7 mm"],
        correctAnswer: "70 mm",
        hint: { text: "You can either calculate the rainfall for each month and subtract, or find the difference in the units first and multiply by the scale.", unlockTime: 10 },
        // ✅ Bar Graph Animation visualizing the units
        animation: { type: "bar-grow", config: { data: [{ label: "June", value: 8 }, { label: "July", value: 15 }] } },
        remedialExplanation: "July's bar is 7 units taller than June's bar (15 - 8 = 7 units). Since each unit represents 10 mm, the extra rainfall is 7 × 10 = 70 mm. Alternatively, you could do July (150 mm) minus June (80 mm) = 70 mm."
      },
      {
        difficulty: "Hard",
        questionText: "On a bar graph, City A is 90 km away and is represented by a bar that is 4.5 units tall. City B is represented by a bar that is 7 units tall. Using the same scale, how far away is City B?",
        options: ["140 km", "120 km", "135 km", "20 km"],
        correctAnswer: "140 km",
        hint: { text: "First, figure out the hidden scale by dividing City A's distance by its bar height. Then, multiply that scale by City B's bar height.", unlockTime: 20 },
        remedialExplanation: "Step 1 is to find the hidden scale: 90 km ÷ 4.5 units = 20 km per unit. Step 2 is to apply this scale to City B: 7 units × 20 km/unit = 140 km."
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
        questionText: "A double bar graph compares 'Tea' and 'Cold Drink' sales. In January, the 'Tea' bar is exactly 3 times as tall as the 'Cold Drink' bar. If the shop sold 30 Cold Drinks, how many TOTAL beverages (Tea + Cold Drinks) were sold that month?",
        options: ["90", "120", "60", "30"],
        correctAnswer: "120",
        hint: { text: "First find the number of Tea cups sold by multiplying Cold Drinks by 3. Then add both amounts together.", unlockTime: 10 },
        // ✅ Double Bar Chart Animation comparing Tea and Cold Drinks
        animation: { type: "double-bar-compare", config: { data: [{ label: "January", value: 30, valueB: 90 }] } },
        remedialExplanation: "Since the Tea bar is 3 times taller, Tea sales = 30 × 3 = 90 cups. The question asks for the TOTAL beverages sold, so you must add the Tea (90) and Cold Drinks (30) together to get 120. If you picked 90, you only found the tea sales!"
      },
      {
        difficulty: "Medium",
        questionText: "A double bar graph shows a student's marks in Term 1 and Term 2. In Maths, the bars increase from 60 to 80 marks. In Science, the bars increase from 50 to 85 marks. How much greater was the student's improvement in Science compared to their improvement in Maths?",
        options: ["15 marks", "20 marks", "35 marks", "5 marks"],
        correctAnswer: "15 marks",
        hint: { text: "Calculate the improvement for Maths, then calculate the improvement for Science, and subtract the two.", unlockTime: 10 },
        // ✅ Double Bar Chart Animation showing the score jumps across two subjects
        animation: { type: "double-bar-compare", config: { data: [{ label: "Maths", value: 60, valueB: 80 }, { label: "Science", value: 50, valueB: 85 }] } },
        remedialExplanation: "First, find the improvement for each subject. Maths improvement is 80 - 60 = 20 marks. Science improvement is 85 - 50 = 35 marks. The difference in their improvement is 35 - 20 = 15 marks. Distractors 35 and 20 are there to catch students who only do half the work!"
      },
      {
        difficulty: "Hard",
        questionText: "A double bar graph compares rainfall in City X and City Y using a scale of 1 unit = 5 cm. In July, City X is 6 units and City Y is 4 units. In August, City X is 5 units and City Y is 8 units. Which city received more total rainfall over both months combined, and by how much?",
        options: ["City Y by 5 cm", "City X by 5 cm", "City Y by 25 cm", "City Y by 1 unit"],
        correctAnswer: "City Y by 5 cm",
        hint: { text: "Add up the total units for City X (6+5) and City Y (4+8). Find the difference in units, then multiply by the scale (5 cm).", unlockTime: 20 },
        remedialExplanation: "Step 1: Find total units for City X (6 + 5 = 11 units). Step 2: Find total units for City Y (4 + 8 = 12 units). City Y has 1 more total unit than City X. Since 1 unit represents 5 cm of rainfall, City Y received 5 cm more rainfall in total. If you picked 'City Y by 1 unit', you forgot to apply the scale at the end!"
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