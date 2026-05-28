# At The Side Bingo

Evenementenbeheer en reserveringsplatform voor At The Side Bingo shows.

## Tech stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Hosting**: Vercel

## Lokaal starten

```bash
npm install
npm run dev
```

Maak een `.env` bestand aan met:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

## Bouwen voor productie

```bash
npm run build
```

## Database

Migraties staan in `/supabase/migrations/`. Uitvoeren via:

```bash
npx supabase db push
```

Of handmatig plakken in de Supabase SQL Editor.

## Functionaliteit

- Publieke agenda met aankomende evenementen
- Reserveringsformulier met event-selectie
- Verlopen evenementen worden automatisch niet meer getoond of boekbaar
- Admin dashboard voor evenementenbeheer, registraties en site-content
- Handmatig goedkeuringsproces voor betalingen
