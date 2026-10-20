// Run from the repository root: node tests/seasonal.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const {seasonForDate, seasonalPun} = require('../js/countdown.js');
const boundaries = [[new Date(2026,8,30,23,59,59),''],[new Date(2026,9,1),'halloween'],
  [new Date(2026,9,31,23,59,59),'halloween'],[new Date(2026,10,1),'fall'],
  [new Date(2026,10,26,23,59,59),'fall'],[new Date(2026,10,27),''],[new Date(2027,9,20),'']];
for (const [date, expected] of boundaries) assert.equal(seasonForDate(date), expected);
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
  vm.runInContext(fs.readFileSync('js/doctor-bunny.js','utf8').replace('button.id =', 'globalThis.testButton = button; button.id ='),scope);
  assert(classes.has('halloween'));
  const seen=new Set();
  for(let i=0;i<8;i++){scope.testButton.events.click();seen.add(scope.testButton.dataset.activity);assert.equal(timers.size,1);}
  for(const action of ['catchLeaf','scarfCoffee','gatherLeaves','pumpkin'])assert(seen.has(action));
  date=new Date(2026,10,1);ticks[0]();assert(classes.has('fall'));assert(!classes.has('halloween'));
  scope.testButton.events.click();assert(!/fang|boo/.test(get('bunny-message').textContent));
  date=new Date(2026,10,27);ticks[0]();assert(!classes.has('fall'));assert.equal(root.dataset.season,'');
  assert.equal(get('seasonal-note').hidden,true);
  scope.testButton.events.click();assert(!['catchLeaf','scarfCoffee','gatherLeaves','pumpkin'].includes(scope.testButton.dataset.activity));
  date=new Date(2027,6,1);ticks[0]();assert(get('countdown').hidden);assert(!get('celebration').hidden);
  if(reduced)assert.equal(frames,0);
}
for(const path of ['index.html','css/styles.css','js/countdown.js','js/doctor-bunny.js'])assert(!/\p{Extended_Pictographic}/u.test(fs.readFileSync(path,'utf8')));
console.log('Season transitions, pun rotation, four seasonal activities, taps, timer cleanup, completion, reduced motion, finite drawing coordinates, and emoji checks passed.');
