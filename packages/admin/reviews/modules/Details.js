/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScInput, ScTextarea, ScSelect } from '@surecart/components-react';
import Box from '../../ui/Box';
import SaveButton from '../../templates/SaveButton';

export default ({ review, updateReview, loading, saving, deleting }) => {
	return (
		<Box
			title={__('Review Details', 'surecart')}
			loading={loading}
			footer={
				!loading && (
					<SaveButton busy={loading || saving || deleting}>
						{__('Save Review', 'surecart')}
					</SaveButton>
				)
			}
		>
			<div
				css={css`
					display: flex;
					gap: 1em;
					flex-direction: column;
				`}
			>
				<ScInput
					label={__('Title', 'surecart')}
					help={__('The review title or headline.', 'surecart')}
					value={review?.title || ''}
					onScInput={(e) => updateReview({ title: e.target.value })}
					disabled={saving || deleting}
				/>

				<ScSelect
					label={__('Rating', 'surecart')}
					help={__('The star rating for this review.', 'surecart')}
					value={review?.stars || 5}
					onScChange={(e) =>
						updateReview({ stars: parseInt(e.target.value) })
					}
					disabled={saving || deleting}
					choices={[
						{ value: 1, label: '★ (1 Star)' },
						{ value: 2, label: '★★ (2 Stars)' },
						{ value: 3, label: '★★★ (3 Stars)' },
						{ value: 4, label: '★★★★ (4 Stars)' },
						{ value: 5, label: '★★★★★ (5 Stars)' },
					]}
				/>

				<ScTextarea
					label={__('Comment', 'surecart')}
					help={__(
						'The detailed review comment or feedback.',
						'surecart'
					)}
					value={review?.body || ''}
					onScInput={(e) => updateReview({ body: e.target.value })}
					disabled={saving || deleting}
					rows={5}
				/>
			</div>
		</Box>
	);
};
