# Delta Bay Impact Website

Next.js + Storybook marketing site for Delta Bay Impact.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Storybook

```bash
npm run storybook
```

## Environment Variables

Create a `.env.local` file in the project root with:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-22
NEXT_PUBLIC_GA_ID=
SANITY_API_WRITE_TOKEN=
```

## Sanity

Sanity Studio is embedded at `/studio`. The client setup lives in
`src/sanity/client.ts` with queries in `src/sanity/queries.ts`.

Seed the initial content into Sanity:

```bash
npm run seed:sanity
```

## Deployment

Deploy on Vercel using the default Next.js settings and add the env vars above
in the Vercel dashboard.
