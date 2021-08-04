/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { SnackbarList } = wp.components;

export default ( {
	children,
	title,
	button,
	footer,
	notices,
	sidebar,
	removeNotice,
} ) => {
	return (
		<div
			css={ css`
				font-size: 15px;
				margin-right: 20px;
				.components-snackbar.is-snackbar-error {
					background: #cc1818;
				}
			` }
		>
			<div
				css={ css`
					background: #fff;
					padding: 20px;
					margin-left: -20px;
					margin-right: -20px;
					margin-bottom: 30px;
					position: sticky;
					display: flex;
					align-items: center;
					justify-content: space-between;
					top: 32px;
					z-index: 99;

					@media screen and ( max-width: 782px ) {
						top: 46px;
					}
				` }
			>
				<h1
					css={ css`
						margin: 0;
						font-size: 1.3em;
						font-weight: normal;
					` }
				>
					{ title }
				</h1>

				{ button }
			</div>

			<div
				css={ css`
					padding: 0 5px;
					display: grid;
					margin: auto;
					max-width: 960px;
					grid-template-columns: 1fr 320px;
					grid-gap: 2em;
					grid-template-areas: 'nav    sidebar';
				` }
			>
				<div
					css={ css`
						> * ~ * {
							margin-top: 1em;
						}
					` }
				>
					{ children }
				</div>
				<div>{ sidebar }</div>
			</div>

			{ footer }

			<SnackbarList
				css={ css`
					position: fixed !important;
					left: auto !important;
					right: 40px;
					bottom: 40px;
					width: auto !important;
				` }
				notices={ notices }
				onRemove={ removeNotice }
			/>
		</div>
	);
};
