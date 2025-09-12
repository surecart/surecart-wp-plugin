/** @jsx jsx */
import { jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { TextControl, TextareaControl, SelectControl } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import { ScCard, ScCardBody, ScCardHeader, ScFlex, ScIcon } from '@surecart/components-react';
import PropertyList from '../../components/PropertyList';
import PropertyItem from '../../components/PropertyItem';
import Card from '../../components/Card';
import Loading from '../../components/Loading';

export default ({ review = {}, onUpdate, loading, saving, deleting }) => {
	if (loading) {
		return <Loading />;
	}

	return (
		<>
			<ScCard style={{ '--sc-card-box-shadow': 'none' }}>
				<ScCardHeader>
					<h3>{__('Review Details', 'surecart')}</h3>
				</ScCardHeader>
				<ScCardBody>
					<PropertyList>
						<PropertyItem
							label={__('Title', 'surecart')}
							value={
								<TextControl
									value={review?.title || ''}
									onChange={(title) => onUpdate({ title })}
									disabled={saving || deleting}
								/>
							}
						/>
						<PropertyItem
							label={__('Comment', 'surecart')}
							value={
								<TextareaControl
									value={review?.comment || ''}
									onChange={(comment) => onUpdate({ comment })}
									disabled={saving || deleting}
									rows={5}
								/>
							}
						/>
						<PropertyItem
							label={__('Rating', 'surecart')}
							value={
								<SelectControl
									value={review?.rating || 5}
									onChange={(rating) => onUpdate({ rating: parseInt(rating) })}
									disabled={saving || deleting}
									options={[
										{ label: '⭐ (1 Star)', value: 1 },
										{ label: '⭐⭐ (2 Stars)', value: 2 },
										{ label: '⭐⭐⭐ (3 Stars)', value: 3 },
										{ label: '⭐⭐⭐⭐ (4 Stars)', value: 4 },
										{ label: '⭐⭐⭐⭐⭐ (5 Stars)', value: 5 },
									]}
								/>
							}
						/>
						<PropertyItem
							label={__('Reviewer Name', 'surecart')}
							value={
								<TextControl
									value={review?.reviewer_name || ''}
									onChange={(reviewer_name) => onUpdate({ reviewer_name })}
									disabled={saving || deleting}
								/>
							}
						/>
						<PropertyItem
							label={__('Reviewer Email', 'surecart')}
							value={
								<TextControl
									value={review?.reviewer_email || ''}
									onChange={(reviewer_email) => onUpdate({ reviewer_email })}
									disabled={saving || deleting}
									type="email"
								/>
							}
						/>
					</PropertyList>
				</ScCardBody>
			</ScCard>

			{review?.customer && (
				<Card
					style={{ marginTop: '1em' }}
					title={__('Customer', 'surecart')}
					icon="user"
				>
					<PropertyList>
						<PropertyItem
							label={__('Name', 'surecart')}
							value={review.customer.name || '-'}
						/>
						<PropertyItem
							label={__('Email', 'surecart')}
							value={review.customer.email || '-'}
						/>
					</PropertyList>
				</Card>
			)}

			{review?.product && (
				<Card
					style={{ marginTop: '1em' }}
					title={__('Product', 'surecart')}
					icon="package"
				>
					<PropertyList>
						<PropertyItem
							label={__('Name', 'surecart')}
							value={
								<a href={`admin.php?page=sc-products&action=edit&id=${review.product.id}`}>
									{review.product.name}
								</a>
							}
						/>
					</PropertyList>
				</Card>
			)}

			{review?.purchase && (
				<Card
					style={{ marginTop: '1em' }}
					title={__('Purchase', 'surecart')}
					icon="shopping-cart"
				>
					<PropertyList>
						<PropertyItem
							label={__('Order', 'surecart')}
							value={
								<a href={`admin.php?page=sc-orders&action=edit&id=${review.purchase.order}`}>
									{review.purchase.order}
								</a>
							}
						/>
						{review.purchase.created_at_date_time && (
							<PropertyItem
								label={__('Purchase Date', 'surecart')}
								value={review.purchase.created_at_date_time}
							/>
						)}
					</PropertyList>
				</Card>
			)}

			<Card
				style={{ marginTop: '1em' }}
				title={__('Status', 'surecart')}
				icon="info"
			>
				<PropertyList>
					<PropertyItem
						label={__('Current Status', 'surecart')}
						value={
							<ScFlex align-items="center" style={{ gap: '0.5em' }}>
								{review?.status === 'published' ? (
									<>
										<ScIcon name="check-circle" style={{ color: 'var(--sc-color-success-500)' }} />
										{__('Published', 'surecart')}
									</>
								) : (
									<>
										<ScIcon name="eye-off" style={{ color: 'var(--sc-color-gray-500)' }} />
										{__('Unpublished', 'surecart')}
									</>
								)}
							</ScFlex>
						}
					/>
					{review?.created_at_date_time && (
						<PropertyItem
							label={__('Created', 'surecart')}
							value={review.created_at_date_time}
						/>
					)}
					{review?.updated_at_date_time && (
						<PropertyItem
							label={__('Last Updated', 'surecart')}
							value={review.updated_at_date_time}
						/>
					)}
				</PropertyList>
			</Card>
		</>
	);
};