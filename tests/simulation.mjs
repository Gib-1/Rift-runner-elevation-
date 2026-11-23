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
 start();assert.equal(player.maxHp,120);assert.equal(player.damage,25);assert.equal(CAMERA_ZOOM,.86);
 assert.equal(Object.keys(weaponTypes).length,6);assert.equal(shopData.length,26);assert.equal(upgradeData.length,49);
 assert.equal(themes.length,8);assert.equal(coinTiers[150].r,19);
 keyboard.add('ArrowRight');update(.03);assert.ok(player.x>0);render();togglePause();assert.equal(mode,'pause');
`);
console.log('Pass: camera, movement, HUD renderer, six weapons, upgrades and eight biomes.');

t.run(`start();walls=[];enemies=[];
 for(const id of Object.keys(weaponTypes)){
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

t.run(`start();walls=[{x:-35,y:-110,w:70,h:220,breakable:false}];invalidateNavigation();
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
console.log('All Evolution 4.0 simulation checks passed.');