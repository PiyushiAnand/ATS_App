# NaN vs 0 Implementation Summary

## What Was Done

Your project now properly distinguishes between:
- **NaN** = Missing/undefined values (never attempted, not yet assessed)
- **0** = Valid zero values (student scored 0, or a real measurement)

## Files Created

### Backend
1. **[/server/utils/numberHandling.ts](../../server/utils/numberHandling.ts)**
   - Core utilities: `toStorageNumber()`, `fromStorageNumber()`, `isMissing()`, `isValid()`, `safeCompare()`
   - Use these when checking or storing numbers

2. **[/server/utils/validation.ts](../../server/utils/validation.ts)**
   - Validation functions: `validateResponseSubmission()`, `validateScore()`, `validateMastery()`
   - Use before storing any numerical data

3. **[/server/NaN_BEST_PRACTICES.md](../../server/NaN_BEST_PRACTICES.md)**
   - Comprehensive guide with examples
   - Migration guide for existing data
   - Testing examples

4. **[/server/NaN_QUICK_REFERENCE.ts](../../server/NaN_QUICK_REFERENCE.ts)**
   - Quick copy-paste examples
   - Do's and don'ts
   - Common use cases

### Frontend
5. **[/src/utils/nanHandling.tsx](../../src/utils/nanHandling.tsx)**
   - React components: `ScoreDisplay`, `MasteryDisplay`, `AssessmentStatus`
   - Validation and API handling
   - State management patterns
   - Testing examples

## Files Modified

### Schemas Updated with Getters
1. **[/server/models/Response.ts](../../server/models/Response.ts)**
   - `timeTaken`: null in DB → NaN on retrieval
   - `attemptCount`: null in DB → NaN on retrieval

2. **[/server/models/AssessmentAttempt.ts](../../server/models/AssessmentAttempt.ts)**
   - `score`: null in DB → NaN on retrieval (before completion)

3. **[/server/models/User.ts](../../server/models/User.ts)**
   - `mastery` map: null entries are cleaned up, missing KCs are NaN

### Routes Updated
4. **[/server/routes/responseRoutes.ts](../../server/routes/responseRoutes.ts)**
   - Added validation before saving responses
   - Proper error messages for validation failures

### App Configuration
5. **[/server/app.ts](../../server/app.ts)**
   - Already has session route mounted (no changes needed)

## Key Implementation Details

### Schema Getters
```typescript
// Example from Response.ts
timeTaken: {
  type: Number,
  default: null,  // null in MongoDB
  get: (value: any) => value === null || value === undefined ? NaN : value,
}
```

This means:
- Storing: Pass `undefined` or let it default to `null`
- Retrieving: Automatically becomes `NaN` if not set
- Displaying: Check with `Number.isNaN()`

### Validation Pattern
```typescript
// In responseRoutes.ts
const validation = validateResponseSubmission({ timeTaken, attemptCount });
if (!validation.isValid) {
  return res.status(400).json({ error: "Validation failed", details: validation.errors });
}
```

### Frontend Display Pattern
```typescript
// In React components
if (Number.isNaN(score)) {
  return <span>Not Attempted</span>;
}
if (score === 0) {
  return <span>0 / 5</span>;
}
return <span>{score} / 5</span>;
```

## How to Use in Your Code

### When Receiving Data
```typescript
// ✅ DON'T do this:
timeTaken: req.body.timeTaken || 0,  // Masks missing!

// ✅ DO this:
timeTaken: req.body.timeTaken,  // Let undefined through
```

### When Checking Values
```typescript
// ✅ DON'T do this:
if (!score) { }           // True for both 0 and NaN
if (score >= 5) { }       // Fails silently with NaN

// ✅ DO this:
import { isMissing, isValid } from '../utils/numberHandling';
if (isMissing(score)) { } // True only for NaN
if (isValid(score) && score >= 5) { } // Safe comparison
```

### When Displaying
```typescript
// ✅ DON'T do this:
<span>{score || "Not attempted"}</span>  // Shows "Not attempted" for 0

// ✅ DO this:
<span>{Number.isNaN(score) ? "Not attempted" : score}</span>
```

## Fields That Use NaN

| Field | Model | Storage | Why NaN |
|-------|-------|---------|--------|
| `score` | AssessmentAttempt | null | Not yet competed |
| `timeTaken` | Response | null | Would need separate tracking |
| `attemptCount` | Response | null | Distinguishes from first attempt (1) |
| `mastery[KC]` | User | missing key | Before first attempt at that KC |
| `endTime` | AssessmentAttempt | null | Before assessment ends |

## Testing These Changes

### Test NaN Handling
```typescript
test('score is NaN for new attempt', () => {
  const attempt = new AssessmentAttempt({ userId, assessmentId });
  expect(Number.isNaN(attempt.score)).toBe(true);
});

test('score is 0 for zero marks', async () => {
  const attempt = new AssessmentAttempt({ userId, assessmentId, score: 0 });
  await attempt.save();
  const fetched = await AssessmentAttempt.findById(attempt._id);
  expect(fetched.score).toBe(0); // Real zero, not NaN
});
```

### Test Validation
```typescript
test('validation catches missing timeTaken', () => {
  const result = validateResponseSubmission({ timeTaken: undefined });
  expect(result.isValid).toBe(false);
});
```

### Test Frontend Display
```typescript
test('score display shows NaN as "Not attempted"', () => {
  const { container } = render(<ScoreDisplay score={NaN} maxScore={5} />);
  expect(container.textContent).toContain('Not attempted');
});
```

## Maintenance Going Forward

### When Adding New Numerical Fields
1. Should it be optional? (Can be missing before first use?)
   - **Yes** → Use `default: null` with NaN getter
   - **No** → Use `required: true`

2. Can the value be 0? (Is 0 a valid meaningful value?)
   - **Yes** → Must use NaN for missing, not 0
   - **No** → 0 is fine (rare case)

3. Always add validation rules in `validation.ts`

### Data Migration (if needed)
```typescript
// If you have existing data with 0s that should be NaN:
db.responses.updateMany(
  { timeTaken: 0 },
  { $set: { timeTaken: null } }
);

// Verify new documents get NaN correctly:
const response = await Response.findOne({ _id: ... });
console.log(Number.isNaN(response.timeTaken)); // Should be true
```

## References

- **Schema Getters**: Read `/server/NaN_BEST_PRACTICES.md` → "Schema Getters" section
- **Validation**: Import from `/server/utils/validation.ts`
- **Frontend**: Read `/src/utils/nanHandling.tsx` → "Display Components" section
- **Quick Examples**: See `/server/NaN_QUICK_REFERENCE.ts`

## Common Issues & Solutions

**Issue**: "I'm getting `null` instead of `NaN` from the API"
- **Solution**: API response needs to use the schema getter. Make sure the model has the getter defined.

**Issue**: "My comparison `if (score >= 5)` fails when score is NaN"
- **Solution**: Use `safeCompare(score, 5)` from numberHandling.ts

**Issue**: "Frontend shows 'Not attempted' for score of 0"
- **Solution**: Use `Number.isNaN(score)` not `!score` or `if (!score)`

**Issue**: "I can't tell if 0 means 'never attempted' or 'scored zero'"
- **Solution**: That's exactly why we're using NaN! Use the new pattern: NaN = never attempted, 0 = real zero.

## Next Steps

1. ✅ Share this summary with team
2. ✅ Import utilities in other routes as needed
3. ✅ Update any frontend components that display scores
4. ✅ Add validation to any new numerical fields
5. ✅ Test with actual data to ensure NaN is working
6. ✅ Consider data migration if you have legacy 0 values

---

All utilities are production-ready. Use them consistently across your codebase! 🎯
