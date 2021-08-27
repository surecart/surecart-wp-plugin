/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { Card, CardBody, CardFooter } = wp.components;
import { CeFormSection } from '@checkout-engine/react';

export default ( {
	title,
	description,
	children,
	size = 'large',
	isBorderLess = true,
	loading,
	footer,
	panelActions,
	className,
} ) => {
	return (
		<Card
			css={ css`
				box-shadow: rgb( 0 0 0 / 10% ) 0px 2px 4px 0px;
				.components-card__footer {
					background: var( --ce-color-gray-100, #f9fafb );
				}
			` }
			size={ size }
			isBorderless={ isBorderLess }
			className={ className }
		>
			<CardBody
				css={ css`
					> * {
						margin-bottom: 10px;
					}
					> *:not( :last-child ) {
						margin-bottom: 20px;
					}
					.components-base-control__label {
						font-weight: 500;
						margin-bottom: 12px;
					}
				` }
			>
				<CeFormSection
					css={ {
						marginTop: '10px',
						marginBottom: '2em',
					} }
				>
					{ title && (
						<span slot="label">
							{ loading ? (
								<ce-skeleton
									style={ {
										width: '120px',
										display: 'inline-block',
									} }
								></ce-skeleton>
							) : (
								title
							) }
						</span>
					) }
					{ description && (
						<span slot="description">
							{ loading ? (
								<ce-skeleton
									style={ {
										width: '240px',
										display: 'inline-block',
									} }
								></ce-skeleton>
							) : (
								description
							) }
						</span>
					) }
				</CeFormSection>

				{ loading ? (
					<div>
						<ce-skeleton
							style={ {
								width: '100%',
								marginBottom: '15px',
								display: 'inline-block',
							} }
						></ce-skeleton>
						<ce-skeleton
							style={ {
								width: '40%',
								display: 'inline-block',
							} }
						></ce-skeleton>
					</div>
				) : (
					children
				) }
			</CardBody>
			{ !! footer && <CardFooter>{ footer }</CardFooter> }
		</Card>
	);
};
