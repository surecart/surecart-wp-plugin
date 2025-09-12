/** @jsx jsx */
import { jsx } from '@emotion/react';
import { __ } from '@wordpress/i18n';
import { useState, useEffect, useMemo } from '@wordpress/element';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { format } from '@wordpress/date';
import { decodeEntities } from '@wordpress/html-entities';
import apiFetch from '@wordpress/api-fetch';
import './components/Rating';

const ReviewsList = () => {
	const [reviews, setReviews] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [status, setStatus] = useState('all');

	const perPage = 10;

	useEffect(() => {
		fetchReviews();
	}, [page, status]);

	const fetchReviews = async () => {
		setLoading(true);
		try {
			const params = {
				page,
				per_page: perPage,
			};
			
			if (status !== 'all') {
				params.status = status;
			}

			const response = await apiFetch({
				path: `/surecart/v1/reviews?${new URLSearchParams(params)}`,
				parse: false,
			});
			
			const data = await response.json();
			setReviews(data.data || []);
			setTotal(parseInt(response.headers.get('X-WP-Total') || 0));
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const columns = useMemo(
		() => [
			{
				Header: __('Reviewer', 'surecart'),
				accessor: 'customer',
				Cell: ({ row }) => {
					const review = row.original;
					const customerName = review.customer?.name || __('Unknown', 'surecart');
					const customerEmail = review.customer?.email || '';
					const avatarUrl = customerEmail ? `https://www.gravatar.com/avatar/${wp.SparkMD5.hash(customerEmail.toLowerCase())}?s=32&d=mm` : '';
					
					return (
						<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
							{avatarUrl && (
								<img 
									src={avatarUrl} 
									alt={customerName}
									style={{ width: '32px', height: '32px', borderRadius: '50%' }}
								/>
							)}
							<div>
								<div>{decodeEntities(customerName)}</div>
								{customerEmail && (
									<div style={{ fontSize: '12px', color: '#666' }}>{customerEmail}</div>
								)}
							</div>
						</div>
					);
				},
			},
			{
				Header: __('Rating', 'surecart'),
				accessor: 'stars',
				Cell: ({ value }) => (
					<sc-rating value={value} readonly style={{ '--sc-rating-symbol-size': '16px' }}></sc-rating>
				),
			},
			{
				Header: __('Review', 'surecart'),
				accessor: 'title',
				Cell: ({ value }) => decodeEntities(value || ''),
			},
			{
				Header: __('Product', 'surecart'),
				accessor: 'product',
				Cell: ({ value }) => decodeEntities(value?.name || ''),
			},
			{
				Header: __('Reviewed on', 'surecart'),
				accessor: 'created_at',
				Cell: ({ value }) => format('Y-m-d', value * 1000),
			},
			{
				Header: __('Status', 'surecart'),
				accessor: 'status',
				Cell: ({ value }) => {
					const statusMap = {
						published: { type: 'success', label: __('Published', 'surecart') },
						in_review: { type: 'warning', label: __('In Review', 'surecart') },
						archived: { type: 'default', label: __('Archived', 'surecart') },
					};
					
					const status = statusMap[value] || { type: 'default', label: value };
					return <StatusBadge type={status.type}>{status.label}</StatusBadge>;
				},
			},
		],
		[]
	);

	const data = useMemo(() => reviews, [reviews]);

	const handleRowClick = (row) => {
		window.location.href = `${window.scAdmin.admin_url}admin.php?page=sc-reviews&action=edit&id=${row.original.id}`;
	};

	return (
		<div>
			<div style={{ marginBottom: '20px' }}>
				<sc-button-group>
					<sc-button
						type={status === 'all' ? 'primary' : 'default'}
						size="small"
						onClick={() => {
							setStatus('all');
							setPage(1);
						}}
					>
						{__('All', 'surecart')}
					</sc-button>
					<sc-button
						type={status === 'in_review' ? 'primary' : 'default'}
						size="small"
						onClick={() => {
							setStatus('in_review');
							setPage(1);
						}}
					>
						{__('In Review', 'surecart')}
					</sc-button>
					<sc-button
						type={status === 'published' ? 'primary' : 'default'}
						size="small"
						onClick={() => {
							setStatus('published');
							setPage(1);
						}}
					>
						{__('Published', 'surecart')}
					</sc-button>
				</sc-button-group>
			</div>

			{error && (
				<sc-alert type="danger" open>
					{error}
				</sc-alert>
			)}

			<DataTable
				columns={columns}
				data={data}
				loading={loading}
				onRowClick={handleRowClick}
				manualPagination
				pageCount={Math.ceil(total / perPage)}
				onPageChange={({ pageIndex }) => setPage(pageIndex + 1)}
				initialState={{
					pageIndex: page - 1,
					pageSize: perPage,
				}}
			/>
		</div>
	);
};

export default ReviewsList;