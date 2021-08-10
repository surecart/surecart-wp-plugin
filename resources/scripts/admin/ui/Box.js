/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { Card, CardBody } = wp.components;

export default ( {
	title,
	children,
	size = 'large',
	isBorderLess = true,
	loading,
} ) => {
	return (
		<Card
			css={ css`
				box-shadow: rgb( 0 0 0 / 10% ) 0px 2px 4px 0px;
			` }
			size={ size }
			isBorderless={ isBorderLess }
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
				<div
					css={ {
						fontSize: '16px',
						marginTop: '10px',
						marginBottom: '25px',
						fontWeight: 600,
					} }
				>
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
				</div>

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
		</Card>
	);
};
