// Run the actual game closure in isolated storage. The drawing double validates
// numeric coordinates and transform-stack balance, not pixels or browser FPS.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
const noop=()=>{};
let depth=0;
const gradient={addColorStop:noop};
const brush=new Proxy({save:()=>depth++,restore:()=>assert.ok(depth-->0),createLinearGradient:()=>gradient,createRadialGradient:()=>gradient},{get:(o,k)=>o[k]??((...args)=>args.forEach(n=>{if(typeof n==='number')assert.ok(Number.isFinite(n),String(k))}))});
class Element{
 style={};children=[];events={};classList={toggle:noop,add:noop,remove:noop};
 setAttribute(){}
 querySelector(){return this}
 remove(){}
 append(...els){this.children.push(...els)}
 set textContent(t){this.label=t;this.children=[]}
 get textContent(){return this.label}
 addEventListener(k,f){this.events[k]=f}
 click(){this.events.click?.()}
 getContext(){return brush}
 getBoundingClientRect(){return {left:0,top:0,width:300,height:240}}
 setPointerCapture(){}
}
const nodes=new Map();
const node=id=>{if(!nodes.has(id))nodes.set(id,new Element());return nodes.get(id)};
const data=new Map();
const env={navigator:{},console,assert,performance,Image:class {},innerWidth:844,innerHeight:390,devicePixelRatio:2,
 document:{getElementById:node,createElement:()=>new Element(),addEventListener:noop},requestAnimationFrame:noop,
 localStorage:{getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)},addEventListener:noop};
env.window=env;
function run(test){vm.runInNewContext(source.replace(/\}\)\(\);\s*$/,'\n'+test+'\n})();'),env);assert.equal(depth,0)}
run(`start();keyboard.add('ArrowRight');update(.03);assert.ok(player.x>0);render();togglePause();assert.equal(mode,'pause');`);
console.log('Movement, projection and frame smoke test passed.');
run(`start();for(const kind of Object.keys(types)){spawnEnemy(kind,60,40);paintEnemy(enemies.at(-1))}paintPilot();render();`);
console.log('All unit and boss silhouettes rendered.');
run(`start();for(mapIndex=0;mapIndex<themes.length;mapIndex++){makeWorld();assert.ok(walls.length>0);for(const w of walls)paintCover(w);render()}`);
console.log('All eight environments, materials and cover passed.');
run(`start();walls=[];for(const id of Object.keys(weaponTypes)){
 enemies=[];bullets=[];beams=[];spawnEnemy('tank',70,0);spawnEnemy('tank',120,10);
 player.weapon=id;fire();assert.equal(player.targetId,enemies[0].id);
 if(id==='tesla')assert.equal(beams.length,2);else assert.ok(bullets.some(b=>b.weapon===id));
 render()
}voidBlast(62,5,10);render();player.nova=100;nova();assert.equal(player.nova,0);
 shield();assert.ok(player.shield>0);gravity();assert.ok(wells.length);dash();assert.ok(player.dashing>0);`);
console.log('Six weapons, targeting, chain lightning, void impact and four abilities passed.');
for(const generation of [3,4]){
 const profile={cores:850,upgrades:{armor:3,attack:2}};
 if(generation===4){profile.achievements={first:true};profile.stats={totalKills:61,bestWave:4}}
 data.set('riftrunner_evolution_v1',JSON.stringify(profile));data.set('riftrunner_best','71');
 run(`assert.equal(meta.cores,850);assert.equal(gameBest,71);assert.equal(meta.upgrades.armor,3);
 assert.equal(!!meta.achievements.first,${generation===4});assert.equal(meta.stats.bestWave,${generation===4?4:1});
 const old=validateBackup({game:BACKUP_GAME,formatVersion:1,progress:{...${JSON.stringify(profile)},best:71}});
 assert.equal(old.cores,850);assert.equal(old.upgrades.attack,2);assert.equal(old.best,71);
 showHangar();const firstRow=$('shopItems').children.find(n=>n.className==='shopItem');
 firstRow.children[1].click();assert.ok(meta.cores<850);assert.equal(Object.values(meta.upgrades).reduce((a,b)=>a+b),6);
 start();gainXp(player.need);assert.equal(mode,'upgrades');$('upgradeList').children[0].click();assert.equal(mode,'play');
 end();assert.equal(mode,'over');`);
}
run(`start();for(let i=0;i<8;i++){timer=(4+i*4)*24-.01;update(.025);assert.equal(mapIndex,(i+1)%8)}
 spawnEnemy('abyss',100,100);const boss=enemies.at(-1);boss.hp=boss.maxHp*.2;update(.03);assert.ok(boss.bossPhase>=2);
 walls=[];enemies=[];for(let i=0;i<130;i++)spawnEnemy('drone',160+i%12*12,Math.floor(i/12)*15);
 for(let i=0;i<30;i++){update(.016);render()}assert.ok(Number.isFinite(player.hp));`);
console.log('3.0/4.0 fixtures, purchases, level choice, results, biome rotation, boss phases and dense simulation passed.');
run(`start();walls=[];player.need=999;for(const n of [1,3,5,10,50]){dropCoin(0,0,n);Object.assign(gems.at(-1),{x:0,y:0,vx:0,vy:0})}
 update(.016);assert.equal(player.xp,69);assert.equal(gems.length,0);
 spawnEnemy('abyss',120,10);const sovereign=enemies.at(-1);
 for(const [fraction,phase] of [[.98,1],[.50,2],[.15,3]]){sovereign.hp=sovereign.maxHp*fraction;update(.016);assert.equal(sovereign.bossPhase,phase);castSkill(sovereign);render()}
 hitEnemy(sovereign,sovereign.maxHp*3,'#fff');assert.ok(sovereign.dead);
`);
console.log('Five XP currencies, Abyss phase attacks and boss defeat passed.');
