import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { ScIcon } from '@surecart/components-react';
import { useEntityRecord } from '@wordpress/core-data';

export default function Edit() {
	const blockProps = useBlockProps();
	const { record: account } = useEntityRecord('surecart', 'store', 'account');

	return (
		<div {...blockProps}>
			<div className="sc-dropdown">
				<div className="sc-dropdown__trigger sc-button sc-button--standard sc-button--medium sc-button--caret sc-button--has-label sc-button--text">
					<span className="sc-button__label">
						{account?.currency?.toUpperCase?.() ||
							__('Currency', 'surecart')}
					</span>
					<span className="sc-button__caret">
						<ScIcon name="chevron-down" />
					</span>
				</div>
			</div>
		</div>
	);
}
