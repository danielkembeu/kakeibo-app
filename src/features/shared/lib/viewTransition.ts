export function withViewTransition(update: VoidFunction) {
  if (typeof document !== "undefined" && "startViewTransition" in document) {
    document.startViewTransition(update);
    return;
  }

  update();
}