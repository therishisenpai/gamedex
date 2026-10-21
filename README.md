# GameDex 🎮

A responsive front-end gaming library and progress-tracking prototype built with HTML, CSS, and vanilla JavaScript for a Software Engineering lab demonstration.

## Features
- Browse and search a sample catalog of games; filter by genre
- Add games to a personal library
- Track Backlog, Playing, Paused, and Completed status
- Track hours played and progress percentage
- Rate games and save review notes
- Add/remove games from a wishlist
- View collection statistics and status breakdown
- Persist demo data in the browser using `localStorage`
- Responsive layout for desktop and mobile

## Run locally
Open `index.html` in a modern browser. No build step or package installation is required.

## Publish with GitHub Pages
1. Create a new GitHub repository named `gamedex`.
2. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose branch `main` and folder `/ (root)`, then save.
6. Wait for GitHub to show the published Pages URL.

## Scope note
This is a front-end prototype. It uses sample catalog data and browser-local storage. It does not currently implement real user authentication, a remote database, a separate admin dashboard, or multi-user synchronization. Data is stored only in the browser profile used for the demo. The cover artwork uses CSS typography and gradients, so no third-party image assets are required.

## Suggested demo flow
1. Search for `Persona` and open its details.
2. Add it to your library.
3. Set status to `Playing`, hours to `6`, progress to `35`, rating to `5`, then save.
4. Add `Elden Ring` to your wishlist.
5. Open **My Library**, then **My Stats**.
6. Refresh the page to demonstrate browser-local persistence.
