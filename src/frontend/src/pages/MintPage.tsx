import { MintHistoryPanel } from "@/components/MintHistoryPanel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAddressHistory } from "@/hooks/useAddressHistory";
import { useMintNFT } from "@/hooks/useQueries";
import { Principal } from "@dfinity/principal";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export default function MintPage() {
  const navigate = useNavigate();
  const mintMutation = useMintNFT();
  const fileRef = useRef<HTMLInputElement>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [phase, setPhase] = useState<"idle" | "minting" | "error">("idle");
  const [errors, setErrors] = useState<{
    name?: string;
    image?: string;
    recipient?: string;
    submit?: string;
  }>({});
  const [dragOver, setDragOver] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [recipientFocused, setRecipientFocused] = useState(false);
  const { addresses: savedAddresses, saveAddress } = useAddressHistory();

  const filteredSuggestions = savedAddresses
    .filter((a) =>
      recipientId.trim()
        ? a.toLowerCase().includes(recipientId.trim().toLowerCase())
        : true,
    )
    .slice(0, 5);

  function truncateMid(addr: string, keep = 10) {
    if (addr.length <= keep * 2 + 3) return addr;
    return `${addr.slice(0, keep)}…${addr.slice(-6)}`;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: undefined }));
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: undefined }));
  };

  const validateRecipient = (val: string): string | undefined => {
    if (!val.trim()) return undefined;
    try {
      Principal.fromText(val.trim());
      return undefined;
    } catch {
      return "Neplatné Principal ID.";
    }
  };

  const validate = () => {
    const errs: { name?: string; image?: string; recipient?: string } = {};
    if (!name.trim()) errs.name = "Zadajte názov NFT.";
    if (!imageFile) errs.image = "Vyberte obrázok.";
    const recipientErr = validateRecipient(recipientId);
    if (recipientErr) errs.recipient = recipientErr;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !imageFile) return;
    setErrors((prev) => ({ ...prev, submit: undefined }));
    setPhase("minting");
    try {
      const _tokenId = await mintMutation.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        imageFile,
        recipientId: recipientId.trim() || undefined,
        isPublic,
      });
      if (recipientId.trim()) saveAddress(recipientId.trim());
      setShowSuccess(true);
    } catch (err) {
      console.error("[MintPage] mintNFT failed:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "Razenie sa nepodarilo. Skúste znova.";
      setErrors((prev) => ({ ...prev, submit: msg }));
      setPhase("error");
      setTimeout(() => {
        setPhase("idle");
      }, 1500);
    }
  };

  useEffect(() => {
    if (!showSuccess) return;
    const t = setTimeout(() => navigate({ to: "/" }), 2500);
    return () => clearTimeout(t);
  }, [showSuccess, navigate]);

  const isBusy = mintMutation.isPending;
  const showProgress = phase === "minting" || phase === "error";
  const phaseLabel =
    phase === "minting"
      ? "Razenie..."
      : phase === "error"
        ? "Chyba"
        : "Vyraziť NFT";

  return (
    <>
      {showSuccess && (
        <div
          data-ocid="mint.success_state"
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            background: "rgba(8,5,24,0.72)",
          }}
          aria-live="assertive"
          aria-label="NFT vyrazené"
        >
          <div
            className="flex flex-col items-center gap-6 rounded-3xl px-14 py-12"
            style={{
              background: "rgba(255,255,255,0.06)",
              border:
                "1px solid rgba(var(--theme-color-1-rgb,255,255,255),0.18)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow:
                "0 8px 40px 0 rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12)",
            }}
          >
            <svg
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-24 h-24"
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id="ck-grad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor={"rgb(var(--theme-color-1-rgb,180,80,220))"}
                  />
                  <stop
                    offset="50%"
                    stopColor={"rgb(var(--theme-color-2-rgb,230,100,180))"}
                  />
                  <stop
                    offset="100%"
                    stopColor={"rgb(var(--theme-color-3-rgb,255,180,60))"}
                  />
                </linearGradient>
              </defs>
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="url(#ck-grad)"
                strokeWidth="3"
                fill="none"
                strokeDasharray="226"
                strokeDashoffset="226"
                style={{
                  animation:
                    "mint-circle 0.5s 0.1s cubic-bezier(0.4,0,0.2,1) forwards",
                }}
              />
              <polyline
                points="22,42 35,55 58,30"
                stroke="url(#ck-grad)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                strokeDasharray="55"
                strokeDashoffset="55"
                style={{
                  animation:
                    "mint-check 0.4s 0.55s cubic-bezier(0.4,0,0.2,1) forwards",
                }}
              />
            </svg>
            <span
              className="font-display font-bold text-2xl tracking-widest uppercase gradient-text"
              style={{ animation: "mint-fade 0.4s 0.85s both" }}
            >
              Vyrazené!
            </span>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8 flex items-center gap-4">
          <span className="text-5xl" aria-hidden="true">
            ⧁
          </span>
          <h1 className="font-display text-3xl font-bold tracking-tight gradient-text">
            Raziť NFT
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left column — mint form */}
          <div className="w-full lg:max-w-[448px] shrink-0">
            <div className="glass-card rounded-3xl p-8">
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Image upload */}
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
                    Vyberte obrázok
                  </Label>
                  <button
                    type="button"
                    data-ocid="mint.dropzone"
                    tabIndex={0}
                    aria-label="Vyberte obrázok"
                    className={`mt-1.5 w-full rounded-2xl transition-smooth cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring text-left ${
                      dragOver ? "bg-white/[0.08]" : errors.image ? "" : ""
                    }`}
                    style={{
                      background: dragOver
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(255,255,255,0.04)",
                      border: errors.image
                        ? "1.5px dashed rgba(239,68,68,0.6)"
                        : dragOver
                          ? "1.5px dashed rgba(255,255,255,0.45)"
                          : "1.5px dashed rgba(255,255,255,0.18)",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                    }}
                    onClick={() => fileRef.current?.click()}
                    onKeyDown={(e) =>
                      e.key === "Enter" && fileRef.current?.click()
                    }
                    onDrop={handleDrop}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                  >
                    {imagePreview ? (
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Náhľad obrázka"
                          className="w-full h-full object-contain bg-muted"
                        />
                        <button
                          type="button"
                          aria-label="Odstrániť obrázok"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageFile(null);
                            setImagePreview(null);
                            if (fileRef.current) fileRef.current.value = "";
                          }}
                          className="absolute top-2 right-2 glass-card rounded-xl text-xs px-3 py-1.5 font-semibold uppercase hover:bg-white/10 transition-smooth text-foreground"
                        >
                          Odstrániť
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 px-4 gap-3 text-center">
                        <div className="w-10 h-10 rounded-xl glass-card flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-muted-foreground"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                            />
                          </svg>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <span className="text-foreground font-semibold">
                            Nahrať obrázok
                          </span>
                          <br />
                          <span className="text-xs">
                            alebo pretáhnite súbor sem
                          </span>
                        </p>
                        <span className="text-xs text-muted-foreground/60">
                          PNG, JPG, GIF, WEBP
                        </span>
                      </div>
                    )}
                  </button>
                  <input
                    ref={fileRef}
                    data-ocid="mint.upload_button"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {errors.image && (
                    <p
                      data-ocid="mint.image.field_error"
                      className="text-xs text-destructive mt-1"
                    >
                      {errors.image}
                    </p>
                  )}
                </div>

                {/* Name */}
                <div>
                  <Label
                    htmlFor="nft-name"
                    className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50"
                  >
                    Názov NFT
                  </Label>
                  <Input
                    id="nft-name"
                    data-ocid="mint.name_input"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (e.target.value.trim())
                        setErrors((p) => ({ ...p, name: undefined }));
                    }}
                    onBlur={() => {
                      if (!name.trim())
                        setErrors((p) => ({
                          ...p,
                          name: "Zadajte názov NFT.",
                        }));
                    }}
                    placeholder="napr. Môj prvý NFT"
                    className={`mt-1.5 rounded-2xl text-sm text-white/90 placeholder:text-white/30 border-0 outline-none focus-visible:ring-1 ${
                      errors.name
                        ? "ring-1 ring-destructive"
                        : "focus-visible:ring-white/30"
                    }`}
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: errors.name
                        ? "1px solid rgba(239,68,68,0.6)"
                        : "1px solid rgba(255,255,255,0.14)",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                    }}
                  />
                  {errors.name && (
                    <p
                      data-ocid="mint.name.field_error"
                      className="text-xs text-destructive mt-1"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Recipient (optional) */}
                <div>
                  <Label
                    htmlFor="nft-recipient"
                    className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50"
                  >
                    Príjemca{" "}
                    <span className="font-normal normal-case tracking-normal text-white/30">
                      (voliteľné)
                    </span>
                  </Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="nft-recipient"
                      data-ocid="mint.recipient_input"
                      value={recipientId}
                      onChange={(e) => {
                        setRecipientId(e.target.value);
                        if (!e.target.value.trim())
                          setErrors((p) => ({ ...p, recipient: undefined }));
                        else {
                          const err = validateRecipient(e.target.value);
                          if (!err)
                            setErrors((p) => ({ ...p, recipient: undefined }));
                        }
                      }}
                      onFocus={() => setRecipientFocused(true)}
                      onBlur={() => {
                        setTimeout(() => setRecipientFocused(false), 150);
                        const err = validateRecipient(recipientId);
                        setErrors((p) => ({ ...p, recipient: err }));
                      }}
                      placeholder="aaaaa-bbbbb-...-cai alebo principal ID"
                      className={`rounded-2xl text-sm text-white/90 placeholder:text-white/30 border-0 outline-none focus-visible:ring-1 ${
                        errors.recipient
                          ? "ring-1 ring-destructive"
                          : "focus-visible:ring-white/30"
                      }`}
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        border: errors.recipient
                          ? "1px solid rgba(239,68,68,0.6)"
                          : "1px solid rgba(255,255,255,0.14)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                      }}
                    />

                    {recipientFocused && filteredSuggestions.length > 0 && (
                      <div
                        data-ocid="mint.recipient_suggestions"
                        aria-label="Nedávne adresy"
                        className="absolute z-30 left-0 right-0 top-full mt-1 rounded-2xl overflow-hidden flex flex-col"
                        style={{
                          background: "rgba(18,12,40,0.92)",
                          border: "1px solid rgba(255,255,255,0.14)",
                          backdropFilter: "blur(20px)",
                          WebkitBackdropFilter: "blur(20px)",
                          boxShadow: "0 8px 32px rgba(0,0,0,0.55)",
                          animation: "mint-fade 0.15s both",
                        }}
                      >
                        <p className="px-3 pt-2 pb-1 text-[9px] font-semibold uppercase tracking-widest text-white/30">
                          Nedávne adresy
                        </p>
                        {filteredSuggestions.map((addr) => (
                          <button
                            key={addr}
                            type="button"
                            onClick={() => {
                              setRecipientId(addr);
                              setErrors((p) => ({
                                ...p,
                                recipient: undefined,
                              }));
                              setRecipientFocused(false);
                            }}
                            className="flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-white/[0.07] transition-colors group"
                          >
                            <svg
                              className="w-3 h-3 text-white/30 shrink-0 group-hover:text-white/60 transition-colors"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              aria-hidden="true"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span className="font-mono text-[11px] text-white/70 group-hover:text-white/95 transition-colors truncate">
                              {truncateMid(addr)}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.recipient && (
                    <p
                      data-ocid="mint.recipient.field_error"
                      className="text-xs text-destructive mt-1"
                    >
                      {errors.recipient}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <Label
                    htmlFor="nft-desc"
                    className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50"
                  >
                    Popis{" "}
                    <span className="font-normal normal-case tracking-normal text-white/30">
                      (voliteľný)
                    </span>
                  </Label>
                  <Textarea
                    id="nft-desc"
                    data-ocid="mint.description_input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Stručný popis vášho NFT..."
                    rows={3}
                    className="mt-1.5 rounded-2xl text-sm resize-none text-white/90 placeholder:text-white/30 border-0 focus-visible:ring-1 focus-visible:ring-white/30"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                    }}
                  />
                </div>

                {/* Visibility toggle */}
                <div className="flex items-center justify-between gap-4 py-1">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
                      Viditeľnosť
                    </p>
                    <p className="text-[11px] text-white/30 mt-0.5">
                      {isPublic
                        ? "Zobrazí sa v sekcii Hodnotenie"
                        : "Vidí len vlastník"}
                    </p>
                  </div>
                  <button
                    type="button"
                    data-ocid="mint.visibility_toggle"
                    role="switch"
                    aria-checked={isPublic}
                    aria-label="Verejné alebo súkromné NFT"
                    onClick={() => setIsPublic((v) => !v)}
                    className="relative flex-shrink-0 rounded-full transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring outline-none"
                    style={{
                      width: 52,
                      height: 28,
                      background: isPublic
                        ? "linear-gradient(90deg, rgb(var(--theme-color-1-rgb,180,80,220)), rgb(var(--theme-color-2-rgb,230,100,180)))"
                        : "rgba(255,255,255,0.12)",
                      border: isPublic
                        ? "1px solid rgba(255,255,255,0.18)"
                        : "1px solid rgba(255,255,255,0.14)",
                      boxShadow: isPublic
                        ? "0 0 12px 2px rgba(var(--theme-color-1-rgb,180,80,220),0.35)"
                        : "none",
                    }}
                  >
                    <span
                      className="absolute top-[3px] rounded-full transition-all duration-200"
                      style={{
                        width: 20,
                        height: 20,
                        left: isPublic ? 28 : 4,
                        background: isPublic
                          ? "#fff"
                          : "rgba(255,255,255,0.45)",
                        boxShadow: isPublic
                          ? "0 1px 4px rgba(0,0,0,0.35)"
                          : "none",
                      }}
                      aria-hidden="true"
                    />
                  </button>
                  <span
                    className="text-xs font-semibold min-w-[60px] text-right"
                    style={{
                      color: isPublic
                        ? "rgba(255,255,255,0.85)"
                        : "rgba(255,255,255,0.35)",
                    }}
                  >
                    {isPublic ? "Verejné" : "Súkromné"}
                  </span>
                </div>

                {/* Progress bar */}
                {showProgress && (
                  <div data-ocid="mint.loading_state" className="space-y-1.5">
                    <div className="flex text-xs text-muted-foreground">
                      <span>
                        {phase === "minting"
                          ? "Razenie na blockchain..."
                          : "Chyba — skúste znova"}
                      </span>
                    </div>
                    <div
                      className="h-1 w-full overflow-hidden rounded-full"
                      style={{ background: "rgba(255,255,255,0.10)" }}
                    >
                      <div
                        className="h-1 transition-all duration-300 rounded-full"
                        style={{
                          width: "100%",
                          background:
                            phase === "error"
                              ? "rgba(239,68,68,0.8)"
                              : "linear-gradient(90deg, rgb(var(--theme-color-1-rgb,180,80,220)), rgb(var(--theme-color-2-rgb,230,100,180)), rgb(var(--theme-color-3-rgb,255,180,60)))",
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Submit error */}
                {errors.submit && (
                  <div
                    data-ocid="mint.error_state"
                    className="rounded-2xl px-4 py-3 text-sm font-medium text-red-300"
                    style={{
                      background: "rgba(239,68,68,0.12)",
                      border: "1px solid rgba(239,68,68,0.35)",
                    }}
                    aria-live="polite"
                  >
                    {errors.submit}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  data-ocid="mint.submit_button"
                  disabled={isBusy}
                  className="relative overflow-hidden w-full rounded-2xl py-5 min-h-[60px] font-display font-bold text-base uppercase tracking-widest text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-xl disabled:opacity-40 disabled:scale-100"
                  style={{
                    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                  }}
                >
                  <span className="gradient-btn-inner" aria-hidden="true" />
                  <span className="relative z-[1] flex items-center justify-center gap-2">
                    {isBusy ? (
                      <>
                        <div
                          className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                          aria-hidden="true"
                        />
                        {phaseLabel}
                      </>
                    ) : (
                      "Vyraziť NFT"
                    )}
                  </span>
                </button>
              </form>
            </div>
          </div>
          {/* end left column */}

          {/* Right column — history panel */}
          <div className="w-full lg:flex-1 lg:min-w-[300px] lg:sticky lg:top-4">
            <MintHistoryPanel />
          </div>
        </div>
        {/* end two-column flex */}
      </div>
    </>
  );
}
