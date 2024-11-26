/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { ScButton, ScIcon } from '@surecart/components-react';
import { CheckboxControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { _n } from '@wordpress/i18n';

export default ({ country, value, onChange }) => {
	const [isOpen, setIsOpen] = useState(false);
	const territories = (country[2] || []).filter(
		(region) => region[1] && region[1] !== 'undefined' // might be a bug in the data
	);
	const territoriesCount = territories.length || 0;

	// when the country is selected, also select the territories
	const onSelectCountry = (checked) => {
		if (checked) {
			onChange({
				country: country[1],
				states: country[2].map((state) => state[1]),
			});
		} else {
			onChange(null);
		}
	};

	const onChangeTerritory = (checked, region) => {
		if (checked) {
			onChange({
				country: country[1],
				states: [...(value?.states || []), region],
			});
		} else {
			onChange({
				country: country[1],
				states: (value?.states || []).filter(
					(state) => state !== region
				),
			});
		}
	};

	return (
		<div
			css={css`
				border-bottom: 1px solid var(--sc-color-gray-100);
			`}
		>
			<div
				css={css`
					display: flex;
					align-items: center;
					justify-content: space-between;
				`}
			>
				<CheckboxControl
					indeterminate={
						value?.states?.length > 0 &&
						value?.states?.length < territoriesCount
					}
					label={country[0]}
					css={css`
						padding: var(--sc-spacing-large);
					`}
					__nextHasNoMarginBottom
					checked={value?.country === country[1]}
					onChange={onSelectCountry}
				/>

				{territoriesCount > 1 && (
					<ScButton
						type="text"
						onClick={() => setIsOpen(!isOpen)}
						css={css`
							&::part(base) {
								font-size: 400;
							}
						`}
					>
						{sprintf(
							_n(
								'%d region',
								'%d regions',
								territoriesCount,
								'surecart'
							),
							territoriesCount
						)}
						<ScIcon
							slot="suffix"
							name={isOpen ? 'chevron-up' : 'chevron-down'}
						/>
					</ScButton>
				)}
			</div>

			{isOpen && (
				<div>
					{territories.map((region) => {
						return (
							<CheckboxControl
								label={region[0]}
								checked={(value?.states || []).includes(
									region[1]
								)}
								onChange={(checked) =>
									onChangeTerritory(checked, region[1])
								}
								__nextHasNoMarginBottom
								css={css`
									padding: var(--sc-spacing-medium);
									padding-left: var(--sc-spacing-xxx-large);
									&:last-child {
										margin-bottom: var(--sc-spacing-medium);
									}
								`}
								key={region[0]}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
};
