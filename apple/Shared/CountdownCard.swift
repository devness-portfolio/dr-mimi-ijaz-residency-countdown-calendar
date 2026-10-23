import SwiftUI

enum Palette {
    static let dmvBackground = LinearGradient(colors: [Color(red:0.91,green:0.93,blue:0.97),Color(red:0.97,green:0.89,blue:0.91)],startPoint:.topLeading,endPoint:.bottomTrailing)
    static let beachBackground = LinearGradient(colors: [Color(red:0.84,green:0.92,blue:0.90),Color(red:0.96,green:0.91,blue:0.81)], startPoint:.topLeading,endPoint:.bottomTrailing)
    static let ramadanBackground = LinearGradient(colors: [Color(red:0.86,green:0.90,blue:0.95),Color(red:0.96,green:0.92,blue:0.84)], startPoint:.topLeading,endPoint:.bottomTrailing)
    static let mardiBackground = LinearGradient(colors: [Color(red:0.91,green:0.86,blue:0.96),Color(red:0.88,green:0.93,blue:0.86)], startPoint:.topLeading,endPoint:.bottomTrailing)
    static let ink = Color(red: 0.396, green: 0.314, blue: 0.388)
    static let newYearBackground = LinearGradient(colors: [Color(red: 0.94, green: 0.89, blue: 0.98), Color(red: 0.97, green: 0.91, blue: 0.79)], startPoint: .topLeading, endPoint: .bottomTrailing)
    static let pink = Color(red: 0.741, green: 0.404, blue: 0.553)
    static let halloweenBackground = LinearGradient(colors: [Color(red: 1, green: 0.89, blue: 0.79), Color(red: 0.89, green: 0.81, blue: 0.96)], startPoint: .topLeading, endPoint: .bottomTrailing)
    static let background = LinearGradient(colors: [Color(red: 1, green: 0.973, blue: 0.953), Color(red: 0.949, green: 0.925, blue: 0.973)], startPoint: .topLeading, endPoint: .bottomTrailing)
}

struct CountdownCard: View {
    let state: Countdown
    var compact = false
    var expanded = false
    private var activity: BunnyActivity { .at(state.date, complete: state.complete) }
    var body: some View {
        VStack(alignment: .leading, spacing: expanded ? 10 : 4) {
            HStack {
                Text("Dr. Mimi Ijaz").font(.system(.headline, design: .rounded)).lineLimit(1).minimumScaleFactor(0.75)
                Spacer(minLength: 2)
                Image(systemName: state.complete ? "star.fill" : "heart.fill")
                    .foregroundStyle(Palette.pink).accessibilityHidden(true)
            }
            if state.complete {
                HStack(spacing: 6) {
                    DoctorBunny(activity: .celebrate).frame(width: compact ? 32 : 44, height: compact ? 36 : 49)
                    Text("YOU DID IT!")
                    .font(.system(size: compact ? 16 : 32, weight: .bold, design: .serif))
                    .foregroundStyle(Palette.pink).minimumScaleFactor(0.7).lineLimit(1)
                }
                Text("Congratulations Meri Jaan!!")
                    .font(.system(compact ? .caption : .subheadline, design: .rounded))
                Text("Alhamdulillah").font(.subheadline)
                if expanded { verse }
            } else {
                if state.season == "dmv" { Text("All roads lead to you").font(.system(compact ? .caption2 : .subheadline,design:.serif)).lineLimit(1).minimumScaleFactor(0.75) }
                if state.season == "beach" { Text("Shore looks good on you").font(.system(compact ? .caption2 : .subheadline,design:.serif)).lineLimit(1).minimumScaleFactor(0.75) }
                if state.season == "ramadan" { Text("Ramadan Mubarak, meri jaan").font(.system(compact ? .caption2 : .subheadline,design:.serif)).lineLimit(1).minimumScaleFactor(0.75) }
                if state.season == "mardi" { Text("A little krewe, a lot of love").font(.system(compact ? .caption2 : .subheadline,design:.serif)).lineLimit(1).minimumScaleFactor(0.75) }
                if state.newYear {
                    Text(state.season == "newyear" ? "Hello, 2027." : "With love, into 2027")
                        .font(.system(compact ? .caption2 : .subheadline, design: .serif))
                    if expanded { Text(state.season == "newyear" ? "Your graduation year is here." : "The best is yet to come.").font(.caption) }
                }
                HStack(alignment: .center, spacing: compact ? 4 : 12) {
                    DoctorBunny(activity: activity, halloween: state.halloween, fall: state.season == "fall", newYear: state.newYear, mardi: state.season == "mardi", ramadan: state.season == "ramadan", beach: state.season == "beach")
                        .frame(width: compact ? 46 : (expanded ? 110 : 54), height: compact ? 58 : (expanded ? 122 : 60))
                    VStack(alignment: .leading, spacing: 0) {
                        Text(state.days.formatted())
                            .font(.system(size: compact ? 36 : (expanded ? 58 : 36), weight: .regular, design: .serif))
                            .monospacedDigit().foregroundStyle(Palette.pink)
                            .minimumScaleFactor(0.6).lineLimit(1)
                        Text("days left").font(compact ? .caption : (expanded ? .title3 : .subheadline))
                    }
                }
                if !compact || !state.season.isEmpty { Text(!state.season.isEmpty ? state.seasonalMessage : activity.message).font(compact ? .caption2 : .caption).lineLimit(2).minimumScaleFactor(0.85) }
                GeometryReader { geometry in
                    Capsule().fill(Palette.pink.opacity(0.15))
                        .overlay(alignment: .leading) {
                            Capsule().fill(Palette.pink)
                                .frame(width: geometry.size.width * state.progress)
                        }
                }
                .frame(height: 5)
                .accessibilityElement()
                .accessibilityLabel("Residency progress").accessibilityValue(state.percentage)
                if expanded { Text(state.percentage).font(.caption) }
                if expanded {
                    Spacer(minLength: 8)
                    Text("Every day, a little closer to your dream.").font(.system(.title3, design: .serif))
                    Text(state.end, format: .dateTime.month(.wide).day().year()).font(.subheadline)
                }
            }
        }
        .foregroundStyle(Palette.ink)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
    }
    private var verse: some View {
        VStack(spacing: 8) {
            Text("فَإِنَّ مَعَ الْعُسْرِ يُسْرًا").font(.title2)
                .environment(\.layoutDirection, .rightToLeft)
                .environment(\.locale, Locale(identifier: "ar"))
            Text("Verily, with hardship comes ease.").font(.subheadline)
            Text("Qur'an 94:5 — Ash-Sharh").font(.caption)
        }
        .multilineTextAlignment(.center).frame(maxWidth: .infinity).padding(.top, 12)
    }
}

// Lightweight vector artwork shares the website mascot’s cream, blush and lavender palette.
struct DoctorBunny: View {
    let activity: BunnyActivity
    var halloween = false
    var fall = false
    var newYear = false
    var mardi = false
    var beach = false
    var ramadan = false
    var body: some View {
        Canvas { context, size in
            context.scaleBy(x: size.width / 180, y: size.height / 220)
            let ink = Color(red: 0.533, green: 0.416, blue: 0.463)
            let cream = Color(red: 1, green: 0.977, blue: 0.933)
            let blush = Color(red: 0.953, green: 0.753, blue: 0.812)
            let lavender = Color(red: 0.882, green: 0.863, blue: 0.925)
            func oval(_ x: CGFloat, _ y: CGFloat, _ w: CGFloat, _ h: CGFloat, _ fill: Color, outline: Bool = true) {
                let p = Path(ellipseIn: CGRect(x: x, y: y, width: w, height: h))
                context.fill(p, with: .color(fill))
                if outline { context.stroke(p, with: .color(ink), lineWidth: 2.5) }
            }
            func line(_ points: [CGPoint], color: Color? = nil, width: CGFloat = 2.5) {
                var path = Path(); if let first = points.first { path.move(to: first) }
                for point in points.dropFirst() { path.addLine(to: point) }
                context.stroke(path, with: .color(color ?? ink), style: StrokeStyle(lineWidth: width, lineCap: .round, lineJoin: .round))
            }
            func box(_ x: CGFloat, _ y: CGFloat, _ w: CGFloat, _ h: CGFloat, _ fill: Color) {
                let path = Path(roundedRect: CGRect(x: x, y: y, width: w, height: h), cornerRadius: 6)
                context.fill(path, with: .color(fill)); context.stroke(path, with: .color(ink), lineWidth: 2)
            }
            func heart(_ x: CGFloat, _ y: CGFloat) {
                var p = Path(); p.move(to: CGPoint(x: x, y: y + 8))
                p.addCurve(to: CGPoint(x: x, y: y - 6), control1: CGPoint(x: x - 23, y: y - 5), control2: CGPoint(x: x - 8, y: y - 20))
                p.addCurve(to: CGPoint(x: x, y: y + 8), control1: CGPoint(x: x + 8, y: y - 20), control2: CGPoint(x: x + 23, y: y - 5))
                context.fill(p, with: .color(Palette.pink))
            }
            context.translateBy(x: 0, y: 14)
            oval(32, 181, 116, 13, lavender, outline: false)
            if activity == .jump || activity == .celebrate { context.translateBy(x: 0, y: -9) }
            // Trace the original bunny.svg ears and pink inner-ear strokes.
            var ears = Path()
            ears.move(to: CGPoint(x:49,y:70))
            ears.addCurve(to: CGPoint(x:65,y:14), control1: CGPoint(x:25,y:9), control2: CGPoint(x:49,y:-6))
            ears.addLine(to: CGPoint(x:77,y:65))
            ears.move(to: CGPoint(x:102,y:64)); ears.addLine(to: CGPoint(x:117,y:15))
            ears.addCurve(to: CGPoint(x:130,y:72), control1: CGPoint(x:132,y:-8), control2: CGPoint(x:153,y:10))
            context.fill(ears, with: .color(cream)); context.stroke(ears, with: .color(ink), lineWidth:2.5)
            var inner = Path(); inner.move(to:CGPoint(x:53,y:53))
            inner.addCurve(to:CGPoint(x:57,y:24),control1:CGPoint(x:41,y:19),control2:CGPoint(x:50,y:12))
            inner.addLine(to:CGPoint(x:67,y:56));inner.move(to:CGPoint(x:113,y:55));inner.addLine(to:CGPoint(x:124,y:24))
            inner.addCurve(to:CGPoint(x:128,y:57),control1:CGPoint(x:132,y:10),control2:CGPoint(x:141,y:20))
            context.stroke(inner,with:.color(blush),style:StrokeStyle(lineWidth:9,lineCap:.round))
            oval(48,164,36,20,cream); oval(97,164,36,20,cream)
            let raised = activity == .stretch || activity == .celebrate
            oval(31,raised ? 80 : 114,24,44,cream)
            oval(125,raised || activity == .wave ? 79 : 114,24,44,cream)
            box(49,111,82,61,.white)
            line([CGPoint(x:70,y:117),CGPoint(x:90,y:142),CGPoint(x:110,y:117)],color:lavender,width:8)
            line([CGPoint(x:90,y:142),CGPoint(x:90,y:169)],color:lavender,width:2)
            var head = Path(); head.move(to:CGPoint(x:42,y:89))
            head.addCurve(to:CGPoint(x:89,y:55),control1:CGPoint(x:42,y:59),control2:CGPoint(x:63,y:51))
            head.addCurve(to:CGPoint(x:140,y:91),control1:CGPoint(x:118,y:49),control2:CGPoint(x:143,y:63))
            head.addCurve(to:CGPoint(x:91,y:129),control1:CGPoint(x:141,y:116),control2:CGPoint(x:120,y:128))
            head.addCurve(to:CGPoint(x:42,y:89),control1:CGPoint(x:61,y:129),control2:CGPoint(x:41,y:115))
            context.fill(head,with:.color(cream));context.stroke(head,with:.color(ink),lineWidth:2.5)
            oval(49,97,20,12,blush,outline:false); oval(113,97,20,12,blush,outline:false)
            var pin = Path();pin.move(to:CGPoint(x:128,y:67))
            pin.addCurve(to:CGPoint(x:132,y:57),control1:CGPoint(x:113,y:57),control2:CGPoint(x:127,y:49))
            pin.addCurve(to:CGPoint(x:128,y:67),control1:CGPoint(x:140,y:49),control2:CGPoint(x:150,y:61))
            context.fill(pin,with:.color(Palette.pink))
            if activity == .nap {
                line([CGPoint(x:60,y:88),CGPoint(x:65,y:91),CGPoint(x:70,y:88)])
                line([CGPoint(x:110,y:88),CGPoint(x:115,y:91),CGPoint(x:120,y:88)])
                context.draw(Text("Z z").font(.system(size: 18, design: .serif)).foregroundColor(ink), at: CGPoint(x:149,y:27))
            } else { oval(63,88,4,7,ink,outline:false); oval(113,88,4,7,ink,outline:false) }
            line([CGPoint(x:85,y:99),CGPoint(x:90,y:103),CGPoint(x:95,y:99)],width:2)
            line([CGPoint(x:90,y:103),CGPoint(x:90,y:109),CGPoint(x:85,y:112),CGPoint(x:81,y:108)],width:2)
            line([CGPoint(x:90,y:109),CGPoint(x:95,y:112),CGPoint(x:99,y:108)],width:2)
            line([CGPoint(x:70,y:118),CGPoint(x:70,y:137),CGPoint(x:76,y:144),CGPoint(x:83,y:144),CGPoint(x:88,y:137),CGPoint(x:88,y:124)],color:ink,width:3)
            line([CGPoint(x:114,y:120),CGPoint(x:114,y:activity == .heartbeat ? 134 : 151)],width:3)
            oval(108,activity == .heartbeat ? 129 : 147,12,12,lavender)
            if halloween {
                let peach = Color(red: 0.96, green: 0.74, blue: 0.59)
                var hat = Path(); hat.move(to: CGPoint(x: 67, y: 59))
                hat.addLine(to: CGPoint(x: 84, y: 13)); hat.addLine(to: CGPoint(x: 113, y: 55)); hat.closeSubpath()
                context.fill(hat, with: .color(lavender)); context.stroke(hat, with: .color(ink), lineWidth: 2)
                oval(58, 52, 66, 12, lavender)
                line([CGPoint(x: 78, y: 43), CGPoint(x: 104, y: 43)], color: peach, width: 6)
                oval(107, 156, 24, 20, peach)
                line([CGPoint(x: 119, y: 156), CGPoint(x: 122, y: 151)], color: .green, width: 3)
                oval(113, 163, 2, 3, ink, outline: false); oval(122, 163, 2, 3, ink, outline: false)
            }
            func leaf(_ x: CGFloat, _ y: CGFloat) {
                var p = Path(); p.move(to: CGPoint(x:x, y:y+12))
                p.addQuadCurve(to: CGPoint(x:x-8,y:y-12), control: CGPoint(x:x-19,y:y+2))
                p.addLine(to: CGPoint(x:x,y:y-6)); p.addLine(to: CGPoint(x:x+7,y:y-17))
                p.addQuadCurve(to: CGPoint(x:x,y:y+12), control: CGPoint(x:x+20,y:y+1)); p.closeSubpath()
                context.fill(p, with: .color(Color(red:0.81,green:0.42,blue:0.41)))
                context.stroke(p, with: .color(ink), lineWidth:1.5)
                line([CGPoint(x:x,y:y+16),CGPoint(x:x,y:y-6)],width:1)
            }
            if fall || activity == .scarfCoffee {
                box(65,122,52,10,blush); box(101,128,12,28,blush)
            }
            if newYear {
                var hat = Path(); hat.move(to: CGPoint(x:70,y:60));hat.addLine(to:CGPoint(x:90,y:23));hat.addLine(to:CGPoint(x:110,y:60));hat.closeSubpath()
                context.fill(hat,with:.color(lavender));context.stroke(hat,with:.color(ink),lineWidth:2)
                line([CGPoint(x:76,y:51),CGPoint(x:104,y:51)],color:Color(red:0.81,green:0.69,blue:0.46),width:4)
                oval(86,20,8,8,blush)
            }
            let gold = Color(red:0.84,green:0.72,blue:0.43)
            let sage = Color(red:0.59,green:0.68,blue:0.52)
            if beach {
                oval(33,176,114,16,Color(red:0.92,green:0.85,blue:0.71),outline:false)
                oval(136,24,24,24,gold,outline:false)
            }
            if ramadan {
                oval(22,25,30,30,gold);oval(30,20,26,28,Color(red:0.91,green:0.93,blue:0.96),outline:false)
                box(50,174,82,15,Color(red:0.61,green:0.68,blue:0.78));line([CGPoint(x:57,y:180),CGPoint(x:125,y:180)],color:gold,width:2)
            }
            if mardi {
                var crown=Path();crown.move(to:CGPoint(x:68,y:58))
                for point in [CGPoint(x:65,y:40),CGPoint(x:79,y:48),CGPoint(x:90,y:32),CGPoint(x:101,y:48),CGPoint(x:115,y:40),CGPoint(x:112,y:58)] { crown.addLine(to:point) };crown.closeSubpath()
                context.fill(crown,with:.color(gold));context.stroke(crown,with:.color(ink),lineWidth:2)
                for i in 0..<13 { let a=Double(i)*Double.pi/12;oval(87+24*cos(a),119+17*sin(a),5,5,i.isMultiple(of:2) ? sage : lavender,outline:false) }
            }
            switch activity {
            case .museum:
                var roof=Path();roof.move(to:CGPoint(x:114,y:135));roof.addLine(to:CGPoint(x:138,y:121));roof.addLine(to:CGPoint(x:162,y:135));roof.closeSubpath()
                context.fill(roof,with:.color(lavender));context.stroke(roof,with:.color(ink),lineWidth:1.5)
                box(114,136,48,5,lavender)
                for x in [119.0,135.0,151.0] { box(x,141,6,30,cream) }
                box(111,172,54,6,lavender);oval(111,144,16,18,cream)
            case .blueCrab:
                let blue=Color(red:0.61,green:0.73,blue:0.82)
                for side in [-1.0,1.0] {
                    for y in [150.0,157.0,164.0] { line([CGPoint(x:90+side*18,y:y),CGPoint(x:90+side*31,y:y-5)],color:blue,width:2) }
                    line([CGPoint(x:90+side*16,y:149),CGPoint(x:90+side*28,y:137)],color:blue,width:3)
                    oval(83+side*29,126,14,16,blue)
                }
                oval(67,142,46,26,blue);oval(81,141,4,6,ink,outline:false);oval(95,141,4,6,ink,outline:false)
                oval(55,159,16,14,cream);oval(109,159,16,14,cream)
            case .trailWalk:
                for (y,w) in [(173.0,28.0),(159.0,33.0)] {
                    var tree=Path();tree.move(to:CGPoint(x:143-w/2,y:y));tree.addLine(to:CGPoint(x:143,y:y-28));tree.addLine(to:CGPoint(x:143+w/2,y:y));tree.closeSubpath();context.fill(tree,with:.color(sage));context.stroke(tree,with:.color(ink),lineWidth:1.5)
                }
                line([CGPoint(x:143,y:169),CGPoint(x:143,y:184)],width:3);line([CGPoint(x:122,y:143),CGPoint(x:126,y:183)],width:3);oval(113,139,16,18,cream)
            case .sandcastle:
                box(116,158,43,24,peach);box(126,143,23,17,peach)
                for x in [116.0,132.0,148.0] { box(x,153,11,8,peach) }
                line([CGPoint(x:137,y:143),CGPoint(x:137,y:124)],width:1.5)
                line([CGPoint(x:137,y:126),CGPoint(x:150,y:129)],color:blush,width:5)
                box(131,169,12,13,gold);oval(114,139,16,18,cream)
            case .seashell:
                var shell=Path();shell.move(to:CGPoint(x:124,y:145))
                shell.addQuadCurve(to:CGPoint(x:113,y:121),control:CGPoint(x:105,y:126))
                shell.addQuadCurve(to:CGPoint(x:124,y:119),control:CGPoint(x:116,y:111))
                shell.addQuadCurve(to:CGPoint(x:137,y:121),control:CGPoint(x:133,y:110))
                shell.addQuadCurve(to:CGPoint(x:124,y:145),control:CGPoint(x:147,y:128));shell.closeSubpath()
                context.fill(shell,with:.color(blush));context.stroke(shell,with:.color(ink),lineWidth:1.5)
                for x in [116.0,125.0,135.0] { line([CGPoint(x:124,y:142),CGPoint(x:x,y:122)],width:1) }
                oval(116,144,16,14,cream)
            case .beachRead:
                box(62,140,57,33,sage);line([CGPoint(x:90,y:142),CGPoint(x:90,y:171)],width:1)
                for y in [149.0,156.0,163.0] { line([CGPoint(x:68,y:y),CGPoint(x:83,y:y)],width:1);line([CGPoint(x:97,y:y),CGPoint(x:111,y:y)],width:1) }
                oval(53,148,16,18,cream);oval(113,148,16,18,cream)
            case .prayer:
                oval(65,113,16,26,cream);oval(99,113,16,26,cream)
            case .iftarDate:
                oval(61,150,62,14,gold)
                for x in [77.0,92.0,107.0] { oval(x-6,140,12,20,Color(red:0.64,green:0.45,blue:0.36));line([CGPoint(x:x,y:145),CGPoint(x:x-1,y:154)],width:1) }
                oval(53,142,16,18,cream);oval(116,142,16,18,cream)
            case .fasting:
                oval(66,144,20,14,cream);oval(94,144,20,14,cream);line([CGPoint(x:79,y:153),CGPoint(x:99,y:153)],width:1)
            case .crawfish:
                let coral=Color(red:0.89,green:0.61,blue:0.53)
                oval(58,140,68,12,lavender);oval(83,115,18,32,coral)
                for y in stride(from:126,through:141,by:5) { line([CGPoint(x:85,y:y),CGPoint(x:99,y:y)],width:1) }
                line([CGPoint(x:86,y:122),CGPoint(x:73,y:116),CGPoint(x:73,y:104)])
                line([CGPoint(x:98,y:122),CGPoint(x:111,y:116),CGPoint(x:111,y:104)])
                for x in [73.0,111.0] {
                    var claw=Path();claw.move(to:CGPoint(x:x,y:111));claw.addQuadCurve(to:CGPoint(x:x-7,y:95),control:CGPoint(x:x-12,y:106));claw.addLine(to:CGPoint(x:x,y:102));claw.addLine(to:CGPoint(x:x+6,y:95));claw.addQuadCurve(to:CGPoint(x:x,y:111),control:CGPoint(x:x+12,y:107));context.fill(claw,with:.color(coral));context.stroke(claw,with:.color(ink),lineWidth:2)
                }
                line([CGPoint(x:85,y:143),CGPoint(x:80,y:150),CGPoint(x:92,y:147),CGPoint(x:104,y:150),CGPoint(x:99,y:143)],color:coral,width:4)
                oval(51,128,16,18,cream);oval(118,128,16,18,cream)
            case .catchBeads:
                for i in 0..<18 { let a=Double(i)*Double.pi/9;oval(140+16*cos(a),97+22*sin(a),6,6,i.isMultiple(of:3) ? gold : i.isMultiple(of:2) ? sage : lavender) }
                line([CGPoint(x:136,y:140),CGPoint(x:145,y:123)]);oval(135,116,20,14,cream)
            case .kingCake:
                oval(56,155,70,14,lavender);oval(64,134,54,28,gold);oval(66,134,50,20,cream)
                for (x,color) in [(74.0,lavender),(91.0,sage),(108.0,gold)] { line([CGPoint(x:x-3,y:141),CGPoint(x:x+3,y:148)],color:color,width:5) }
                oval(82,139,18,8,gold);oval(56,144,16,18,cream);oval(111,144,16,18,cream)
            case .fireworks:
                for center in [CGPoint(x:26,y:53),CGPoint(x:151,y:38)] {
                    for i in 0..<8 {
                        let angle = Double(i) * .pi / 4
                        line([CGPoint(x:center.x + cos(angle)*5,y:center.y + sin(angle)*5),CGPoint(x:center.x + cos(angle)*18,y:center.y + sin(angle)*18)],color:i.isMultiple(of:2) ? Palette.pink : lavender,width:2)
                    }
                }
                oval(126,80,22,42,cream)
            case .ringBell:
                var bell = Path();bell.move(to:CGPoint(x:128,y:130));bell.addQuadCurve(to:CGPoint(x:132,y:116),control:CGPoint(x:132,y:125));bell.addQuadCurve(to:CGPoint(x:144,y:116),control:CGPoint(x:138,y:105));bell.addQuadCurve(to:CGPoint(x:148,y:130),control:CGPoint(x:144,y:125));bell.closeSubpath()
                context.fill(bell,with:.color(Color(red:0.88,green:0.75,blue:0.49)));context.stroke(bell,with:.color(ink),lineWidth:2)
                oval(135,130,6,6,blush);oval(128,135,18,14,cream)
                line([CGPoint(x:152,y:109),CGPoint(x:158,y:104)],color:Palette.pink)
            case .wishCard:
                box(63,136,56,36,Color(red:0.97,green:0.93,blue:0.85));line([CGPoint(x:91,y:138),CGPoint(x:91,y:170)],color:lavender,width:1)
                context.draw(Text("2027").font(.system(size:10,design:.serif)).foregroundColor(ink),at:CGPoint(x:77,y:151))
                heart(105,155);oval(53,146,16,20,cream);oval(114,146,16,20,cream)
            case .catchLeaf:
                oval(137,118,20,14,cream); leaf(147,110)
            case .gatherLeaves:
                leaf(55,176);leaf(76,183);leaf(98,177);leaf(126,181)
                oval(110,151,18,14,cream);leaf(105,145)
            case .pumpkin:
                let peach = Color(red:0.96,green:0.74,blue:0.59)
                oval(65,135,50,44,peach);oval(78,135,24,44,peach)
                line([CGPoint(x:90,y:135),CGPoint(x:94,y:129)],color:Color(red:0.55,green:0.61,blue:0.45),width:4)
                oval(58,149,16,20,cream);oval(106,149,16,20,cream)
            case .scarfCoffee:
                oval(113,121,18,17,.white);box(83,115,34,28,Color(red:0.87,green:0.77,blue:0.63))
                line([CGPoint(x:89,y:120),CGPoint(x:111,y:120)],color:ink,width:3)
                line([CGPoint(x:92,y:109),CGPoint(x:88,y:102),CGPoint(x:93,y:95)],color:lavender,width:1.5)
                oval(73,127,18,15,cream)

            case .heartbeat:
                oval(115,134,22,16,cream); heart(154,62)
            case .notes:
                box(82,133,38,43,cream);box(93,130,16,6,lavender)
                for y in stride(from: 146, through: 166, by: 7) { line([CGPoint(x:89,y:y),CGPoint(x:110,y:y)],color:lavender,width:2) }
                line([CGPoint(x:125,y:138),CGPoint(x:106,y:159)],color:Palette.pink,width:4)
            case .read:
                box(62,139,58,36,lavender);line([CGPoint(x:91,y:140),CGPoint(x:91,y:174)])
                for y in stride(from: 148, through: 168, by: 7) {
                    line([CGPoint(x:68,y:y),CGPoint(x:84,y:y)],width:1)
                    line([CGPoint(x:98,y:y),CGPoint(x:114,y:y)],width:1)
                }
            case .eat:
                oval(94,107,30,28,Color(red:0.875,green:0.73,blue:0.47))
                oval(102,113,4,4,ink,outline:false);oval(112,121,4,4,ink,outline:false)
                oval(116,107,10,10,cream,outline:false);oval(118,127,18,14,cream)
            case .tea:
                oval(107,135,22,22,.white);box(76,132,39,28,blush)
                line([CGPoint(x:88,y:128),CGPoint(x:85,y:120),CGPoint(x:89,y:113)],color:lavender,width:2)
            case .celebrate:
                heart(25,64);heart(155,57)
            case .wave:
                line([CGPoint(x:153,y:73),CGPoint(x:161,y:68)],color:Palette.pink)
            case .stretch:
                line([CGPoint(x:23,y:78),CGPoint(x:27,y:84)],color:Palette.pink)
            default: break
            }
        }
        .accessibilityLabel(activity.label)
    }
}
