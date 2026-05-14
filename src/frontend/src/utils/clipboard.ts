/**
 * Safe clipboard utility.
 * Uses the native Clipboard API and falls back to a textarea-based approach
 * that always checks parentNode before calling removeChild, avoiding the
 * "The node to be removed is not a child of this node" DOM error.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Prefer modern async clipboard API
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to textarea fallback
    }
  }

  // Textarea fallback for older browsers / restricted contexts
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.cssText =
    "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none;";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  let success = false;
  try {
    success = document.execCommand("copy");
  } catch {
    success = false;
  } finally {
    // Guard: only removeChild if it is still attached
    if (textarea.parentNode) {
      textarea.parentNode.removeChild(textarea);
    }
  }
  return success;
}
