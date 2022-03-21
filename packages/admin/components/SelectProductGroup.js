import { __ } from '@wordpress/i18n';
import { useRef } from '@wordpress/element';
import {
	CeSelect,
	CeDivider,
	CeMenuItem,
} from '@checkout-engine/components-react';
import throttle from 'lodash/throttle';
import { translateInterval } from '../util/translations';
import { formatNumber } from '../util';

export default ({
	open,
	required,
	groups,
	onSelect,
	value,
	help,
	className,
	onQuery,
	onFetch,
	onNew,
	loading,
}) => {
	const selectRef = useRef();
	const findItem = throttle(
		(value) => {
			onQuery(value);
		},
		750,
		{ leading: false }
	);

	const choices = (groups || []).map((group) => {
		return {
			label: group?.name,
			value: group.id,
		};
	});

	return (
		<CeSelect
			required={required}
			ref={selectRef}
			value={value}
			help={help}
			className={className}
			open={open}
			loading={loading}
			placeholder={__('Select an upgrade group', 'surecart')}
			searchPlaceholder={__('Search for an upgrade group...', 'surecart')}
			search
			onCeOpen={onFetch}
			onCeSearch={(e) => findItem(e.detail)}
			onCeChange={(e) => {
				onSelect(e.target.value);
			}}
			choices={choices}
		>
			{onNew && (
				<span slot="prefix">
					<CeMenuItem onClick={onNew}>
						<span slot="prefix">+</span>
						{__('Add New Upgrade Group', 'surecart')}
					</CeMenuItem>
					<CeDivider
						style={{ '--spacing': 'var(--ce-spacing-x-small)' }}
					></CeDivider>
				</span>
			)}
		</CeSelect>
	);
};
