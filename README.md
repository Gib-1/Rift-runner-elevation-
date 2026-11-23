# RIFT RUNNER: EVOLUTION

A mobile-first, single-file cosmic survival roguelite. Play in a modern browser, or open the published GitHub Pages website.

## Official website

https://gib-1.github.io/Rift-runner-elevation-/

## Evolution 4.0 — Targeted Flight, Wave Clearance & XP Sweep

- **Ship turns toward the firing target:** the player craft follows its current target between auto-shots, and its nose snaps to the actual firing direction when a projectile or Tesla beam is fired. Moving and dashing do not force the ship to face away from an enemy it is shooting.
- **Wave spawns end before transition:** regular enemy spawning runs for 19 seconds, then stops (including enemy summoning). The wave must reach at least 24 seconds *and* all remaining enemies must be defeated before progressing; fights never skip living enemies. Void Breaches continue to have their original 35-second time limit and fast spawns.
- **Guaranteed end-of-wave XP sweep:** all remaining XP coins fly rapidly toward the player for 1.15 seconds and are fully collected before the next wave or Void Breach. Uncollected XP coins no longer expire mid-wave; emergency pickup aggregation guarantees none remain stranded offscreen. Healing orbs are handled separately.
- **Faster leveling:** starting XP requirement falls from 20 to 16 and subsequent requirements grow by `floor(previous * 1.15 + 4)` instead of `floor(previous * 1.21 + 6)`. All 11 existing coin types and boss values stay unchanged.
- **Save compatibility:** original `riftrunner_evolution_v1`, `riftrunner_best`, options key, permanent upgrades, and version-1 export/import format remain unchanged. These gameplay changes affect only in-run state.

## Evolution 4.0 — Drone Armada (35-feature gameplay update)

- **All players start with one orbit drone.** Every drone now has an animated orbit, rotor, thruster, aim swivel, targeting reticle, recoil, muzzle flash and real moving energy bolts. New drones from run or Hangar upgrades fire independently rather than dealing invisible hits. Overdrive triggers briefly after ten eliminations.
- **Thirteen new optional run upgrades** add Guardian Drone interception, fire/cold/disruption effects, execution damage, critical shockwaves, boss lifesteal, ricochets, Nova residue, enhanced Gravity Well, Dash shock trails, Shield cooldown recovery and milestone healing. There are now **62** run-upgrade options; permanent Hangar remains at **26** unchanged upgrade definitions.
- **Wave supply pods** offer five useful pickups: hull repair, XP currency, temporary rapid fire, magnetic collection, or a temporary barrier. Opening them also causes a nearby shockwave.
- **HUD and accessibility:** offscreen boss and cache markers, visible kill streak and next-wave timer, low-health warning, and optional Near/Normal/Far camera zoom saved to the existing options key. The game menu has a **WHAT'S NEW** guide listing all 35 improvements.
- **Mobile performance:** drone line-of-sight searches run periodically (~5 Hz), not every rendered frame. The existing low-effects option remains supported.
- **Compatibility:** Existing weapon inventory, enemy pathfinding, cover, 150-XP major boss coins, 50-XP mini-boss coins, six weapons, eight biomes and all existing progression remain. `riftrunner_evolution_v1`, `riftrunner_best`, and portable version-1 save backup format are unchanged.

### The 35 additions

1. Animated floating drone orbits
2. Animated drone rotor wings
3. Animated thruster exhaust
4. Staggered independent drone fire
5. Tracking drone turrets
6. Drone recoil and muzzle flashes
7. Visible moving drone bolts
8. Drone target-lock reticles
9. Drone overdrive streak mode
10. Drone projectile interception
11. Incendiary rounds
12. Cryo slow rounds
13. Armor disruption rounds
14. Execution bonus damage
15. Critical shockwaves
16. Boss siphon repairs
17. Ricochet shots
18. Lingering Nova plasma
19. Crushing Gravity Well
20. Electrified Dash wake
21. Shield cooldown recovery on eliminations
22. Milestone level repairs
23. Wave supply pod deployments
24. Supply pod repair cells
25. Supply pod XP caches
26. Temporary rapid-fire supply module
27. Temporary magnet supply module
28. Temporary barrier supply module
29. Supply pod opening shockwave
30. Offscreen boss direction beacon
31. Offscreen supply cache locator
32. Kill combo tracker
33. Adjustable camera zoom
34. Low-hull warning overlay
35. Next-wave countdown

## Evolution 4.0 — Void Breach Interludes and Expanded XP

- Every normal biome rotation (after each four-wave segment), play a dedicated **35-second VOID BREACH** before entering the next of the eight original biomes. The normal wave clock pauses during the breach; your survival timer still advances during active play. Level-up pauses do not consume the 35 seconds.
- During the breach: a purple Void arena replaces the normal biome, Void Runners and Void Lancers arrive in rapid waves, and **The Void Heart** boss appears immediately with unique projectile patterns and troop summons. To protect mobile performance, this mode limits active enemies.
- The player ship develops **temporary animated violet corruption cracks** and a purple aura. These effects are cosmetic, and the normal appearance returns afterward.
- New XP tiers **2, 15, 25, 75 and 300** expand the system to eleven types: 1, 2, 3, 5, 10, 15, 25, 50, 75, 150 and 300. The existing 50-XP mini-boss and 150-XP major boss coins are preserved. Void troops and supply caches provide the new types; defeating The Void Heart earns an extra 75-XP clear reward on exit, with a 300-XP rare reward after every third successful interlude. Rare 300-XP coins can also appear in advanced secret caches.
- The Void phase is temporary, not a ninth normal biome. All eight existing biomes, six weapons, Drone Armada upgrades, achievements, save keys, version-1 backup compatibility, and user settings remain intact.
- Designed and tested for portrait and landscape play with no external assets or network dependencies.

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