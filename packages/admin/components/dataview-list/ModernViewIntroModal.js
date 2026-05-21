/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useEffect, useState, useCallback } from 'react';
import { Modal, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const ATTRACT_CLASS = 'is-attract';

const persistDismissed = (dismissUrl, dismissNonce) => {
	if (!dismissUrl || !dismissNonce) return;
	const body = new FormData();
	body.set('action', 'sc_dismiss_modern_view_intro');
	body.set('_wpnonce', dismissNonce);
	window
		.fetch(dismissUrl, {
			method: 'POST',
			credentials: 'same-origin',
			body,
		})
		.catch(() => {
			// Swallow — re-showing the modal next visit is acceptable
			// fallback, no point bothering the user with an error toast.
		});
};

const attractToggle = (toggleId) => {
	const toggle = document.getElementById(toggleId);
	if (!toggle) return;
	toggle.classList.remove(ATTRACT_CLASS);
	toggle.offsetWidth;
	toggle.classList.add(ATTRACT_CLASS);
	toggle.addEventListener(
		'animationend',
		() => toggle.classList.remove(ATTRACT_CLASS),
		{ once: true }
	);
	toggle.focus({ preventScroll: false });
};

const submitToggleForm = (toggleId) => {
	const toggle = document.getElementById(toggleId);
	const form = toggle?.closest('form');
	if (form) {
		form.classList.add('is-busy');
		form.submit();
	}
};

export default function ModernViewIntroModal({
	enabled,
	imageUrl,
	toggleId = 'sc-enhanced-views-toggle',
	// Server-side dismissal state — passed from PHP (scData) so this React
	// component is stateless about persistence. Drives both the initial
	// "should we auto-open?" check and the request when the user closes.
	dismissed = false,
	dismissUrl = '',
	dismissNonce = '',
	delayMs = 5000, // Short delay so the data table paints first — landing the modal after the user sees the new view, not while they're still looking at the old one.
}) {
	const [isOpen, setIsOpen] = useState(false);

	// Only auto-open when the user is on modern view AND hasn't dismissed.
	useEffect(() => {
		if (!enabled || dismissed) {
			return undefined;
		}
		const timer = window.setTimeout(() => setIsOpen(true), delayMs);
		return () => window.clearTimeout(timer);
	}, [enabled, dismissed, delayMs]);

	// Transient close — used when the user presses ESC, clicks the
	// backdrop, or hits the small "x" in the corner. We hide the modal
	// locally but do NOT mark it as dismissed in the DB, so it'll come
	// back on the next page load. Dismissal is a deliberate action that
	// only the explicit Close / Revert buttons trigger.
	const handleTransientClose = useCallback(() => {
		setIsOpen(false);
		window.setTimeout(() => attractToggle(toggleId), 0);
	}, [toggleId]);

	// Explicit dismissal — user clicked the primary "Close" button. Persist
	// to user_meta so we don't show the intro again on future visits.
	const handleDismiss = useCallback(() => {
		persistDismissed(dismissUrl, dismissNonce);
		setIsOpen(false);
		window.setTimeout(() => attractToggle(toggleId), 0);
	}, [toggleId, dismissUrl, dismissNonce]);

	// Explicit revert — also counts as dismissal: user engaged with the
	// modal and chose an option, no need to keep nudging them.
	const handleRevert = useCallback(() => {
		persistDismissed(dismissUrl, dismissNonce);
		submitToggleForm(toggleId);
	}, [toggleId, dismissUrl, dismissNonce]);

	if (!isOpen) {
		return null;
	}

	return (
		<Modal
			className="sc-modern-view-intro-modal"
			contentLabel={__('Introducing Modern View', 'surecart')}
			// ESC / click-outside / built-in close X → transient only.
			// Saving to user_meta is reserved for the explicit Close /
			// Revert buttons below.
			onRequestClose={handleTransientClose}
			shouldCloseOnClickOutside
			shouldCloseOnEsc
			__experimentalHideHeader
			focusOnMount="firstContentElement"
			size="medium"
			css={css`
				width: 520px;
				max-width: calc(100vw - 32px);
				border-radius: 12px;
				overflow: hidden;
				padding: 0;

				.components-modal__content {
					padding: 0 !important;
					margin-top: 0 !important;
				}
			`}
		>
			<div
				css={css`
					background: #f3f4f6;
				`}
			>
				<img
					src={imageUrl}
					alt={__('Preview of the modern data view', 'surecart')}
					css={css`
						display: block;
						width: 100%;
						height: auto;
					`}
				/>
			</div>

			<div
				css={css`
					padding: 20px 28px 24px;
				`}
			>
				<span
					css={css`
						display: inline-flex;
						align-items: center;
						gap: 6px;
						padding: 4px 10px;
						border-radius: 999px;
						background: #d1fae5;
						color: #047857;
						font-size: 12px;
						font-weight: 600;
						margin-bottom: 12px;
					`}
				>
					<svg
						width="14"
						height="14"
						viewBox="0 0 14 14"
						fill="none"
						aria-hidden="true"
						focusable="false"
					>
						<path
							d="M7 1L8.5 5.5L13 7L8.5 8.5L7 13L5.5 8.5L1 7L5.5 5.5L7 1Z"
							fill="currentColor"
						/>
					</svg>
					{__('New in SureCart 5.0', 'surecart')}
				</span>

				<h2
					css={css`
						font-size: 20px;
						font-weight: 600;
						line-height: 1.3;
						margin: 0 0 8px;
						color: #111827;
					`}
				>
					{__('Introducing Modern View', 'surecart')}
				</h2>

				<p
					css={css`
						font-size: 14px;
						color: #4b5563;
						line-height: 1.55;
						margin: 0 0 16px;
					`}
				>
					{__(
						"We've redesigned the Products and Product Collections lists — cleaner layout, noticeably faster performance, and a better experience. Your data stays exactly the same.",
						'surecart'
					)}
				</p>

				<ul
					aria-label={__("What's new", 'surecart')}
					css={css`
						list-style: none;
						display: flex;
						flex-wrap: wrap;
						gap: 8px 20px;
						margin: 0 0 22px;
						padding: 0;

						li {
							display: inline-flex;
							align-items: center;
							gap: 6px;
							font-size: 13px;
							color: #374151;
							font-weight: 500;
						}

						li svg {
							color: #10b981;
							flex-shrink: 0;
						}
					`}
				>
					<li>
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							aria-hidden="true"
							focusable="false"
						>
							<path
								d="M8.667 1.333L2.667 8.667h4l-1.334 6 6-7.334h-4l1.334-6z"
								fill="currentColor"
							/>
						</svg>
						{__('Instant load times', 'surecart')}
					</li>
					<li>
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							aria-hidden="true"
							focusable="false"
						>
							<path
								d="M8 3.333c-3.333 0-5.667 2.667-6.667 4.667 1 2 3.334 4.667 6.667 4.667s5.667-2.667 6.667-4.667c-1-2-3.334-4.667-6.667-4.667zm0 8a3.333 3.333 0 110-6.667 3.333 3.333 0 010 6.667zm0-5.333a2 2 0 100 4 2 2 0 000-4z"
								fill="currentColor"
							/>
						</svg>
						{__('Easier to scan', 'surecart')}
					</li>
					<li>
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							aria-hidden="true"
							focusable="false"
						>
							<path
								d="M2 2.667h12v10.667H2V2.667zm1.333 1.333v2.667h3.334V4H3.333zm4.667 0v2.667h4V4H8zm-4.667 4v3.333h3.334V8H3.333zm4.667 0v3.333h4V8H8z"
								fill="currentColor"
							/>
						</svg>
						{__('Personalized columns', 'surecart')}
					</li>
				</ul>

				<div
					css={css`
						display: flex;
						align-items: center;
						justify-content: space-between;
						gap: 12px;
					`}
				>
					<Button variant="primary" onClick={handleDismiss}>
						{__('Close', 'surecart')}
					</Button>
					<div
						css={css`
							font-size: 13px;
							color: #6b7280;
						`}
					>
						<span
							css={css`
								margin-right: 4px;
							`}
						>
							{__('Prefer the classic layout?', 'surecart')}
						</span>
						<Button
							variant="link"
							onClick={handleRevert}
							css={css`
								font-size: 13px;
								font-weight: 500;
							`}
						>
							{__('Revert', 'surecart')}
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
}
