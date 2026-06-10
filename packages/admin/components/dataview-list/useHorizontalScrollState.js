import { useEffect } from '@wordpress/element';

const ATTR = 'data-horizontal-scroll';
const HEIGHT_VAR = '--sc-dvw-inner-scroll-height';
const VIEWPORT_W_VAR = '--sc-dvw-viewport-w';

export default function useHorizontalScrollState(rootRef) {
	useEffect(() => {
		const root = rootRef?.current;
		if (!root) {
			return undefined;
		}

		const wpContent = document.getElementById('wpcontent');
		let scrollEl = null;
		let resizeObserver = null;
		let lastViewportW = null;

		const updateInnerScrollHeight = () => {
			if (!scrollEl) {
				return;
			}
			const rect = scrollEl.getBoundingClientRect();
			// Floor to integer — a fractional wrapper bottom puts the sticky
			// thead at a fractional y, and its 1px divider rasterizes to
			// <1px alpha and disappears during scroll.
			const available = Math.max(
				0,
				Math.floor(window.innerHeight - rect.top)
			);
			scrollEl.style.setProperty(HEIGHT_VAR, `${available}px`);
		};

		// Off-mode the wrappers are max-content wide so the bars' sticky pin
		// has travel room; this var caps each bar back to the visible
		// scrollport width (see dataview-list-common.scss). Resize-only —
		// sticky does all the per-scroll work on the compositor.
		const updateViewportWidth = () => {
			if (!wpContent) {
				return; // CSS var(…, 100%) fallback covers this.
			}
			// clientWidth = padding box minus the vertical scrollbar — the
			// exact sticky scrollport, integer-rounded, RTL-safe.
			const width = wpContent.clientWidth;
			if (width === lastViewportW) {
				return; // Observers fire in bursts; skip no-op style writes.
			}
			lastViewportW = width;
			root.style.setProperty(VIEWPORT_W_VAR, `${width}px`);
		};

		const update = () => {
			updateViewportWidth();
			if (!scrollEl) {
				return;
			}
			const hasOverflow = scrollEl.scrollWidth > scrollEl.clientWidth + 1;
			scrollEl.setAttribute(ATTR, hasOverflow ? 'true' : 'false');
			updateInnerScrollHeight();
		};

		const detach = () => {
			if (scrollEl) {
				scrollEl.style.removeProperty(HEIGHT_VAR);
			}
			resizeObserver?.disconnect();
			resizeObserver = null;
			scrollEl = null;
		};

		const attach = () => {
			const next = root.querySelector('.dataviews-wrapper');
			if (!next) {
				detach();
				return;
			}
			if (next === scrollEl) {
				update();
				return;
			}

			detach();
			scrollEl = next;
			resizeObserver = new ResizeObserver(update);
			resizeObserver.observe(scrollEl);
			update();
		};

		attach();

		const mutationObserver = new MutationObserver(attach);
		mutationObserver.observe(root, { childList: true, subtree: true });
		window.addEventListener('resize', update);

		// Body resize affects wrapper.top (notice banners, admin-bar collapse).
		// #wpcontent resize covers admin-menu fold, which fires neither a
		// window resize nor a body-size change.
		const bodyResizeObserver = new ResizeObserver(update);
		bodyResizeObserver.observe(document.body);
		if (wpContent) {
			bodyResizeObserver.observe(wpContent);
		}

		return () => {
			mutationObserver.disconnect();
			window.removeEventListener('resize', update);
			bodyResizeObserver.disconnect();
			root.style.removeProperty(VIEWPORT_W_VAR);
			detach();
		};
	}, [rootRef]);
}
