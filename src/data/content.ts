import { ContentSection } from "../types";

export const COURSE_CONTENT: ContentSection[] = [
  {
    id: 'kc1',
    title: 'Data Representation & Bar Graphs',
    videoUrl: 'https://www.youtube.com/embed/n2YkbdNORp8', // Example educational video
    explanation: 'Data handling is the process of gathering, recording, and presenting information in a way that is helpful to others. Bar graphs use rectangular bars to represent data.',
    examples: [
      'A bar graph showing the number of students who like different fruits.',
      'Using tally marks to count frequency before drawing a graph.'
    ],
    questions: [
      {
        id: 'q1',
        text: 'What is the primary purpose of a bar graph?',
        options: ['To draw pretty pictures', 'To compare different categories of data', 'To write long stories', 'To solve complex equations'],
        correctIndex: 1,
        difficulty: 'easy',
        hint: 'Think about how the bars stand next to each other.'
      },
      {
        id: 'q2',
        text: 'If one unit on a bar graph represents 5 students, how many students do 4 units represent?',
        options: ['4', '9', '20', '15'],
        correctIndex: 2,
        difficulty: 'medium',
        hint: 'Multiply the number of units by the value of one unit.'
      }
    ],
    remedialContent: {
      explanation: 'Let\'s revisit the basics of counting with tally marks. Each vertical line represents one, and the fifth line crosses the first four.',
      videoUrl: 'https://www.youtube.com/embed/1W_zM7-S68U'
    }
  },
  {
    id: 'kc2',
    title: 'Understanding Pie Charts',
    videoUrl: 'https://www.youtube.com/embed/Lp9Z6X_8X0A',
    explanation: 'A pie chart is a circular graph divided into slices to illustrate numerical proportion. The entire circle represents 100% or the total value.',
    examples: [
      'A pie chart showing how a student spends their 24-hour day.',
      'Calculating the angle of a slice: (Value / Total) * 360.'
    ],
    questions: [
      {
        id: 'q3',
        text: 'In a pie chart, what does the entire circle represent?',
        options: ['Half the data', 'The total value', 'A small portion', 'Zero'],
        correctIndex: 1,
        difficulty: 'easy',
        hint: 'A whole pie is... well, whole!'
      },
      {
        id: 'q4',
        text: 'If a pie chart shows 40 students and "Cricket" takes up exactly half the circle, how many students like Cricket?',
        options: ['10', '20', '40', '5'],
        correctIndex: 1,
        difficulty: 'medium',
        hint: 'What is half of 40?'
      }
    ],
    remedialContent: {
      explanation: 'Think of a pie chart like a real pizza. If you cut it into equal halves, each half is 50% of the whole pizza.',
      videoUrl: 'https://www.youtube.com/embed/8v_62O-0q-w'
    }
  }
];
