import { __ } from '@wordpress/i18n';
import AdHoc from './parts/AdHoc';
import Amount from './parts/Amount';
import { ScFlex } from '@surecart/components-react';
import ScratchAmount from './parts/ScratchAmount';
import { Flex, FlexBlock } from '@wordpress/components';

export default ({ price, updatePrice }) => {
	return (
		<>
			<Flex gap={4}>
				<FlexBlock>
					<Amount price={price} updatePrice={updatePrice} />
				</FlexBlock>
				<FlexBlock>
					<ScratchAmount price={price} updatePrice={updatePrice} />
				</FlexBlock>
			</Flex>
			<AdHoc price={price} updatePrice={updatePrice} />
		</>
	);
};
