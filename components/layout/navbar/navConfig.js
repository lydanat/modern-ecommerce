export const navLinks = [
  { label: "Home",    href: "/" },
  { label: "Product", href: "/#product" },
  { label: "Contact", href: "/#contact" },
];

/**
 * handleSmoothScroll
 *
 * Intercepts clicks on anchor links (href starting with "/#") and uses
 * the native scrollIntoView API instead of a hard page reload.
 *
 * @param {React.MouseEvent} e       - The click event (used to preventDefault).
 * @param {string}           href    - The link's href value.
 * @param {Function}         onDone  - Optional callback fired after scroll starts
 *                                     (used by MobileNav to close the Sheet drawer).
 */
export function handleSmoothScroll(e, href, onDone) {
  if (href === "/") {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    onDone?.();
    return;
  }

  if (href.startsWith("/#")) {
    e.preventDefault();
    const id = href.slice(2);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    onDone?.();
  }
}