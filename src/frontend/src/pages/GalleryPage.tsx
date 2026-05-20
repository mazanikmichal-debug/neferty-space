import { MintHistoryPanel } from "@/components/MintHistoryPanel";
import { useTranslation } from "react-i18next";

export default function GalleryPage() {
  const { t } = useTranslation();

  return (
    <div className="section-content space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <span className="text-5xl" aria-hidden="true">
          ▦
        </span>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight">
          {t("messages.galleryTitle")}
        </h1>
      </div>

      {/* Gallery — MintHistoryPanel with all view modes */}
      <MintHistoryPanel />
    </div>
  );
}
