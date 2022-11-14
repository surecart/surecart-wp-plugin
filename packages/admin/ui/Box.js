/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScCard, ScDashboardModule } from '@surecart/components-react';

import { Card, CardBody, CardFooter, CardHeader } from '@wordpress/components';

export default ({
	title,
	children,
	header_action,
	size = 'large',
	isBorderLess = true,
	hasDivider = true,
	isRounded = true,
	loading,
	footer,
	className,
}) => {
	return (
		<Card
			css={css`
				/* box-shadow: rgb( 0 0 0 / 10% ) 0px 2px 4px 0px; */
				.components-card__footer {
					background: var(--sc-color-gray-50, #f9fafb);
				}
			`}
			size={size}
			isRounded={isRounded}
			isBorderless={isBorderLess}
			className={className}
		>
			<CardHeader
				isBorderless={!hasDivider}
				css={css`
					${!hasDivider ? 'padding-bottom: 0 !important' : ''};
				`}
			>
				<sc-text
					tag="h2"
					style={{
						'--font-size': '15px',
						'--font-weight': 'var(--sc-font-weight-bold)',
					}}
				>
					{title}
				</sc-text>
				{header_action}
			</CardHeader>
			<CardBody
				css={css`
					display: grid;
					gap: 10px;
					> * {
						width: 100%;
					}
					.components-base-control__label {
						font-weight: 500;
						margin-bottom: 12px;
					}
				`}
			>
				{loading ? (
					<div>
						<sc-skeleton
							style={{
								width: '100%',
								marginBottom: '15px',
								display: 'inline-block',
							}}
						></sc-skeleton>
						<sc-skeleton
							style={{
								width: '40%',
								display: 'inline-block',
							}}
						></sc-skeleton>
					</div>
				) : (
					children
				)}
			</CardBody>
			{!!footer && <CardFooter>{footer}</CardFooter>}
		</Card>
	);
};
