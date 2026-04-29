import { useState } from '@wordpress/element';
import PriceSelector from '../../../../../admin/components/PriceSelector';
import {
	ScButton,
	ScCard,
	ScFormControl,
	ScIcon,
	ScStackedList,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import PriceItem from './PriceItem';

export default (props) => {
	const { label, value, placeholder, onChange } = props;
	const [addNew, setAddNew] = useState(false);

	return (
		<>
			{!!(value || [])?.length && (
				<ScCard noPadding>
					<ScStackedList>
						{(value || []).map((id) => (
							<PriceItem
								id={id}
								key={id}
								onRemove={() =>
									onChange(
										(value || []).filter(
											(existing) => existing !== id
										)
									)
								}
							/>
						))}
					</ScStackedList>
				</ScCard>
			)}
			{!(value || [])?.length || addNew ? (
				<ScFormControl
					label={label}
					showLabel={false}
					style={{
						display: 'grid',
						gap: 'var(--sc-spacing-medium)',
					}}
				>
					<PriceSelector
						value={null}
						placeholder={
							placeholder ||
							__('Search for prices...', 'surecart')
						}
						ad_hoc={false}
						includeVariants={false}
						requestQuery={{ archived: false }}
						exclude={value}
						open={addNew}
						onSelect={({ price_id }) => {
							if (price_id) {
								onChange([
									...new Set([
										...(value || []),
										...[price_id],
									]),
								]);
								setAddNew(false);
							}
						}}
						onScHide={() => setAddNew(false)}
					/>
				</ScFormControl>
			) : (
				<div>
					<ScButton type="link" onClick={() => setAddNew(true)}>
						<ScIcon name="plus" slot="prefix" />
						{__('Add Another Price', 'surecart')}
					</ScButton>
				</div>
			)}
		</>
	);
};
