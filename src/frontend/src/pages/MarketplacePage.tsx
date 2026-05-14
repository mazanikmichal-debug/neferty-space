/**
 * MarketplacePage — Coming Soon placeholder.
 *
 * The NFT transfer functionality already lives in GalleryPage (Send button on each card).
 * Full marketplace (buy / sell / list) is coming in a future release.
 *
 * NOTE: Principal ID validation MUST always use:
 *   import { Principal } from "@dfinity/principal";
 *   try { Principal.fromText(val.trim()); return true; } catch { return false; }
 * Never use a regex pattern — the canonical implementation is in MintPage / NFTCard.
 */

import { motion } from "motion/react";

export default function MarketplacePage() {
  return (
    <div className="section-content flex-1 flex flex-col items-center justify-center min-h-[70vh] select-none">
      {/* Ambient glow orb */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
      >
        <div
          className="w-[560px] h-[560px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, oklch(0.65 0.25 300) 0%, oklch(0.55 0.22 260) 40%, transparent 70%)",
            filter: "blur(72px)",
          }}
        />
      </div>

      {/* Floating geometric rings */}
      <div aria-hidden="true" className="relative pointer-events-none">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border"
            style={{
              width: 180 + i * 80,
              height: 180 + i * 80,
              top: "50%",
              left: "50%",
              x: "-50%",
              y: "-50%",
              borderColor: `oklch(0.65 0.22 ${290 + i * 20} / ${0.18 - i * 0.04})`,
            }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{
              duration: 18 + i * 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-6 text-center px-6"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Liquid-glass icon container */}
        <motion.div
          className="w-28 h-28 rounded-[2rem] flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)",
            border: "1.5px solid rgba(255,255,255,0.15)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow:
              "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.18)",
          }}
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <span className="text-5xl" aria-hidden="true">
            ⇄
          </span>
        </motion.div>

        <div className="space-y-3">
          <h1
            className="font-display text-5xl md:text-6xl font-bold tracking-tight"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.92 0.08 280), oklch(0.75 0.22 300), oklch(0.65 0.20 260))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Trhovisko
          </h1>

          <motion.p
            className="font-display text-xl md:text-2xl font-semibold text-muted-foreground/70 uppercase tracking-[0.25em]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            Čoskoro
          </motion.p>
        </div>

        <motion.p
          className="text-sm text-muted-foreground max-w-xs leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Nakupuj a predávaj NFT na decentralizovanom trhovisku.
        </motion.p>

        {/* Animated dots */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.70 0.20 300), oklch(0.60 0.18 260))",
              }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 1.4,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.22,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
