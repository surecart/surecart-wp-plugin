/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
	ScIcon,
	ScSkeleton,
	ScFlex,
	ScStackedListRow,
} from '@surecart/components-react';

export default ({ loading, imageUrl, icon, children, suffix }) => {
	return (
		<ScStackedListRow
			style={{
				'--columns': '1',
			}}
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
						{imageUrl ? (
							<img
								src={imageUrl}
								css={css`
									width: 40px;
									height: 40px;
									object-fit: cover;
									background: #f3f3f3;
									display: flex;
									align-items: center;
									justify-content: center;
									border-radius: var(
										--sc-border-radius-small
									);
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
