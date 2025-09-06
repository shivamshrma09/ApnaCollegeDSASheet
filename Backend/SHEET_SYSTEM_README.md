# Dynamic Sheet Progress System

## Overview
The backend now supports dynamic progress tracking for all DSA sheets including Apna College, Love Babbar, Striver sheets, and more. Each sheet maintains separate progress data including completed problems, starred problems, notes, playlists, and forgetting curve.

## Features Supported for All Sheets

### 1. Progress Tracking
- ✅ Completed problems tracking
- ✅ Starred problems
- ✅ Notes for each problem
- ✅ Custom playlists
- ✅ Difficulty-wise statistics (Easy/Medium/Hard)
- ✅ Streak tracking
- ✅ Forgetting curve implementation

### 2. Supported Sheet Types
- `apnaCollege` - Apna College DSA Sheet (373 problems)
- `loveBabbar` - Love Babbar DSA Sheet (450 problems)
- `striverSDE` - Striver SDE Sheet (191 problems)
- `striverA2Z` - Striver A2Z DSA Sheet (455 problems)
- `striver79` - Striver 79 Sheet (79 problems)
- `blind75` - Blind 75 (75 problems)
- `striverComplete` - Striver Complete Sheet (455 problems)
- `striverMaster` - Striver Master Sheet (455 problems)
- `striverCP` - Striver CP Sheet (200 problems)
- `striverArrays` - Striver Arrays (50 problems)
- `striverBinarySearch` - Striver Binary Search (30 problems)
- `companyWise` - Company Wise Questions (500 problems)

## API Endpoints

### Sheet Management
```
GET /api/sheets/types - Get all available sheet types
GET /api/sheets/user/:userId/all-progress - Get user's progress across all sheets
POST /api/sheets/user/:userId/initialize/:sheetType - Initialize a new sheet for user
```

### Progress Management (All support sheetType query parameter)
```
GET /api/progress/:userId?sheetType=<sheetType> - Get user progress for specific sheet
POST /api/progress/:userId/complete/:problemId?sheetType=<sheetType> - Toggle problem completion
POST /api/progress/:userId/star/:problemId?sheetType=<sheetType> - Toggle problem star
POST /api/progress/:userId/note/:problemId?sheetType=<sheetType> - Save problem note
DELETE /api/progress/:userId/note/:problemId?sheetType=<sheetType> - Delete problem note
```

### Playlist Management
```
POST /api/progress/:userId/playlist?sheetType=<sheetType> - Create playlist
PUT /api/progress/:userId/playlist/:playlistId?sheetType=<sheetType> - Update playlist
DELETE /api/progress/:userId/playlist/:playlistId?sheetType=<sheetType> - Delete playlist
POST /api/progress/:userId/playlist/:playlistId/problem/:problemId?sheetType=<sheetType> - Add problem to playlist
DELETE /api/progress/:userId/playlist/:playlistId/problem/:problemId?sheetType=<sheetType> - Remove problem from playlist
```

### Forgetting Curve (All support sheetType query parameter)
```
GET /api/forgetting-curve/all?sheetType=<sheetType> - Get forgetting curve data
POST /api/forgetting-curve/add?sheetType=<sheetType> - Add problem to forgetting curve
POST /api/forgetting-curve/update?sheetType=<sheetType> - Update forgetting curve
GET /api/forgetting-curve/due-today?sheetType=<sheetType> - Get problems due for review
DELETE /api/forgetting-curve/remove/:problemId?sheetType=<sheetType> - Remove problem from forgetting curve
```

## Database Schema

### User Model - sheetProgress Field
```javascript
sheetProgress: {
  type: Map,
  of: {
    completedProblems: [{ type: Number }],
    starredProblems: [{ type: Number }],
    notes: { type: Map, of: String, default: new Map() },
    playlists: [{
      id: String,
      name: String,
      description: String,
      problems: [Number],
      createdAt: { type: Date, default: Date.now }
    }],
    totalSolved: { type: Number, default: 0 },
    easySolved: { type: Number, default: 0 },
    mediumSolved: { type: Number, default: 0 },
    hardSolved: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastSolvedDate: { type: Date },
    forgettingCurve: {
      today: [{ problemId: Number, addedDate: { type: Date, default: Date.now } }],
      day1: [{ problemId: Number, addedDate: Date }],
      day3: [{ problemId: Number, addedDate: Date }],
      week1: [{ problemId: Number, addedDate: Date }],
      week2: [{ problemId: Number, addedDate: Date }],
      month1: [{ problemId: Number, addedDate: Date }],
      month3: [{ problemId: Number, addedDate: Date }]
    }
  },
  default: new Map()
}
```

## Migration

A migration script has been created to convert existing users from the old structure to the new Map-based structure:

```bash
cd Backend
node scripts/migrateSheetProgress.js
```

## Usage Examples

### Frontend Integration
```javascript
// Get progress for specific sheet
const response = await fetch(`/api/progress/${userId}?sheetType=striverSDE`);
const progress = await response.json();

// Toggle problem completion for Love Babbar sheet
await fetch(`/api/progress/${userId}/complete/${problemId}?sheetType=loveBabbar`, {
  method: 'POST'
});

// Get all available sheet types
const sheets = await fetch('/api/sheets/types');
const sheetTypes = await sheets.json();
```

### Backend Controller Usage
```javascript
// The controllers automatically handle different sheet types
// based on the sheetType query parameter
const { sheetType = 'apnaCollege' } = req.query;
const sheetData = user.sheetProgress.get(sheetType);
```

## Benefits

1. **Scalability**: Easy to add new sheet types without code changes
2. **Data Isolation**: Each sheet maintains separate progress data
3. **Backward Compatibility**: Existing data is preserved through migration
4. **Consistent API**: Same endpoints work for all sheet types
5. **Performance**: Map-based storage for efficient data access

## Notes

- Default sheet type is `apnaCollege` if not specified
- All existing functionality (notes, playlists, forgetting curve) works across all sheets
- Sheet type validation ensures only valid sheet types are accepted
- Migration preserves all existing user data