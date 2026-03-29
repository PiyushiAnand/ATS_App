# ATS App - Adaptive Teaching System

An intelligent adaptive learning platform that uses Bayesian Knowledge Tracing (BKT) to personalize education for Class 6 Data Handling curriculum. The system dynamically adjusts difficulty and provides targeted remediation based on student performance.

## 🏗️ Architecture Overview

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  Express Backend │    │   MongoDB Atlas │
│   (Vite + TS)   │◄──►│   (Node.js)      │◄──►│   (Cloud DB)    │
│                 │    │                 │    │                 │
│ • Auth UI       │    │ • REST APIs      │    │ • User Data     │
│ • Content Viewer│    │ • BKT Engine     │    │ • Assessments   │
│ • Pathway Nav   │    │ • Session Mgmt   │    │ • Responses     │
│ • Animations    │    │ • Retry Logic    │    │ • Mastery Levels│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 ▼
                    ┌─────────────────┐
                    │   Render Cloud  │
                    │   (Deployment)  │
                    └─────────────────┘
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + @tailwindcss/typography
- **State Management**: React hooks (useState, useEffect)
- **HTTP Client**: Fetch API with custom retry logic
- **Animations**: Framer Motion + custom SVG animations
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: MongoDB Atlas (Cloud)
- **ODM**: Mongoose
- **Authentication**: JWT with HTTP-only cookies
- **Validation**: Custom utilities with NaN handling
- **CORS**: Configured for cross-origin requests

### DevOps & Deployment
- **Platform**: Render (Full-stack deployment)
- **Environment**: Production on render.com
- **Package Manager**: npm
- **Version Control**: Git

## 📊 Database Schema

### Core Entities

#### User
```typescript
{
  name: string,
  email: string (unique),
  password: string (hashed),
  mastery: Map<string, number>, // KC → mastery level (0.01-0.99 or NaN)
  completedTopics: string[],
  timestamps: true
}
```

#### Lesson
```typescript
{
  kcId: "KC1" | "KC2" | "KC3",
  subtopicName: string,
  order: number,
  learningContent: string,
  exampleText?: string,
  mediaUrl?: string,
  videoUrl?: string,
  animation: {
    type: string (enum),
    config: Mixed
  },
  timestamps: true
}
```

#### Content (Questions)
```typescript
{
  kcId: "KC1" | "KC2" | "KC3",
  difficulty: "Easy" | "Medium" | "Hard",
  questionText: string,
  options: string[4],
  correctAnswer: string,
  mediaUrl?: string,
  hint?: { text: string, unlockTime: number },
  remedialExplanation?: string,
  animation: { type: string, config: Mixed },
  timestamps: true
}
```

#### Assessment
```typescript
{
  kcId: "KC1" | "KC2" | "KC3",
  subtopicName: string,
  lessonId: ObjectId (ref: Lesson),
  questions: ObjectId[] (ref: Content),
  totalMarks: number,
  timestamps: true
}
```

#### AssessmentAttempt *(Future Implementation)*
```typescript
{
  userId: ObjectId (ref: User),
  assessmentId: ObjectId (ref: Assessment),
  score: number (NaN if incomplete),
  isCompleted: boolean,
  startTime: Date,
  endTime?: Date,
  responses: ObjectId[] (ref: Response),
  timestamps: true
}
```
*Note: AssessmentAttempt schema is designed for future implementation to track formal assessment attempts with scoring and completion status.*

#### Response
```typescript
{
  userId: ObjectId (ref: User),
  sessionId: ObjectId (ref: Session),
  problemId: ObjectId (ref: Content),
  kcId: "KC1" | "KC2" | "KC3",
  correctness: boolean,
  timeTaken: number (NaN if missing),
  hintTaken: boolean,
  attemptCount: number (NaN if missing),
  timestamps: true
}
```

#### Session
```typescript
{
  userId: ObjectId (ref: User),
  startTime: Date,
  endTime?: Date,
  Responses: ObjectId[] (ref: Response),
  timestamps: true
}
```

## 🔌 API Architecture

### Authentication Routes (`/api/auth`)
- `POST /signup` - User registration
- `POST /login` - User authentication (JWT cookie)
- `POST /logout` - Clear session

### User Management (`/api/user`)
- `GET /me` - Get current user profile
- `POST /state` - Update completed topics

### Content Delivery (`/api/lessons`)
- `GET /:kcId/:order` - Get specific lesson
- `GET /:kcId` - Get all lessons for KC

### Assessment System (`/api/assessments`) *(Future Implementation)*
- `GET /lesson/:lessonId` - Get assessment for lesson
- `POST /start` - Begin assessment attempt
- `POST /complete` - Finish assessment
*Note: Assessment routes are planned for future implementation to support formal testing with attempt tracking and scoring.*

### Response Tracking (`/api/responses`)
- `POST /submit` - Submit answer + BKT update

### Mastery System (`/api/mastery`)
- `GET /get_mastery` - Get user's mastery levels

### Session Management (`/api/session`)
- `POST /start` - Create user session
- `POST /complete` - Finalize session with responses

### Analytics Integration (`/api/merge`)
- `GET /chapters/:kcId/metadata` - Chapter structure
- `POST /sessions/:sessionId/sync` - Session analytics
- `POST /sessions/:sessionId/exit` - Midway exit tracking

## 🎯 Key Features

### 1. Bayesian Knowledge Tracing (BKT)
- **Purpose**: Adaptive difficulty adjustment
- **Algorithm**: Custom BKT implementation with parameters per KC
- **Inputs**: Correctness, time taken, hints used, attempt count
- **Outputs**: Updated mastery levels (0.01-0.99)
- **Integration**: Runs on every answer submission

### 2. Session Management
- **User Sessions**: Track learning sessions with start/end times
- **Response Grouping**: Link all responses to sessions
- **Retry Logic**: Frontend queues failed requests for retry
- **Offline Resilience**: Local storage for failed payloads

### 3. Content Delivery System
- **Knowledge Components**: KC1 (Data), KC2 (Pie Charts), KC3 (Probability)
- **Progressive Learning**: Ordered subtopics within each KC
- **Multimedia Support**: Videos, images, interactive animations
- **Animations**: Custom SVG animations for data visualization

### 4. Assessment Engine *(Basic Implementation - Full Engine Planned)*
- **Current**: Basic question delivery with real-time BKT updates
- **Question Types**: Multiple choice with 4 options
- **Difficulty Levels**: Easy, Medium, Hard
- **Hints System**: Unlockable hints with time penalties
- **Scoring**: Real-time feedback with mastery updates
- **Future**: Formal assessment attempts with scoring, completion tracking, and detailed analytics

### 5. Retry & Resilience
- **Frontend Retry**: Exponential backoff for failed requests
- **Queue System**: Store failed payloads in localStorage
- **NaN Handling**: Distinguish missing values from zeros
- **Network Recovery**: Auto-retry when connection restored

## 🔄 Data Flow

### Student Learning Journey

1. **Authentication**
   ```
   Student → Login/Signup → JWT Cookie → Access Granted
   ```

2. **Content Discovery**
   ```
   Student → Select KC → View Pathway → Choose Subtopic → Read Lesson
   ```

3. **Assessment Flow**
   ```
   Student → Start Assessment → Answer Questions → Submit Response
   → BKT Update → Mastery Adjustment → Next Question/Content
   ```

4. **Session Tracking**
   ```
   Login → Session Start → Multiple Interactions → Session Complete
   → Analytics Sync → Data Preservation
   ```

### BKT Algorithm Flow

```
Answer Submitted → Validate → Check Correctness → Calculate Time Penalty
→ Apply Hint Penalty → Update Attempt Penalty → BKT Formula
→ New Mastery Level → Update User Record → Adjust Difficulty
```

## 🚀 Deployment Architecture

### Render Configuration
- **Web Service**: Express backend (port 10000)
- **Static Site**: React frontend (Vite build)
- **Database**: MongoDB Atlas (external)
- **Environment**: Production with environment variables

### Environment Variables
```bash
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
NODE_ENV=production
PORT=10000
```

### Build Process
```bash
# Backend
npm install
npm run build  # TypeScript compilation
npm start      # Production server

# Frontend
npm install
npm run build  # Vite build to dist/
# Served statically by Render
```

## 🧪 Testing Strategy

### API Testing
- **Tool**: Custom bash scripts (`test-merge-api.sh`)
- **Coverage**: All major endpoints
- **Data**: Uses real MongoDB ObjectIds

### Frontend Testing
- **Components**: Manual testing with different states
- **Retry Logic**: Network failure simulation
- **NaN Handling**: Edge cases with missing data

### Integration Testing
- **Full Flow**: Auth → Content → Assessment → BKT Update
- **Session Management**: Start → Multiple responses → Complete
- **Error Recovery**: Failed requests → Queue → Retry → Success

## 📈 Analytics & Reporting

### Session Analytics
- **Duration**: Start time to end time
- **Interactions**: Count of responses per session
- **Performance**: Average correctness, time spent
- **Progress**: Topics completed, mastery gains

### Student Insights
- **Mastery Trends**: KC-wise progress over time
- **Difficulty Adaptation**: How system adjusts content
- **Remediation Effectiveness**: Success rates after hints/remediation

### System Metrics
- **API Reliability**: Success rates, error patterns
- **Retry Effectiveness**: Queue processing success
- **Performance**: Response times, database queries

## 🔒 Security Considerations

### Authentication
- **JWT**: HTTP-only cookies, secure flag
- **Password**: bcrypt hashing (salt rounds: 10)
- **Session**: Automatic expiration

### Data Protection
- **Input Validation**: All API inputs validated
- **CORS**: Restricted origins
- **Rate Limiting**: Not implemented (consider adding)

### Privacy
- **Data Minimization**: Only collect necessary student data
- **Session Tracking**: Anonymous session IDs
- **Analytics**: Aggregated, no personal identification

## 🐛 Error Handling

### Frontend Errors
- **Network Failures**: Queue for retry
- **Validation Errors**: User-friendly messages
- **Authentication**: Redirect to login

### Backend Errors
- **Database**: Graceful degradation
- **Validation**: Detailed error responses
- **Logging**: Console logging for debugging

### Recovery Mechanisms
- **Retry Logic**: Exponential backoff
- **Fallback UI**: Graceful degradation
- **Data Persistence**: Local storage backup

## 🚀 Future Enhancements

### Planned Features
- **Formal Assessment System**: AssessmentAttempt tracking with scoring, completion status, and detailed analytics
- **Real-time Collaboration**: Multi-student sessions
- **Advanced Analytics**: ML-powered insights
- **Mobile App**: React Native version
- **Offline Mode**: Full offline capability
- **Gamification**: Badges, leaderboards

### Technical Improvements
- **GraphQL**: Replace REST APIs
- **Redis**: Caching layer
- **Microservices**: Split monolithic backend
- **CDN**: Static asset optimization

## 📚 Development Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Git

### Local Development
```bash
# Clone repository
git clone <repo-url>
cd ats-app

# Backend setup
cd server
npm install
cp .env.example .env  # Configure MongoDB URI
npm run dev

# Frontend setup (new terminal)
cd src
npm install
npm run dev

# Access
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

### Database Seeding
```bash
# Run seed scripts
node seed.ts
node seedAssessment.ts
node seed_kc23.ts
node seed_assesKC23.ts
```

### Testing
```bash
# API tests
./test-merge-api.sh

# Build verification
npm run build
```

## 🤝 Contributing

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Code quality checks
- **Prettier**: Consistent formatting
- **Git Flow**: Feature branches, PR reviews

### Architecture Principles
- **Separation of Concerns**: Clear boundaries between layers
- **Error Resilience**: Graceful failure handling
- **Data Integrity**: Validation at all layers
- **Performance**: Efficient queries and caching

---

**Built with ❤️ for adaptive education**

*Last updated: March 2026*
