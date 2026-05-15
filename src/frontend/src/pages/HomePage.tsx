import { Link } from "@tanstack/react-router";
import { Images, Sparkles, Star, Store } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

const HUB_SECTIONS: Array<{
  to: string;
  Icon: LucideIcon;
  key: string;
  ocid: string;
}> = [
  { to: "/mint", Icon: Sparkles, key: "mint", ocid: "home.mint_card" },
  {
    to: "/marketplace",
    Icon: Store,
    key: "marketplace",
    ocid: "home.marketplace_card",
  },
  { to: "/gallery", Icon: Images, key: "gallery", ocid: "home.gallery_card" },
  { to: "/rating", Icon: Star, key: "rating", ocid: "home.rating_card" },
];

export default function HomePage() {
  const { t } = useTranslation();
  return (
    <div className="section-content flex flex-col items-center justify-center min-h-[70vh]">
      <div className="hub-card-grid" data-ocid="home.hub_grid">
        {HUB_SECTIONS.map((section) => (
          <Link
            key={section.to}
            to={section.to}
            data-ocid={section.ocid}
            className="hub-card no-underline"
          >
            <section.Icon
              className="w-20 h-20 text-white"
              strokeWidth={1.2}
              aria-hidden="true"
            />
            <span className="text-base font-display font-bold uppercase tracking-widest text-white">
              {t(`nav.${section.key}` as const)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
