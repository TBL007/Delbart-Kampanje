# Delbart-Kampanje
- [Planlegging](/Planlegging/Planlegging.md)
- [Logg](/Logg/Logg.md)
- [Publisert](https://delbart-kampanje.vercel.app/)
# Innhold
dette er en fullstack web app lagd med next.js, sanity og supabase ment som en digital kampanje for å informere om loverk angående seksualiserte bilder og deling av disse


# setup

Set supabase med koden i [sql schema](/SUPABASE_SCHEMA.sql)

set opp et sanity project

## Environment Variables

Create a `.env.local` file in the project root and add the following variables:

```env
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_PROJECT_ID="your_sanity_project_id"

NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your_supabase_publishable_key"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"

AUTH_SECRET="your_auth_secret"
AUTH_URL="http://localhost:3000"

ADMIN_PASS="your_admin_password"
```

### Notes

- `SUPABASE_SERVICE_ROLE_KEY` must never be exposed publicly.
- `AUTH_SECRET` should be a long random secure string.
- `ADMIN_PASS` is used for admin authentication during production.
- In production, update `AUTH_URL` to your deployed domain.


## kjør prosjektet
```sh
npm install

npm run dev
```
# Funksjonalitet

## Splash 
hoved siden er komponert av et splash bilde og under er det innlegg fra forms
## Quiz
Quizen siden er basert på en liste med spørsmål som har bilder, titler/spørsmålet og svar alternativer fra sanity forms, den funker ved å iterere gjenom listen og opdattere inholden slik.
## undersøkelse/studie
spørsmål basert på sanity, sender svar til api som vidresender til supabase 
