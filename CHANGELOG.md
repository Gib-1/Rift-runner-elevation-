# Changelog

## Evolution 4.0 — Aim Tracking, Clear-the-Wave & XP Sweep

- Ship hull continuously faces the locked enemy between shots and points exactly along each projectile/beam during auto-fire (including Tesla Repeater).
- Regular waves spawn enemies only during their first 19 seconds. After 19 seconds, normal and summoned enemy spawns stop; a wave cannot advance before 24 seconds or while any enemies are alive.
- On a cleared wave, every uncollected XP coin is drawn toward the player in a visible 1.15-second sweep; any leftover XP is guaranteed to be credited before the next wave or the 35-second Void Breach.
- XP pickup coins no longer expire mid-wave, and level requirements are now 16 to start with gentler `floor(need * 1.15 + 4)` growth instead of 20 and `floor(need * 1.21 + 6)`.
- Void Breaches stay exactly 35 seconds, and uncollected XP from the event is secured before changing biomes.
- Saved progress, the existing backup format, six weapons, eight main biomes, 11 XP tiers, Drone Armada, bosses, and upgrades are preserved.

## Evolution 4.0 — Void Breach Interludes / 11 XP Tiers

- Introduced a 35-second Void Breach between normal biomes, after every four-wave segment. Normal-wave progression pauses during active breach gameplay and resumes at the next original biome without skipping a wave.
- Added temporary VOID BREACH arena styling, a visible countdown and dark purple vignette. The player ship acquires purely cosmetic animated purple corruption cracks and a pulsing outline, which revert when the event ends.
- Introduced two fast-spawning enemy variants (Void Runner and ranged Void Lancer) and the Void Heart major boss with unique rapid projectiles, telegraphed danger circles, and reinforcements. Encounter has an active enemy cap for mobile performance.
- Expanded the coin system from six to eleven denominations: added 2, 15, 25, 75 and rare 300 XP. The 50-XP mini-boss and 150-XP major boss rewards remain. Added new Void mob rewards, supply caches, and extra optional clear bonuses.
- Adjusted the XP legend, viewport clipping, boss label and countdown positions for portrait/landscape screens.
- Preserved the entire Drone Armada combat system, previous biome art, weapons, upgrades, version-1 backup validation, and original browser save keys. CI tests cover the 35-second phase, repeated biome transitions, boss spawning and XP tiers, mobile layout, and imports/exports.


## Evolution 4.0 — Drone Armada (35 features)

- Built animated visible orbit drones with individual bolt attacks, turret tracking, visual exhaust, wing rotation, recoil and firing flashes. One starter drone is available immediately; existing drone upgrades add more.
- Added a kill-streak-triggered drone overdrive and a new Guardian Drone interception upgrade.
- Added 12 other upgrade choices with distinct combat effects, bringing the selection pool to 62, without changing permanent upgrade IDs or prices.
- Added five temporary supply-pod reward types plus an opening shockwave. Supply pods appear after early wave transitions and expire if ignored.
- Added boss and pickup direction indicators, on-screen combat combo and wave countdown, configurable camera zoom and a low-health warning.
- Added a visible "WHAT'S NEW" guide showing all 35 improvements.
- Reduced drone target scans to around five per second per drone to protect Android performance.
- Preserved game controls, existing progress keys, version-1 backup format, XP tiers, biomes, boss roster and all existing equipment.
- Validation: JavaScript syntax; Node gameplay regression tests (targeting, 13 new run upgrades, drone interception, wave pods, existing 4.0 saves, pathfinding); Chromium portrait and landscape screenshots and control navigation; headless 120-enemy simulation with no JavaScript exceptions.

## Evolution 4.0 — Camera, Pathfinding & Power Update

- Zoomed the world camera out to 86% scale, revealing roughly 16% more world distance while keeping the HUD and touch controls full-sized.
- Added shared flow-field navigation for enemies to route around blocked line-of-sight cover. Rebuilds only when the player's navigation cell changes or destructible cover is removed; regular obstacle collision and enemy abilities remain intact.
- Buffed starting HP (120), base weapon damage (25), movement, shot speed, Nova and pickup radius; all six weapons benefit and several weapon-specific modifiers are increased.
- Strengthened numerical effects for 25 permanent Hangar bonuses and 17 common run upgrades. Upgrade prices, IDs, unlock conditions, level limits, and saved player progress remain unchanged.
- Major bosses drop one guaranteed golden 150-XP coin; mini-bosses drop one 50-XP coin. Ordinary enemies still drop 2–4 low-value coins. High-value rewards take priority when the pickup pool is full.
- Expanded XP coin legend, visuals and pickup sounds for the new 150-XP tier.
- Kept Evolution 4.0's gameplay engine, eight biomes, all bosses, save storage keys and portable version-1 save compatibility.


## Evolution 4.0 — Complete (Phases 2–6)

### Phase 2 — Evolving Arsenal
- Added Tesla Repeater: instantaneous lightning chains between visible nearby targets.
- Added Void Cannon: slow explosive rounds that pull and damage nearby enemies.
- Added a unique evolution option for each of the six unlockable weapons.

### Phase 3 — Enemy Uprising
- Added three enemy variants: Strider, Sapper and Nullifier.
- Added Rift Hunter mini-boss with teleport and projectile attacks.
- Added Abyss Sovereign main boss with health-triggered three-phase combat and telegraphed special attacks.

### Phase 4 — Progression 2.0
- Added six run upgrades and six weapon evolutions (49 total run-upgrade options).
- Added five permanent Hangar upgrades (26 total), retaining existing upgrade IDs and purchase costs.
- Added seven persistent achievements, one-time Rift Core rewards, achievements screen and cumulative challenge statistics.
- Expanded portable version-1 backups to optionally include achievements/statistics while remaining backward compatible with older backups.

### Phase 5 — World Expansion
- Added Obsidian Depths and Astral Graveyard for eight total biomes.
- Added breakable mineral cover, scattered secret caches, and biome-specific lava-pulse/gravity hazards.

### Phase 6 — Mobile Polish
- Updated game menu, description and Hangar sorting.
- Added Settings for performance effects, screen shake, combat text and sound.
- Retained single-file offline gameplay and original save keys.
- Browser-tested portrait and landscape gameplay, legacy saves, export/import, boss phases, weapons, achievements, walls and combat stress.

## Evolution 4.0 — Phase 1: Combat Reborn
- Smoother joystick acceleration and directional movement, smarter automatic targeting and lead prediction.
- Dash afterimages and improved combat impact effects.
- Improved fast-projectile collision and mobile canvas rendering costs.

## Official Website Build (Evolution 3.0)
- Added portable Export Save and Import Save with validation and confirmation.
- Preserved original XP coin tiers, cover, bosses, biomes, weapon selections, run and permanent upgrades.