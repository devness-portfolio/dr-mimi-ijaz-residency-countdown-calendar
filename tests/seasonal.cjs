// Run from the repository root: node tests/seasonal.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const {seasonForDate, seasonalPun, NEW_YEAR_SCENES, MARDI_SCENES, RAMADAN_SCENES, calculateCountdown, RESIDENCY_START, RESIDENCY_END} = require('../js/countdown.js');
const boundaries = [[new Date(2026,8,30,23,59,59),''],[new Date(2026,9,1),'halloween'],
  [new Date(2026,9,31,23,59,59),'halloween'],[new Date(2026,10,1),'fall'],
  [new Date(2026,10,26,23,59,59),'fall'],[new Date(2026,10,27),''],[new Date(2027,9,20),''],
  [new Date(2026,11,24,23,59,59),''],[new Date(2026,11,25),'nye'],
  [new Date(2026,11,31,23,59,59),'nye'],[new Date(2027,0,1),'newyear'],
  [new Date(2027,0,1,23,59,59),'newyear'],[new Date(2027,0,2),''],
  [new Date(2027,0,5,23,59,59),''],[new Date(2027,0,6),'mardi'],
  [new Date(2027,1,7,23,59,59),'mardi'],[new Date(2027,1,8),'ramadan'],[new Date(2027,1,10),'ramadan'],[new Date(2027,2,8,23,59,59),'ramadan'],[new Date(2027,2,9),''],[new Date(2028,0,6),'']];
for (const [date, expected] of boundaries) assert.equal(seasonForDate(date), expected);
assert.equal(NEW_YEAR_SCENES.length,3);
assert.equal(new Set(NEW_YEAR_SCENES.map(scene=>scene.affirmation)).size,3);
assert.equal(new Set(NEW_YEAR_SCENES.map(scene=>scene.pun)).size,3);
for(const key of ['activity','pun','affirmation'])assert.equal(new Set(MARDI_SCENES.map(scene=>scene[key])).size,3);
assert.equal(new Set(Array.from({length:9},(_,i)=>seasonalPun('mardi',i))).size,3);
assert.equal(calculateCountdown(new Date(2027,0,1,12)).totalDays,181);
assert.equal(calculateCountdown(RESIDENCY_START).progress,0);
assert.equal(calculateCountdown(RESIDENCY_END).progress,100);
const target=new Date(2026,11,31,23,59,59);
assert.equal(calculateCountdown(new Date(+target-1000),RESIDENCY_START,target).seconds,1);
assert(calculateCountdown(target,RESIDENCY_START,target).complete);
assert(calculateCountdown(new Date(+target+1000),RESIDENCY_START,target).complete);
const fallPuns = new Set(Array.from({length:14},(_,i)=>seasonalPun('fall',i)));
assert.equal(fallPuns.size,5);assert(![...fallPuns].some(p=>/fang|boo/.test(p)));
assert(new Set(Array.from({length:14},(_,i)=>seasonalPun('halloween',i))).size === 7);

// Exercise the actual DOM updater and companion, including tap/drawing and rollover.
for (const reduced of [false,true]) {
  let date = new Date(2026,9,20), frames = 0;
  const elements = new Map(), ticks = [], timers = new Map();let nextTimer = 0;
  const classes = new Set();
  const ctx = new Proxy({}, {get(target,key){return target[key] || ((...args)=>{
    for(const n of args) if(typeof n==='number') assert(Number.isFinite(n),`${key}: invalid drawing coordinate`);
  });}, set(target,key,value){target[key]=value;return true;}});
  class Element {
    constructor(){this.hidden=false;this.dataset={};this.style={};this.textContent='';this.events={};}
    setAttribute(){} append(){} prepend(){} after(){} remove(){} replaceChildren(){}
    addEventListener(name,fn){this.events[name]=fn;} getContext(){return ctx;}
    querySelector(){return new Element();}
  }
  const get = id => {if(!elements.has(id))elements.set(id,new Element());return elements.get(id);};
  get('celebration').hidden = true;
  const root = new Element();root.classList={toggle(name,on){on?classes.add(name):classes.delete(name);},contains(name){return classes.has(name);}};
  const document = {documentElement:root,head:new Element(),hidden:false,
    getElementById(id){return id==='doctor-bunny'?undefined:get(id);},
    querySelector(selector){return get(selector);},createElement(){return new Element();},addEventListener(){}};
  const motion = {matches:reduced,addEventListener(){}};
  class MockDate extends Date {constructor(...args){super(...(args.length?args:[date]));}}
  const scope={document,Date:MockDate,window:{matchMedia:()=>motion,addEventListener(){}},matchMedia:()=>motion,
    performance:{now:()=>0},Path2D:class{constructor(path){assert(!/NaN|undefined/.test(path));}},MutationObserver:class{observe(){}},
    setInterval(fn){ticks.push(fn);return ticks.length;},clearInterval(){},
    setTimeout(fn){const id=++nextTimer;timers.set(id,fn);return id;},clearTimeout(id){timers.delete(id);},
    requestAnimationFrame(){frames++;return frames;},cancelAnimationFrame(){}};
  vm.createContext(scope);vm.runInContext(fs.readFileSync('js/countdown.js','utf8'),scope);
  vm.runInContext(fs.readFileSync('js/doctor-bunny.js','utf8').replace('button.id =', 'globalThis.testButton = button; button.id =').replace("message.id =", "globalThis.testMessage = message; message.id ="),scope);
  assert(classes.has('halloween'));
  const seen=new Set();
  for(let i=0;i<8;i++){scope.testButton.events.click();seen.add(scope.testButton.dataset.activity);assert.equal(timers.size,1);}
  for(const action of ['catchLeaf','scarfCoffee','gatherLeaves','pumpkin'])assert(seen.has(action));
  date=new Date(2026,10,1);ticks[0]();assert(classes.has('fall'));assert(!classes.has('halloween'));
  scope.testButton.events.click();assert(!/fang|boo/.test(get('bunny-message').textContent));
  date=new Date(2026,10,27);ticks[0]();assert(!classes.has('fall'));assert.equal(root.dataset.season,'');
  assert.equal(get('seasonal-note').hidden,true);
  scope.testButton.events.click();assert(!['catchLeaf','scarfCoffee','gatherLeaves','pumpkin'].includes(scope.testButton.dataset.activity));
  for(const [nextDate,expected] of [[new Date(2026,11,25),'nye'],[new Date(2027,0,1),'newyear']]) {
    date=nextDate;ticks[0]();assert.equal(root.dataset.season,expected);assert(classes.has('new-year'));
    const scenes=new Set();
    for(let i=0;i<3;i++) {
      scope.testButton.events.click();scenes.add(scope.testButton.dataset.activity);
      const scene=NEW_YEAR_SCENES.find(scene=>scene.activity===scope.testButton.dataset.activity);
      assert.equal(scope.testMessage.textContent,scene.pun+' '+scene.affirmation);
    }
    assert.equal(scenes.size,3);
    assert(!get('new-year-note').hidden);
  }
  date=new Date(2027,0,2);ticks[0]();assert.equal(root.dataset.season,'');assert(get('new-year-note').hidden);
  scope.testButton.events.click();assert(!NEW_YEAR_SCENES.some(scene=>scene.activity===scope.testButton.dataset.activity));
  for(const nextDate of [new Date(2027,0,6),new Date(2027,1,7,23,59,59)]) {
    date=nextDate;ticks[0]();assert.equal(root.dataset.season,'mardi');assert(classes.has('mardi'));assert(!classes.has('new-year'));
    const scenes=new Set();
    for(let i=0;i<3;i++) {
      scope.testButton.events.click();scenes.add(scope.testButton.dataset.activity);
      const scene=MARDI_SCENES.find(scene=>scene.activity===scope.testButton.dataset.activity);
      assert.equal(scope.testMessage.textContent,scene.pun+' '+scene.affirmation);
    }
    assert.equal(scenes.size,3);
  }
  date=new Date(2027,2,9);ticks[0]();assert.equal(root.dataset.season,'');assert(!classes.has('mardi'));
  scope.testButton.events.click();assert(!MARDI_SCENES.some(scene=>scene.activity===scope.testButton.dataset.activity));
  date=new Date(2027,1,8);ticks[0]();assert.equal(root.dataset.season,'ramadan');assert(classes.has('ramadan'));assert(!classes.has('mardi'));
  const ramadanScenes=new Set();
  for(let i=0;i<3;i++) {
    scope.testButton.events.click();ramadanScenes.add(scope.testButton.dataset.activity);
    const scene=RAMADAN_SCENES.find(scene=>scene.activity===scope.testButton.dataset.activity);
    assert.equal(scope.testMessage.textContent,scene.pun+' '+scene.affirmation);
  }
  assert.equal(ramadanScenes.size,3);assert(!get('new-year-note').hidden);
  date=new Date(2027,2,9);ticks[0]();assert(!classes.has('ramadan'));assert(get('new-year-note').hidden);
  const {BEACH_SCENES}=require('../js/countdown.js');
  for(const [nextDate,expected] of [[new Date(2027,2,31,23,59,59),''],[new Date(2027,3,1),'beach'],[new Date(2027,3,30,23,59,59),'beach'],[new Date(2027,4,1),'dmv']])assert.equal(seasonForDate(nextDate),expected);
  date=new Date(2027,3,15);ticks[0]();assert(classes.has('beach'));assert(!get('new-year-note').hidden);
  const beachActions=new Set();
  for(let i=0;i<3;i++) {
    scope.testButton.events.click();beachActions.add(scope.testButton.dataset.activity);
    const scene=BEACH_SCENES.find(scene=>scene.activity===scope.testButton.dataset.activity);
    assert.equal(scope.testMessage.textContent,scene.pun+' '+scene.affirmation);
  }
  assert.equal(beachActions.size,3);
  const {DMV_SCENES}=require('../js/countdown.js');
  for(const [nextDate,expected] of [[new Date(2027,4,1),'dmv'],[new Date(2027,5,30,23,59,59),'dmv'],[new Date(2027,6,1),'']])assert.equal(seasonForDate(nextDate),expected);
  date=new Date(2027,4,15);ticks[0]();assert(classes.has('dmv'));assert(!get('new-year-note').hidden);
  const dmvActions=new Set();
  for(let i=0;i<3;i++) {
    scope.testButton.events.click();dmvActions.add(scope.testButton.dataset.activity);
    const scene=DMV_SCENES.find(scene=>scene.activity===scope.testButton.dataset.activity);
    assert.equal(scope.testMessage.textContent,scene.pun+' '+scene.affirmation);
  }
  assert.equal(dmvActions.size,3);
  date=new Date(2027,4,1);ticks[0]();assert(!classes.has('beach'));assert(classes.has('dmv'));assert(!get('new-year-note').hidden);
  date=new Date(2027,6,1);ticks[0]();assert(get('countdown').hidden);assert(!get('celebration').hidden);
  if(reduced)assert.equal(frames,0);
}
for(const path of ['index.html','css/styles.css','js/countdown.js','js/doctor-bunny.js','apple/Shared/CountdownCard.swift','apple/Shared/Residency.swift'])assert(!/\p{Extended_Pictographic}/u.test(fs.readFileSync(path,'utf8')));
console.log('Season transitions, pun rotation, four seasonal activities, taps, timer cleanup, completion, reduced motion, finite drawing coordinates, and emoji checks passed.');
