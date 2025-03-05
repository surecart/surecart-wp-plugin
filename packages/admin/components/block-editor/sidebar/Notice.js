/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { store as preferencesStore } from '@wordpress/preferences';
import { Notice } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';

export default function () {
	const { set } = useDispatch(preferencesStore);
	const hide = useSelect((select) =>
		select(preferencesStore).get(
			'surecart/product-content-editor',
			'hideProductContentBetaNotice'
		)
	);
	const remove = () => {
		set(
			'surecart/product-content-editor',
			'hideProductContentBetaNotice',
			true
		);
	};

	if (hide) {
		return null;
	}

	return (
		<Notice
			css={css`
				margin: 0 16px;
			`}
			onDismiss={remove}
		>
			{__(
				'The Product Content Editor is new. Some block libraries may have limited compatibility.',
				'surecart'
			)}
		</Notice>
	);
}
