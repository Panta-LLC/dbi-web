/** Message field placeholder — mirrors `CtaModalForm` behavior for inline forms. */
export function resolveContactMessagePlaceholder(
  triggerLabel: string,
  messageContext: string | undefined,
  explicit: string | undefined,
): string {
  if (explicit !== undefined && explicit.trim() !== "") {
    return explicit;
  }
  if (messageContext !== undefined && messageContext.trim() !== "") {
    return `What would you like to share? You used “${triggerLabel}” from ${messageContext.trim()}.`;
  }
  return `What would you like to share? You used “${triggerLabel}” from this page.`;
}
