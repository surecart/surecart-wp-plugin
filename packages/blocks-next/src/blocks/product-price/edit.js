/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	AlignmentControl,
	BlockControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import HeadingLevelDropdown from '../../components/HeadingLebelDropdown';

export default ({ attributes: { level, textAlign }, setAttributes, context: { metrics }, }) => {
	const blockProps = useBlockProps();

	return (
		<>
			<p {...blockProps}>{metrics?.max_price_amount}</p>
		</>
	);
};
