/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import Box from '../../../ui/Box';
import { ScSkeleton } from '@surecart/components-react';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from 'react';
import AddImage from './AddImage';
import ImageDisplay from './ImageDisplay';
import Error from '../../../components/Error';
import SortableList, { SortableItem } from 'react-easy-sort';
import arrayMove from 'array-move';

export default ({ post, loading }) => {
	const [error, setError] = useState();
	const { editEntityRecord } = useDispatch(coreStore);

	const onDragStop = (oldIndex, newIndex) => {
		const gallery = arrayMove(post?.gallery || [], oldIndex, newIndex);
		editEntityRecord('postType', 'sc_product', post?.id, { gallery });
	};

	return (
		<Box title={__('Images', 'surecart')}>
			<Error error={error} setError={setError} margin="100px" />
			<SortableList
				css={css`
					display: grid;
					gap: 1em;
					grid-template-columns: ${loading || post?.gallery?.length
						? 'repeat(4, 1fr)'
						: '1fr'};
				`}
				onSortEnd={onDragStop}
			>
				{loading ? (
					[...Array(4)].map(() => {
						return (
							<ScSkeleton
								style={{
									aspectRatio: '1 / 1',
									'--border-radius':
										'var(--sc-border-radius-medium)',
								}}
							/>
						);
					})
				) : (
					<>
						{post?.gallery.map((id, index) => (
							<SortableItem key={id}>
								<div
									css={css`
										user-select: none;
										cursor: grab;
									`}
								>
									<ImageDisplay
										onRemove={() => {
											editEntityRecord(
												'postType',
												'sc_product',
												post?.id,
												{
													gallery:
														post?.gallery.filter(
															(item) =>
																item !== id
														),
												}
											);
										}}
										id={id}
										isFeatured={index === 0}
									/>
								</div>
							</SortableItem>
						))}
						<AddImage
							value={post?.gallery || []}
							onSelect={(gallery) => {
								editEntityRecord(
									'postType',
									'sc_product',
									post?.id,
									{
										gallery: gallery.map(({ id }) => id),
									}
								);
							}}
						/>
					</>
				)}
			</SortableList>
		</Box>
	);
};
