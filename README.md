# RankMe - Human Benchmarking Platform

RankMe is a competitive platform to test and track your human benchmarks, including reaction time, sequence memory, aim, and more. Compare your scores with friends in private rooms or climb the global leaderboards.

## Features

- **5 Benchmark Games**: Reaction Time, Sequence Memory, Aim Trainer, Number Memory, Chimp Test.
- **Real-time Leaderboards**: Global and Room-based rankings.
- **Private Rooms**: Create competitive lobbies for friends.
- **User System**: Guest mode (instant play) and Registered accounts (save history).
- **Responsive UI**: Modern, dark-themed interface built with Tailwind CSS.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Shadcn UI (compatible).
- **Backend**: Node.js, Express, Prisma ORM, PostgreSQL.
- **Database**: PostgreSQL.

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL installed and running.

### Installation

1.  **Clone the repository** (if applicable).

2.  **Setup Backend**:
    ```bash
    cd server
    npm install
    ```
    - Create a `.env` file in `server/` with:
      ```env
      PORT=5000
      DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/rankme?schema=public"
      JWT_SECRET="supersecretkey"
      ```
    - Run DB migrations:
      ```bash
      npx prisma generate
      npx prisma push
      ```
    - Start server:
      ```bash
      npm run dev
      ```

3.  **Setup Frontend**:
    ```bash
    cd client
    npm install
    ```
    - Start client:
      ```bash
      npm run dev
      ```

### Deployment (Vercel)

1.  Push your code to GitHub.
2.  Import the repository in Vercel.
3.  **Important**: In the "Project Settings" (or during import):
    - Set the **Root Directory** to `client`.
    - The framework should auto-detect as **Next.js**.
4.  Deploy!

## Project Structure

- `client/`: Next.js frontend application.
- `server/`: Express backend application.
