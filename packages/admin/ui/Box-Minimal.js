/** @jsx jsx */
import { ScCard } from '@surecart/components-react';
import { css, jsx } from '@emotion/core';

import { Card, CardBody, CardFooter, CardHeader } from '@wordpress/components';

export default ({
	title,
	children,
	header_action,
	size = 'large',
	isBorderLess = true,
	noPadding = false,
	hasDivider = true,
	loading,
	footer,
	className,
}) => {
	return (
		<div>
			{' '}
			<sc-text
				tag="h2"
				style={{
					'--font-size': '16px',
					'--font-weight': 'var(--sc-font-weight-bold)',
					marginBottom: 'var(--sc-spacing-medium)',
				}}
			>
				{title && (
					<span>
						{loading ? (
							<sc-skeleton
								style={{
									width: '120px',
									display: 'inline-block',
								}}
							></sc-skeleton>
						) : (
							title
						)}
					</span>
				)}
			</sc-text>
			{header_action}
			<ScCard
				noPadding={noPadding}
				css={css`
					.components-card__footer {
						background: var(--sc-color-gray-50, #f9fafb);
						margin-top: -1px;
						position: relative;
						border-bottom-left-radius: var(
							--sc-input-border-radius-medium
						);
						border-bottom-right-radius: var(
							--sc-input-border-radius-medium
						);
					}
				`}
				size={size}
				isBorderless={isBorderLess}
				className={className}
			>
				<div
					css={css`
						display: grid;
						gap: 10px;
						margin-bottom: 0;
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
				</div>
				{!!footer && <CardFooter>{footer}</CardFooter>}
			</ScCard>
		</div>
	);
};
