import SwiftUI
import WidgetKit

struct ResidencyEntry: TimelineEntry {
    let date: Date
    var state: Countdown { Countdown(date: date) }
}
struct ResidencyProvider: TimelineProvider {
    func placeholder(in context: Context) -> ResidencyEntry { ResidencyEntry(date: .now) }
    func getSnapshot(in context: Context, completion: @escaping (ResidencyEntry) -> Void) {
        completion(ResidencyEntry(date: .now))
    }
    func getTimeline(in context: Context, completion: @escaping (Timeline<ResidencyEntry>) -> Void) {
        let now = Date()
        let entries = ([now] + BunnyActivity.refreshDates(after: now)).map { ResidencyEntry(date: $0) }
        // Half-hour poses plus exact day boundaries. WidgetKit controls presentation timing.
        completion(Timeline(entries: entries, policy: .after(now.addingTimeInterval(86400))))
    }
}
struct ResidencyWidgetView: View {
    @Environment(\.widgetFamily) private var family
    let entry: ResidencyEntry
    var body: some View {
        Group {
            #if os(iOS)
            switch family {
            case .accessoryCircular:
                Gauge(value: entry.state.progress) {
                    Image(systemName: "heart.fill")
                } currentValueLabel: {
                    if entry.state.complete { Image(systemName: "checkmark") }
                    else { Text("\(entry.state.days)") }
                }.gaugeStyle(.accessoryCircular)
                    .accessibilityLabel(entry.state.complete ? "Residency complete" : "\(entry.state.days) days left")
            case .accessoryRectangular:
                VStack(alignment: .leading) {
                    Text("Dr. Mimi Ijaz").font(.headline)
                    Text(entry.state.complete ? "YOU DID IT!" : "\(entry.state.days) days left")
                    Text(entry.state.complete ? "Alhamdulillah" : (!entry.state.season.isEmpty ? entry.state.seasonalMessage : "One day closer.")).font(.caption)
                }
            case .accessoryInline:
                Text(entry.state.complete ? "Mimi, YOU DID IT!" : "Mimi: \(entry.state.days) days left")
            default: card
            }
            #else
            card
            #endif
        }
        .containerBackground(for: .widget) { !entry.state.season.isEmpty ? Palette.halloweenBackground : Palette.background }
    }
    private var card: some View {
        CountdownCard(state: entry.state, compact: family == .systemSmall, expanded: family == .systemLarge)
    }
}
@main
struct ResidencyWidget: Widget {
    let kind = "ResidencyCountdown"
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: ResidencyProvider()) { entry in
            ResidencyWidgetView(entry: entry)
        }
        .configurationDisplayName("Residency Countdown")
        .description("A little love for Dr. Mimi Ijaz, every day until residency is complete.")
        #if os(iOS)
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge, .accessoryCircular, .accessoryRectangular, .accessoryInline])
        #else
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
        #endif
    }
}
