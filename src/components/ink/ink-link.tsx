import { forwardRef, type MouseEvent } from "react";
import { Link, useLocation, useNavigate, type LinkProps } from "react-router-dom";
import { useRegister } from "@/lib/register";
import { inkTheme, accentCss } from "@/lib/motion/ink-theme";
import { useInkTransition } from "./ink-transition";

/**
 * A react-router Link that floods the screen with ink before navigating.
 * Plain clicks are intercepted; modified clicks (new tab) and same-page
 * hash links fall through to the router.
 */
export const InkLink = forwardRef<HTMLAnchorElement, LinkProps>(function InkLink(
  { to, onClick, ...rest },
  ref
) {
  const navigate = useNavigate();
  const location = useLocation();
  const { flood } = useInkTransition();
  const { register } = useRegister();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const dest = typeof to === "string" ? to : to.pathname ?? "";
    const destPath = dest.split("#")[0];
    // Same route: let the router (and ScrollManager) handle the hash.
    if (destPath === "" || destPath === location.pathname) return;
    e.preventDefault();
    void flood({
      color: accentCss(inkTheme(register)),
      origin: { x: e.clientX, y: e.clientY },
      onCovered: () => {
        navigate(to);
      },
    });
  };

  return <Link ref={ref} to={to} onClick={handleClick} {...rest} />;
});
