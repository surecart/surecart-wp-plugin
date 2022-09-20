export default ({ className }) => {

	return (
		<sc-checkbox
			class={className || false}
			name="get_feedback"
      value="Feedback"
      style="position: absolute; left: -9999px; top: -9999px;"
		>
		</sc-checkbox>
	);
};
