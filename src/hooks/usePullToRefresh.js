import { useState, useEffect, useRef } from "react";

/**
 * Pull-to-refresh hook.
 * @param {() => Promise<void>} onRefresh - async function to call on pull
 * @param {number} threshold - px to pull before triggering (default 80)
 */
export function usePullToRefresh(onRefresh, threshold = 80) {
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(null);

  useEffect(() => {
    const el = document.documentElement;

    const onTouchStart = (e) => {
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e) => {
      if (startY.current === null || refreshing) return;
      const dy = e.touches[0].clientY - startY.current;
      if (dy > 0 && window.scrollY === 0) {
        setPulling(true);
        setPullDistance(Math.min(dy, threshold * 1.5));
      }
    };

    const onTouchEnd = async () => {
      if (pulling && pullDistance >= threshold) {
        setRefreshing(true);
        setPullDistance(0);
        setPulling(false);
        await onRefresh();
        setRefreshing(false);
      } else {
        setPulling(false);
        setPullDistance(0);
      }
      startY.current = null;
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [onRefresh, pulling, pullDistance, refreshing, threshold]);

  return { pulling, pullDistance, refreshing };
}