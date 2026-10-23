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

for zoneName in ["America/Chicago", "America/New_York", "UTC", "Asia/Karachi"] {
    let zone = TimeZone(identifier:zoneName)!
    var calendar = Calendar(identifier:.gregorian);calendar.timeZone = zone
    for (year,month,day,expected) in [(2026,12,24,""),(2026,12,25,"nye"),(2026,12,31,"nye"),(2027,1,1,"newyear"),(2027,1,2,"")] {
        let date = calendar.date(from:DateComponents(year:year,month:month,day:day))!
        assert(Countdown(date:date,timeZone:zone).season == expected)
        if !expected.isEmpty {
            let actions = Set((0..<12).map { BunnyActivity.at(date.addingTimeInterval(Double($0)*1800),complete:false,timeZone:zone) })
            assert(actions == Set([.rest,.fireworks,.ringBell,.wishCard]))
        }
    }
}
assert(Set(Residency.newYearPuns).count == 3 && Set(Residency.newYearAffirmations).count == 3)
print("New Year calendar boundaries, three scenes and resting intervals passed in four timezones.")

for zoneName in ["America/Chicago", "America/New_York", "UTC", "Asia/Karachi"] {
    let zone = TimeZone(identifier:zoneName)!
    var calendar = Calendar(identifier:.gregorian);calendar.timeZone = zone
    for (year,month,day,hour,minute,second,expected) in [(2027,1,5,23,59,59,""),(2027,1,6,0,0,0,"mardi"),(2027,2,7,23,59,59,"mardi"),(2027,2,8,0,0,0,"ramadan"),(2027,3,8,23,59,59,"ramadan"),(2027,3,9,0,0,0,""),(2028,1,6,0,0,0,"")] {
        let date=calendar.date(from:DateComponents(year:year,month:month,day:day,hour:hour,minute:minute,second:second))!
        assert(Countdown(date:date,timeZone:zone).season == expected)
    }
    let date=calendar.date(from:DateComponents(year:2027,month:1,day:6))!
    let actions=Set((0..<12).map { BunnyActivity.at(date.addingTimeInterval(Double($0)*1800),complete:false,timeZone:zone) })
    assert(actions == Set([.rest,.crawfish,.catchBeads,.kingCake]))
}
assert(Set(Residency.mardiPuns).count == 3 && Set(Residency.mardiAffirmations).count == 3)
print("Mardi Gras boundaries and three scenes passed in four timezones.")

for zoneName in ["America/Chicago", "America/New_York", "UTC", "Asia/Karachi"] {
    let zone = TimeZone(identifier:zoneName)!
    var calendar = Calendar(identifier:.gregorian);calendar.timeZone = zone
    let date=calendar.date(from:DateComponents(year:2027,month:2,day:15))!
    let actions=Set((0..<12).map { BunnyActivity.at(date.addingTimeInterval(Double($0)*1800),complete:false,timeZone:zone) })
    assert(actions == Set([.rest,.prayer,.iftarDate,.fasting]))
}
assert(Set(Residency.ramadanPuns).count == 3 && Set(Residency.ramadanAffirmations).count == 3)
print("Ramadan boundaries and three activities passed in four timezones.")

for zoneName in ["America/Chicago", "America/New_York", "UTC", "Asia/Karachi"] {
    let zone = TimeZone(identifier:zoneName)!
    var calendar = Calendar(identifier:.gregorian);calendar.timeZone = zone
    for (month,day,expected) in [(3,31,""),(4,1,"beach"),(4,30,"beach"),(5,1,"dmv")] {
        let date=calendar.date(from:DateComponents(year:2027,month:month,day:day))!
        assert(Countdown(date:date,timeZone:zone).season == expected)
    }
    let date=calendar.date(from:DateComponents(year:2027,month:4,day:15))!
    let actions=Set((0..<12).map { BunnyActivity.at(date.addingTimeInterval(Double($0)*1800),complete:false,timeZone:zone) })
    assert(actions == Set([.rest,.sandcastle,.seashell,.beachRead]))
}
assert(Set(Residency.beachPuns).count == 3 && Set(Residency.beachAffirmations).count == 3)
print("Beach boundaries and three activities passed in four timezones.")

for zoneName in ["America/Chicago", "America/New_York", "UTC", "Asia/Karachi"] {
    let zone = TimeZone(identifier:zoneName)!
    var calendar = Calendar(identifier:.gregorian);calendar.timeZone = zone
    for (month,day,expected) in [(4,30,"beach"),(5,1,"dmv"),(6,30,"dmv"),(7,1,"")] {
        let date=calendar.date(from:DateComponents(year:2027,month:month,day:day))!
        assert(Countdown(date:date,timeZone:zone).season == expected)
    }
    let date=calendar.date(from:DateComponents(year:2027,month:5,day:15))!
    let actions=Set((0..<12).map { BunnyActivity.at(date.addingTimeInterval(Double($0)*1800),complete:false,timeZone:zone) })
    assert(actions == Set([.rest,.museum,.blueCrab,.trailWalk]))
}
assert(Set(Residency.dmvPuns).count == 3 && Set(Residency.dmvAffirmations).count == 3)
print("DMV boundaries and three activities passed in four timezones.")
