export default ({ page, totalPages, loading, button_text, onClick }) => {
	const hasButton = () => {
		if (loading) return true;
		if (parseInt(page) < parseInt(totalPages)) return true;
		return false;
	};

	return (
		hasButton() && (
			<sc-button onClick={onClick} loading={loading}>
				{button_text || __('Load More', 'surecart')}
			</sc-button>
		)
	);
};
