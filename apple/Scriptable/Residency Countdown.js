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


// One-off 2026 season, through US Thanksgiving, in the device's local calendar.
function seasonForDate(now) {
  if (now.getFullYear() !== 2026) return '';
  if (now.getMonth() === 9) return 'halloween';
  return now.getMonth() === 10 && now.getDate() <= 26 ? 'fall' : '';
}
function isHalloween(now) { return seasonForDate(now) === 'halloween'; }
function seasonalPun(season, index) {
  const puns = ["You’re un-be-leaf-able, Dr. Mimi.", "I love you a latte, meri jaan.",
    "You autumn know how proud I am.", "You’re brew-tiful.", "Falling for you, one day at a time."];
  if (season === 'halloween') puns.push("You’re doing fang-tastic.", "A little boo, a lot of love.");
  return puns[((index % puns.length) + puns.length) % puns.length];
}

const BUNNY_ACTIONS = ["jump", "wave", "heartbeat", "notes", "read", "eat", "tea", "stretch", "nap", "celebrate"];
function activityForDate(now, complete) {
  if (complete) return "celebrate";
  const slot = Math.floor(now.getTime() / 1800000);
  const actions = seasonForDate(now) ? ["catchLeaf", "scarfCoffee", "gatherLeaves", "pumpkin"] : BUNNY_ACTIONS;
  return slot % 2 === 0 ? "rest" : actions[((Math.floor(slot / 2) % actions.length) + actions.length) % actions.length];
}
function bunnyMessage(activity, now) {
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
function doctorBunny(activity = "rest", halloween = false, fall = false) {
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
  return canvas.getImage();
}

const now = new Date();
const state = calculateCountdown(now);
const activity = activityForDate(now, state.complete);
const season = state.complete ? "" : seasonForDate(now);
const halloween = season === "halloween";
if (season) { COLORS.pink = new Color("9a5274"); COLORS.track = new Color("e8d9ef"); }
const family = config.widgetFamily || "large";
const small = family === "small";
const large = family === "large" || family === "extraLarge";
const widget = new ListWidget();
const backdrop = new LinearGradient();
backdrop.colors = (season ? ["ffe3cd", "f4e3f2", "e3cff5"] : ["fff8f3", "f8e5ef", "eee7f4"]).map(hex => new Color(hex));
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
  const image = parent.addImage(doctorBunny(activity, halloween, season === "fall"));
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
