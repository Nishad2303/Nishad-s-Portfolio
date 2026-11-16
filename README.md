# Nishad's portfolio

## Project layout

- `app/` contains the Next.js App Router pages and media API routes.
- `public/` contains the static portfolio pages, browser scripts and styles, navigation/icons, about carousel images, and the 160 journey animation frames served by the site.
- `Projects/photos/`, `Achievements/`, and `certificate/` contain the source media read by the API routes. Keep these folders in place for deployment.
- Root HTML, JS, and CSS files mirror the browser-facing portfolio files in `public/` for direct local preview. Keep the copies synchronized when editing them.
- `package.json`, `package-lock.json`, and the Next/PostCSS/Tailwind config files are required for install and build.
- Windows shortcut files and generated build output are excluded from the repository; the live media folders above remain included.

## Run locally

```powershell
npm install
npm run dev
```

Create a production build with `npm run build`, then serve it with `npm run start`.
