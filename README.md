# PoemCraftAI

PoemCraftAI is a project aimed at providing an AI-powered poetry creation platform. It leverages TypeScript, modern web frameworks, and configuration tools to deliver a seamless user experience.

## Project Structure

- **client/**  
  Contains the front-end code, including `index.html` as the main entry point and a `src/` directory for additional client-side logic and assets.

- **server/**  
  (Details not available from current results, but typically would contain backend logic such as API endpoints, authentication, and database interaction.)

- **shared/**  
  (Details not available from current results, but this directory is commonly used for code shared between client and server, such as type definitions or utility functions.)

- **components.json**  
  Configuration file that may define UI or system components used in the application.

- **drizzle.config.ts**  
  Configuration for Drizzle ORM or a related database tool.

- **package.json & package-lock.json**  
  Node.js dependencies and scripts for managing the project's build and development lifecycle.

- **postcss.config.js**  
  Configuration for PostCSS, likely used for CSS processing.

- **ARCHITECTURE.md**  
  Overview of the application's architecture, components and data flow.

- **tailwind.config.ts**  
  Configuration for Tailwind CSS to style the UI.

- **tsconfig.json**  
  TypeScript configuration.

- **vite.config.ts**  
  Configuration for Vite, a fast front-end build tool.

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

## Configuration

The server reads these from the process environment and does not load `.env` files. Export them in your shell (see `.env.example`) or set them in your host's settings:

| Variable | Required | Description |
| --- | --- | --- |
| `GEMINI_API_KEY` | No | Google Gemini API key (free from [Google AI Studio](https://aistudio.google.com/apikey)). Enables AI poem generation. `GOOGLE_API_KEY` is also accepted. Without a key, built-in template poems are used. |
| `GEMINI_MODEL` | No | Gemini model to use (default `gemini-flash-latest`). |
| `PORT` | No | Port to listen on (default `5000`). Most hosts set this automatically. |
| `DATABASE_URL` | No | Only used by `npm run db:push`. Poems are currently stored in memory. |

## Deployment

### Netlify

The repository's `netlify.toml` sets the build command to `npm run build` and
the publish directory to `dist/public`, where Vite writes `index.html` and the
client assets. Publishing the parent `dist` directory places the homepage at
`/public/` instead of `/` and causes the site root to return a 404.

### Render

`render.yaml` defines a web service. In Render choose **New > Blueprint**, select this
repository, and enter `GEMINI_API_KEY` when prompted. Poems are stored in memory, so they
reset on every restart or redeploy, and the app must run as a single instance.

### Other Node hosts

Requires Node.js 20.11+. Any Node host works (Render, Railway, Fly.io, a VPS, Docker, ...):

- **Build command:** `npm ci --include=dev && npm run build` (the build needs dev dependencies)
- **Start command:** `npm start`
- Set `GEMINI_API_KEY` in the host's environment. `GET /api/health` can be used as the health check.

## Technologies Used

- TypeScript
- Node.js
- Vite
- Tailwind CSS
- PostCSS

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)
