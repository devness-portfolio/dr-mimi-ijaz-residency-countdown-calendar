import Foundation

enum Residency {
    // Match the website: midnight in the device's current timezone.
    static func milestones(timeZone: TimeZone = .current) -> (start: Date, end: Date) {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = timeZone
        return (calendar.date(from: DateComponents(year: 2022, month: 7, day: 1))!,
                calendar.date(from: DateComponents(year: 2027, month: 7, day: 1))!)
    }
    static let website = URL(string: "https://devness-portfolio.github.io/dr-mimi-ijaz-residency-countdown-calendar/")!
}

struct Countdown {
    let date: Date
    let end: Date
    let days: Int
    let progress: Double
    var complete: Bool { date >= end }
    var percentage: String { String(format: "%.1f%% complete", floor(progress * 1000) / 10) }
    init(date: Date, timeZone: TimeZone = .current) {
        let milestones = Residency.milestones(timeZone: timeZone)
        self.date = date
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
    case rest, jump, wave, heartbeat, notes, read, eat, tea, stretch, nap, celebrate

    static func at(_ date: Date, complete: Bool) -> BunnyActivity {
        if complete { return .celebrate }
        let slot = Int(floor(date.timeIntervalSince1970 / 1800))
        if slot.isMultiple(of: 2) { return .rest }
        let actions = allCases.filter { $0 != .rest }
        return actions[((slot / 2) % actions.count + actions.count) % actions.count]
    }

    var label: String {
        switch self {
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
