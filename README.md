# StockCheck

A mobile-first app for the weekly grocery run: tick off what you already
have, then generate and send a shopping list for whatever's left. Static
site, no backend — everything lives in your browser's localStorage.

## Run locally

Requires Node 18+.

```bash
npm install
npm run dev       # start the dev server (prints a local URL)
npm run test      # run the Vitest suite for the list formatters
npm run build     # type-check and produce a production build in dist/
npm run preview   # serve the production build locally
```

## Editing the essentials list

All categories and items live in a single file: `src/data/items.ts`. Each
category looks like:

```ts
{
  id: 'pantry',
  name: 'Pantry',
  items: ['Rice', 'Pasta', 'Olive oil', /* ... */],
}
```

- Add, remove, or rename items freely — just edit the `items` array.
- Add a whole new category by adding another object to the `categories`
  array (give it a unique `id`, a `name`, and an `items` list).
- **Note on renaming:** each item's "checked" state is saved against a key
  made from `categoryId + item name`. Renaming an item resets its checked
  state (it'll look unchecked next time), but reordering items or categories
  is safe and won't lose anyone's progress.
- Category icons and accent colors are mapped by `id` in
  `src/lib/categoryStyles.tsx` — add an entry there if you add a new category
  and want it to have its own icon and color (otherwise it falls back to a
  neutral default).

## Changing how long saved state lasts

The app remembers what you've checked off and any extra items you've added
for a limited time, so a stale list from three weeks ago doesn't greet you
next time you shop. This is controlled by `STATE_TTL_DAYS` in `src/config.ts`:

```ts
export const STATE_TTL_DAYS = 7;
```

Change the number to adjust how many days of inactivity before the check
state and extras are discarded (your preferred send format is always kept).
You can also clear everything immediately at any time with the **Start new
week** button at the top of the page.

## Push to GitHub

```bash
git add -A
git commit -m "Your message"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import your GitHub
   repo.
2. Framework preset: **Vite**.
3. Build command: `npm run build`
4. Output directory: `dist`
5. No environment variables are needed — click **Deploy**.

Every push to `main` will trigger a new deployment automatically.

## What to test on your phone

After deploying (or running `npm run dev` and opening the URL on your
phone over the same network), it's worth manually checking:

- **Share sheet** — on the shopping list view, tap **Share** and confirm
  your phone's native share sheet opens with the list text pre-filled.
- **WhatsApp link** — tap **WhatsApp** and confirm it opens WhatsApp (or
  wa.me in the browser) with the message pre-filled and category headers
  bolded.
- **Telegram link** — tap **Telegram** and confirm it opens the Telegram
  share dialog with the text pre-filled.
- **Copy → Notes/Keep/Reminders** — switch to the **Notes** preset, tap
  **Copy**, paste into Apple Notes / Google Keep / Reminders, select the
  item lines, and confirm you can convert them into a checklist using the
  app's own checklist/bullet button.
- **Add to Home Screen** — confirm the StockCheck icon and name appear
  correctly when you add the site to your home screen.
- **Light/dark mode** — toggle your phone's system theme and confirm the
  app follows it.
