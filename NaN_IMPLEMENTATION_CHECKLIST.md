# NaN Implementation Checklist

Use this checklist to systematically update your codebase to use NaN for missing values.

## Phase 1: Setup (✅ Already Done)
- [x] Create `/server/utils/numberHandling.ts` - Core utilities
- [x] Create `/server/utils/validation.ts` - Validation functions
- [x] Update `/server/models/Response.ts` - Add NaN getters
- [x] Update `/server/models/AssessmentAttempt.ts` - Add NaN getters
- [x] Update `/server/models/User.ts` - Handle mastery map
- [x] Update `/server/routes/responseRoutes.ts` - Add validation
- [x] Create `/src/utils/nanHandling.tsx` - Frontend utilities
- [x] Create documentation files

## Phase 2: Code Updates Required

### Backend Routes
- [ ] `/server/routes/assessmentRoutes.ts`
  - [ ] Import `{ validateScore }` from validation
  - [ ] When creating AssessmentAttempt, don't set score if not ready
  - [ ] When completing: validate score before saving
  
- [ ] `/server/routes/userRoutes.ts`
  - [ ] When updating mastery, validate with `validateMastery()`
  - [ ] Don't set mastery values to 0, use NaN for untried

- [ ] `/server/routes/masteryRoute.ts`
  - [ ] Validate mastery values before returning
  - [ ] Document that NaN means "not attempted"

### Frontend Components
- [ ] `/src/components/Content.tsx`
  - [ ] Import display utilities from `nanHandling.tsx`
  - [ ] Update score display to handle NaN
  - [ ] Update any score comparisons

- [ ] `/src/components/Pathway.tsx`
  - [ ] Update mastery display to show "Not started" for NaN
  - [ ] Use `isMissing()` instead of comparing with 0

- [ ] `/src/App.tsx`
  - [ ] Initialize mastery with NaN values: `{ "KC1": NaN, "KC2": NaN, "KC3": NaN }`
  - [ ] When displaying mastery, handle NaN
  - [ ] Update any conditional logic checking mastery

### API Clients
- [ ] Create `/src/api/assessmentClient.ts`
  - [ ] Handle NaN in responses
  - [ ] Add validation before sending data
  - [ ] Document that score can be NaN

## Phase 3: Testing

### Unit Tests
- [ ] Test `numberHandling.ts` utilities
  - [ ] `isMissing()` returns true only for NaN
  - [ ] `isValid()` returns false for NaN
  - [ ] `fromStorageNumber()` converts null to NaN

- [ ] Test `validation.ts` functions
  - [ ] `validateResponseSubmission()` with missing timeTaken
  - [ ] `validateScore()` with NaN score
  - [ ] `validateMastery()` with NaN mastery

### Integration Tests
- [ ] Test AssessmentAttempt model
  - [ ] New attempt has NaN score ✓
  - [ ] Can set score to 0 and retrieve as 0 ✓
  - [ ] Can set score to positive number ✓

- [ ] Test Response model
  - [ ] timeTaken can be NaN ✓
  - [ ] attemptCount can be NaN ✓
  - [ ] Can store and retrieve both

- [ ] Test API endpoints
  - [ ] POST `/api/assessments/start` returns attemptId
  - [ ] GET `/api/assessments/:attemptId` returns score as NaN
  - [ ] POST `/api/responses/submit` validates input

### E2E Tests
- [ ] Student takes assessment
  - [ ] [ ] Score shown as "Not Attempted" before submission
  - [ ] [ ] After submission, score shows as number (0 or positive)
  - [ ] [ ] Mastery shows as "Not started" for new KC
  - [ ] [ ] Mastery updates to percentage after first response

- [ ] Student scores zero
  - [ ] [ ] Display shows "0 / 5" not "Not Attempted"
  - [ ] [ ] Mastery still updates (not treated as missing)

- [ ] Validation prevents bad data
  - [ ] [ ] Negative timeTaken rejected
  - [ ] [ ] Attempt count < 1 rejected
  - [ ] [ ] Score > maxScore rejected

## Phase 4: Data Verification

### Check Existing Data
- [ ] Query responses with null timeTaken
  ```mongo
  db.responses.find({ timeTaken: null }).count()
  ```

- [ ] Query attempts with null score
  ```mongo
  db.assessmentattempts.find({ score: null }).count()
  ```

### Verify NaN Conversion
- [ ] [ ] Fetch response from API, check timeTaken is NaN
- [ ] [ ] Fetch attempt from API, check score is NaN if not completed
- [ ] [ ] Fetch user mastery from API, check untried KCs are missing

### Fix Legacy Data (if needed)
- [ ] [ ] Identify zero values that should be NaN
  ```typescript
  // Find responses with 0 seconds (probably should be NaN)
  Response.find({ timeTaken: 0 })
  ```

- [ ] [ ] Migrate data
  ```typescript
  Response.updateMany(
    { timeTaken: 0 }, // If 0 means "never tracked/missing"
    { $set: { timeTaken: null } }
  );
  ```

- [ ] [ ] Verify migration
  ```typescript
  const resp = await Response.findOne();
  console.log(Number.isNaN(resp.timeTaken)); // Should be true
  ```

## Phase 5: Documentation

- [ ] [ ] Add comments to code using NaN
  ```typescript
  // timeTaken is NaN if student hasn't answered yet
  if (Number.isNaN(response.timeTaken)) {
    // ...
  }
  ```

- [ ] [ ] Update API documentation
  - [ ] Document that score can be null (becomes NaN)
  - [ ] Document that mastery keys missing means NaN

- [ ] [ ] Team knowledge sharing
  - [ ] Share `/server/NaN_BEST_PRACTICES.md` with team
  - [ ] Share `/server/NaN_QUICK_REFERENCE.ts` for examples
  - [ ] Update team wiki/docs

## Phase 6: Deployment

- [ ] [ ] Create database backup before migration
- [ ] [ ] Run data migration in staging first
- [ ] [ ] Verify all tests pass
- [ ] [ ] Deploy backend changes
- [ ] [ ] Deploy frontend changes
- [ ] [ ] Monitor for errors in production logs
- [ ] [ ] Verify data integrity post-deployment

## Phase 7: Monitoring

- [ ] [ ] Add logging for NaN values
  ```typescript
  if (Number.isNaN(score)) {
    logger.info('Assessment not yet completed', { attemptId, userId });
  }
  ```

- [ ] [ ] Monitor error rates for validation failures
- [ ] [ ] Check database storage of null vs numeric values
- [ ] [ ] Track API response times (no regression)

## Utility Reference

### Import in Backend Routes
```typescript
import { isMissing, isValid } from '../utils/numberHandling';
import { validateResponseSubmission, validateScore } from '../utils/validation';
```

### Import in Frontend
```typescript
import { ScoreDisplay, MasteryDisplay } from '../utils/nanHandling';
```

## Rollback Plan

If something goes wrong:
1. Revert schema getters (comment out NaN getter)
2. Run data migration in reverse (null → 0)
3. Revert code changes
4. Redeploy

## Questions to Ask

- [ ] Should we migrate existing 0 values to NaN?
- [ ] Do we need to track why a field is NaN (not answered vs. excluded)?
- [ ] Should frontend send NaN to backend or undefined/null?
- [ ] Do we need analytics on NaN values (how many untried)?

## Estimated Timeline

- **Phase 1**: ✅ Done (1-2 hours)
- **Phase 2**: 3-4 hours (depends on number of routes/components)
- **Phase 3**: 2-3 hours (testing)
- **Phase 4**: 1-2 hours (data verification)
- **Phase 5**: 1 hour (documentation)
- **Phase 6**: 0.5-1 hour (deployment)
- **Phase 7**: Ongoing (monitoring)

**Total: ~10-14 hours of work**

---

✅ Start with Phase 1 (already complete)
👉 Next: Phase 2 (update remaining routes)
