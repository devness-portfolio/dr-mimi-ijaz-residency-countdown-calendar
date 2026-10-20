import Foundation
for zoneName in ["America/Chicago", "America/New_York", "UTC", "Asia/Karachi"] {
    let zone = TimeZone(identifier: zoneName)!
    let dates = Residency.milestones(timeZone: zone)
    let start = Countdown(date: dates.start, timeZone: zone)
    assert(start.progress == 0 && !start.complete)
    assert(Countdown(date: dates.start.addingTimeInterval(-86400), timeZone: zone).progress == 0)
    let lastSecond = Countdown(date: dates.end.addingTimeInterval(-1), timeZone: zone)
    assert(lastSecond.days == 1 && !lastSecond.complete && lastSecond.percentage == "99.9% complete")
    for offset in [0.0, 1.0, 86400.0] {
        let finished = Countdown(date: dates.end.addingTimeInterval(offset), timeZone: zone)
        assert(finished.complete && finished.days == 0 && finished.progress == 1)
    }
    let boundary = dates.end.addingTimeInterval(-86400 * 3)
    assert(Countdown(date: boundary.addingTimeInterval(-1), timeZone: zone).days == 4)
    assert(Countdown(date: boundary, timeZone: zone).days == 3)
    let timeline = Countdown.refreshDates(after: boundary.addingTimeInterval(-1), timeZone: zone)
    assert(timeline.first == boundary && timeline.last == dates.end)
    assert(Countdown.refreshDates(after: dates.end, timeZone: zone).isEmpty)
    var calendar = Calendar(identifier: .gregorian)
    calendar.timeZone = zone
    for day in [7, 8, 9] {
        let date = calendar.date(from: DateComponents(year: 2027, month: 3, day: day, hour: 12))!
        let state = Countdown(date: date, timeZone: zone)
        let next = Countdown.refreshDates(after: date, timeZone: zone).first!
        assert(next > date && next.timeIntervalSince(date) <= 86400)
        assert(Countdown(date: next, timeZone: zone).days == state.days - 1)
    }
}
print("Countdown boundary, completion, timezone, DST, progress, and timeline checks passed.")

let sample = Date(timeIntervalSince1970: 1791345600)
let poses = (0..<40).map { BunnyActivity.at(sample.addingTimeInterval(Double($0) * 1800), complete: false) }
assert(Set(poses) == Set([.rest, .catchLeaf, .scarfCoffee, .gatherLeaves, .pumpkin]))
assert(poses.filter { $0 == .rest }.count == 20)
assert(BunnyActivity.at(sample, complete: true) == .celebrate)
let poseDates = BunnyActivity.refreshDates(after: sample)
assert(poseDates == poseDates.sorted() && Set(poseDates).count == poseDates.count)
assert(poseDates.allSatisfy { $0 > sample })
assert(poseDates.first!.timeIntervalSince(sample) <= 1800)
let completion = Residency.milestones().end
assert(BunnyActivity.refreshDates(after: completion.addingTimeInterval(-1)).contains(completion))
print("Bunny pose rotation, resting intervals, completion and timeline ordering checks passed.")

for zoneName in ["America/Chicago", "UTC", "Asia/Karachi"] {
    let zone = TimeZone(identifier: zoneName)!
    var calendar = Calendar(identifier: .gregorian); calendar.timeZone = zone
    for (year, month, day, expected) in [(2026,9,30,false),(2026,10,1,true),(2026,10,31,true),(2026,11,1,false),(2027,10,20,false)] {
        let date = calendar.date(from: DateComponents(year: year, month: month, day: day))!
        assert(Countdown(date: date, timeZone: zone).halloween == expected)
    }
}
print("Halloween local calendar boundaries passed in three timezones.")

for zoneName in ["America/Chicago", "UTC", "Asia/Karachi"] {
    let zone = TimeZone(identifier:zoneName)!
    var calendar = Calendar(identifier:.gregorian); calendar.timeZone = zone
    for (month,day,expected) in [(10,31,"halloween"),(11,1,"fall"),(11,10,"fall"),(11,26,"fall"),(11,27,"")] {
        let date = calendar.date(from:DateComponents(year:2026,month:month,day:day,hour:23,minute:59,second:59))!
        assert(Countdown(date:date,timeZone:zone).season == expected)
    }
    let end = calendar.date(from:DateComponents(year:2026,month:11,day:27))!
    assert(Countdown(date:end,timeZone:zone).season.isEmpty)
}
let october = Date(timeIntervalSince1970:1791345600)
let november = october.addingTimeInterval(86400 * 31)
let fallPuns = Set((0..<14).map { Residency.pun(november.addingTimeInterval(Double($0)*1800),season:"fall") })
assert(fallPuns.count == 5 && !fallPuns.contains("You’re doing fang-tastic."))
print("Thanksgiving cutoff, fall transition, and rotating pun checks passed.")
