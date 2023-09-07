/**
 * External dependencies.
 */
import {
	Button,
	__experimentalHStack as HStack,
	Modal,
	TextControl,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { cleanForSlug } from '@wordpress/url';

const DEFAULT_TITLE = __('Custom Product Collection page', 'surecart');

export default function CollectionTemplateCreateModal({
	onClose,
	template,
	collection,
	updateCollection,
}) {
	const [title, setTitle] = useState('');
	const [isBusy, setIsBusy] = useState(false);
	const { saveEntityRecord } = useDispatch(coreStore);

	const cancel = () => {
		setTitle('');
		onClose();
	};

	const submit = async (event) => {
		event.preventDefault();

		if (isBusy) {
			return;
		}

		setIsBusy(true);

		const newTemplateContent = template?.content?.raw;

		const { id } = await saveEntityRecord('postType', 'wp_template', {
			slug: `sc-product-collection-${cleanForSlug(
				title || DEFAULT_TITLE
			)}`,
			content: newTemplateContent,
			title: title || DEFAULT_TITLE,
		});

		updateCollection({
			metadata: {
				...collection.metadata,
				wp_template_id: id,
			},
		});

		setIsBusy(false);
		cancel();
	};

	return (
		<Modal
			title={__('Create Template', 'surecart')}
			onRequestClose={cancel}
			className="edit-post-post-template__create-modal"
		>
			<form
				className="edit-post-post-template__create-form"
				onSubmit={submit}
			>
				<VStack spacing="3">
					<TextControl
						__nextHasNoMarginBottom
						label={__('Name', 'surecart')}
						value={title}
						onChange={setTitle}
						placeholder={DEFAULT_TITLE}
						disabled={isBusy}
						help={__(
							'Describe the template, e.g. "Mens T-Shirt Template". A custom template can be manually applied to any collection archive.',
							'surecart'
						)}
					/>
					<HStack justify="right">
						<Button variant="tertiary" onClick={cancel}>
							{__('Cancel', 'surecart')}
						</Button>

						<Button
							variant="primary"
							type="submit"
							isBusy={isBusy}
							aria-disabled={isBusy}
						>
							{__('Create', 'surecart')}
						</Button>
					</HStack>
				</VStack>
			</form>
		</Modal>
	);
}
