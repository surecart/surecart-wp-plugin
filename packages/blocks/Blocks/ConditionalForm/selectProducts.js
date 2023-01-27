/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState } from '@wordpress/element';
import ModelSelector from '../../../admin/components/ModelSelector';
import {
	ScButton,
	ScCard,
	ScFormControl,
	ScIcon,
	ScStackedList,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import ProductItem from './ProductItem';

export default (props) => {
	const { label, value, placeholder, onChange } = props;
	const [addNew, setAddNew] = useState(false);

	return (
		<>
			{!!(value || [])?.length && (
				<ScCard noPadding>
					<ScStackedList>
						{(value || []).map((id) => (
							<ProductItem
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
					css={css`
						display: grid;
						gap: var(--sc-spacing-medium);
					`}
				>
					<ModelSelector
						placeholder={placeholder}
						name="product"
						requestQuery={{
							archived: false,
						}}
						exclude={value}
						onSelect={(id) => {
							if (id) {
								onChange([
									...new Set([...(value || []), ...[id]]),
								]);
							}
						}}
						onClose={() => setAddNew(false)}
						open={addNew}
					/>
				</ScFormControl>
			) : (
				<div>
					<ScButton type="link" onClick={() => setAddNew(true)}>
						<ScIcon name="plus" slot="prefix" />
						{__('Add Another Product', 'surecart')}
					</ScButton>
				</div>
			)}
		</>
	);
};
