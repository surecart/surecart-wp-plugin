import { useEffect } from '@wordpress/element';

const ATTR = 'data-horizontal-scroll';
const HEIGHT_VAR = '--sc-dvw-inner-scroll-height';

export default function useHorizontalScrollState(rootRef) {
	useEffect(() => {
		const root = rootRef?.current;
		if (!root) {
			return undefined;
		}

		let scrollEl = null;
		let resizeObserver = null;

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

		const update = () => {
			if (!scrollEl) {
				return;
			}
			const hasOverflow = scrollEl.scrollWidth > scrollEl.clientWidth + 1;
			scrollEl.setAttribute(ATTR, hasOverflow ? 'true' : 'false');
			updateInnerScrollHeight();
		};

		const detach = () => {
			if (scrollEl) {
				scrollEl.removeEventListener('scroll', update);
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
			scrollEl.addEventListener('scroll', update, { passive: true });
			resizeObserver = new ResizeObserver(update);
			resizeObserver.observe(scrollEl);
			update();
		};

		attach();

		const mutationObserver = new MutationObserver(attach);
		mutationObserver.observe(root, { childList: true, subtree: true });
		window.addEventListener('resize', update);

		// Body resize affects wrapper.top (notice banners, admin-bar collapse).
		const bodyResizeObserver = new ResizeObserver(update);
		bodyResizeObserver.observe(document.body);

		return () => {
			mutationObserver.disconnect();
			window.removeEventListener('resize', update);
			bodyResizeObserver.disconnect();
			detach();
		};
	}, [rootRef]);
}
