import { __ } from '@wordpress/i18n';
import AdHoc from './parts/AdHoc';
import Amount from './parts/Amount';
import ScratchAmount from './parts/ScratchAmount';
import { Flex, FlexBlock } from '@wordpress/components';
import RevokeAfterDays from './parts/RevokeAfterDays';

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
			<RevokeAfterDays price={price} updatePrice={updatePrice} />
		</>
	);
};
