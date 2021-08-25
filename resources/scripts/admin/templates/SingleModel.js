/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { __ } = wp.i18n;

const { SnackbarList, Modal, Button, Tooltip } = wp.components;

export default ( {
	children,
	title,
	button,
	footer,
	noticeUI,
	backUrl,
	backText,
	notices,
	removeNotice,
	onSubmit,
	archive,
	sidebar,
} ) => {
	return (
		<form
			className="ce-model-form"
			onSubmit={ onSubmit }
			css={ css`
				font-size: 15px;
				margin-right: 20px;

				select {
					max-width: none;
				}

				.components-snackbar.is-snackbar-error {
					background: #cc1818;
				}

				.is-error {
					.components-text-control__input {
						border-color: #cc1818;
					}
					.components-text-control__input:focus {
						border-color: #cc1818;
						box-shadow: 0 0 0 1px #cc1818;
					}
				}
			` }
		>
			<div
				css={ css`
					background: #fff;
					margin-left: -20px;
					margin-right: -20px;
					margin-bottom: 30px;
					position: sticky;
					top: 32px;
					z-index: 99;

					@media screen and ( max-width: 782px ) {
						top: 46px;
					}
				` }
			>
				<div
					css={ css`
						padding: 20px;
						display: flex;
						align-items: center;
						justify-content: space-between;
					` }
				>
					<div
						css={ css`
							display: flex;
							align-items: center;
							column-gap: 1em;
						` }
					>
						{ !! backUrl && (
							<Tooltip
								text={
									backText ||
									__( 'Go back.', 'checkout_engine' )
								}
							>
								<Button isSmall isSecondary href={ backUrl }>
									&larr;
								</Button>
							</Tooltip>
						) }

						<h1
							css={ css`
								margin: 0;
								font-size: 1.3em;
								font-weight: normal;
							` }
						>
							{ title }
						</h1>
					</div>

					{ button }
				</div>
				<div
					css={ css`
						.components-notice {
							margin: 0;
						}
					` }
				>
					{ noticeUI }
				</div>
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
					{ footer && (
						<div>
							<hr
								css={ css`
									margin: 1.5em 0;
								` }
							/>
							{ footer }
						</div>
					) }
				</div>
				<div>
					<div
						css={ css`
							position: sticky;
							top: 135px;
						` }
					>
						{ sidebar }
					</div>
				</div>
			</div>
			<SnackbarList
				css={ css`
					position: fixed !important;
					left: auto !important;
					right: 40px;
					bottom: 40px;
					width: auto !important;

					:first-letter {
						text-transform: uppercase;
					}
				` }
				notices={ notices }
				onRemove={ removeNotice }
			/>
		</form>
	);
};
