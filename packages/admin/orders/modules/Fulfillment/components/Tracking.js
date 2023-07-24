/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScButton, ScIcon, ScInput } from '@surecart/components-react';
import { __, _n } from '@wordpress/i18n';

export default ({ trackings, setTrackings }) => {
	const updateTrackingItem = (trackingIndex, data) => {
		setTrackings(
			trackings.map((item, index) => {
				if (index !== trackingIndex) {
					// This isn't the item we care about - keep it as-is
					return item;
				}

				// Otherwise, this is the one we want - return an updated value
				return {
					...item,
					...data,
				};
			})
		);
	};

	return (
		<div
			css={css`
				display: grid;
				gap: var(--sc-spacing-large);
			`}
		>
			{(trackings || []).map(({ number, url }, index) => (
				<div
					css={css`
						display: flex;
						gap: 1em;
						&:not(:first-child) {
							border-top: 1px solid var(--sc-color-gray-200);
							padding-top: var(--sc-spacing-large);
						}
					`}
				>
					<div
						css={css`
							display: grid;
							flex: 1;
							gap: var(--sc-spacing-large);
						`}
					>
						<div
							css={css`
								width: 100%;
								display: flex;
								gap: var(--sc-spacing-large);
								flex-wrap: wrap;
							`}
						>
							<ScInput
								css={css`
									flex: 1;
								`}
								label={__('Tracking number', 'surecart')}
								value={number}
								required={!!number || !!url}
								onScInput={(e) =>
									updateTrackingItem(index, {
										number: e.target.value,
									})
								}
							/>
							<ScInput
								css={css`
									flex: 1;
								`}
								label={__('Tracking Link', 'surecart')}
								type="url"
								required={!!number || !!url}
								value={url}
								onScInput={(e) =>
									updateTrackingItem(index, {
										url: e.target.value,
									})
								}
							/>
						</div>
					</div>
					{trackings?.length > 1 && (
						<ScButton
							type="text"
							circle
							onClick={() => {
								setTrackings(
									trackings.filter((_, i) => i !== index)
								);
							}}
						>
							<ScIcon name="trash" />
						</ScButton>
					)}
				</div>
			))}

			<div>
				<ScButton
					type="link"
					onClick={() =>
						setTrackings([
							...trackings,
							{
								url: '',
								number: '',
								carrier: '',
							},
						])
					}
				>
					<ScIcon name="plus" slot="prefix" />
					{__('Add another tracking number', 'surecart')}
				</ScButton>
			</div>
		</div>
	);
};
