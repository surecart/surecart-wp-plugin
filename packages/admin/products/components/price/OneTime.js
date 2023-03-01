import { __ } from '@wordpress/i18n';
import { Flex, FlexBlock } from '@wordpress/components';
import AdHoc from './parts/AdHoc';
import Amount from './parts/Amount';
import ScratchAmount from './parts/ScratchAmount';

export default ({ price, updatePrice }) => {
	return (
		<>
			<Flex>
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
