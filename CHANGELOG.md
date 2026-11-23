# Changelog

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