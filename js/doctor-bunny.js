/* Shared companion for the website and the offline native apps. */
(() => {
  'use strict';
  if (document.getElementById('doctor-bunny')) return;
  const hero = document.querySelector('#countdown .hero');
  if (!hero) return;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx || typeof Path2D === 'undefined' || !ctx.roundRect) return;
  const style = document.createElement('style');
  style.textContent = `
    #countdown .hero { gap: 12px; }
    #countdown .hero > .spark, #countdown .hero > .heart { display:none; }
    #doctor-bunny { width:clamp(100px,29vw,160px); flex:none; padding:0; border:0; background:transparent; border-radius:22px; color:#655063; cursor:pointer; touch-action:manipulation; }
    #doctor-bunny:focus-visible { outline:3px solid #bd678d; outline-offset:3px; }
    #doctor-bunny canvas { display:block; width:100%; height:auto; }
    #bunny-message { min-height:3em; max-width:360px; margin:8px auto 12px; padding:0 8px; font:italic 16px/1.5 Georgia,serif; color:#806070; text-align:center; }
    #countdown .encouragement img { display:none; }
    #countdown .encouragement { margin-bottom:22px; text-align:center; }
    #celebration .celebration-art { flex-wrap:wrap; }
    @media(max-width:360px) { #countdown .days strong {font-size:76px;letter-spacing:-4px;} #countdown .hero {gap:6px;} }
  `;
  document.head.append(style);
  const button = document.createElement('button');
  button.id = 'doctor-bunny'; button.type = 'button';
  button.setAttribute('aria-label', 'Doctor bunny. Tap for the next activity and encouragement.');
  canvas.width = 360; canvas.height = 440; canvas.setAttribute('aria-hidden', 'true');
  button.append(canvas); hero.prepend(button);
  const message = document.createElement('p'); message.id = 'bunny-message';
  // Automatic messages stay quiet for screen readers; tapped messages use a live region.
  const live = document.createElement('span'); live.setAttribute('role', 'status');
  live.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)';
  button.after(live); hero.after(message);
  const encouragements = ['One day at a time, meri jaan.', 'You make a difference, Dr. Mimi.',
    'Your kindness is part of the treatment.', 'So proud of you. Always.',
    'One day closer to your next chapter.', 'Mimi, you are somebody’s reason to feel hopeful.',
    'A little reminder: you are loved beyond measure.', 'You have a heart of gold and a very busy pager.',
    'Meri Jaan, your best is enough today.', 'Prognosis: a beautiful future ahead.'];
  const activityMessages = {
    jump: ['Little wins deserve a little happy hop.', 'Your next chapter is getting closer, Mimi!'],
    wave: ['Hello, my favorite doctor.', 'Sending you a little love between rounds.'],
    heartbeat: ['Your kindness is part of the treatment.', 'A heart of gold. No stethoscope needed to know.'],
    notes: ['Doctor’s note: you are doing beautifully.', 'Assessment: brilliant. Plan: keep believing in yourself.'],
    read: ['One page, one patient, one day at a time.', 'Studying hard, shining brighter.'],
    eat: ['Prescription: a snack and a little self-kindness.', 'Even the best doctors need a snack break.'],
    tea: ['Doctor’s orders: take a tiny tea break.', 'A warm cup of tea and a moment just for you, meri jaan.'],
    stretch: ['Unclench your shoulders, meri jaan.', 'A little stretch between big things.'],
    nap: ['You deserve some rest, meri jaan.', 'A little rest is part of the treatment.'],
    celebrate: ['So proud of you. Every little win counts.', 'Dr. Mimi, you give us so much to celebrate.'],
    coffee: ['Coffee break, Dr. Mimi. You’ve earned it.', 'A little coffee before the next chapter.'],
    hotDrink: ['Tiny sip. Big feelings. Let it cool, meri jaan.', 'Prescription: patience. That cup is still hot!']
  };
  // Keep the hot-cup story between unrelated actions so it reads as its own scene.
  const activities = ['jump','wave','heartbeat','notes','read','eat','tea','stretch','nap','coffee','celebrate','hotDrink'];
  const drinkActivities = ['tea','coffee','hotDrink','scarfCoffee'];
  const season = () => finished ? '' : document.documentElement.dataset.season || '';
  const messageTurns = {};
  const specificActivities = ['tea','coffee','hotDrink','nap','eat','stretch'];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let activity = 'rest', index = 0, messageIndex = 0, started = performance.now();
  let timer, frame, active = true, finished = false, milestone = null;
  message.textContent = season() ? seasonalPun(season(), 0) : encouragements[0];
  const ink = '#886a76', cream = '#fff9ee', pink = '#f3c0cf', lavender = '#e1dcec';
  function ellipse(x,y,rx,ry,fill,stroke=ink) {
    ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2.5;ctx.stroke();}
  }
  function line(points,color=ink,width=2.5) {
    ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));
    ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();
  }
  function box(x,y,w,h,color,r=5) {
    ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=color;ctx.fill();ctx.strokeStyle=ink;ctx.lineWidth=2;ctx.stroke();
  }
  function heart(x,y,size) {
    ctx.save();ctx.translate(x,y);ctx.scale(size,size);ctx.beginPath();ctx.moveTo(0,4);
    ctx.bezierCurveTo(-20,-8,-9,-20,0,-10);ctx.bezierCurveTo(9,-20,20,-8,0,4);
    ctx.fillStyle='#cf92aa';ctx.fill();ctx.restore();
  }
  // Original website SVG paths, separated so the bunny can act and emote.
  function shape(d, fill, stroke=ink, width=2.5) {
    const path=new Path2D(d);if(fill){ctx.fillStyle=fill;ctx.fill(path);}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke(path);}
  }
  function text(value,x,y,size=13) {ctx.fillStyle=ink;ctx.font=`${size}px Georgia`;ctx.fillText(value,x,y);}
  function leaf(x,y,angle=0) {
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);
    shape('M0 12Q-19 2-8-12L0-6 7-17Q20 1 0 12Z','#cf6b69');
    line([[0,16],[0,-6]],'#98576a',1.5);ctx.restore();
  }
  function draw(now=performance.now()) {
    frame = undefined;
    const t = motion.matches ? (activity==='hotDrink'?2.8:drinkActivities.includes(activity)?2:0) : (now-started)/1000;
    const drinking = drinkActivities.includes(activity);
    // One lift, sip, and lower within the existing 5.5-second activity window.
    const sip = drinking ? Math.max(0, Math.min(1, (t-.4)/1.1, (4.2-t)/1.1)) : 0;
    const burned = activity==='hotDrink' && t>=1.7 && t<3.7;
    const recovering = activity==='hotDrink' && t>=3.7 && t<4.6;
    const wiggle = Math.sin(t*5), slow = Math.sin(t*2);
    ctx.setTransform(2,0,0,2,0,0);ctx.clearRect(0,0,180,220);ctx.translate(0,14);
    ellipse(90,185,58,7,'#e8d9e7',null);
    ctx.save();
    if(activity==='jump'||activity==='celebrate') ctx.translate(0,-Math.abs(wiggle)*11);
    if(activity==='nap') {ctx.translate(4,3+slow);ctx.translate(90,110);ctx.rotate(-0.12);ctx.translate(-90,-110);}
    if(activity==='rest') ctx.translate(0,slow*.8);
    ctx.save();ctx.translate(90,65);ctx.rotate(motion.matches?0:slow*.018);ctx.translate(-90,-65);
    shape('M49 70C25 9 49-6 65 14L77 65M102 64L117 15C132-8 153 10 130 72',cream);
    shape('M53 53C41 19 50 12 57 24L67 56M113 55L124 24C132 10 141 20 128 57',null,'#efbfd0',9);
    ctx.restore();
    ellipse(66,174,18,10,cream);ellipse(115,174,18,10,cream);
    const raised = activity==='stretch'||activity==='celebrate';
    ellipse(43,raised?97+slow*5:136,12,22,cream);
    if(!drinking) ellipse(137,raised?95+slow*5:activity==='wave'?107+wiggle*7:136,12,22,cream);
    shape('M57 116Q40 132 46 178Q91 190 135 178Q139 136 123 115','#fff');
    ctx.beginPath();ctx.moveTo(71,113);ctx.lineTo(109,113);ctx.lineTo(90,143);ctx.closePath();ctx.fillStyle=lavender;ctx.fill();
    line([[67,119],[64,138],[77,144],[69,151],[84,170]],'#d8c9d4',2);
    line([[113,119],[116,138],[104,144],[112,151],[96,170]],'#d8c9d4',2);
    line([[90,145],[90,171]],'#d8c9d4',1.5);
    shape('M42 89C42 59 63 51 89 55C118 49 143 63 140 91C141 116 120 128 91 129C61 129 41 115 42 89Z',cream);
    ellipse(59,103,10,6,pink,null);ellipse(123,103,10,6,pink,null);
    shape('M128 67C113 57 127 49 132 57C140 49 150 61 128 67','#cf92aa',null);
    const closed=activity==='nap'||(activity==='rest'&&t%5>4.8);
    if(burned){line([[60,94],[65,88],[70,94]],ink,2);line([[110,94],[115,88],[120,94]],ink,2);line([[60,81],[70,84]],ink,2);line([[110,84],[120,81]],ink,2);}
    else if(closed){line([[61,88],[65,91],[69,88]],ink,2);line([[111,88],[115,91],[119,88]],ink,2);}
    else {line([[65,88],[65,93]],'#655460',4);line([[115,88],[115,93]],'#655460',4);}
    shape('M85 99Q90 104 95 99',null,ink,2);
    if(burned){
      ellipse(90,110,7,4,'#655460',null);
      shape('M86 110L86 117Q90 122 94 117L94 110','#ef9fae',ink,1.5);
      line([[90,113],[90,117]],'#cf8298',1);
      const tearY=99+Math.min(12,(t-1.7)*8);
      shape(`M119 ${tearY-5}Q111 ${tearY+5} 119 ${tearY+7}Q126 ${tearY+5} 119 ${tearY-5}`,'#b9dce7',null);
    } else if(recovering){line([[84,110],[96,110]],ink,2);}
    else if(drinking&&sip>.8){ellipse(90,110,4,3,ink,null);}
    else shape('M90 104V109M90 109Q85 113 81 108M90 109Q95 113 99 108',null,ink,2);
    // A stethoscope stays on the coat, with its chestpiece lifted for the exam.
    line([[70,118],[70,137],[75,144],[83,144],[88,137],[88,124]],'#87768d',3);
    line([[114,120],[114,activity==='heartbeat'?133:148]],'#87768d',3);
    ellipse(114,activity==='heartbeat'?135:153,6,6,'#dbc8e4');
    if(activity==='heartbeat'){ellipse(124,139,11,8,cream);heart(151,65,1+(wiggle*.12));line([[137,87],[143,87],[146,81],[150,94],[154,87],[163,87]],'#bd678d',1.5);}
    if(activity==='notes') {box(82,133,38,43,'#faf4e8');box(93,130,16,6,'#dbc8e4',2);for(let y=146;y<168;y+=7)line([[89,y],[110,y]],'#baa4b5',1);line([[119+wiggle*2,141],[105+wiggle*2,159]],'#bd678d',4);ellipse(126,143,9,7,cream);}
    if(activity==='read') {box(62,139,58,36,lavender);line([[91,140],[91,174]],ink,2);for(let y=148;y<168;y+=7){line([[68,y],[85,y]],'#b2a3c1',1);line([[98,y],[114,y]],'#b2a3c1',1);}text('+',102,153,15);line([[91,141],[91+Math.abs(slow)*17,144],[91+Math.abs(slow)*17,170],[91,174]],'#b2a3c1',1);ellipse(61,155,8,10,cream);ellipse(124,155,8,10,cream);}
    if(activity==='eat'){ellipse(90,110,3,1.5+Math.abs(wiggle)*2,ink,null);const y=116+slow*4;ellipse(110,y,15,14,'#dfba77');for(const [x,dy] of [[104,-4],[113,3],[108,8]])ellipse(x,y+dy,2,2,ink,null);ellipse(121,y+4,9,7,cream);ellipse(120,y-9,5,5,'#fff9ee',null);}
    if(drinking){
      // During the mishap the cup drops away while the free paw fans the tongue.
      const lift=activity==='hotDrink'&&t>=1.7 ? Math.max(0,1-(t-1.7)/.35) : sip;
      const x=76+(activity==='hotDrink'&&t>=1.7?22*(1-lift):0), y=138-29*lift;
      const coffee=activity==='coffee'||activity==='scarfCoffee';
      line([[52,139],[x-2,y+13]],ink,3);
      ellipse(x+38,y+11,8,8,'#fff',ink);
      box(x,y,32,24,coffee?'#dfc4a1':activity==='hotDrink'?'#e1dcec':'#efbfd0',6);
      ellipse(x+16,y+2,12,2,coffee?'#765541':'#b3bd8c',null);
      if(coffee){line([[x+10,y+11],[x+22,y+11]],'#fff9ee',2);}
      else if(activity==='tea'){line([[x+25,y+3],[x+26,y+13]],ink,1);box(x+23,y+13,6,7,'#fff9ee',1);}
      else {text('!',x+14,y+17,13);}
      ellipse(x-2,y+14,8,9,cream);
      if(burned){
        const fan=motion.matches?0:Math.sin(t*25);
        const pawX=110+fan*7, pawY=116+Math.abs(fan)*3;
        line([[136,138],[pawX,pawY]],ink,3);ellipse(pawX,pawY,9,7,cream);
        line([[pawX+12,pawY-5],[pawX+18,pawY-8]],'#baa4b5',1);
        line([[pawX+13,pawY+1],[pawX+20,pawY+1]],'#baa4b5',1);
      }else {line([[134,138],[x+32,y+14]],ink,3);ellipse(x+32,y+14,8,9,cream);}
      line([[x+12,y-5],[x+9+slow*2,y-11],[x+13,y-17]],'#baa4b5',1.5);
      if(coffee)line([[x+22,y-5],[x+25+slow*2,y-11],[x+22,y-17]],'#baa4b5',1.5);
    }
    if(activity==='stretch'){line([[27,84],[23,78]],'#cf92aa',2);line([[149,82],[155,75]],'#cf92aa',2);}
    if(activity==='nap'){text('Z',138,49+slow*2,17);text('z',151,35+slow*3,12);}
    if(activity==='celebrate'){heart(33,65,.7);heart(147,57,.8);for(let i=0;i<5;i++){ctx.fillStyle=i%2?pink:lavender;ctx.fillRect(20+i*34,22+(i%2)*9+slow*3,4,7);}}
    if(season()) {
      if(activity==='scarfCoffee' || season()==='fall') {
        box(65,122,52,10,'#c293b2',4);box(101,128,12,28,'#c293b2',3);
        line([[102,150],[111,150]],'#f8d9b4',3);
      }
      if(activity==='catchLeaf') {
        const fall=motion.matches?1:Math.min(1,t/2.5);
        const x=148+Math.sin(fall*Math.PI*2)*12, y=20+fall*99;
        line([[136,140],[148,128]],ink,3);ellipse(148,126,10,7,cream);
        leaf(x,y,motion.matches?.3:slow*.35);
      }
      if(activity==='gatherLeaves') {
        for(const [x,y,a] of [[55,176,-.6],[76,183,.6],[98,177,-.2],[126,181,.8]])leaf(x,y,a);
        line([[136,132],[118,160]],ink,3);ellipse(118,160,9,7,cream);
        leaf(108,155,slow*.12);
      }
      if(activity==='pumpkin') {
        ellipse(90,157,25,22,'#f3be97');ellipse(90,157,12,22,'#f3be97');
        line([[90,135],[94,129]],'#8c9c73',4);
        line([[83,153],[83,155]],ink,2);line([[97,153],[97,155]],ink,2);
        line([[86,163],[90,165],[94,163]],ink,2);
        ellipse(65,157,8,10,cream);ellipse(115,157,8,10,cream);
      }
    }
    if(season()==='halloween') {
      // The hat and pocket pumpkin travel with every existing pose.
      shape('M67 59L84 13Q92 24 113 55Z','#b99bd2');
      ellipse(91,58,33,6,'#c9afe0');
      line([[78,43],[104,43]],'#f3be97',6);
      ellipse(119,166,12,10,'#f3be97');
      line([[119,156],[122,151]],'#8c9c73',3);
      line([[115,164],[115,165]],ink,2);line([[123,164],[123,165]],ink,2);
      line([[117,170],[119,171],[122,169]],ink,1.5);
    }
    ctx.restore();
    if(!motion.matches && active && !document.hidden) frame=requestAnimationFrame(draw);
  }
  function chooseMessage(next){
    if(finished) return 'You did it, Dr. Mimi. So proud of you!';
    const turn=messageIndex++;
    if(season()) {
      const messages = {catchLeaf:'You’re un-be-leaf-able, Dr. Mimi.', scarfCoffee:'I love you a latte, meri jaan.',
        gatherLeaves:'You autumn know how proud I am.', pumpkin:'You’re the pick of the patch, meri jaan.'};
      return messages[next] || seasonalPun(season(), turn);
    }
    if(next==='rest') return encouragements[turn%encouragements.length];
    const pool=activityMessages[next];
    if(!specificActivities.includes(next)&&turn%3===0) return encouragements[turn%encouragements.length];
    const visit=messageTurns[next]||0;
    messageTurns[next]=visit+1;
    return pool[visit%pool.length];
  }
  function setActivity(next){activity=next;message.textContent=chooseMessage(next);button.dataset.activity=next;started=performance.now();if(frame)cancelAnimationFrame(frame);draw();}
  function schedule(delay=7000){clearTimeout(timer);if(active&&!document.hidden)timer=setTimeout(advance,delay);}
  // Taps and automatic activities share a cursor, so a tap always moves forward.
  function nextActivity(){
    const choices=season() ? ['catchLeaf','wave','scarfCoffee','heartbeat','gatherLeaves','read','pumpkin','nap'] : activities;
    let next=choices[index++%choices.length];
    if(next===activity) next=choices[index++%choices.length];
    return next;
  }
  function advance(){
    if(activity==='rest'){
      setActivity(finished?'celebrate':nextActivity());
      schedule(5500);
    } else {setActivity('rest');schedule(8500);}
  }
  button.addEventListener('click',()=>{
    setActivity(nextActivity());live.textContent=message.textContent;schedule(5500);
  });
  function visibility(){
    clearTimeout(timer);if(frame)cancelAnimationFrame(frame);
    if(active&&!document.hidden){setActivity('rest');schedule();}
  }
  document.addEventListener('visibilitychange',visibility);
  window.addEventListener('bunny-app-active',event=>{active=event.detail;visibility();});
  motion.addEventListener('change',()=>{if(frame)cancelAnimationFrame(frame);draw();});
  const countdown=document.getElementById('countdown');
  function checkMilestone(){
    if(countdown.hidden && !document.getElementById('celebration').hidden && !finished){
      finished=true;const art=document.querySelector('.celebration-art');art.querySelector('img')?.remove();
      art.prepend(button);button.after(live);art.after(message);message.textContent='You did it, Dr. Mimi. So proud of you!';setActivity('celebrate');schedule(5500);
    } else if(!finished&&[100,30,7,1].includes(Number(document.getElementById('total-days').textContent))&&milestone!==Number(document.getElementById('total-days').textContent)){
      milestone=Number(document.getElementById('total-days').textContent);setActivity('celebrate');message.textContent='Another beautiful milestone, Dr. Mimi!';schedule(5500);
    }
  }
  new MutationObserver(checkMilestone).observe(countdown,{attributes:true,attributeFilter:['hidden'],childList:true,subtree:true});
  setActivity('rest');schedule();checkMilestone();
})();
