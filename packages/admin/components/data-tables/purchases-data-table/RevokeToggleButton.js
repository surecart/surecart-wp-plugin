import { __, _n } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { CeButton } from '@checkout-engine/components-react';
import useEntity from '../../../mixins/useEntity';

export default ({ purchase }) => {
	const [loading, setLoading] = useState(false);
	const { updateEntity } = useEntity('purchase', purchase?.id);

	const toggleRevoke = async (id, revoke) => {
		const r = confirm(
			revoke
				? __(
						'Are you sure you want to revoke this purchase?',
						'checkout_engine'
				  )
				: __(
						'Are you sure you want to reinstate this purchase?',
						'checkout_engine'
				  )
		);

		// canceled.
		if (!r) {
			return;
		}

		setLoading(true);
		try {
			const result = await apiFetch({
				path: addQueryArgs(
					`checkout-engine/v1/purchases/${id}/${
						revoke ? 'revoke' : 'invoke'
					}`,
					{
						expand: ['product', 'product.price'],
					}
				),
				method: 'PATCH',
			});
			updateEntity(result);
		} catch (e) {
			throw e;
		} finally {
			setLoading(false);
		}
	};

	// TODO: Maybe offer subscription cancelation UI here.
	if (purchase?.subscription) {
		return null;
	}

	return purchase?.revoked ? (
		<CeButton
			href="#"
			onClick={() => toggleRevoke(purchase?.id, false)}
			size="small"
			loading={loading}
		>
			{__('Unrevoke', 'checkout_engine')}
		</CeButton>
	) : (
		<CeButton
			href="#"
			onClick={() => toggleRevoke(purchase?.id, true)}
			size="small"
			loading={loading}
		>
			{__('Revoke', 'checkout_engine')}
		</CeButton>
	);
};
