import useEntity from '../../../mixins/useEntity';
import { ScButton, ScTooltip } from '@surecart/components-react';
import apiFetch from '@wordpress/api-fetch';
import { useState } from '@wordpress/element';
import { __, _n } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

export default ({ purchase }) => {
	const [loading, setLoading] = useState(false);

	const toggleRevoke = async (id, revoke) => {
		const r = confirm(
			revoke
				? __(
						'Are you sure you want to revoke this purchase?',
						'surecart'
				  )
				: __(
						'Are you sure you want to reinstate this purchase?',
						'surecart'
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
					`surecart/v1/purchases/${id}/${
						revoke ? 'revoke' : 'invoke'
					}`,
					{
						expand: ['product', 'product.price'],
					}
				),
				method: 'PATCH',
			});
			receivePurchase(result);
		} catch (e) {
			throw e;
		} finally {
			setLoading(false);
		}
	};

	return purchase?.revoked ? (
		<ScTooltip
			type="text"
			text={
				!!purchase?.subscription
					? __(
							'To unrevoke this purchase, the customer must purchase a new subscription.',
							'surecart'
					  )
					: __('Unrevoke access to this purchase', 'surecart')
			}
		>
			<ScButton
				href="#"
				onClick={() => toggleRevoke(purchase?.id, false)}
				size="small"
				loading={loading}
				disabled={!!purchase?.subscription}
			>
				{__('Unrevoke', 'surecart')}
			</ScButton>
		</ScTooltip>
	) : (
		<ScTooltip
			type="text"
			text={
				!!purchase?.subscription
					? __(
							'To revoke this purchase you must cancel the subscription.',
							'surecart'
					  )
					: __('Revoke access to this purchase', 'surecart')
			}
		>
			<ScButton
				href="#"
				onClick={() => toggleRevoke(purchase?.id, true)}
				size="small"
				loading={loading}
				disabled={!!purchase?.subscription}
			>
				{__('Revoke', 'surecart')}
			</ScButton>
		</ScTooltip>
	);
};
