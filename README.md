# FPScoreBoard

Frontend for viewing statistics from [MatchZy](https://github.com/shobhit-pathak/MatchZy) for CS2.

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd FPScoreBoard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Access in browser: `http://localhost:3000`

## Configuration

After installing, you need to configure the data connection. There are two options:

### Option 1: .env file

Create a `.env` file based on `.env.example` and fill in your MySQL database data or API endpoints.

### Option 2: Configuration Page

Access the configuration page at `/start-config` and fill in the requested information:

- **Language**: Select between Portuguese, English or Spanish
- **Data Source**: Choose between MySQL or API
  - If MySQL: Fill in the database data (host, port, user, password, database name)
  - If API: Fill in the base API URL and endpoints

## Configuration Priority

For API and database data, the `.env` file always takes priority over `config.json`.

For the `needConfig` flag (which controls whether the configuration link appears in the menu), the `config.json` takes priority over `.env`.

And if there is both a database and an API, the API will take priority in calls.

## Usage

After proper configuration, you can access the following pages:

- `/` - Home page
- `/dashboard/matchs-stats` - Match statistics
- `/dashboard/players-matchs` - Players and their matches
- `/dashboard/maps-stats` - Map statistics

The "Config" link appears in the menu only when configuration has not been completed yet.

## Contributing

Want to contribute to the project? Send your Pull Request to the `development` branch.

## Tests Branch

The `tests` branch contains tools for testing a local MySQL database, useful for development and debug.

## Technologies

- **Next.js (16.0.1)**: React framework with server-side rendering and integrated API routes
- **React (19.2.0)**: Main library for interface construction
- **Tailwind CSS (v4)**: Utility-first CSS framework
- **MySQL2**: Driver for MySQL database connection
- **TypeScript**: JavaScript superset with static typing
- **ESLint**: Code analysis tool
- **Dotenv**: Environment variable management
- **Faker.js**: Fake data generation for testing
- **Ts-node**: TypeScript execution in Node.js
