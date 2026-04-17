/**
 * @var {string}         title
 * @var {string}         [actionLabel]
 * @var {string}         [actionHref]
 * @var {(e) => void}    [onAction]
 */
export default function ListHeader({
	title,
	actionLabel,
	actionHref,
	onAction,
}) {
	const showAction = actionLabel && (onAction || actionHref);

	const handleClick = (e) => {
		if (!onAction) return;
		// Let modified clicks fall through as native navigation.
		if (
			e.metaKey ||
			e.ctrlKey ||
			e.shiftKey ||
			e.altKey ||
			e.button !== 0
		) {
			return;
		}
		e.preventDefault();
		onAction(e);
	};

	return (
		<div className="sc-list-header">
			<div className="sc-list-header__bar">
				<h1 className="wp-heading-inline">{title}</h1>
				{showAction && (
					<a
						href={actionHref || '#'}
						onClick={handleClick}
						className="button button-primary sc-list-header__action"
						data-test-id="add-new-button"
					>
						{actionLabel}
					</a>
				)}
			</div>
			<hr className="wp-header-end" />
		</div>
	);
}
