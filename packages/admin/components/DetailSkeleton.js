/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { ScSkeleton } from '@surecart/components-react';

/**
 * Suspense fallback shown while a lazy detail chunk downloads on a cold
 * (direct-URL) load. Without it, Suspense renders `null` → a blank content area
 * until the chunk arrives, so the page appears to "pop" straight to full
 * content. On SPA navigation the chunk is already prefetched, so this rarely
 * paints — it only bridges the cold-load gap.
 *
 * Deliberately generic — a header, a main column of "cards" with inner
 * field rows, and a sidebar card — so every entity's edit/create screen
 * (products, bundles, reviews, groups, collections) gets a consistent loading
 * state that reads as a form before its own layout-matched skeleton takes over.
 */
const bar = (width, height = '0.9em') => (
	<ScSkeleton style={{ width, height }} />
);

// A card shell with a title row and `rows` label + input pairs inside, so the
// box reads as a real form section rather than one big empty block.
const Card = ({ rows = 3 }) => (
	<div
		css={css`
			border: 1px solid var(--sc-color-gray-200, #e5e7eb);
			border-radius: 8px;
			padding: 1.25em;
			background: var(--sc-color-white, #fff);
			display: grid;
			gap: 1.25em;
		`}
	>
		{bar('35%', '1.1em')}
		{Array.from({ length: rows }).map((_, i) => (
			<div
				key={i}
				css={css`
					display: grid;
					gap: 0.5em;
				`}
			>
				{bar('25%')}
				<ScSkeleton
					style={{
						width: '100%',
						height: '2.25em',
						'--border-radius': '6px',
					}}
				/>
			</div>
		))}
	</div>
);

export default () => (
	<div
		css={css`
			max-width: 960px;
			margin: 0 auto;
			padding: 2em 1em;
			display: grid;
			gap: 1.5em;
		`}
	>
		{/* header: back button + title */}
		<div
			css={css`
				display: flex;
				align-items: center;
				gap: 1em;
			`}
		>
			<ScSkeleton
				style={{
					width: '2em',
					height: '2em',
					'--border-radius': '50%',
				}}
			/>
			{bar('30%', '1.5em')}
		</div>

		{/* main column + sidebar */}
		<div
			css={css`
				display: grid;
				gap: 1.5em;
				@media (min-width: 900px) {
					grid-template-columns: 2fr 1fr;
					align-items: start;
				}
			`}
		>
			<div
				css={css`
					display: grid;
					gap: 1.5em;
				`}
			>
				<Card rows={3} />
				<Card rows={2} />
			</div>

			<div
				css={css`
					display: grid;
					gap: 1.5em;
				`}
			>
				<Card rows={2} />
			</div>
		</div>
	</div>
);
