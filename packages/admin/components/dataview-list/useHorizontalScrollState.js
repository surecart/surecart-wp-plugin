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

	// Off-mode: scrolling the page sideways drags the header bars (admin header,
	// page header, toolbar, footer) along with the table. Shift them back by
	// scrollLeft so they stay put. (Plain CSS sticky can't pin them here — the
	// wrapper isn't wide enough.)
	useEffect(() => {
		const root = rootRef?.current;
		if (!root) {
			return undefined;
		}

		// All inside the React root except the admin header, which WP renders
		// separately above the app.
		const PINNED = [
			'.sc-list-header',
			'.dataviews__view-actions',
			'.dataviews-footer',
		];
		const scrollEl = document.getElementById('wpcontent');
		if (!scrollEl) {
			return undefined;
		}

		const isOffDesktop = () =>
			root.getAttribute('data-enhanced-view') === 'off' &&
			window.matchMedia('(min-width: 783px)').matches;

		const bars = () => [
			...PINNED.flatMap((sel) => [...root.querySelectorAll(sel)]),
			...[document.getElementById('sc-admin-header')].filter(Boolean),
		];

		const apply = () => {
			const x = isOffDesktop() ? scrollEl.scrollLeft : 0;
			bars().forEach((el) => {
				el.style.transform = x ? `translateX(${x}px)` : '';
			});
		};

		scrollEl.addEventListener('scroll', apply, { passive: true });
		window.addEventListener('resize', apply);
		// Re-pin when rows reload or the view toggle flips.
		const observer = new MutationObserver(apply);
		observer.observe(root, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['data-enhanced-view'],
		});

		apply();

		return () => {
			scrollEl.removeEventListener('scroll', apply);
			window.removeEventListener('resize', apply);
			observer.disconnect();
			bars().forEach((el) => {
				el.style.transform = '';
			});
		};
	}, [rootRef]);
}
