import { ActivitySummaryCard } from "@/features/kakeibo/components/ActivitySummaryCard";
import { CategoryManager } from "@/features/kakeibo/components/CategoryManager";
import { DangerZone } from "@/features/kakeibo/components/DangerZone";
import { ExportSection } from "@/features/kakeibo/components/ExportSection";
import { KakeiboExplainerSection } from "@/features/kakeibo/components/KakeiboExplainerSection";

export default function ProfilePage() {
  return (
    <div className="space-y-4">
      <ActivitySummaryCard />
      <CategoryManager />
      <ExportSection />
      <KakeiboExplainerSection />
      <DangerZone />
    </div>
  );
}
