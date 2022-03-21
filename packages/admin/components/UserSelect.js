import { ScSelect } from '@surecart/components-react';
import { useRef, useState } from '@wordpress/element';
import { throttle } from 'lodash';
import { store as coreStore } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';

export default ({ required, value, className, onSelect }) => {
	const selectRef = useRef();
	const [query, setQuery] = useState(null);

	const choiceLabel = (user) => {
		if (user?.name && user?.email) {
			return `${user.email} (${user.name})`;
		}
		return user?.email;
	};

	const { choices, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'root',
				'user',
				{ search: query, context: 'edit' },
			];
			const users = select(coreStore).getEntityRecords(...queryArgs);
			return {
				choices: (users || []).map((user) => {
					return {
						label: choiceLabel(user),
						value: user?.id,
					};
				}),
				loading: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[query]
	);

	const findUser = throttle(
		(query) => {
			setQuery(query);
		},
		750,
		{ leading: false }
	);

	return (
		<ScSelect
			required={required}
			ref={selectRef}
			className={className}
			loading={loading}
			placeholder={__('Select a user', 'surecart')}
			searchPlaceholder={__('Search for a user...', 'surecart')}
			search
			onScSearch={(e) => findUser(e.detail)}
			onScChange={(e) => onSelect(e.target.value)}
			choices={choices}
		/>
	);
};
