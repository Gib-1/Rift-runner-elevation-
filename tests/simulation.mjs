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
 start();assert.equal(player.maxHp,120);assert.equal(player.damage,25);assert.equal(player.droneCount,1);assert.equal(EVO42_FEATURES.length,35);assert.equal(cameraScale(),.86);
 assert.equal(Object.keys(weaponTypes).length,7);assert.equal(shopData.length,26);assert.equal(upgradeData.length,62);
 assert.equal(themes.length,8);assert.equal(coinTiers[150].r,19);
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
t.run(`start();walls=[];enemies=[];spawnTimer=999;shotTimer=999;assert.equal(upgradeData.length,62);
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
  if(idx===1)assert.ok(gems.some(g=>g.val===10));
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