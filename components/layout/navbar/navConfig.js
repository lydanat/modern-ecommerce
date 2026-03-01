export const navLinks = [
  { label: "Home",    href: "/",        section: null },
  { label: "Product", href: "/product", section: null },
];

/**
 * handleSmoothScroll
 *
 * - On landing page ("/"):  scrolls to top for Home, scrolls to section for others
 * - On any other page:      lets Next.js navigate normally (no preventDefault)
 */
export function handleSmoothScroll(e, href, onDone) {
  const isOnLandingPage = window.location.pathname === "/";

  // "Home" — always scroll to top if already on "/", else navigate
  if (href === "/") {
    if (isOnLandingPage) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/");
    }
    // else: let Next.js Link handle navigation normally
    onDone?.();
    return;
  }

  // Anchor links like "/#contact" — only intercept on landing page
  if (href.startsWith("/#")) {
    if (isOnLandingPage) {
      e.preventDefault();
      const id = href.slice(2);
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", href);
      }
    }
    // else: let Next.js navigate to "/" first, anchor will resolve there
    onDone?.();
    return;
  }

  // Normal page links (e.g. "/product") — just close drawer if open
  onDone?.();
}