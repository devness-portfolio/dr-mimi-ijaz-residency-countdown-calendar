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
        guard parts.year == 2026 else { return "" }
        if parts.month == 10 { return "halloween" }
        return parts.month == 11 && (parts.day ?? 31) <= 26 ? "fall" : ""
    }
    static func pun(_ date: Date, season: String) -> String {
        var puns = ["You’re un-be-leaf-able, Dr. Mimi.", "I love you a latte, meri jaan.",
                    "You autumn know how proud I am.", "You’re brew-tiful.", "Falling for you, one day at a time."]
        if season == "halloween" { puns += ["You’re doing fang-tastic.", "A little boo, a lot of love."] }
        let slot = Int(floor(date.timeIntervalSince1970 / 1800))
        return puns[(slot % puns.count + puns.count) % puns.count]
    }
    static let website = URL(string: "https://devness-portfolio.github.io/dr-mimi-ijaz-residency-countdown-calendar/")!
}

struct Countdown {
    let date: Date
    let season: String
    var halloween: Bool { season == "halloween" }
    var seasonalMessage: String { Residency.pun(date, season: season) }
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
    case rest, jump, wave, heartbeat, notes, read, eat, tea, stretch, nap, celebrate, catchLeaf, scarfCoffee, gatherLeaves, pumpkin

    static func at(_ date: Date, complete: Bool, timeZone: TimeZone = .current) -> BunnyActivity {
        if complete { return .celebrate }
        let slot = Int(floor(date.timeIntervalSince1970 / 1800))
        if slot.isMultiple(of: 2) { return .rest }
        let seasonal: [BunnyActivity] = [.catchLeaf, .scarfCoffee, .gatherLeaves, .pumpkin]
        let actions = Residency.season(date, timeZone: timeZone).isEmpty ? allCases.filter { $0 != .rest && !seasonal.contains($0) } : seasonal
        return actions[((slot / 2) % actions.count + actions.count) % actions.count]
    }

    var label: String {
        switch self {
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
