/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import SelectModel from '../../../components/SelectModel';

export default ({ model, position }) => {
	const [data, setData] = useState([]);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);

	const onQuery = async () => {
		try {
			setLoading(true);
			const response = await apiFetch({
				path: addQueryArgs(
					'surecart/v1/integration_providers/product',
					{
						context: 'edit',
						per_page: 100,
					}
				),
			});
			setData(response);
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false);
		}
	};

	return (
		<SelectModel
			placeholder={__('Select An Integration', 'surecart')}
			position={position || 'bottom-left'}
			choices={(data || []).map((provider) => ({
				label: provider.name,
				value: provider.slug,
			}))}
			loading={loading}
			onSelect={onSelect}
			onQuery={onQuery}
		/>
	);
};
