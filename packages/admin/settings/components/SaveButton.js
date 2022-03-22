const { __ } = wp.i18n;
const { Button } = wp.components;
const { useSelect, dispatch } = wp.data;

export default ({ style, className }) => {
	const ui = useSelect((select) => {
		return select('surecart/settings').ui();
	});

	const save = (e) => {
		e.preventDefault();
		dispatch('surecart/settings').save();
	};

	return (
		<Button
			isPrimary
			style={style}
			className={className}
			disabled={ui.saving}
			onClick={save}
		>
			{__('Save Changes', 'presto-player')}
		</Button>
	);
};
