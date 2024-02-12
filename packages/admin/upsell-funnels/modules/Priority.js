/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import Box from '../../ui/Box';

export default ({ funnel, updateFunnel, loading }) => {
	return (
		<Box title={__('Priority', 'surecart')} loading={loading}>
			<RangeControl
				label={__('Priority', 'surecart')}
				hideLabelFromVision={true}
				css={css`
					padding: 0 15px 15px;
					span.components-range-control__marks {
						margin-top: 15px;
					}
				`}
				min={1}
				max={5}
				__next40pxDefaultSize={true}
				__nextHasNoMarginBottom={true}
				withInputField={false}
				marks={[
					{
						value: 1,
						label: __('Low', 'surecart'),
					},
					{
						value: 2,
					},
					{
						value: 3,
						label: __('Medium', 'surecart'),
					},
					{
						value: 4,
					},
					{
						value: 5,
						label: __('High', 'surecart'),
					},
				]}
				value={funnel?.priority}
				onChange={(value) => updateFunnel({ priority: value })}
			/>
		</Box>
	);
};
