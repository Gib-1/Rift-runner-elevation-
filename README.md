# RIFT RUNNER: EVOLUTION

A mobile-first, single-file cosmic survival roguelite. Play in a modern browser, or open the published GitHub Pages website.

## Official website

https://gib-1.github.io/Rift-runner-elevation-/

## Evolution 4.0 — Camera, Pathfinding & Power Update

- Camera zoomed out slightly (86% world scale) for better battlefield awareness; interface and touch hitboxes remain unchanged.
- Enemies follow cached navigation routes around solid cover when direct pursuit is blocked, using the existing collision system.
- Buffed all six weapons through stronger starting power, increased many numerical upgrades, and improved starting survival stats. Hangar purchases and unlock progression remain unchanged.
- Major bosses now drop a single **150 XP** gold coin; mini-bosses drop a single **50 XP** magenta coin. Standard enemies retain the original coin distribution.
- Preserves Evolution 4.0's existing save keys and downloadable backup format; no save reset is necessary. Export a backup before switching versions if you want a safety copy.

## Evolution 4.0 — Complete six-phase overhaul

- **Phase 1 — Combat Reborn:** smoother movement, smarter auto-targeting, Dash trails, improved hit feedback and swept projectile collisions.
- **Phase 2 — Evolving Arsenal:** two more unlockable weapons (Tesla Repeater and Void Cannon) and six weapon-specific evolutions for the full arsenal.
- **Phase 3 — Enemy Uprising:** Strider, Sapper and Nullifier enemy types, Rift Hunter mini-boss and Abyss Sovereign major boss with three health-based phases.
- **Phase 4 — Progression 2.0:** 49 run-level upgrade choices in the upgrade pool, 26 permanent Hangar upgrades, and seven unlockable achievements with one-time Rift Core rewards.
- **Phase 5 — World Expansion:** eight rotating biomes, including Obsidian Depths and Astral Graveyard; unique hazards, destructible cover and hidden supply caches.
- **Phase 6 — Mobile Polish:** an updated menu, organized Hangar, achievements screen, performance/visual effects settings, screen shake and combat text toggles, save compatibility checks.

Existing weapons, abilities, bosses, six XP coin tiers, and the original six biomes remain playable. Android portrait and landscape modes are supported. The game does not require an account, external assets, or a download when played on the official site.

## Controls

- **Mobile:** drag in the left area to move; tap the Dash, Nova, Shield and Gravity buttons. Shooting targets automatically. Tap the weapon button in the HUD to switch unlocked weapons.
- **Desktop:** WASD / arrow keys move; Space = Dash; E = Nova; Q = Shield; R = Gravity; F = switch weapon; Escape = pause.

## Saves and backups

Browser progress is saved automatically in `riftrunner_evolution_v1` (Rift Cores, permanent upgrades, achievements and cumulative challenge statistics) and `riftrunner_best` (best eliminations). Additional visual settings are in `riftrunner_options_v1`. Existing Evolution 3.0 save keys and upgrades remain supported; missing newly added upgrade and achievement fields default safely.

Select **EXPORT SAVE** to download a `.json` backup, or **IMPORT SAVE** to restore one. The portable save format remains version 1, with optional new achievement/statistic fields; old version-1 backup files are still accepted. **Import replaces current saved progress** — export your website progress before importing to avoid losing it.

Opening downloaded HTML files can use different storage than a GitHub Pages site; do not delete an older file or clear browser data until your old save has been safely exported and imported.

## Updating the game

Update `index.html` in the repository's `main` branch after testing. A GitHub Actions workflow publishes the branch to the same permanent website address. Use a separate branch for development and verify browser tests before merging.

## Privacy

No account registration, login, analytics, advertising, personal data collection or external asset requests are built into the game. Backup files contain game progress and an export timestamp, not names or contact information. GitHub profile details and public repository commit history are visible through GitHub and separate from game saves.