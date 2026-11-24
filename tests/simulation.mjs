// RIFT RUNNER Evolution 4.0 — DOM-free simulation smoke tests.
// These tests intentionally target the lightweight Canvas game, not the retired 5.0 renderer.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const match=html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(match,'Single game script must exist');
const source=match[1];
const noop=()=>{};
function makeEnv(seed={}){
 let depth=0;
 const gradient={addColorStop:noop};
 const canvas=new Proxy({save:()=>{depth++},restore:()=>{assert.ok(depth>0,'Canvas restore without save');depth--},createRadialGradient:()=>gradient,createLinearGradient:()=>gradient},
   {get:(obj,k)=>obj[k]??noop});
 class Element{
  constructor(){this.style={};this.children=[];this.label='';this.events={};this.className='';this.classList={toggle:noop,add:noop,remove:noop};this.scrollTop=0;this.value='';this.files=[];}
  setAttribute(){} addEventListener(n,fn){this.events[n]=fn} click(){this.events.click?.()} append(...v){this.children.push(...v)} querySelector(){return this} remove(){} setPointerCapture(){} getBoundingClientRect(){return {left:0,top:0,width:300,height:240}} getContext(){return canvas}
  set textContent(v){this.label=String(v);this.children=[]} get textContent(){return this.label}
  set innerHTML(v){this.label=String(v);this.children=[]} get innerHTML(){return this.label}
 }
 const elements=new Map();const node=id=>{if(!elements.has(id))elements.set(id,new Element());return elements.get(id)};
 const storage=new Map(Object.entries(seed));
 const env={assert,console,performance,innerWidth:844,innerHeight:390,devicePixelRatio:1.4,requestAnimationFrame:noop,addEventListener:noop,navigator:{},
  document:{hidden:false,getElementById:node,createElement:()=>new Element(),addEventListener:noop},
  localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,String(v)),removeItem:k=>storage.delete(k)}
 };
 env.window=env;
 const run=snippet=>{
   vm.runInNewContext(source.replace(/\}\)\(\);\s*$/,`\n${snippet}\n})();`),env,{timeout:15000});
   assert.equal(depth,0,'Canvas transform stack balanced');
 };
 return {run,storage};
}
const t=makeEnv();
t.run(`
 start();assert.equal(player.maxHp,120);assert.equal(player.damage,25);assert.equal(player.droneCount,1);assert.equal(EVO42_FEATURES.length,39);assert.equal(cameraScale(),.86);
 assert.equal(Object.keys(weaponTypes).length,7);assert.equal(shopData.length,36);assert.equal(upgradeData.length,82);
 assert.equal(MAIN_BIOME_COUNT,8);assert.equal(themes.length,10);assert.equal(coinTiers[150].r,19);
 keyboard.add('ArrowRight');update(.03);assert.ok(player.x>0);render();togglePause();assert.equal(mode,'pause');
`);
console.log('Pass: camera, movement, HUD renderer, six weapons, upgrades and eight biomes.');

t.run(`start();walls=[];enemies=[];
 for(const id of Object.keys(weaponTypes).filter(id=>id!=='drone')){
  enemies=[];bullets=[];beams=[];spawnEnemy('tank',120,0);spawnEnemy('tank',175,18);
  player.weapon=id;fire();assert.equal(player.targetId,enemies[0].id);
  if(id==='tesla')assert.ok(beams.length>0);else assert.ok(bullets.some(b=>b.weapon===id));
 }
 nova();shield();gravity();dash();render();
`);
console.log('Pass: all six weapons, automatic targeting and four special abilities.');

t.run(`start();
 spawnEnemy('hunter',250,0);killed(enemies.at(-1));assert.equal(gems.filter(g=>g.val===50).length,1);
 spawnEnemy('abyss',250,50);killed(enemies.at(-1));assert.equal(gems.filter(g=>g.val===150).length,1);
 assert.equal(gems.filter(g=>g.val===50).length,1);
 player.need=999;player.xp=0;gainXp(150);assert.equal(player.xp,150);
`);
console.log('Pass: mini-boss 50 XP, main boss 150 XP, and XP leveling.');

t.run(`start();player.droneCount=0;walls=[{x:-35,y:-110,w:70,h:220,breakable:false}];invalidateNavigation();
 player.x=215;player.y=0;enemies=[];spawnEnemy('drone',-140,0);const e=enemies[0];e.x=-140;e.y=0;e.shot=999;
 assert.ok(rayWall(e.x,e.y,player.x,player.y,10));let reached=false;
 spawnTimer=999;shotTimer=999;
 for(let i=0;i<465;i++){update(.016);if(hypot(e.x-player.x,e.y-player.y)<66){reached=true;break}}
 assert.ok(reached,'Pathfinding should route an enemy around cover');
 damageCover({breakable:false,hp:1},0); // should safely ignore unbreakable cover
`);
console.log('Pass: obstacle-aware enemy pathfinding around solid cover.');

const save={cores:342,upgrades:{armor:3,attack:2},achievements:{first:true},stats:{totalKills:25,bestWave:3}};
const profiles=makeEnv({riftrunner_evolution_v1:JSON.stringify(save),riftrunner_best:'88'});
profiles.run(`assert.equal(meta.cores,342);assert.equal(meta.upgrades.armor,3);assert.equal(meta.achievements.first,true);
 assert.equal(gameBest,88);start();assert.equal(player.maxHp,168);assert.equal(player.damage,30);
 const parsed=validateBackup({game:BACKUP_GAME,formatVersion:1,progress:{cores:342,best:88,upgrades:{armor:3,attack:2}}});
 assert.equal(parsed.cores,342);assert.equal(parsed.upgrades.armor,3);assert.equal(parsed.best,88);
`);
console.log('Pass: legacy saves, existing upgrade purchases and version-1 save import.');

// Specific drone and combat regressions.
t.run(`start();walls=[];enemies=[];spawnTimer=999;shotTimer=999;
 spawnEnemy('tank',135,0);let droneShots=0;
 for(let i=0;i<100;i++){update(.016);droneShots+=bullets.filter(b=>b.weapon==='drone').length}
 assert.ok(droneShots>0,'Drone must emit real visible projectiles');assert.equal(player.drones.length,1);
 const d=player.drones[0];assert.ok(Number.isFinite(d.aim));render();
 player.droneDefense=1;player.drones[0].interceptCd=0;const pos=dronePose(0);
 enemyBullets=[{x:pos.x-5,y:pos.y,vx:380,vy:0,r:5,dmg:20,life:1}];update(.02);assert.equal(enemyBullets.length,0,'Drone intercepts projectiles');
`);
console.log('Pass: drone orbit, aim, moving bolts, interception, and render.');
t.run(`start();walls=[];enemies=[];spawnTimer=999;shotTimer=999;assert.equal(upgradeData.length,82);
 for(const id of ['flameRounds','cryoRounds','disruptRounds','executeRounds','critShock','bossSiphon','ricochetRounds','novaAfter','gravityCrush','dashWake','shieldRecharge','levelRepair']){
 const option=upgradeData.find(v=>v.id===id);assert.ok(option,id);option.apply();assert.ok(player[id]>0,id);
 }
 spawnEnemy('tank',95,0);const e=enemies.at(-1);hitEnemy(e,10,'#fff',false,'shot');assert.ok(e.burn>0&&e.chill>0&&e.disrupt>0);
 const current=e.hp;update(.05);assert.ok(e.hp<current,'Burn must apply damage');
 player.nova=100;nova();assert.ok(novaFields.length>0);
 player.gravCd=0;gravity();assert.ok(wells.length>0);
 player.hp=15;player.level=3;player.need=20;player.xp=0;gainXp(20);assert.ok(player.hp>15,'Milestone healing applies');
 render();
`);
console.log('Pass: twelve independent combat, defense, and special ability upgrades.');
t.run(`start();walls=[];enemies=[];spawnTimer=999;shotTimer=999;wave=2;
 for(let idx=0;idx<5;idx++){
  supplyPods=[];wave=2+idx;spawnSupplyPod();assert.equal(supplyPods.length,1);
  const p=supplyPods[0];assert.equal(p.type,SUPPLY_TYPES[idx]);player.x=p.x;player.y=p.y;
  if(idx===0)player.hp=10;
  openSupplyPod(p);
  if(idx===0)assert.ok(player.hp>10);
  if(idx===1)assert.ok(gems.some(g=>g.val===25));
  if(idx===2)assert.ok(player.rapidTime>0);
  if(idx===3)assert.ok(player.magnetTime>0);
  if(idx===4)assert.ok(player.shield>0);
 }
 gameSettings.zoom='far';assert.equal(cameraScale(),.73);gameSettings.zoom='near';assert.equal(cameraScale(),.98);
 gameSettings.zoom='normal';player.hp=1;updateHUD();assert.ok(Number($('healthAlarm').style.opacity)>0);
 render();
`);
console.log('Pass: 5 distinct supply pickups, camera zoom, low-hull HUD and world rendering.');
console.log('All Evolution 4.0 Drone Armada simulation checks passed.');

// Wave pacing, targeted ship orientation and XP acquisition regression coverage.
t.run(`start();assert.equal(player.need,16);
 gainXp(16);assert.equal(player.level,2);assert.equal(player.need,22);
`);
console.log('Pass: easier level requirements and gentler XP curve.');

t.run(`start();walls=[];enemies=[];player.droneCount=0;spawnTimer=999;shotTimer=999;
 spawnEnemy('tank',0,-190);const e=enemies.at(-1);e.speed=0;e.shot=999;
 player.aim=0;fire();assert.equal(player.targetId,e.id);
 assert.ok(Math.abs(player.aim+Math.PI/2)<.03,'Ship points toward its initial shot target');
 assert.ok(bullets.some(b=>b.vy<0),'Bullet fires where ship faces');
 e.x=190;e.y=0;const old=player.aim;update(.03);
 assert.ok(player.aim>old,'Ship follows moving enemy smoothly between shots');
 keyboard.add('ArrowLeft');fire();assert.ok(Math.abs(player.aim)<.03,'Facing shooting target overrides movement');
 keyboard.delete('ArrowLeft');player.weapon='tesla';e.x=-190;e.y=0;fire();
 assert.ok(Math.abs(Math.cos(player.aim)+1)<.03,'Tesla also rotates ship toward its shot');
 assert.ok(beams.length>0,'Tesla emitted beams');render();
`);
console.log('Pass: ship faces every firing direction including Tesla and continuously tracks moving targets.');

t.run(`start();walls=[];enemies=[];player.droneCount=0;player.invuln=999;
 spawnTimer=999;shotTimer=999;spawnEnemy('drone',500,500);const foe=enemies[0];foe.speed=0;
 waveElapsed=18.99;update(.02);assert.equal(wavePhase,'clear');
 assert.equal(enemies.length,1);const before=enemies.length;
 spawnTimer=0;spawnEnemy('dart',200,200);update(.5);assert.equal(enemies.length,before,'No troops spawn during last-five-seconds cleanup, including scripted summons');
 waveElapsed=23.98;update(.03);assert.equal(wavePhase,'clear','Must wait for final enemy elimination');
 player.need=9999;player.xp=0;dropCoin(player.x+1250,player.y+90,300);gems[0].vx=0;gems[0].vy=0;
 const firstX=gems[0].x;update(.03);assert.ok(gems[0].x===firstX,'Far-away coins remain until the sweep');
 enemies=[];update(.02);assert.equal(wavePhase,'sweep');
 const coinX=gems[0].x;update(.03);assert.ok(gems[0].x<coinX,'Stray XP coin visibly flies toward player');
 for(let i=0;i<75;i++)update(.02);
 assert.equal(wave,2);assert.equal(wavePhase,'spawn');assert.equal(player.xp,300);
 assert.equal(gems.filter(g=>!g.heal).length,0,'All XP auto-collected at wave end');
`);
console.log('Pass: spawn cutoff, enemy-clear gating, animated XP vacuum and complete XP collection.');

t.run(`start();advanceWave(4);waveElapsed=24;wavePhase='clear';enemies=[];player.invuln=999;
 update(.02);assert.equal(wavePhase,'sweep');waveSweepRemaining=.01;update(.02);
 assert.equal(voidActive,true);assert.equal(mapIndex,VOID_BIOME);
 assert.equal(voidRemaining,VOID_LENGTH);assert.equal(wave,4);
 assert.ok(enemies.some(e=>e.kind==='voidheart'));
 assert.equal(coinTiers[2].r,6.5);assert.equal(coinTiers[15].r,10.5);
 assert.equal(coinTiers[25].r,12);assert.equal(coinTiers[75].r,16);
 assert.equal(coinTiers[300].r,21);
 spawnTimer=0;update(.03);assert.ok(enemies.some(e=>['voidrunner','voidlancer'].includes(e.kind)));
 assert.ok(spawnTimer<.4);render();
 const boss=enemies.find(e=>e.kind==='voidheart');killed(boss);assert.equal(voidBossCleared,true);assert.ok(gems.some(g=>g.val===150));
 const before=normalTime;for(let i=0;i<100;i++)update(.02);assert.equal(normalTime,before);
 voidRemaining=.02;update(.03);assert.equal(voidActive,false);assert.equal(mapIndex,1);
 assert.equal(wave,5);assert.equal(coinTiers[75].r,16);
 assert.ok(gems.some(g=>g.val===75)||player.level>1,'Void clear gives immediate reward coin');
 assert.ok(!gems.some(g=>g.val===150),'Void boss XP is swept up when breach closes');
 render();assert.equal($('voidTint').style.opacity,'0');
`);
console.log('Pass: 35s Void breach still starts after fully cleared fourth wave, exits into next biome and gathers old XP.');

t.run(`start();advanceWave(4);waveElapsed=24;wavePhase='clear';enemies=[];update(.02);waveSweepRemaining=.01;update(.02);
 voidRemaining=.01;update(.03);assert.equal(mapIndex,1);assert.equal(wave,5);
 advanceWave(8);waveElapsed=24;wavePhase='clear';enemies=[];update(.02);waveSweepRemaining=.01;update(.02);
 assert.equal(voidActive,true);assert.equal(voidNextBiome,2);
 voidRemaining=.01;update(.02);assert.equal(mapIndex,2);assert.equal(wave,9);
 for(const n of [1,2,3,5,10,15,25,50,75,150,300]){dropCoin(player.x+110,player.y,n)};
 assert.ok(gems.some(g=>g.val===300));render();
`);
console.log('Pass: repeat Void transitions, biome rotation and all eleven XP tiers render.');

t.run(`start();advanceWave(4);waveElapsed=24;wavePhase='clear';enemies=[];update(.02);waveSweepRemaining=.01;update(.02);
 player.invuln=999;
 for(let i=0;i<75;i++)spawnEnemy(i%3?'voidrunner':'voidlancer',100+(i%15)*17,60+(i%5)*10);
 assert.ok(enemies.length<=82,'Void NPC cap should remain bounded');
 for(let i=0;i<120;i++){update(.016);render()}
 assert.ok(voidActive);assert.ok(Number.isFinite(player.hp));assert.ok(Number.isFinite(voidRemaining));
 assert.ok(enemies.length<=90,'Wave population remains bounded under rapid spawning');
`);
console.log('Pass: rapid Void combat stays bounded and frame calculations remain finite.');

// ENDLESS HORDE: isolated from normal wave transitions and Void Breaches.
t.run(`start('endless');const originalBestWave=meta.stats.bestWave;assert.equal(runMode,'endless');assert.equal(mapIndex,ENDLESS_BIOME);
 assert.equal(themes[mapIndex].name,'ECLIPSE CITADEL');assert.equal(wave,1);
 assert.equal(wavePhase,'spawn');assert.equal(voidActive,false);assert.equal(endlessMilestoneQueue.length,0);
 assert.ok(walls.length>=25&&rifts.length>=5&&decos.length>=45,'Compact arena geometry exists');
 assert.equal(ENDLESS_HALF_SIZE,965);assert.equal(ENDLESS_SPAWN_MULTIPLIER,5);
 assert.ok(walls.every(w=>Math.abs(w.x+w.w/2)<930&&Math.abs(w.y+w.h/2)<930),'Cover is within smaller arena');
 assert.equal(insideWall(0,0,175),false,'Spawn center is unobstructed');
 updateHUD();assert.ok($('wave').textContent.includes('ENDLESS'));assert.ok($('battleMetrics').textContent.includes('2.5× XP'));
 player.xp=0;player.need=99;gainXp(2);assert.equal(player.xp,5,'XP is 2.5x exactly');
 gainXp(1);assert.equal(player.xp,7.5,'Fractional XP is retained instead of rounding away rewards');
 spawnTimer=.001;enemies=[];player.droneCount=0;player.invuln=999;
 update(.016);assert.ok(enemies.length>0,'Enemy spawns immediately');
 wavePhase='clear';spawnTimer=0;const oldLength=enemies.length;update(.03);
 assert.ok(enemies.length>oldLength,'Endless spawning ignores cleared wave phase');
 assert.equal(wave,1);assert.equal(voidActive,false);
 render();assert.equal(meta.stats.bestWave,originalBestWave,'Endless must not advance wave achievements');
`);
console.log('Pass: independent Endless mode, distinct arena, continuous spawns, HUD and exact 2.5x XP.');

t.run(`start('endless');player.droneCount=0;player.invuln=999;
 enemies=[];walls=[];spawnTimer=999;endlessHordeClock=999;endlessSupplyClock=.01;
 update(.03);assert.equal(wave,1);assert.ok(supplyPods.length===1,'Timed supply drops operate without waves');
 assert.equal(enemies.filter(e=>e.boss).length,0,'Elite bosses are kill-triggered, not spawned on a time clock');
 timer=400;enemies=[];spawnEnemy('tank',160,80);assert.ok(enemies[0].hp>200,'Difficulty scales over survival time');
 wavePhase='sweep';waveElapsed=24;update(.03);assert.equal(wave,1);assert.equal(voidActive,false);assert.equal(mapIndex,ENDLESS_BIOME);
 const classicBest=gameBest;kills=87;saveBest();assert.equal(meta.stats.bestEndless,87);assert.equal(gameBest,classicBest);
 const backup=validateBackup({game:BACKUP_GAME,formatVersion:1,progress:{cores:meta.cores,upgrades:meta.upgrades,best:0,stats:meta.stats}});
 assert.equal(backup.stats.bestEndless,87);
 start('normal');assert.equal(runMode,'normal');assert.equal(mapIndex,0);assert.equal(wave,1);
 player.need=99;player.xp=0;gainXp(2);assert.equal(player.xp,2,'Classic XP is unchanged');
`);
console.log('Pass: independent supply timer, growing threat, separate Endless high score, and old saves.');

// ENDLESS 2.5X SPAWN CADENCE, HORDES, AND PERFORMANCE LIMITS.
t.run(`start('endless');player.invuln=999;player.droneCount=0;shotTimer=999;
 enemies=[];walls=[];invalidateNavigation();spawnTimer=.001;
 update(.005);assert.ok(spawnTimer>0&&spawnTimer<.85/ENDLESS_SPAWN_MULTIPLIER*1.2,'5x enemy spawn cadence');
 assert.equal(enemies.length,1);
 const limit=ENDLESS_HALF_SIZE;player.x=limit-20;player.y=0;moveSolid(player,1000,0);assert.ok(player.x<=limit-player.r+1e-5);
 const t=runMode;start('normal');assert.equal(runMode,'normal');walls=[];player.x=1400;moveSolid(player,1000,0);assert.ok(player.x>1400,'Classic arena remains larger');
`);
console.log('Pass: 5x Endless spawn cadence and compact-only boundaries.');
t.run(`start('endless');player.invuln=999;player.droneCount=0;shotTimer=999;
 enemies=[];walls=[];invalidateNavigation();spawnTimer=999;endlessHordeClock=.001;
 update(.005);assert.ok(endlessHordeCount>=1,'At least one squad arrived together');
 assert.ok(enemies.length>=2,'A multi-enemy horde was spawned');
 const cap=endlessEnemyCap();assert.ok(cap<=ENDLESS_BASE_CAP);
 enemies=[];for(let i=0;i<cap+15;i++)spawnEnemy('drone',100+i%10*9,50+i%8*9);
 assert.equal(enemies.length,cap-ENDLESS_ELITE_RESERVE,'Eight elite slots stay open during packed hordes');
 gameSettings.fx='low';assert.equal(endlessEnemyCap(),Math.min(endlessDynamicCap,58));
 gameSettings.fx='balanced';endlessDynamicCap=52;assert.equal(endlessEnemyCap(),52);
 render();assert.equal(wave,1);assert.equal(voidActive,false);
`);
console.log('Pass: grouped hordes, bounded enemy count, performance settings and classic independence.');

t.run(`start('endless');player.invuln=999;player.droneCount=0;shotTimer=999;spawnTimer=999;endlessHordeClock=999;endlessSupplyClock=999;
 walls=[];invalidateNavigation();enemies=[];
 for(let i=0;i<ENDLESS_BASE_CAP+20;i++)spawnEnemy('drone',-420+(i%10)*72,-430+Math.floor(i/10)*68);
 assert.equal(enemies.length,ENDLESS_BASE_CAP-ENDLESS_ELITE_RESERVE,'Common enemies leave eight reserve slots');
 for(let i=0;i<100;i++){update(.016);render()}
 assert.ok(enemies.length<=ENDLESS_BASE_CAP);assert.ok(Number.isFinite(player.hp));
`);
console.log('Pass: dense Endless combat remains bounded and renderer stable.');

// NEW: Kill-based elites and 1000-kill triple encounter, independent of Classic mode.
t.run(`start('endless');walls=[];invalidateNavigation();player.invuln=999;player.droneCount=0;
 spawnTimer=999;endlessHordeClock=999;endlessSupplyClock=999;enemies=[];
 kills=64;spawnEnemy('drone',200,0);killed(enemies.at(-1));
 assert.equal(endlessMilestoneQueue.length,1);assert.equal(endlessMilestoneQueue[0].tier,'mini');
 enemies=[];update(.016);assert.equal(endlessMilestoneQueue.length,0);
 assert.equal(enemies.filter(e=>e.boss&&e.mini).length,1,'65th elimination summons a mini-boss');
 const miniKind=enemies.find(e=>e.boss&&e.mini).kind;
 update(.016);assert.equal(enemies.filter(e=>e.boss&&e.mini).length,1,'No repeat summon at same kill count');
 enemies=[];kills=114;spawnEnemy('drone',200,0);killed(enemies.at(-1));enemies=[];
 update(.016);assert.equal(enemies.filter(e=>e.boss&&!e.mini).length,1,'115th elimination summons a major boss');
 assert.ok(miniKind&&enemies[0].kind);
`);
console.log('Pass: exactly one mini-boss every 65 kills and a major boss every 115 kills.');

t.run(`start('endless');walls=[];invalidateNavigation();player.invuln=999;player.droneCount=0;
 spawnTimer=999;endlessHordeClock=999;endlessSupplyClock=999;enemies=[];
 kills=999;spawnEnemy('drone',220,0);killed(enemies.at(-1));enemies=[];
 assert.equal(endlessMilestoneQueue.length,1);assert.equal(endlessMilestoneQueue[0].tier,'raid');
 update(.016);assert.equal(endlessMilestoneQueue.length,0);
 assert.equal(enemies.filter(e=>e.boss&&!e.mini).length,1,'1,000 kills summons one main boss');
 assert.equal(enemies.filter(e=>e.boss&&e.mini).length,2,'1,000 kills summons two mini-bosses');
 assert.ok(enemies.every(e=>Math.abs(e.x)<=ENDLESS_HALF_SIZE&&Math.abs(e.y)<=ENDLESS_HALF_SIZE));
 assert.equal(wave,1);assert.equal(voidActive,false);
`);
console.log('Pass: 1000-kill raid contains exactly one boss and two mini-bosses.');

t.run(`start('endless');walls=[];invalidateNavigation();player.invuln=999;player.droneCount=0;
 spawnTimer=999;endlessHordeClock=999;endlessSupplyClock=999;enemies=[];
 // Fill all elite slots with bosses, then verify new milestones remain queued.
 const cap=endlessEnemyCap(),normalCap=cap-ENDLESS_ELITE_RESERVE;
 for(let i=0;i<normalCap;i++)spawnEnemy('drone',i%15*22,50+Math.floor(i/15)*25);
 assert.equal(enemies.length,normalCap);
 for(let i=0;i<ENDLESS_ELITE_RESERVE;i++)spawnEnemy('hunter',180+i*12,140);
 assert.equal(enemies.length,cap);
 kills=64;const target=enemies.find(e=>!e.boss);killed(target);
 assert.equal(endlessMilestoneQueue.length,1);
 update(.016);assert.equal(endlessMilestoneQueue.length,1,'Elites remain queued until room opens');
 const residentBoss=enemies.find(e=>e.boss);residentBoss.dead=true;enemies=enemies.filter(e=>!e.dead);
 update(.016);assert.equal(endlessMilestoneQueue.length,0,'Queued boss summons when room becomes available');
 assert.ok(enemies.length<=endlessEnemyCap(),'Population cap is never exceeded');
 start('normal');assert.equal(endlessMilestoneQueue.length,0,'Kill milestone queue resets in Classic');
`);
console.log('Pass: population-capped boss queue and clean mode restart.');

// Coin Rain 2.5×: halves carry between drops, including boss rewards.
t.run(`start('normal');player.coinRain=1;gems=[];enemies=[];
 assert.equal(coinRainDropCount(3),7);assert.equal(player.coinRainRemainder,.5);
 assert.equal(coinRainDropCount(3),8);assert.equal(player.coinRainRemainder,0);
 assert.equal(coinRainDropCount(2),5);
 player.coinRainRemainder=0;
 spawnEnemy('hunter',120,0);killed(enemies.at(-1));
 assert.equal(gems.filter(g=>g.val===50).length,2,'First mini-boss drops two 50 XP coins');
 spawnEnemy('hunter',130,0);killed(enemies.at(-1));
 assert.equal(gems.filter(g=>g.val===50).length,5,'Two mini-bosses give 2+3 coins');
 assert.equal(player.coinRainRemainder,0);
 assert.equal(ENDLESS_SPAWN_MULTIPLIER,5);
 assert.equal(ENDLESS_XP_MULTIPLIER,2.5);
 start('normal');assert.equal(player.coinRainRemainder,0);assert.equal(coinRainDropCount(3),3);
 const rain=upgradeData.find(u=>u.id==='coinRain');
 assert.equal(rain.name,'COIN RAIN · 2.5× LOOT');
`);
console.log('Pass: Coin Rain physical coin drops average 2.5× and preserve Endless settings.');

// Phase 1 visual-style settings: preference-only, independently saved and safe for old profiles.
const styles=makeEnv();
styles.run(`
 assert.equal(gameSettings.visualStyle,'normal');
 assert.equal(gameSettings.styleEnemies,true);
 assert.equal(gameSettings.styleArmor,true);
 assert.equal(gameSettings.styleEffects,true);
 assert.equal(Object.keys(VISUAL_STYLES).length,5);
 assert.equal(VISUAL_STYLES.hybrid.name,'Hybrid');
 openSettings();assert.equal(mode,'settings');assert.equal(settingsReturnMode,'menu');
 $('styleOption-cosmic').events.click();assert.equal(gameSettings.visualStyle,'cosmic');
 $('styleOption-hybrid').events.click();assert.equal(gameSettings.visualStyle,'hybrid');
 $('styleEnemiesBtn').events.click();assert.equal(gameSettings.styleEnemies,false);
 $('styleArmorBtn').events.click();assert.equal(gameSettings.styleArmor,false);
 $('styleEffectsBtn').events.click();assert.equal(gameSettings.styleEffects,false);
 assert.equal(gameSettings.fx,'balanced');
 assert.equal(JSON.parse(localStorage.getItem('riftrunner_options_v1')).visualStyle,'hybrid');
 const before=localStorage.getItem('riftrunner_evolution_v1');
 $('styleOption-neon').events.click();assert.equal(gameSettings.visualStyle,'neon');
 assert.equal(before,localStorage.getItem('riftrunner_evolution_v1')); 
 $('settingsBackBtn').events.click();assert.equal(mode,'menu');
 start('normal');assert.equal(mode,'play');
 setMode('pause');openSettings();assert.equal(settingsReturnMode,'pause');
 $('styleOption-normal').events.click();assert.equal(gameSettings.visualStyle,'normal');
 $('settingsBackBtn').events.click();assert.equal(mode,'pause');
 start('endless');assert.equal(runMode,'endless');
 render();
`);
const persisted=JSON.parse(styles.storage.get('riftrunner_options_v1'));
assert.equal(persisted.visualStyle,'normal');assert.equal(persisted.styleEnemies,false);
const reload=makeEnv({riftrunner_options_v1:JSON.stringify({...persisted,visualStyle:'military',fx:'low',zoom:'far',sound:false})});
reload.run(`
 assert.equal(gameSettings.visualStyle,'military');
 assert.equal(gameSettings.styleEnemies,false);
 assert.equal(gameSettings.styleArmor,false);
 assert.equal(gameSettings.styleEffects,false);
 assert.equal(gameSettings.fx,'low');assert.equal(gameSettings.zoom,'far');assert.equal(soundOn,false);
 openSettings();assert.ok($('visualPreviewName').textContent.includes('MILITARY'));
 assert.equal(cameraScale(),.73);start('normal');render();
`);
const oldPrefs=makeEnv({riftrunner_options_v1:JSON.stringify({fx:'low',zoom:'near',damageNumbers:false,screenShake:false,sound:false})});
oldPrefs.run(`assert.equal(gameSettings.visualStyle,'normal');assert.equal(gameSettings.styleEnemies,true);
 assert.equal(gameSettings.styleArmor,true);assert.equal(gameSettings.styleEffects,true);
 assert.equal(gameSettings.fx,'low');assert.equal(gameSettings.zoom,'near');
 assert.equal(gameSettings.damageNumbers,false);assert.equal(gameSettings.screenShake,false);
 assert.equal(soundOn,false);`);
const invalidPrefs=makeEnv({riftrunner_options_v1:JSON.stringify({visualStyle:'invalid',styleEnemies:'false',styleArmor:0,styleEffects:null})});
invalidPrefs.run(`assert.equal(gameSettings.visualStyle,'normal');assert.equal(gameSettings.styleEnemies,true);
 assert.equal(gameSettings.styleArmor,true);assert.equal(gameSettings.styleEffects,true);
 chooseVisualStyle('__proto__');assert.equal(gameSettings.visualStyle,'normal');
 toggleStyleSetting('untrustedKey');assert.equal(gameSettings.styleEffects,true);`);
console.log('Pass: Phase 1 visual-style options, exclusive selection, toggles, persistence, legacy settings, input validation, both modes.');
