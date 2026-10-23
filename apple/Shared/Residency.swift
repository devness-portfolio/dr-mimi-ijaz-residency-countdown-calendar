import Foundation

enum Residency {
    // Match the website: midnight in the device's current timezone.
    static func milestones(timeZone: TimeZone = .current) -> (start: Date, end: Date) {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = timeZone
        return (calendar.date(from: DateComponents(year: 2022, month: 7, day: 1))!,
                calendar.date(from: DateComponents(year: 2027, month: 7, day: 1))!)
    }
    static func season(_ date: Date, timeZone: TimeZone = .current) -> String {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = timeZone
        let parts = calendar.dateComponents([.year, .month, .day], from: date)
        if parts.year == 2027 && [5,6].contains(parts.month ?? 0) { return "dmv" }
        if parts.year == 2027 && parts.month == 4 { return "beach" }
        // Expected civil dates, with precedence over overlapping Carnival days.
        if parts.year == 2027 && ((parts.month == 2 && (parts.day ?? 0) >= 8) || (parts.month == 3 && (parts.day ?? 31) <= 8)) { return "ramadan" }
        if parts.year == 2027 && ((parts.month == 1 && (parts.day ?? 0) >= 6) || (parts.month == 2 && (parts.day ?? 31) <= 9)) { return "mardi" }
        if parts.year == 2026 && parts.month == 12 && (parts.day ?? 0) >= 25 { return "nye" }
        if parts.year == 2027 && parts.month == 1 && parts.day == 1 { return "newyear" }
        guard parts.year == 2026 else { return "" }
        if parts.month == 10 { return "halloween" }
        return parts.month == 11 && (parts.day ?? 31) <= 26 ? "fall" : ""
    }
    static let newYearPuns = ["You’re the spark of my year.", "Ring in the year. You’ve already won my heart.", "My New Year’s resolution? More you."]
    static let newYearAffirmations = ["You make the future look bright, meri jaan.", "Every little victory deserves to be celebrated.", "Your next chapter is worth believing in, Dr. Mimi."]
    static let dmvPuns = ["You’re a national treasure, Dr. Mimi.", "You’re claw-some, hon.", "Virginia is for lovers. I’m here for you."]
    static let dmvAffirmations = ["Your curiosity and care make the world a brighter place.", "Even when the day gets crabby, your kindness shines through.", "One step at a time, meri jaan. You are so close to your next adventure."]
    static let beachPuns = ["You’re sand-sational, Dr. Mimi.", "Shell yeah, I believe in you.", "You deserve a shore break, meri jaan."]
    static let beachAffirmations = ["Every small step is building your beautiful next chapter.", "Your kindness leaves something lovely wherever you go.", "Rest belongs in your story, too. Take a little time for yourself."]
    static let ramadanPuns = ["You’re my favorite prayer-tner.", "My favorite date is iftar with you.", "Running on empty, still full of heart."]
    static let ramadanAffirmations = ["May your quiet moments bring peace to your busy days.", "You deserve sweetness, nourishment, and a gentle evening.", "Take it one moment at a time, meri jaan. Your effort matters."]
    static let mardiPuns = ["You’re craw-some, Dr. Mimi.", "I bead-lieve in you, meri jaan.", "You take the cake, my queen."]
    static let mardiAffirmations = ["Even on the hard days, you bring so much heart.", "Every small win belongs in your parade.", "You deserve a little sweetness between rounds."]
    static func isNewYear(_ season: String) -> Bool { season == "nye" || season == "newyear" }
    static func pun(_ date: Date, season: String) -> String {
        var puns = ["You’re un-be-leaf-able, Dr. Mimi.", "I love you a latte, meri jaan.",
                    "You autumn know how proud I am.", "You’re brew-tiful.", "Falling for you, one day at a time."]
        if season == "halloween" { puns += ["You’re doing fang-tastic.", "A little boo, a lot of love."] }
        if isNewYear(season) { puns = newYearPuns }
        if season == "dmv" { puns = dmvPuns }
        if season == "beach" { puns = beachPuns }
        if season == "ramadan" { puns = ramadanPuns }
        if season == "mardi" { puns = mardiPuns }
        let slot = Int(floor(date.timeIntervalSince1970 / 1800))
        return puns[(slot % puns.count + puns.count) % puns.count]
    }
    static let website = URL(string: "https://devness-portfolio.github.io/dr-mimi-ijaz-residency-countdown-calendar/")!
}

struct Countdown {
    let date: Date
    let season: String
    var halloween: Bool { season == "halloween" }
    var newYear: Bool { Residency.isNewYear(season) }
    var seasonalMessage: String {
        let activity = BunnyActivity.at(date, complete: complete)
        if season == "dmv" {
            if let index = [BunnyActivity.museum, .blueCrab, .trailWalk].firstIndex(of: activity) {
                return Residency.dmvPuns[index] + " " + Residency.dmvAffirmations[index]
            }
            return "Three places, one favorite person. Almost home, meri jaan."
        }
        if season == "beach" {
            if let index = [BunnyActivity.sandcastle, .seashell, .beachRead].firstIndex(of: activity) {
                return Residency.beachPuns[index] + " " + Residency.beachAffirmations[index]
            }
            return "A little sunshine, a whole lot of love. Take a shore break, Mimi."
        }
        if season == "ramadan" {
            if let index = [BunnyActivity.prayer, .iftarDate, .fasting].firstIndex(of: activity) {
                return Residency.ramadanPuns[index] + " " + Residency.ramadanAffirmations[index]
            }
            return "Ramadan Mubarak, meri jaan. May this month bring you peace."
        }
        if season == "mardi" {
            if let index = [BunnyActivity.crawfish, .catchBeads, .kingCake].firstIndex(of: activity) {
                return Residency.mardiPuns[index] + " " + Residency.mardiAffirmations[index]
            }
            return "A little krewe, a whole lot of love."
        }
        if newYear, let index = [BunnyActivity.fireworks, .ringBell, .wishCard].firstIndex(of: activity) {
            return Residency.newYearPuns[index] + " " + Residency.newYearAffirmations[index]
        }
        return newYear ? "A fresh year. The same love, always." : Residency.pun(date, season: season)
    }
    let end: Date
    let days: Int
    let progress: Double
    var complete: Bool { date >= end }
    var percentage: String { String(format: "%.1f%% complete", floor(progress * 1000) / 10) }
    init(date: Date, timeZone: TimeZone = .current) {
        let milestones = Residency.milestones(timeZone: timeZone)
        self.date = date
        season = date < milestones.end ? Residency.season(date, timeZone: timeZone) : ""
        end = milestones.end
        days = Int(ceil(max(0, end.timeIntervalSince(date)) / 86400))
        progress = min(1, max(0, date.timeIntervalSince(milestones.start) / end.timeIntervalSince(milestones.start)))
    }
    // Elapsed 24-hour boundaries match ceil(days) across DST. Include completion.
    static func refreshDates(after date: Date, timeZone: TimeZone = .current) -> [Date] {
        let state = Countdown(date: date, timeZone: timeZone)
        guard !state.complete else { return [] }
        let next = state.end.addingTimeInterval(-Double(state.days - 1) * 86400)
        return (0..<8).map { next.addingTimeInterval(Double($0) * 86400) }.filter { $0 <= state.end }
    }
}

// Widget poses change at half-hour timeline entries; the system controls delivery.
enum BunnyActivity: String, CaseIterable {
    case rest, jump, wave, heartbeat, notes, read, eat, tea, stretch, nap, celebrate, catchLeaf, scarfCoffee, gatherLeaves, pumpkin, fireworks, ringBell, wishCard, crawfish, catchBeads, kingCake, prayer, iftarDate, fasting, sandcastle, seashell, beachRead, museum, blueCrab, trailWalk

    static func at(_ date: Date, complete: Bool, timeZone: TimeZone = .current) -> BunnyActivity {
        if complete { return .celebrate }
        let slot = Int(floor(date.timeIntervalSince1970 / 1800))
        if slot.isMultiple(of: 2) { return .rest }
        let seasonal: [BunnyActivity] = [.catchLeaf, .scarfCoffee, .gatherLeaves, .pumpkin]
        let newYear: [BunnyActivity] = [.fireworks, .ringBell, .wishCard]
        let dmv: [BunnyActivity] = [.museum, .blueCrab, .trailWalk]
        let beach: [BunnyActivity] = [.sandcastle, .seashell, .beachRead]
        let ramadan: [BunnyActivity] = [.prayer, .iftarDate, .fasting]
        let mardi: [BunnyActivity] = [.crawfish, .catchBeads, .kingCake]
        let season = Residency.season(date, timeZone: timeZone)
        let actions = season == "dmv" ? dmv : season == "beach" ? beach : season == "ramadan" ? ramadan : season == "mardi" ? mardi : Residency.isNewYear(season) ? newYear : season.isEmpty ? allCases.filter { $0 != .rest && !seasonal.contains($0) && !newYear.contains($0) && !mardi.contains($0) && !ramadan.contains($0) && !beach.contains($0) && !dmv.contains($0) } : seasonal
        return actions[((slot / 2) % actions.count + actions.count) % actions.count]
    }

    var label: String {
        switch self {
        case .museum: return "Doctor bunny visiting a DC museum"
        case .blueCrab: return "Doctor bunny enjoying Maryland blue crab"
        case .trailWalk: return "Doctor bunny walking a Virginia trail"
        case .sandcastle: return "Doctor bunny building a sandcastle"
        case .seashell: return "Doctor bunny collecting a seashell"
        case .beachRead: return "Doctor bunny reading at the beach"
        case .prayer: return "Doctor bunny making dua on a prayer mat"
        case .iftarDate: return "Doctor bunny holding dates for iftar"
        case .fasting: return "Doctor bunny resting patiently while fasting"
        case .crawfish: return "Doctor bunny enjoying crawfish"
        case .catchBeads: return "Doctor bunny catching Mardi Gras beads"
        case .kingCake: return "Doctor bunny enjoying king cake"
        case .fireworks: return "Doctor bunny watching fireworks"
        case .ringBell: return "Doctor bunny ringing a New Year bell"
        case .wishCard: return "Doctor bunny opening a New Year wish card"
        case .catchLeaf: return "Doctor bunny catching a red leaf"
        case .scarfCoffee: return "Doctor bunny drinking coffee in a cozy scarf"
        case .gatherLeaves: return "Doctor bunny gathering fall leaves"
        case .pumpkin: return "Doctor bunny hugging a pumpkin"
        case .rest: return "Doctor bunny resting"
        case .jump: return "Doctor bunny jumping happily"
        case .wave: return "Doctor bunny waving"
        case .heartbeat: return "Doctor bunny checking its heartbeat"
        case .notes: return "Doctor bunny taking notes"
        case .read: return "Doctor bunny reading a medical book"
        case .eat: return "Doctor bunny enjoying a snack"
        case .tea: return "Doctor bunny sipping tea"
        case .stretch: return "Doctor bunny stretching"
        case .nap: return "Doctor bunny napping"
        case .celebrate: return "Doctor bunny celebrating"
        }
    }
    var message: String {
        switch self {
        case .notes, .read: return "You make a difference, Dr. Mimi."
        case .eat: return "Prescription: a little snack break."
        case .tea: return "Doctor’s orders: a tiny tea break."
        case .nap, .stretch: return "A little rest is part of the treatment."
        case .heartbeat: return "Your kindness is part of the treatment."
        case .celebrate: return "So proud of you, Dr. Mimi."
        default: return "One day closer, meri jaan."
        }
    }
    static func refreshDates(after date: Date, timeZone: TimeZone = .current) -> [Date] {
        let next = (floor(date.timeIntervalSince1970 / 1800) + 1) * 1800
        let poses = (0..<48).map { Date(timeIntervalSince1970: next + Double($0) * 1800) }
        return Array(Set(poses + Countdown.refreshDates(after: date, timeZone: timeZone))).sorted()
    }
}
