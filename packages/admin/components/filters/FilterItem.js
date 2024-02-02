/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
	ScButton,
	ScDropdown,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScSkeleton,
	ScFlex,
	ScStackedListRow,
} from '@surecart/components-react';

export default ({ loading, media, onRemove, icon, children, suffix }) => {
	return (
		<ScStackedListRow
			style={{
				'--columns': '1',
			}}
			mobileSize={320}
		>
			{loading ? (
				<ScFlex alignItems="center" justifyContent="flex-start">
					{(!!media?.url || !!icon) && (
						<ScSkeleton
							css={css`
								width: 40px;
								height: 40px;
							`}
							style={{
								'--border-radius':
									' var(--sc-border-radius-small)',
							}}
						/>
					)}
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
									width: 60px;
									height: 60px;
									object-fit: cover;
									background: #f3f3f3;
									display: flex;
									align-items: center;
									justify-content: center;
									align-self: flex-start;
									border-radius: var(
										--sc-border-radius-small
									);
									border: 1px solid var(--sc-color-gray-300);
									border-radius: var(
										--sc-input-border-radius-medium
									);
								`}
							/>
						) : (
							icon && (
								<div
									css={css`
										width: 60px;
										height: 60px;
										object-fit: cover;
										background: var(--sc-color-gray-100);
										display: flex;
										align-items: center;
										justify-content: center;
										align-self: flex-start;
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
					{!!suffix ? (
						suffix
					) : (
						<ScDropdown slot="suffix" placement="bottom-end">
							<ScButton type="text" slot="trigger" circle>
								<ScIcon name="more-horizontal" />
							</ScButton>
							<ScMenu>
								<ScMenuItem onClick={onRemove}>
									<ScIcon slot="prefix" name="trash" />
									{__('Remove', 'surecart')}
								</ScMenuItem>
							</ScMenu>
						</ScDropdown>
					)}
				</>
			)}
		</ScStackedListRow>
	);
};
