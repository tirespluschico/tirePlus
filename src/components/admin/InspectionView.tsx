import type { InspectionStatus } from "@/lib/supabase/types";

interface InspectionItem {
  name: string;
  status: InspectionStatus;
  note: string | null;
}

interface InspectionViewProps {
  items: InspectionItem[];
}

const sections: {
  status: InspectionStatus;
  label: string;
  icon: string;
  bg: string;
  border: string;
  text: string;
  dot: string;
}[] = [
  {
    status: "red",
    label: "Needs Attention Now",
    icon: "🔴",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-400",
    dot: "bg-red-500",
  },
  {
    status: "yellow",
    label: "Needs Attention Soon",
    icon: "🟡",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
    text: "text-yellow-400",
    dot: "bg-yellow-400",
  },
  {
    status: "green",
    label: "Good Condition",
    icon: "🟢",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    text: "text-green-400",
    dot: "bg-green-500",
  },
];

export default function InspectionView({ items }: InspectionViewProps) {
  if (items.length === 0) {
    return (
      <p className="text-brand-muted text-sm">No inspection items recorded.</p>
    );
  }

  return (
    <div className="space-y-4">
      {sections.map((section) => {
        const sectionItems = items.filter((i) => i.status === section.status);
        if (sectionItems.length === 0) return null;

        return (
          <div
            key={section.status}
            className={`rounded-xl border ${section.border} ${section.bg} p-4`}
          >
            <h4 className={`text-sm font-semibold ${section.text} mb-3`}>
              {section.icon} {section.label}
            </h4>
            <div className="space-y-2">
              {sectionItems.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${section.dot} mt-1.5 shrink-0`}
                  />
                  <div>
                    <p className="text-white text-sm">{item.name}</p>
                    {item.note && (
                      <p className="text-brand-muted text-xs mt-0.5">
                        {item.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
