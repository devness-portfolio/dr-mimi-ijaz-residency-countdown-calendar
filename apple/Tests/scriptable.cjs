const vm = require('node:vm');
const fs = require('node:fs');
const assert = require('node:assert/strict');
// Run from the repository root: node apple/Tests/scriptable.cjs
const code = fs.readFileSync(process.cwd()+'/apple/Scriptable/Residency Countdown.js','utf8');
class Size { constructor(width,height) { Object.assign(this,{width,height}); } }
class Point { constructor(x,y) { Object.assign(this,{x,y}); } }
class Rect { constructor(x,y,width,height) { Object.assign(this,{x,y,width,height}); } }
class Color { constructor(hex) { assert.match(hex,/^[a-f\d]{3}([a-f\d]{3})?$/i); } }
class Font { constructor(name,size) {} static mediumRoundedSystemFont() {} static regularMonospacedSystemFont() {} }
class Path { addRoundedRect() {} move() {} addLine() {} addCurve() {} addQuadCurve() {} addEllipse() {} closeSubpath() {} }
class DrawContext { setFillColor() {} addPath() {} fillPath() {} setStrokeColor() {} setLineWidth() {} strokePath() {} getImage() { assert.ok(this.size); return {}; } }
async function run(family, date, inApp) {
 const texts=[], timers=[], images=[];
 let widget, completed=false, opened=[];
 class Node {
  addStack() { return new Node(); }
  addSpacer() {} layoutVertically() {} centerAlignContent() {} setPadding() {}
  addText(value) { texts.push(value); return {centerAlignText(){}}; }
  addImage(value) { assert.ok(value); const image={applyFittingContentMode(){},centerAlignImage(){}}; images.push(image); return image; }
  addDate(date) { const timer={date,applyTimerStyle(){this.native=true}}; timers.push(timer); return timer; }
 }
 const RealDate=Date;
 class MockDate extends RealDate { constructor(...a) { super(...(a.length?a:[date])); } }
 const scope={Date:MockDate, config:{widgetFamily:family,runsInApp:inApp},Safari:{async openInApp(url,full){opened.push({url,full})}}, Color, Font, Size, Point, Rect, Path, DrawContext, LinearGradient:class {}, ListWidget:Node, Script:{setWidget(w){widget=w},complete(){completed=true}}};
 await vm.runInNewContext('(async()=>{'+code+'})()',scope);
 assert.equal(opened.length,inApp?1:0);if(inApp){assert.equal(opened[0].url,widget.url);assert.equal(opened[0].full,true);}
 assert.ok(widget); assert.ok(completed);
 assert.ok(widget.url.startsWith('https://devness-portfolio.github.io/'));
 const end=new Date(2027,6,1);
 if(new Date(date)>=end) {
  assert.ok(texts.includes('YOU DID IT!'));
  assert.ok(texts.includes('Congratulations Meri Jaan!!'));
  assert.equal(timers.length,0);
  assert.equal(widget.refreshAfterDate,undefined);
  if(family!=='small') assert.ok(texts.includes('فَإِنَّ مَعَ الْعُسْرِ يُسْرًا'));
 } else {
  assert.equal(timers.length,1); assert.equal(+timers[0].date,+end); assert.ok(timers[0].native);
  assert.ok(+widget.refreshAfterDate>+new Date(date)); assert.ok(+widget.refreshAfterDate<=+end);
  assert.ok(+widget.refreshAfterDate <= (Math.floor(+new Date(date) / 1800000) + 1) * 1800000);
  assert.ok(texts.includes('days left'));
  if(family==='large'||family==='extraLarge'||family===undefined) {
   for(const unit of ['Months','Weeks','Days','Hours','Minutes','Seconds']) assert.ok(texts.includes(unit));
   assert.ok(+widget.refreshAfterDate-+new Date(date)<=900000);
  }
 }
 assert.ok(images.length > 0);
}
(async()=>{
for(const inApp of [false,true]) for(const family of ['small','medium','large','extraLarge',undefined]) {
 for(const date of [new Date(2022,6,1),new Date(2026,9,7),new Date(2026,9,31,23,59,59),new Date(2026,10,1),new Date(2026,10,26,23,59,59),new Date(2026,10,27),new Date(2027,5,30,23,59,59),new Date(2027,6,1),new Date(2028,0,1)]) await run(family,date,inApp);
}
assert.ok(!/\p{Extended_Pictographic}/u.test(code));
console.log('90 widget/in-app family/date scenarios passed: launch routing, countdown, celebration, native timers, refresh boundaries, artwork execution, and no emoji.');

})().catch(e=>{console.error(e);process.exit(1)});

// Exercise pose drawings and deterministic scheduling independently of widget layout.
{
const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const code=fs.readFileSync('apple/Scriptable/Residency Countdown.js','utf8').split('const now = new Date();')[0];
class Point {constructor(x,y){this.x=x;this.y=y}} class Rect {constructor(x,y,width,height){Object.assign(this,{x,y,width,height})}} class Size{constructor(width,height){Object.assign(this,{width,height})}} class Color{constructor(hex){this.hex=hex}}
class Path{constructor(){this.commands=[]} move(p){this.commands.push(['M',p.x,p.y])} addLine(p){this.commands.push(['L',p.x,p.y])} addCurve(p,a,b){this.commands.push(['C',a.x,a.y,b.x,b.y,p.x,p.y])} addQuadCurve(p,a){this.commands.push(['Q',a.x,a.y,p.x,p.y])} addEllipse(r){this.commands.push(['E',r.x,r.y,r.width,r.height])} closeSubpath(){this.commands.push(['Z'])}}
class DrawContext{constructor(){this.parts=[]} setFillColor(c){this.fill=c.hex} setStrokeColor(c){this.stroke=c.hex} setLineWidth(w){this.width=w} addPath(p){this.path=p} fillPath(){this.parts.push({commands:this.path.commands,fill:this.fill})} strokePath(){this.parts.push({commands:this.path.commands,stroke:this.stroke,width:this.width})} getImage(){return this.parts}}
const scope={Point,Rect,Size,Color,Path,DrawContext};vm.createContext(scope);vm.runInContext(code,scope);
const actions=['rest','jump','wave','heartbeat','notes','read','eat','tea','stretch','nap','celebrate']; const drawings=new Set();
for(const a of actions){const result=vm.runInContext(`doctorBunny('${a}')`,scope);drawings.add(JSON.stringify(result));for(const part of result)for(const c of part.commands)for(const n of c.slice(1))assert(Number.isFinite(n));}
assert.equal(drawings.size,11);
const seasonalDrawings=new Set();
for(const season of ['halloween','fall']) for(const action of ['catchLeaf','scarfCoffee','gatherLeaves','pumpkin']) {
 const result=vm.runInContext(`doctorBunny('${action}',${season==='halloween'},${season==='fall'})`,scope);
 seasonalDrawings.add(JSON.stringify(result));
 for(const part of result)for(const c of part.commands)for(const n of c.slice(1))assert(Number.isFinite(n));
}
assert.equal(seasonalDrawings.size,8);
for(const [date,expected] of [[new Date(2026,9,31),'halloween'],[new Date(2026,10,1),'fall'],[new Date(2026,10,26,23,59,59),'fall'],[new Date(2026,10,27),'']]) {
 scope.date=date; assert.equal(vm.runInContext('seasonForDate(date)',scope),expected);
}
const web=require('../../js/countdown.js');
for(let day=1;day<=30;day++)for(const month of [9,10,11]) {
 scope.date=new Date(2026,month,day);
 assert.equal(vm.runInContext('seasonForDate(date)',scope),web.seasonForDate(scope.date));
}
console.log('Eight seasonal widget drawings and web/Scriptable date parity passed.');

for(let slot=0;slot<40;slot++) {scope.date=new Date(slot*1800000);assert.equal(vm.runInContext('activityForDate(date,false)',scope),slot%2===0?'rest':actions[1+Math.floor(slot/2)%10]);assert.equal(vm.runInContext('activityForDate(date,true)',scope),'celebrate');}
for(const date of [new Date(2020,0,1),new Date(2022,6,1),new Date(2027,6,1),new Date(2028,0,1)]){scope.date=date;const s=vm.runInContext('calculateCountdown(date)',scope);assert(s.progress>=0&&s.progress<=100);for(const k of ['months','weeks','days','hours','minutes','seconds','totalDays'])assert(s[k]>=0);}

console.log("11 distinct drawings and 40 pose slots passed.");
}
