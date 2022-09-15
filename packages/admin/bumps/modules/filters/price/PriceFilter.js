import {
	ScButton,
	ScDropdown,
	ScFormatNumber,
	ScIcon,
	ScMenu,
	ScMenuItem,
	ScSkeleton,
	ScStackedListRow,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import useEntity from '../../../../hooks/useEntity';
import { intervalString } from '../../../../util/translations';

export default ({ id }) => {
	const { price, hasLoadedPrice } = useEntity('price', id, {
		expand: ['product'],
	});

	return (
		<ScStackedListRow
			style={{
				'--columns': '1',
			}}
		>
			{!hasLoadedPrice ? (
				<ScSkeleton />
			) : (
				<>
					<div>
						<strong>{price?.product?.name}</strong> -{' '}
						<ScFormatNumber
							type="currency"
							currency={price?.currency || 'usd'}
							value={price?.amount}
						/>
						{intervalString(price)}
					</div>
					<ScDropdown slot="suffix" placement="bottom-end">
						<ScButton type="text" slot="trigger" circle>
							<ScIcon name="more-horizontal" />
						</ScButton>
						<ScMenu>
							<ScMenuItem>
								<ScIcon slot="prefix" name="trash" />
								{__('Remove', 'surecart')}
							</ScMenuItem>
						</ScMenu>
					</ScDropdown>
				</>
			)}
		</ScStackedListRow>
	);
};
