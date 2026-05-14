import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface ImageLightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const overlayRoot = document.getElementById("overlay-root") ?? document.body;

  return createPortal(
    <dialog
      data-ocid="lightbox.dialog"
      aria-label={alt}
      open
      className="lightbox-overlay"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      {/* Backdrop — fades in */}
      <div className="lightbox-backdrop" aria-hidden="true" />

      {/* Close button */}
      <button
        type="button"
        data-ocid="lightbox.close_button"
        aria-label="Zatvoriť"
        onClick={onClose}
        className="lightbox-close-btn"
      >
        <X className="w-5 h-5" style={{ color: "rgba(255,255,255,0.9)" }} />
      </button>

      {/* Image — pops toward viewer */}
      <div
        className="lightbox-img-wrap"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <img src={src} alt={alt} className="lightbox-img" />
      </div>
    </dialog>,
    overlayRoot,
  );
}
