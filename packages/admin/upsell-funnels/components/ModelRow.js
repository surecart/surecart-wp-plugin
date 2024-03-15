/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
	ScIcon,
	ScSkeleton,
	ScFlex,
	ScStackedListRow,
} from '@surecart/components-react';

export default ({ loading, media, icon, children, suffix }) => {
	return (
		<ScStackedListRow
			style={{
				'--columns': '1',
			}}
			mobileSize={350}
		>
			{loading ? (
				<ScFlex alignItems="center" justifyContent="flex-start">
					<ScSkeleton
						css={css`
							width: 40px;
							height: 40px;
						`}
						style={{
							'--border-radius': ' var(--sc-border-radius-small)',
						}}
					/>
					<ScSkeleton style={{ width: '25%' }} />
				</ScFlex>
			) : (
				<>
					<ScFlex alignItems="center" justifyContent="flex-start">
						{media?.url ? (
							<img
								src={media.url}
								alt={media.alt}
								{...(media.title ? { title: media.title } : {})}
								css={css`
									width: var(
										--sc-product-line-item-image-size,
										4em
									);
									height: var(
										--sc-product-line-item-image-size,
										4em
									);
									object-fit: cover;
									border-radius: 4px;
									border: solid 1px
										var(
											--sc-input-border-color,
											var(--sc-input-border)
										);
									display: block;
									box-shadow: var(--sc-input-box-shadow);
									align-self: flex-start;
									background: #f3f3f3;
								`}
							/>
						) : (
							icon && (
								<div
									css={css`
										width: 40px;
										height: 40px;
										object-fit: cover;
										background: var(--sc-color-gray-100);
										display: flex;
										align-items: center;
										justify-content: center;
										border-radius: var(
											--sc-border-radius-small
										);
									`}
								>
									<ScIcon
										style={{
											width: '18px',
											height: '18px',
										}}
										name={icon}
									/>
								</div>
							)
						)}
						<div>{children}</div>
					</ScFlex>
					{!!suffix && suffix}
				</>
			)}
		</ScStackedListRow>
	);
};
