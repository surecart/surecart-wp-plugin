/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	BlockControls,
} from '@wordpress/block-editor';
import {
	UnitControl as __stableUnitControl,
	__experimentalUnitControl,
	Notice,
	Button,
} from '@wordpress/components';
import { useEntityRecord } from '@wordpress/core-data';

/**
 * Internal dependencies.
 */
import { TEMPLATE } from './template';
import ListToolbar from '../../utilities/patterns-toolbar';
import InspectorControls from './inspector-controls';

/**
 * Product Review List Edit.
 */
export default function ProductReviewListEdit({
	setAttributes,
	attributes,
	attributes: { query },
	name,
	clientId,
	openPatternSelectionModal,
}) {
	/**
	 * Fetch review protocol settings.
	 */
	const { record: reviewProtocol } = useEntityRecord(
		'surecart',
		'store',
		'review_protocol'
	);
	const isReviewsDisabled = reviewProtocol && !reviewProtocol.reviews_enabled;

	/**
	 * Block props.
	 */
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
	});

	/**
	 * Update the query attributes.
	 *
	 * @param {Object} newQuery - The new query object.
	 */
	const updateQuery = (newQuery) => {
		setAttributes({ query: { ...query, ...newQuery } });
	};

	return (
		<>
			<InspectorControls
				attributes={attributes}
				setAttributes={setAttributes}
				onUpdateQuery={updateQuery}
			/>

			<BlockControls>
				<ListToolbar
					name={name}
					clientId={clientId}
					openPatternSelectionModal={openPatternSelectionModal}
				/>
			</BlockControls>

			{isReviewsDisabled && (
				<Notice status="warning" isDismissible={false}>
					{__(
						'Product reviews are disabled in global settings.',
						'surecart'
					)}{' '}
					<Button
						variant="link"
						onClick={() => {
							window.parent.location.href =
								'admin.php?page=sc-settings&tab=review_protocol';
						}}
					>
						{__('Enable reviews', 'surecart')}
					</Button>
				</Notice>
			)}

			<div {...innerBlocksProps} />
		</>
	);
}
