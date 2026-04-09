This is the Next.js frontend for the Food Tour application.

## Environment Setup

Create your local env file from the example:

```bash
cp .env.development.example .env.local
```

Available env templates:
- `.env.example`
- `.env.development.example`
- `.env.production.example`

Required variables:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The app will read `.env.local` during development, and `.env.production` in production builds.

## Production Build

```bash
npm run build
npm start
```

Set `NEXT_PUBLIC_API_URL` to your deployed backend API endpoint before starting in production.
