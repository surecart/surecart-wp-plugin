/**
 * Page header shared across admin list pages.
 *
 * Renders the `<h1>` title plus an optional primary action button. Matches
 * the `wp-heading-inline` / `wp-header-end` structure WP List Table uses,
 * so legacy and SPA pages share the same visual chrome.
 *
 * @param {Object}          props
 * @param {string}          props.title         Page title shown as `<h1>`.
 * @param {string}          [props.actionLabel] Button label (e.g. "Add New").
 * @param {string}          [props.actionHref]  Href used for modified clicks / fallback nav.
 * @param {(e: Event) => void} [props.onAction] Handler for plain clicks; if absent, the href is followed.
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
