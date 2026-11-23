# RIFT RUNNER: EVOLUTION

A self-contained, offline-capable, mobile-friendly browser survival game.

## Play

Open `index.html` locally, or publish this repository with GitHub Pages (`main` branch, `/ (root)` folder). No installs, libraries, accounts, analytics, or external assets are required to play.

## What's included

Evolution 4.0 Phase 1 (Combat Reborn) builds on Evolution 3.0: improved joystick movement, stable auto-targeting with limited lead, Dash afterimages, hit reactions, collision detection for fast projectiles, and rendering optimizations. The game still includes multiple weapons, XP coin tiers, 6 biomes, cover walls, bosses, mini-bosses, 36 level-up upgrades, and 21 permanent Hangar upgrades.

## Save backups and upgrades

From the main menu choose **EXPORT SAVE** to download a `.json` backup. The file contains only earned Rift Cores, permanent upgrade levels, and your highest elimination count. It does not contain an account name, personal information, or in-run state.

On the new website, choose **IMPORT SAVE** and select your `.json` file. Review and confirm the replacement. **Import replaces the website's current saved progress.** Export first if you want to preserve it. The current game keeps the same storage keys used in Evolution 3.0: `riftrunner_evolution_v1` and `riftrunner_best`.

**Migrating from a previous downloaded game:** Download and open this updated official HTML version using the **same browser and storage context** where Evolution 3.0 has your existing progress; if the save appears, export it here, then import into the website. Because browsers can isolate `file://` files (and may block local storage), old progress is not guaranteed to appear automatically. If it does not appear, keep the original file and browser data; do not delete it, clear storage or overwrite your only saved progress. Game upgrades and settings continue saving automatically in the browser where you play.

## Updating this project

Edit `index.html` on the `main` branch. GitHub Pages republishes it to the **same URL**. Existing saved progress on that website stays in the browser under the same domain and save keys; take a backup before major changes.

## Privacy

There are no ads, tracking services, passwords, usernames, emails, or external network calls in this game. Only the repository owner name, repository content and GitHub-hosted website become public if the repository is public. Avoid putting personal information in future commits, README files or filenames.

## Evolution 4.0 release approach

Phase 1 (Combat Reborn) has been tested on portrait and landscape browser viewports. Phases 2–6 (weapons, bosses, progression, biomes, and final polish) are not implemented yet. Save format, storage keys and existing upgrade IDs remain unchanged. A JSON save export is recommended before major updates.