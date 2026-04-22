🔗 **Central Documentation:** [https://github.com/fitforge101/fitforge-app-docs](https://github.com/fitforge101/fitforge-app-docs)

# Progress Service

## Overview
The `progress-service` is an event-driven system for logging user physical metrics and workout outcomes. It stores historical progress and emits real-time events to a Redis pub/sub mechanism.

## Features
*   Logs body weight, body fat percentage, and specific exercise records.
*   Publishes `progress-updates` events to Redis for asynchronous processing.
*   Enforces secure, self-only access to progress logs.

## Tech Stack
*   Node.js
*   Express.js
*   MongoDB (Mongoose)
*   Redis (ioredis)

## API Endpoints
*   `GET /progress/summary/:userId` - Retrieve the last 10 progress entries
*   `POST /progress/log` - Create an entry and trigger Redis event
*   `GET /health` - Healthcheck

## Example Request/Response

**POST `/progress/log`**
*Request:*
```json
{
  "weightKg": 75.5,
  "bodyFatPct": 14.2,
  "workoutCompleted": true,
  "exerciseLogs": [
    { "exercise": "Deadlift", "sets": 3, "reps": 5, "weightKg": 120 }
  ]
}
```

## Setup Instructions
1.  **Install Dependencies:**
    ```bash
    npm ci
    ```
2.  **Run Development Server:**
    ```bash
    npm run dev
    ```

## Environment Variables
*   `PORT` (Default: `5005`)
*   `MONGO_URI` (Default: `mongodb://mongo:27017/progress_db`)
*   `REDIS_HOST` (Default: `redis`)
*   `REDIS_PORT` (Default: `6379`)
*   `JWT_SECRET` (Required)

## Folder Structure
```text
.
├── Dockerfile
├── package.json
└── src/
    ├── index.js
    ├── middleware/
    │   └── auth.js
    ├── models/
    │   └── ProgressLog.js
    └── routes/
        └── progress.js
```

## Deployment
Packaged via `Dockerfile` and managed by Kubernetes using Helm. Requires an accessible Redis instance as defined in the deployment charts.
