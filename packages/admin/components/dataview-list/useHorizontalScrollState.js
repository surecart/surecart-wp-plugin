import { useEffect } from '@wordpress/element';

const ATTR = 'data-horizontal-scroll';

export default function useHorizontalScrollState(rootRef) {
	useEffect(() => {
		const root = rootRef?.current;
		if (!root) {
			return undefined;
		}

		let scrollEl = null;
		let resizeObserver = null;

		const update = () => {
			if (!scrollEl) {
				return;
			}
			const hasOverflow = scrollEl.scrollWidth > scrollEl.clientWidth + 1;
			scrollEl.setAttribute(ATTR, hasOverflow ? 'true' : 'false');
		};

		const detach = () => {
			if (scrollEl) {
				scrollEl.removeEventListener('scroll', update);
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

		return () => {
			mutationObserver.disconnect();
			window.removeEventListener('resize', update);
			detach();
		};
	}, [rootRef]);
}
