## Evolution 4.0 — Coin Rain tuning

- Reduced Coin Rain from 5× to **2.5× physical XP-coin drops**. Fractional half-coins carry across kills, so two single-coin boss rewards grant 2 then 3 coins instead of always rounding up.
- Preserved the independent Endless enemy 5× spawn-rate multiplier, Endless 2.5× XP value multiplier, and overflow XP protection.
- Updated the menu, level-up card, README, and tests without changing save keys or upgrade IDs.

# Changelog

## Visual Redesign — Phase 4: Advanced Enemy Fleets (current)

- Replaced the generic elite silhouette on **Blinkblade, Prism Gunner, Ironclad, Stormweaver and Swarm Carrier** with five bespoke archetypes, drawn in four clearly differentiated visual styles, for 20 distinctive specialist variants.
- Added cosmetic wind-up cues driven by existing combat state: Blinkblade teleport circle, Prism's three muzzle chargers, Ironclad shield/charge plating, Stormweaver warning halo and Swarm Carrier's three visible drones.
- Added **Advanced Enemy Hangar** inside Game Settings, with five actual renderer-based model previews which change with the selected world theme. The preview uses the identical function as combat.
- Force redesigned enemy art ON for all four non-Normal world themes, including old saved preferences with stale enemy-art OFF settings. Normal still shows the original enemy forms and allows the original toggle state.
- Kept style-specific world, UI, ships, 36 total enemy kinds, major/miniboss art, drone art and weapons from the previously deployed Five Visual Worlds release.
- No gameplay balance or spawn changes. Existing 5× Endless spawning, 2.5× Endless XP, 65/115/1,000 kill boss milestones, 2.5× Coin Rain, Classic waves, Void Breaches, old saves and portable JSON backups remain compatible.
- Tested five specialists × four styles × Balanced/Low Effects × idle/warning/impact frames, legacy option migration, normal sprite fallback and gameplay invariants in Node. Chromium rendered portrait and landscape previews and 50 active specialists in Low Effects without JavaScript errors. Browser CI runs full mobile/desktop, save, gameplay and gallery checks before deployment.

## Five Visual Worlds — Full Art Overhaul (previous release)

- Rebuilt the five-mode art selector so all alternative modes restyle **the full game**: menus, HUD, game-over, achievements, Hangar, upgrades, interactive buttons, stage palettes, grids, cover, hazards, rifts, pickups, XP coins, player, drones, weapons, enemy bullets and visual effects.
- Drew distinct Military, Neon, Dark Cosmic and Hybrid variants for **all 36 enemy kinds**, including the five new specialists, Void troops, mini-bosses and major bosses. Preserve original Normal shapes and original enemy art with the Redesigned Enemies switch OFF.
- Introduced dramatic faction-specific battlefield patterns: military tactical markings, neon circuitry, cosmic runes and dimensional rings, and hybrid industrial/energy geometry; retained per-biome identity and low-effects fallback.
- Added a large scene preview and unmistakable color changes in Settings, UI, browser theme color and the main menu. Applying a preference also updates the menu and active HUD instantly. Retains exclusive styles and all three independent artwork switches.
- Protected old saves and version-1 progress export/import, Coin Rain 2.5x physical coins, Endless 5x enemy cadence and 2.5x XP, boss milestones, Classic/Void behavior and all purchased upgrades.
- Added explicit visual-style simulation coverage of all 36 enemies across four alternative skins and all-five-settings persistence, menu/HUD restyling and portrait/landscape Chromium coverage. Locally exercised 76-enemy render stress with Balanced/Low effects, without JavaScript errors.

## Visual Redesign — Phases 2–3: Player Ship and Basic Enemies (previous release)

- Activated four **in-game** player-ship variants—Military Sci-Fi, Neon Cyberpunk, Dark Cosmic Sci-Fi and Hybrid—with differentiated hulls, wing shapes, engines, line details and cosmetic Void effects; **Normal remains the original ship drawing**.
- Redesigned fifteen **common enemies** with different role-specific silhouettes: scouts, drones, gunners, armored tanks, chargers, bombers, splitters and support units. Each silhouette uses the selected style's palette, and preserves original unit-color attack cues.
- Made **Redesigned Enemies** immediately effective for those fifteen common types: switching it off restores their original drawings, without changing the player's ship choice.
- Kept the five newer specialist enemies, Void soldiers, mini-/major bosses, drones, weapon effects and environments in their Phase 1 appearance for later art passes.
- Built the art in lightweight Canvas 2D. Balanced and Low Effects remain functional. No AI, damage, health, hitbox, spawn, XP, upgrades, wave, Endless, save or backup-format changes.
- Regressed legacy saves, weapon use, Classic/Endless, 2.5× Coin Rain, kill-triggered bosses, 35-second Void Breaches and the existing Settings UI. Browser-tested portrait/landscape, all five options and the enemy toggle, plus bounded 70-enemy rendering.

## Visual Redesign — Phase 1: Settings Foundation

- Added five selectable visual style preferences to GAME SETTINGS: Normal (default), Military Sci-Fi, Neon Cyberpunk, Dark Cosmic Sci-Fi and Hybrid. Only one style can be selected at a time.
- Added a small in-settings visual preview and three independently saved ON/OFF switches: Redesigned Enemies, Animated Ship Armor & Thrusters, and Enhanced Style Effects.
- Added immediate, validated preference persistence using the existing `riftrunner_options_v1` localStorage key; older/invalid settings load with safe defaults and retain original FX, zoom, sound, shake and combat text choices.
- Added a scrollable, touch-accessible Settings layout with a sticky Back control; preserve menu/paused return navigation in both modes.
- **Foundation only:** the new style selector and switches intentionally do not modify gameplay visuals until the appropriate later redesign phases. Normal remains visually unchanged, and this patch adds no gameplay assets or runtime render cost.
- Kept all existing content, XP and Coin Rain values, Classic and Endless systems, permanent purchases, gameplay save keys and version-1 backup format unmodified. Added automated preference, persistence, backwards-compatibility and responsive UI tests.

## Evolution 4.0 — Enemy Uprising + Coin Rain

- Five unique enemies introduced: Blinkblade (teleport), Prism Gunner (3-way ranged bursts), Ironclad (temporary guard and charge), Stormweaver (hazard spells), and Swarm Carrier (three Dart minions upon defeat). Available to both Classic and Endless as difficulty grows; new distinct animated accent geometry on each unit.
- Run upgrade pool grows from **62 to 82** with **20 new** choices: 2.5× Coin Rain drops, XP multiplier, extra coins, XP-triggered repairs, stronger pickup magnet, boosted drone rate/range/interception, hull repair and regeneration, Shield blast, Dash wake, Nova/Groundwell improvements, critical tuning, weapon reactor, boss bonus, electricity aura, movement speed, and elimination Nova charge. Coin Rain is deliberately offered at level 2–3 so players can test it easily.
- Permanent Hangar grows from **26 to 36** choices. Added: Experience Matrix, Fortune Harvester, Orbital Accelerator, Extended Drone Radar, Kinetic Dash Reactor, Nova Charge Coil, Aegis Shock Field, Rare Coin Scanner, Emergency Barrier Cell, and Salvage Array. All have functioning persistent levels 0–5 with legacy save defaults.
- Coin Rain multiplies *number of XP coins* by 2.5 over time for ordinary and boss enemies, carrying fractional halves between drops. Includes a 340 Balanced / 210 Low Effects XP-gem cap; when full, overflow XP is granted immediately so high-density Endless waves never erase earned XP. Gem glow is cheaper on low-end devices.
- Classic Wave and Void Breach transitions, all six weapons and drone mechanics, Endless 5× spawn rate and kill-based bosses, save import/export format and progression preserved.

## Evolution 4.0 — 5× Endless Spawning & Kill-Milestone Boss Encounters

- Increased nonstop Endless enemy spawn-rate multiplier from **2.5× to 5×** the original baseline while keeping 2.5× XP rewards unchanged. Used a bounded catch-up loop to prevent lag-induced runaway spawns.
- Added recurring **65-kill mini-boss** and **115-kill major-boss** encounters using rotating existing elite types.
- Added a repeatable **1,000-kill triple threat**: Abyss Sovereign plus two mini-bosses appearing together (also at 2,000 and later thousand-kill milestones).
- Replaced the previous time-based Endless elite spawns with kill-driven encounters. Timed supply drops remain available.
- Reserved eight population slots for elites under the existing 82/58 active-enemy caps and queued boss milestones when capacity is temporarily exhausted so encounters are not lost.
- Updated the Endless menu description and live HUD elite counter; Classic waves, Void Breaches, pathfinding, drones, difficulty, 11 XP coin values, permanent upgrades, game saves and export/import compatibility remain unchanged.
- Expanded automated tests for 65/115/1,000 kill milestones, repeated triggers, capped queues, mode isolation, and Classic regression coverage.


## Evolution 4.0 — Compact Endless Horde / 2.5× Spawning

- Reduced Endless's dedicated Eclipse Citadel arena to approximately **1,930 × 1,930** world units, with interior concentric rings, redesigned cover, hazards, caches, and a visible perimeter. Normal mode's arena dimensions are unchanged.
- Made continuous Endless enemy spawns **2.5× faster** than the previous mode's interval while keeping the existing **2.5× XP** gain.
- Added periodic directional horde squads of 2–8 enemies with an on-screen announcement, alongside the usual nonstop spawn stream.
- Capped active Endless foes at **82** (Balanced Effects) or **58** (Low Effects), with a simple frame-time governor that can lower the cap to 52 on slow devices and gradually restore it if performance recovers. This prioritizes playability over unbounded enemy populations.
- Reduced Endless environmental decoration and checked that horde spawns appear away from the player when near the arena boundary. Preserves Classic Waves, Void Breaches, achievements, coin tiers, the existing save schema and Endless records.


## Evolution 4.0 — Endless Horde (separate mode)

- Added a new **∞ ENDLESS HORDE · 2.5× XP** button on the title screen, alongside the unchanged Classic Wave Mode.
- Created the exclusive **ECLIPSE CITADEL** arena: radial energy lanes, concentric neon rings, custom arena cover, rifts, caches, and distinctive teal/violet lighting; optimized 2D canvas visuals.
- Endless mode spawns enemies continuously, without waves, pauses for wave clearing, XP-sweep breaks, 35-second Void interludes, or rotating biomes.
- Difficulty scales with survival time, gradually unlocking more enemy types, higher enemy health and quicker spawn rates; bounded spawning for mobile performance.
- Added timed supply drops, mini-bosses and occasional major boss encounters without interrupting the horde.
- Multiplied Endless-only XP earnings by exactly **2.5×**, preserving fractional XP and all 11 coin tiers. Classic XP rates are unchanged.
- Added an independent persistent Endless elimination record (`stats.bestEndless`) to the existing profile and version-1 JSON backup, with safe defaults for legacy backups. The Classic best score and wave-based achievements are unaffected.
- Retry respects the current run mode, while the two menu buttons always explicitly choose their corresponding modes.
- Added automated mode-isolation, arena, XP, timing, threat-scaling and save compatibility tests, with mobile portrait/landscape browser checks.

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
