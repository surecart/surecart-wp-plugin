import { __ } from '@wordpress/i18n';
import Trial from './parts/Trial';
import Amount from './parts/Amount';
import AdHoc from './parts/AdHoc';
import ScratchAmount from './parts/ScratchAmount';
import { Flex, FlexBlock } from '@wordpress/components';

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
			<Trial price={price} updatePrice={updatePrice} />
		</>
	);
};
