// Residency countdown for the free Scriptable app.
// Dates use midnight in the device's current timezone, like the website.
const WEBSITE_URL = "https://devness-portfolio.github.io/dr-mimi-ijaz-residency-countdown-calendar/";
const START = new Date(2022, 6, 1, 0, 0, 0);
const END = new Date(2027, 6, 1, 0, 0, 0);
const COLORS = {
  background: new Color("fff8f3"),
  ink: new Color("655063"),
  muted: new Color("806e7d"),
  pink: new Color("bd678d"),
  track: new Color("f0e8ef"),
};

// Clamp month-end dates: January 31 + one month becomes February 28/29.
function addMonths(date, months) {
  const result = new Date(date);
  result.setDate(1);
  result.setMonth(result.getMonth() + months);
  const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(date.getDate(), lastDay));
  return result;
}

function calculateCountdown(now, start = START, end = END) {
  const remaining = Math.max(0, end - now);
  const progress = Math.max(0, Math.min(100, ((now - start) / (end - start)) * 100));
  if (!remaining) return { complete: true, totalDays: 0, progress, months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  let months = Math.max(0, (end.getFullYear() - now.getFullYear()) * 12 + end.getMonth() - now.getMonth());
  if (addMonths(now, months) > end) months--;
  let rest = Math.max(0, Math.floor((end - addMonths(now, months)) / 1000));
  const weeks = Math.floor(rest / 604800); rest %= 604800;
  const days = Math.floor(rest / 86400); rest %= 86400;
  const hours = Math.floor(rest / 3600); rest %= 3600;
  const minutes = Math.floor(rest / 60);
  return { complete: false, totalDays: Math.ceil(remaining / 86400000), progress, months, weeks, days, hours, minutes, seconds: rest % 60 };
}


// One-off seasons in the device's local calendar; end dates are exclusive.
function seasonForDate(now) {
  // Expected civil dates; Ramadan takes precedence during Carnival overlap.
  if (now >= new Date(2027, 4, 1) && now < new Date(2027, 6, 1)) return 'dmv';
  if (now >= new Date(2027, 3, 1) && now < new Date(2027, 4, 1)) return 'beach';
  if (now >= new Date(2027, 1, 8) && now < new Date(2027, 2, 9)) return 'ramadan';
  if (now >= new Date(2027, 0, 6) && now < new Date(2027, 1, 10)) return 'mardi';
  if (now >= new Date(2026, 11, 25) && now < new Date(2027, 0, 1)) return 'nye';
  if (now >= new Date(2027, 0, 1) && now < new Date(2027, 0, 2)) return 'newyear';
  if (now.getFullYear() !== 2026) return '';
  if (now.getMonth() === 9) return 'halloween';
  return now.getMonth() === 10 && now.getDate() <= 26 ? 'fall' : '';
}
function isHalloween(now) { return seasonForDate(now) === 'halloween'; }
const NEW_YEAR_SCENES = [
  { activity: 'fireworks', pun: 'You’re the spark of my year.', affirmation: 'You make the future look bright, meri jaan.' },
  { activity: 'ringBell', pun: 'Ring in the year. You’ve already won my heart.', affirmation: 'Every little victory deserves to be celebrated.' },
  { activity: 'wishCard', pun: 'My New Year’s resolution? More you.', affirmation: 'Your next chapter is worth believing in, Dr. Mimi.' }
];
function isNewYear(season) { return season === 'nye' || season === 'newyear'; }
const MARDI_SCENES = [
  { activity: 'crawfish', pun: 'You’re craw-some, Dr. Mimi.', affirmation: 'Even on the hard days, you bring so much heart.' },
  { activity: 'catchBeads', pun: 'I bead-lieve in you, meri jaan.', affirmation: 'Every small win belongs in your parade.' },
  { activity: 'kingCake', pun: 'You take the cake, my queen.', affirmation: 'You deserve a little sweetness between rounds.' }
];
const DMV_SCENES = [
  { activity: 'museum', pun: 'You’re a national treasure, Dr. Mimi.', affirmation: 'Your curiosity and care make the world a brighter place.' },
  { activity: 'blueCrab', pun: 'You’re claw-some, hon.', affirmation: 'Even when the day gets crabby, your kindness shines through.' },
  { activity: 'trailWalk', pun: 'Virginia is for lovers. I’m here for you.', affirmation: 'One step at a time, meri jaan. You are so close to your next adventure.' }
];
const BEACH_SCENES = [
  { activity: 'sandcastle', pun: 'You’re sand-sational, Dr. Mimi.', affirmation: 'Every small step is building your beautiful next chapter.' },
  { activity: 'seashell', pun: 'Shell yeah, I believe in you.', affirmation: 'Your kindness leaves something lovely wherever you go.' },
  { activity: 'beachRead', pun: 'You deserve a shore break, meri jaan.', affirmation: 'Rest belongs in your story, too. Take a little time for yourself.' }
];
const RAMADAN_SCENES = [
  { activity: 'prayer', pun: 'You’re my favorite prayer-tner.', affirmation: 'May your quiet moments bring peace to your busy days.' },
  { activity: 'iftarDate', pun: 'My favorite date is iftar with you.', affirmation: 'You deserve sweetness, nourishment, and a gentle evening.' },
  { activity: 'fasting', pun: 'Running on empty, still full of heart.', affirmation: 'Take it one moment at a time, meri jaan. Your effort matters.' }
];
function seasonalPun(season, index) {
  if (season === 'dmv') return DMV_SCENES[((index % 3) + 3) % 3].pun;
  if (season === 'beach') return BEACH_SCENES[((index % 3) + 3) % 3].pun;
  if (season === 'ramadan') return RAMADAN_SCENES[((index % 3) + 3) % 3].pun;
  if (season === 'mardi') return MARDI_SCENES[((index % 3) + 3) % 3].pun;
  if (isNewYear(season)) return NEW_YEAR_SCENES[((index % 3) + 3) % 3].pun;
  const puns = ["You’re un-be-leaf-able, Dr. Mimi.", "I love you a latte, meri jaan.",
    "You autumn know how proud I am.", "You’re brew-tiful.", "Falling for you, one day at a time."];
  if (season === 'halloween') puns.push("You’re doing fang-tastic.", "A little boo, a lot of love.");
  return puns[((index % puns.length) + puns.length) % puns.length];
}

const BUNNY_ACTIONS = ["jump", "wave", "heartbeat", "notes", "read", "eat", "tea", "stretch", "nap", "celebrate"];
function activityForDate(now, complete) {
  if (complete) return "celebrate";
  const slot = Math.floor(now.getTime() / 1800000);
  const actions = seasonForDate(now) === 'dmv' ? DMV_SCENES.map(scene => scene.activity) : seasonForDate(now) === 'beach' ? BEACH_SCENES.map(scene => scene.activity) : seasonForDate(now) === 'ramadan' ? RAMADAN_SCENES.map(scene => scene.activity) : seasonForDate(now) === 'mardi' ? MARDI_SCENES.map(scene => scene.activity) : isNewYear(seasonForDate(now)) ? NEW_YEAR_SCENES.map(scene => scene.activity) : seasonForDate(now) ? ["catchLeaf", "scarfCoffee", "gatherLeaves", "pumpkin"] : BUNNY_ACTIONS;
  return slot % 2 === 0 ? "rest" : actions[((Math.floor(slot / 2) % actions.length) + actions.length) % actions.length];
}
function bunnyMessage(activity, now) {
  if (seasonForDate(now) === 'dmv') {
    const scene = DMV_SCENES.find(scene => scene.activity === activity);
    return scene ? scene.pun + ' ' + scene.affirmation : 'Three places, one favorite person. Almost home, meri jaan.';
  }
  if (seasonForDate(now) === 'beach') {
    const scene = BEACH_SCENES.find(scene => scene.activity === activity);
    return scene ? scene.pun + ' ' + scene.affirmation : 'A little sunshine, a whole lot of love. Take a shore break, Mimi.';
  }
  if (seasonForDate(now) === 'ramadan') {
    const scene = RAMADAN_SCENES.find(scene => scene.activity === activity);
    return scene ? scene.pun + ' ' + scene.affirmation : 'Ramadan Mubarak, meri jaan. May this month bring you peace.';
  }
  if (seasonForDate(now) === 'mardi') {
    const scene = MARDI_SCENES.find(scene => scene.activity === activity);
    return scene ? scene.pun + ' ' + scene.affirmation : 'A little krewe, a whole lot of love.';
  }
  if (isNewYear(seasonForDate(now))) {
    const scene = NEW_YEAR_SCENES.find(scene => scene.activity === activity);
    return scene ? scene.pun + ' ' + scene.affirmation : 'A fresh year. The same love, always.';
  }
  if (seasonForDate(now)) return seasonalPun(seasonForDate(now), Math.floor(now.getTime() / 1800000));
  const messages = {
    jump: "One day closer to your next chapter.", wave: "Hello, my favorite doctor.",
    heartbeat: "Your kindness is part of the treatment.", notes: "Doctor’s note: you are doing beautifully.",
    read: "You make a difference, Dr. Mimi.", eat: "Prescription: a little snack break.",
    tea: "Doctor’s orders: a tiny tea break.", stretch: "Unclench your shoulders, meri jaan.",
    nap: "A little rest is part of the treatment.", celebrate: "So proud of you, Dr. Mimi."
  };
  const rests = ["One day at a time, meri jaan.", "So proud of you. Always.", "Your best is enough today."];
  return messages[activity] || rests[((Math.floor(now.getTime() / 3600000) % rests.length) + rests.length) % rests.length];
}

// Vector geometry from assets/bunny.svg, drawn locally: no downloads or extra files.
function doctorBunny(activity = "rest", halloween = false, fall = false, newYear = false, mardi = false, ramadan = false, beach = false) {
  const canvas = new DrawContext();
  canvas.size = new Size(180, 220);
  canvas.opaque = false;
  canvas.respectScreenScale = true;
  const shapes = [
    ["#e8d9e7","none",1.0,[["E",24.0,179.0,132.0,18.0]]],
    ["#fff9ee","#886a76",2.5,[["M",49.0,70.0],["C",25.0,9.0,49.0,-6.0,65.0,14.0],["L",77.0,65.0],["M",102.0,64.0],["L",117.0,15.0],["C",132.0,-8.0,153.0,10.0,130.0,72.0]]],
    ["none","#efbfd0",9.0,[["M",53.0,53.0],["C",41.0,19.0,50.0,12.0,57.0,24.0],["L",67.0,56.0],["M",113.0,55.0],["L",124.0,24.0],["C",132.0,10.0,141.0,20.0,128.0,57.0]]],
    ["#fff9ee","#886a76",2.5,[["M",54.0,124.0],["C",29.0,130.0,23.0,158.0,40.0,161.0],["L",51.0,150.0],["M",125.0,126.0],["C",150.0,121.0,162.0,106.0,169.0,117.0],["C",177.0,134.0,151.0,151.0,133.0,151.0]]],
    ["#fff9ee","#886a76",2.5,[["M",58.0,175.0],["L",54.0,185.0],["Q",59.0,195.0,76.0,187.0],["L",80.0,174.0],["M",104.0,174.0],["L",107.0,187.0],["Q",125.0,195.0,130.0,185.0],["L",124.0,173.0]]],
    ["#fff","#886a76",2.5,[["M",57.0,116.0],["Q",40.0,132.0,46.0,178.0],["Q",91.0,190.0,135.0,178.0],["Q",139.0,136.0,123.0,115.0]]],
    ["#e1dcec","#886a76",2.5,[["M",72.0,118.0],["L",89.0,142.0],["L",107.0,119.0]]],
    ["none","#d8c9d4",2.5,[["M",65.0,120.0],["L",61.0,140.0],["L",75.0,143.0],["L",67.0,151.0],["L",88.0,177.0],["M",114.0,120.0],["L",121.0,140.0],["L",107.0,145.0],["L",115.0,152.0],["L",97.0,178.0],["M",91.0,146.0],["L",91.0,180.0]]],
    ["#fff9ee","#886a76",2.5,[["M",42.0,89.0],["C",42.0,59.0,63.0,51.0,89.0,55.0],["C",118.0,49.0,143.0,63.0,140.0,91.0],["C",141.0,116.0,120.0,128.0,91.0,129.0],["C",61.0,129.0,41.0,115.0,42.0,89.0],["Z"]]],
    ["none","#87768d",2.5,[["M",72.0,119.0],["L",72.0,141.0],["Q",73.0,154.0,83.0,154.0],["Q",94.0,154.0,94.0,142.0],["L",94.0,129.0],["M",118.0,122.0],["L",118.0,151.0]]],
    ["#dbc8e4","#886a76",2.5,[["E",112.0,149.0,12.0,12.0]]],
    ["none","#655460",4.0,[["M",65.0,88.0],["L",65.0,93.0],["M",115.0,88.0],["L",115.0,93.0]]],
    ["none","#886a76",2.0,[["M",85.0,99.0],["Q",90.0,104.0,95.0,99.0],["M",90.0,104.0],["L",90.0,109.0],["M",90.0,109.0],["Q",85.0,113.0,81.0,108.0],["M",90.0,109.0],["Q",95.0,113.0,99.0,108.0]]],
    ["#f3c0cf","none",1.0,[["E",49.0,97.0,20.0,12.0]]],
    ["#f3c0cf","none",1.0,[["E",113.0,97.0,20.0,12.0]]],
    ["#cf92aa","none",1.0,[["M",128.0,67.0],["C",113.0,57.0,127.0,49.0,132.0,57.0],["C",140.0,49.0,150.0,61.0,128.0,67.0]]],
    ["#dfba77","none",1.0,[["M",20.0,83.0],["L",23.0,91.0],["L",31.0,94.0],["L",23.0,97.0],["L",20.0,105.0],["L",17.0,97.0],["L",9.0,94.0],["L",17.0,91.0],["Z"]]],
  ];
  // Leave headroom for the raised hop and long ears. The ground stays still.
  const offsetY = activity === "jump" || activity === "celebrate" ? 4 : 16;
  const raised = activity === "stretch" || activity === "celebrate";
  shapes[3] = ["#fff9ee", "#886a76", 2.5, [
    ["E", 27, raised ? 76 : 125, 24, 38],
    ["E", 130, raised ? 76 : activity === "wave" ? 87 : 125, 24, 38]
  ]];
  if (activity === "nap") shapes[11] = ["none", "#655460", 2, [
    ["M",61,88],["Q",65,94,69,88],["M",111,88],["Q",115,94,119,88]
  ]];
  if (activity === "heartbeat") {
    shapes[9][3] = [["M",72,119],["L",72,141],["Q",73,154,83,154],["Q",94,154,94,142],["L",94,129],["M",118,122],["L",108,137]];
    shapes[10][3] = [["E",102,132,12,12]];
  }
  function paint(fill, stroke, width, commands, yOffset = offsetY) {
    const path = new Path();
    for (const [command, ...coords] of commands) {
      const v = coords.map((value, index) => index % 2 === 1 && !(command === "E" && index === 3) ? value + yOffset : value);
      switch (command) {
        case "M": path.move(new Point(v[0], v[1])); break;
        case "L": path.addLine(new Point(v[0], v[1])); break;
        case "C": path.addCurve(new Point(v[4], v[5]), new Point(v[0], v[1]), new Point(v[2], v[3])); break;
        case "Q": path.addQuadCurve(new Point(v[2], v[3]), new Point(v[0], v[1])); break;
        case "E": path.addEllipse(new Rect(...v)); break;
        case "Z": path.closeSubpath(); break;
      }
    }
    if (fill !== "none") {
      canvas.setFillColor(new Color(fill.replace("#", "")));
      canvas.addPath(path);
      canvas.fillPath();
    }
    if (stroke !== "none") {
      canvas.setStrokeColor(new Color(stroke.replace("#", "")));
      canvas.setLineWidth(width);
      canvas.addPath(path);
      canvas.strokePath();
    }
  }
  shapes.forEach(([fill, stroke, width, commands], index) => paint(fill, stroke, width, commands, index === 0 ? 16 : offsetY));
  function ellipse(x,y,w,h,fill = "#fff9ee") { paint(fill,"#886a76",2,[["E",x,y,w,h]]); }
  function line(points, color = "#886a76", width = 2) { paint("none",color,width,points.map(([x,y],i)=>[i ? "L" : "M",x,y])); }
  function box(x,y,w,h,fill) { paint(fill,"#886a76",2,[["M",x,y],["L",x+w,y],["L",x+w,y+h],["L",x,y+h],["Z"]]); }
  function heart(x,y) { paint("#cf92aa","none",1,[["M",x,y],["C",x-18,y-12,x-5,y-24,x,y-15],["C",x+5,y-24,x+18,y-12,x,y]]); }
  if (activity === "heartbeat") { ellipse(112,133,20,15); heart(151,70); }
  if (activity === "notes") {
    box(78,135,40,40,"#faf4e8"); box(89,131,17,7,"#dbc8e4");
    for (let y=148;y<170;y+=7) line([[85,y],[109,y]],"#baa4b5",1);
    line([[125,139],[104,161]],"#bd678d",4); ellipse(118,140,17,14);
  }
  if (activity === "read") {
    box(61,140,60,35,"#e1dcec"); line([[91,140],[91,175]]);
    for (let y=148;y<170;y+=7) { line([[67,y],[85,y]],"#baa4b5",1); line([[97,y],[115,y]],"#baa4b5",1); }
    ellipse(53,150,16,20); ellipse(117,150,16,20);
  }
  if (activity === "eat") {
    ellipse(97,108,29,27,"#dfba77");
    for (const [x,y] of [[102,115],[113,122],[106,127]]) ellipse(x,y,3,3,"#886a76");
    ellipse(118,106,10,10); ellipse(121,124,17,14);
  }
  if (activity === "tea") {
    ellipse(113,121,18,17,"#ffffff"); box(83,115,34,28,"#efbfd0");
    line([[107,115],[110,130]],"#886a76",1); box(106,130,7,8,"#fff9ee");
    line([[92,109],[88,102],[93,95]],"#baa4b5",1.5); ellipse(73,127,18,15); ellipse(113,135,18,15);
  }
  if (activity === "nap") {
    // Draw lettering locally too: no browser canvas or font downloads.
    line([[145,39],[157,39],[145,51],[157,51]]);
    line([[160,24],[168,24],[160,32],[168,32]],"#886a76",1.5);
  }
  if (activity === "stretch") { line([[22,71],[17,64]],"#cf92aa"); line([[157,71],[163,64]],"#cf92aa"); }
  if (activity === "celebrate") { heart(24,68); heart(154,64); }
  function leaf(x,y) { paint("#cf6b69","#886a76",1.5,[["M",x,y+12],["Q",x-19,y+2,x-8,y-12],["L",x,y-6],["L",x+7,y-17],["Q",x+20,y+1,x,y+12],["Z"]]); line([[x,y+16],[x,y-6]],"#98576a",1); }
  if (fall || activity === "scarfCoffee") { box(65,122,52,10,"#c293b2");box(101,128,12,28,"#c293b2"); }
  if (activity === "catchLeaf") { ellipse(137,118,20,14);leaf(147,110); }
  if (activity === "gatherLeaves") { for(const [x,y] of [[55,176],[76,183],[98,177],[126,181]])leaf(x,y);ellipse(110,151,18,14);leaf(105,145); }
  if (activity === "pumpkin") { ellipse(65,135,50,44,"#f3be97");ellipse(78,135,24,44,"#f3be97");line([[90,135],[94,129]],"#8c9c73",4);ellipse(58,149,16,20);ellipse(106,149,16,20); }
  if (activity === "scarfCoffee") { ellipse(113,121,18,17,"#ffffff");box(83,115,34,28,"#dfc4a1");line([[89,120],[111,120]],"#765541",3);line([[92,109],[88,102],[93,95]],"#baa4b5",1.5);ellipse(73,127,18,15); }
  if (halloween) {
    paint("#b99bd2","#886a76",2,[["M",67,59],["L",84,13],["L",113,55],["Z"]]);
    ellipse(58,52,66,12,"#c9afe0"); line([[78,43],[104,43]],"#f3be97",6);
    ellipse(107,156,24,20,"#f3be97");line([[119,156],[122,151]],"#8c9c73",3);
    ellipse(113,163,2,3,"#886a76");ellipse(122,163,2,3,"#886a76");
  }
  if (newYear) {
    paint("#d6bee7","#886a76",2,[["M",70,60],["L",90,23],["L",110,60],["Z"]]);
    line([[76,51],[104,51]],"#cfb075",4);ellipse(86,20,8,8,"#cfb075");
  }
  if (activity === "fireworks") {
    for (const [x,y] of [[26,53],[151,38]]) for(let i=0;i<8;i++) {
      const a=i*Math.PI/4;
      line([[x+Math.cos(a)*5,y+Math.sin(a)*5],[x+Math.cos(a)*18,y+Math.sin(a)*18]],i%2?"#ac8dc3":"#b59558",2);
    }
    ellipse(126,80,22,42);heart(34,119);
  }
  if (activity === "ringBell") {
    paint("#e0bf7c","#886a76",2,[["M",128,130],["Q",132,125,132,116],["Q",138,105,144,116],["Q",144,125,148,130],["Z"]]);
    ellipse(135,130,6,6,"#b59558");ellipse(128,135,18,14);line([[152,109],[158,104]],"#b59558");
  }
  if (activity === "wishCard") {
    box(63,136,56,36,"#f8eed8");line([[91,138],[91,170]],"#cfb075",1);
    for(let y=145;y<165;y+=7)line([[69,y],[83,y]],"#cfb075",1);
    heart(105,158);ellipse(53,146,16,20);ellipse(114,146,16,20);
  }
  if(activity === 'museum') {
    paint('#d6c8da','#685d65',1.5,[['M',114,135],['L',138,121],['L',162,135],['Z']]);box(114,136,48,5,'#d6c8da');
    for(const x of [119,135,151])box(x,141,6,30,'#f8f1e9');box(111,172,54,6,'#d6c8da');ellipse(111,144,16,18);
  }
  if(activity === 'blueCrab') {
    for(const side of [-1,1]){
      for(const y of [150,157,164])line([[90+side*18,y],[90+side*31,y-5]],'#7699b8',2);
      line([[90+side*16,149],[90+side*28,137]],'#7699b8',3);ellipse(83+side*29,126,14,16,'#9dbbd1');
    }
    ellipse(67,142,46,26,'#9dbbd1');ellipse(81,141,4,6,'#685d65');ellipse(95,141,4,6,'#685d65');ellipse(55,159,16,14);ellipse(109,159,16,14);
  }
  if(activity === 'trailWalk') {
    for(const [y,w] of [[173,28],[159,33]])paint('#a6c3ac','#685d65',1.5,[['M',143-w/2,y],['L',143,y-28],['L',143+w/2,y],['Z']]);
    line([[143,169],[143,184]],'#8f7b6b',3);line([[122,143],[126,183]],'#8f7b6b',3);ellipse(113,139,16,18);
  }
  if (beach) { ellipse(33,176,114,16,"#ead8b6",null);ellipse(136,24,24,24,"#efd18c",null); }
  if (activity === 'sandcastle') {
    box(116,158,43,24,"#e4c798");box(126,143,23,17,"#e4c798");
    for(const x of [116,132,148])box(x,153,11,8,"#e4c798");
    line([[137,143],[137,124]],"#8f7b6b",1.5);line([[137,126],[150,129]],"#d8958c",5);
    box(131,169,12,13,"#b69770");ellipse(114,139,16,18);
  }
  if (activity === 'seashell') {
    paint("#efc4ba","#b78680",1.5,[["M",124,145],["Q",105,126,113,121],["Q",116,111,124,119],["Q",133,110,137,121],["Q",147,128,124,145],["Z"]]);
    for(const x of [116,125,135])line([[124,142],[x,122]],"#b78680",1);ellipse(116,144,16,14);
  }
  if (activity === 'beachRead') {
    box(62,140,57,33,"#a9cfc6");line([[90,142],[90,171]],"#688e85",1);
    for(const y of [149,156,163]){line([[68,y],[83,y]],"#688e85",1);line([[97,y],[111,y]],"#688e85",1);}
    ellipse(53,148,16,18);ellipse(113,148,16,18);
  }
  if (ramadan) {
    ellipse(22,25,30,30,"#d3b77c");ellipse(30,20,26,28,"#e9eef6",null);
    box(50,174,82,15,"#9caec6");line([[57,180],[125,180]],"#f1dfba",2);
  }
  if (activity === 'prayer') { ellipse(65,113,16,26);ellipse(99,113,16,26); }
  if (activity === 'iftarDate') {
    ellipse(61,150,62,14,"#f4e6c9");
    for(const x of [77,92,107]){ellipse(x-6,140,12,20,"#a4745b");line([[x,145],[x-1,154]],"#795443",1);}
    ellipse(53,142,16,18);ellipse(116,142,16,18);
  }
  if (activity === 'fasting') { ellipse(66,144,20,14);ellipse(94,144,20,14);line([[79,153],[99,153]],"#c8b7b6",1); }
  if (mardi) {
    paint("#e5cb87","#886a76",2,[["M",68,58],["L",65,40],["L",79,48],["L",90,32],["L",101,48],["L",115,40],["L",112,58],["Z"]]);
    for(let i=0;i<13;i++){const a=i*Math.PI/12;ellipse(87+24*Math.cos(a),119+17*Math.sin(a),5,5,["#ae91c4","#97ae84","#d1b16a"][i%3]);}
  }
  if (activity === 'crawfish') {
    ellipse(58,140,68,12,"#eee4f3");ellipse(83,115,18,32,"#e49b88");
    for(let y=126;y<144;y+=5)line([[85,y],[99,y]],"#b87472",1);
    line([[85,122],[73,117],[73,109]],"#b87472");line([[99,122],[111,117],[111,109]],"#b87472");
    for(const x of [73,111])paint("#e49b88","#886a76",2,[["M",x,111],["Q",x-12,106,x-7,95],["L",x,102],["L",x+6,95],["Q",x+12,107,x,111],["Z"]]);
    paint("#e49b88","#886a76",1,[["M",87,143],["L",80,150],["L",92,147],["L",104,150],["L",97,143],["Z"]]);
    ellipse(51,128,16,18);ellipse(118,128,16,18);
  }
  if (activity === 'catchBeads') {
    for(let i=0;i<18;i++){const a=i*Math.PI/9;ellipse(140+16*Math.cos(a),97+22*Math.sin(a),6,6,["#ae91c4","#97ae84","#d1b16a"][i%3]);}
    line([[136,140],[145,123]]);ellipse(135,116,20,14);
  }
  if (activity === 'kingCake') {
    ellipse(56,155,70,14,"#eee4f3");ellipse(64,134,54,28,"#dfbb82");ellipse(66,134,50,20,"#fff9ee");
    for(const [x,color] of [[74,"#ae91c4"],[91,"#97ae84"],[108,"#d1b16a"]])line([[x-3,141],[x+3,148]],color,5);
    ellipse(82,139,18,8,"#dfbb82");ellipse(56,144,16,18);ellipse(111,144,16,18);
  }
  return canvas.getImage();
}

const now = new Date();
const state = calculateCountdown(now);
const activity = activityForDate(now, state.complete);
const season = state.complete ? "" : seasonForDate(now);
const halloween = season === "halloween";
if (season) { COLORS.pink = new Color("9a5274"); COLORS.track = new Color("e8d9ef"); }
if (isNewYear(season)) COLORS.pink = new Color("895b83");
if (season === 'dmv') COLORS.pink = new Color('68658c');
if (season === 'beach') COLORS.pink = new Color('3f756b');
if (season === 'ramadan') COLORS.pink = new Color('526785');
if (season === 'mardi') COLORS.pink = new Color("82559d");
const family = config.widgetFamily || "large";
const small = family === "small";
const large = family === "large" || family === "extraLarge";
const widget = new ListWidget();
const backdrop = new LinearGradient();
backdrop.colors = (season === 'dmv' ? ['e5eaf5','edf0f7','f7e3e9'] : season === 'beach' ? ['d6ebe6','e5f2ee','f5e7cf'] : season === 'ramadan' ? ['dce5f1','e9eef6','f5ebd5'] : season === 'mardi' ? ["e8dcf4", "f1edf8", "e1eddc"] : isNewYear(season) ? ["eee2fa", "f3effa", "f7e7ca"] : season ? ["ffe3cd", "f4e3f2", "e3cff5"] : ["fff8f3", "f8e5ef", "eee7f4"]).map(hex => new Color(hex));
backdrop.locations = [0, 0.5, 1];
backdrop.startPoint = new Point(0, 0);
backdrop.endPoint = new Point(1, 1);
widget.backgroundGradient = backdrop;
widget.setPadding(8, 8, 8, 8);
widget.url = WEBSITE_URL;

const card = widget.addStack();
card.layoutVertically();
card.setPadding(large ? 12 : 6, 10, large ? 12 : 6, 10);
card.backgroundColor = new Color("fffdfa");
card.cornerRadius = 20;
card.borderWidth = 1;
card.borderColor = new Color("ffffff");

function text(parent, value, size, color = COLORS.ink, serif = false) {
  const label = parent.addText(String(value));
  label.font = serif ? new Font("Georgia", size) : Font.mediumRoundedSystemFont(size);
  label.textColor = color;
  label.lineLimit = 1;
  label.minimumScaleFactor = 0.7;
  return label;
}
function centered(parent, value, size, color = COLORS.ink, serif = false) {
  const row = parent.addStack();
  row.addSpacer();
  const label = text(row, value, size, color, serif);
  label.centerAlignText();
  row.addSpacer();
  return label;
}
function bunny(parent, height) {
  const image = parent.addImage(doctorBunny(activity, halloween, season === "fall", isNewYear(season), season === 'mardi', season === 'ramadan', season === 'beach'));
  image.imageSize = new Size(height * 180 / 220, height);
  image.applyFittingContentMode();
}
function progressBar(parent, value) {
  const drawing = new DrawContext();
  drawing.size = new Size(280, 5);
  drawing.opaque = false;
  drawing.respectScreenScale = true;
  const track = new Path();
  track.addRoundedRect(new Rect(0, 0, 280, 5), 2.5, 2.5);
  drawing.setFillColor(COLORS.track);
  drawing.addPath(track);
  drawing.fillPath();
  if (value > 0) {
    const fill = new Path();
    fill.addRoundedRect(new Rect(0, 0, 280 * Math.min(1, value), 5), 2.5, 2.5);
    drawing.setFillColor(new Color("dda0b9"));
    drawing.addPath(fill);
    drawing.fillPath();
  }
  const image = parent.addImage(drawing.getImage());
  // Conservative widths fit the smallest supported phone widgets.
  image.imageSize = new Size(small ? 100 : large ? 220 : 240, 5);
  image.centerAlignImage();
}
function liveTimer(parent) {
  const row = parent.addStack();
  row.addSpacer();
  const timer = row.addDate(END);
  timer.applyTimerStyle();
  timer.font = Font.regularMonospacedSystemFont(small ? 11 : 12);
  timer.textColor = COLORS.ink;
  timer.lineLimit = 1;
  timer.minimumScaleFactor = 0.6;
  row.addSpacer();
}

if (!state.complete || small || large) {
  centered(card, "Dr. Mimi Ijaz’s", large ? 19 : 12, COLORS.ink, true);
  if (large) centered(card, "RESIDENCY COUNTDOWN", 9, COLORS.muted);
  card.addSpacer(4);
}

if (state.complete) {
  let celebrationText = card;
  if (!small && !large) {
    const hero = card.addStack();
    hero.centerAlignContent();
    hero.addSpacer();
    bunny(hero, 46);
    hero.addSpacer(8);
    celebrationText = hero.addStack();
    celebrationText.layoutVertically();
    hero.addSpacer();
  }
  centered(celebrationText, "YOU DID IT!", large ? 30 : small ? 19 : 23, COLORS.pink, true);
  const congratulations = centered(celebrationText, "Congratulations Meri Jaan!!", large ? 15 : 11);
  congratulations.lineLimit = small ? 2 : 1;
  centered(celebrationText, "Alhamdulillah", large ? 13 : 10, COLORS.muted);
  if (large || small) {
    card.addSpacer(large ? 8 : 2);
    const art = card.addStack();
    art.addSpacer();
    bunny(art, large ? 84 : 26);
    art.addSpacer();
  }
  if (!small) {
    card.addSpacer(large ? 10 : 4);
    const verse = card.addStack();
    verse.layoutVertically();
    verse.backgroundColor = new Color("f7f2f8");
    verse.cornerRadius = 12;
    verse.setPadding(large ? 10 : 3, 5, large ? 10 : 3, 5);
    // Arabic text supplies its own RTL direction; keep it on a separate line.
    centered(verse, "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", large ? 23 : 17);
    centered(verse, "Verily, with hardship comes ease.", large ? 11 : 9);
    centered(verse, "Qur'an 94:5 — Ash-Sharh", large ? 9 : 8, COLORS.muted);
  }
  if (large) {
    card.addSpacer();
    centered(card, "So proud of you. Always.", 12, COLORS.pink, true);
  }
} else {
  if (season === 'dmv') centered(card, 'All roads lead to you', small ? 9 : 12, COLORS.pink, true);
  if (season === 'beach') centered(card, 'Shore looks good on you', small ? 9 : 12, COLORS.pink, true);
  if (season === 'ramadan') centered(card, 'Ramadan Mubarak, meri jaan', small ? 9 : 12, COLORS.pink, true);
  if (season === 'mardi') centered(card, "A little krewe, a lot of love", small ? 9 : 12, COLORS.pink, true);
  if (isNewYear(season)) {
    centered(card, season === "newyear" ? "Hello, 2027." : "With love, into 2027", small ? 10 : 13, COLORS.pink, true);
    if (large) centered(card, season === "newyear" ? "Your graduation year is here." : "The best is yet to come.", 11, COLORS.muted);
  }
  const hero = card.addStack();
  hero.centerAlignContent();
  hero.addSpacer();
  bunny(hero, large ? 70 : small ? 48 : 58);
  hero.addSpacer(small ? 5 : 12);
  const count = hero.addStack();
  count.layoutVertically();
  centered(count, state.totalDays.toLocaleString(), large ? 46 : small ? 32 : 34, COLORS.pink, true);
  centered(count, "days left", small ? 10 : 12);
  hero.addSpacer();
  card.addSpacer(4);
  if (large) {
    const stamp = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    centered(card, `BREAKDOWN · AS OF ${stamp}`, 8, COLORS.muted);
    card.addSpacer(3);
    for (const units of [["months", "weeks", "days"], ["hours", "minutes", "seconds"]]) {
      const row = card.addStack();
      row.addSpacer();
      units.forEach((unit, index) => {
        if (index) row.addSpacer(5);
        const tile = row.addStack();
        tile.layoutVertically();
        tile.size = new Size(70, 38);
        tile.cornerRadius = 10;
        tile.borderWidth = 0.5;
        tile.borderColor = new Color(["eedfe7", "e7e0ef", "efe6d4"][index]);
        tile.backgroundColor = new Color(["fbf0f4", "f2eef8", "faf4e8"][index]);
        tile.addSpacer();
        centered(tile, String(state[unit]).padStart(2, "0"), 18);
        centered(tile, unit[0].toUpperCase() + unit.slice(1), 8, COLORS.muted);
        tile.addSpacer();
      });
      row.addSpacer();
      card.addSpacer(5);
    }
  }
  liveTimer(card);
  card.addSpacer(large ? 6 : 4);
  progressBar(card, state.progress / 100);
  card.addSpacer(3);
  centered(card, `${(Math.floor(state.progress * 10) / 10).toFixed(1)}% complete`, 9, COLORS.muted);
  if (!small || season) {
    card.addSpacer(large ? 4 : 2);
    const message = centered(card, bunnyMessage(activity, now), large ? 11 : small ? 8 : 9, COLORS.pink, true);
    message.lineLimit = 2;
  }
}

if (!state.complete) {
  const nextChange = new Date(END.getTime() - Math.max(0, state.totalDays - 1) * 86400000);
  const nextPose = (Math.floor(now.getTime() / 1800000) + 1) * 1800000;
  widget.refreshAfterDate = new Date(Math.min(nextChange.getTime(), nextPose, large ? now.getTime() + 900000 : Infinity));
}
// Home Screen widgets are snapshots. Open the full interactive bunny when run in-app.
Script.setWidget(widget);
if (config.runsInApp) await Safari.openInApp(WEBSITE_URL, true);
Script.complete();
