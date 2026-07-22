import { useEffect } from '@wordpress/element';

// On desktop list pages the page itself never scrolls (#wpcontent does), so
// WordPress can't scroll a tall admin menu into view — items below the fold
// become unreachable. This restores that: wheel or keyboard focus over the
// menu slides it up and down, stopping at its ends.
const DESKTOP = '(min-width: 783px)';

export default function useAdminMenuScroll() {
	useEffect(() => {
		const main = document.getElementById('adminmenumain');
		const wrap = document.getElementById('adminmenuwrap');
		if (!main || !wrap) {
			return undefined;
		}

		const media = window.matchMedia(DESKTOP);
		let offset = 0;

		// How far up the menu is allowed to slide before its bottom edge
		// meets the bottom of the screen. 0 means the menu already fits.
		const maxOffset = () => {
			const naturalBottom = wrap.getBoundingClientRect().bottom - offset;
			return Math.min(0, window.innerHeight - naturalBottom);
		};

		const apply = (next) => {
			offset = Math.min(0, Math.max(maxOffset(), next));
			wrap.style.transform = offset
				? `translateY(${offset}px)`
				: '';
		};

		const onWheel = (event) => {
			if (!media.matches || maxOffset() === 0) {
				return;
			}
			event.preventDefault();
			const line = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 20 : 1;
			apply(offset - event.deltaY * line);
		};

		// Tabbing to a menu item that's off screen — slide it into view.
		const onFocusIn = (event) => {
			if (!media.matches) {
				return;
			}
			const rect = event.target.getBoundingClientRect();
			const topEdge = wrap.getBoundingClientRect().top - offset;
			if (rect.bottom > window.innerHeight) {
				apply(offset - (rect.bottom - window.innerHeight));
			} else if (rect.top < topEdge) {
				apply(offset + (topEdge - rect.top));
			}
		};

		// Menu got shorter or the window taller — don't leave a gap below it.
		const reclamp = () => apply(offset);
		const resizeObserver = new ResizeObserver(reclamp);
		resizeObserver.observe(wrap);

		main.addEventListener('wheel', onWheel, { passive: false });
		main.addEventListener('focusin', onFocusIn);
		window.addEventListener('resize', reclamp);

		return () => {
			main.removeEventListener('wheel', onWheel);
			main.removeEventListener('focusin', onFocusIn);
			window.removeEventListener('resize', reclamp);
			resizeObserver.disconnect();
			wrap.style.transform = '';
		};
	}, []);
}
