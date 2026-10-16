// Cidade demonstrativa gerada com os objetos e tools nativos de 3d.city.
import { writeFile } from 'node:fs/promises';
let lastSave;
globalThis.self = {postMessage(message) { if (message.tell === 'SAVEGAME') lastSave = message.gameData; }};
let seed = 32132;
Math.random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
const { CityGame, MainGame } = await import('../src/micro/CityGame.js');
const { Micro } = await import('../src/micro/Micro.js');
const { Tile } = await import('../src/micro/Tile.js');
const { Residential } = await import('../src/micro/zone/Residential.js');
const { Commercial } = await import('../src/micro/zone/Commercial.js');
const { Industrial } = await import('../src/micro/zone/Industrial.js');
const { Zone } = await import('../src/city3d/Base.js');
let game;
const originalNewMap = MainGame.prototype.newMap;
MainGame.prototype.newMap = function(size) { game = this; originalNewMap.call(this, size); };
MainGame.prototype.tick = function() {}; // Geração offline, sem loop assíncrono.
CityGame.message({data:{tell:'INIT', timestep:30}});
CityGame.message({data:{tell:'NEWMAP', mapSize:[64,64]}});
Micro.MAP_WIDTH = Micro.MAP_HEIGHT = 64;
for (let y=11;y<=54;y++) for (let x=11;x<=54;x++) game.map.setTile(x,y,Tile.DIRT,0);
// Bosques e rio lateral com os tiles nativos; não há geometria decorativa paralela.
for(let y=1;y<63;y++) for(let x=1;x<63;x++) {
  if ((x<12 || x>54 || y<11 || y>55) && Math.random()<0.64) game.map.setTile(x,y,Tile.WOODS,Tile.BLBNBIT);
  const bank=5+Math.round(Math.sin(y/9)*2);
  if(x>=bank && x<=bank+3) game.map.setTile(x,y,Tile.RIVER,0);
}
game.mapGen.smoothRiver();
game.mapGen.smoothTrees();
game.difficulty = 0;
game.playMap();
game.simulation.budget.setFunds(100000);
const place = (name,x,y) => { game.tool(name); game.mapClick(x,y,true); };
for (let v=16;v<=48;v+=4) for(let p=16;p<=48;p++) { place('road',p,v); place('road',v,p); }
const layers = Array.from({length:16},()=>[0,0,0]);
const add = (type,x,y,tile,size=3,geometry=0) => {
  const layer = Math.floor(x/16) + Math.floor(y/16)*4;
  const slot = type === 'town' ? 0 : 2;
  if (!layers[layer][slot]) layers[layer][slot] = [];
  layers[layer][slot].push(type==='town' ? [x,0,y,geometry,Zone(size,x,y)] : [x,0,y,tile,Zone(3,x,y),0]);
};
let index=0;
for(let y=18;y<=46;y+=4) for(let x=18;x<=46;x+=4) {
  index++;
  if ((x===30 && y===30) || (x===34 && y===30) || (x===30 && y===34) || (x===34 && y===34)) {
    for(let py=y-1;py<=y+1;py++) for(let px=x-1;px<=x+1;px++) place('park',px,py);
    continue;
  }
  const type = y>=42 && x>=34 ? 'industrial' : x>=30 && x<=38 ? 'commercial' : 'residential';
  place(type,x,y);
  if(type==='residential') Residential.placeResidential(game.map,x,y,index%4, index%3,true);
  if(type==='commercial') Commercial.placeCommercial(game.map,x,y,index%5,index%3,true);
  if(type==='industrial') Industrial.placeIndustrial(game.map,x,y,index%4,index%2,true);
  add('building',x,y,game.map.getTileValue(x,y));
}
for (const [name,x,y,geometry] of [['nuclear',51,27,9],['fire',22,51,7],['police',30,51,4],['school',38,51,14],['hospital',46,51,13]]) {
  place(name,x,y);
  add('town',x,y,0,name==='nuclear'?4:3,geometry);
}
for(let x=16;x<=51;x++) place('wire',x,28);
game.simulation.budget.setFunds(35000);
game.simulation.budget.autoBudget = true;
game.simulation.disasterManager.disastersEnabled = false;
game.speed = 2;
game.saveGame(JSON.stringify(layers),true);
const save = JSON.parse(lastSave);
save.name = 'Nova Aurora';
save.demo = {seed:32132, origin:'lo-th/3d.city native map, tools and zone placement'};
await writeFile(new URL('../assets/demo-city.json',import.meta.url),JSON.stringify(save));
console.log(JSON.stringify({width:save.width,height:save.height,buildings:layers.reduce((n,l)=>n+(l[0]?.length||0)+(l[2]?.length||0),0),bytes:JSON.stringify(save).length}));
