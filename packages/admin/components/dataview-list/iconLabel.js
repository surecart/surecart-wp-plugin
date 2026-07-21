import { Tooltip } from '@wordpress/components';

/**
 * Label-function for DataViews actions. Renders an icon and a text label
 * as siblings; CSS decides which is visible per context.
 *
 * @param {JSX.Element} iconElement e.g. `<Icon icon={edit} />`
 * @param {string}      text        Translated label.
 */
const iconLabel = (iconElement, text) => () =>
	(
		<>
			<Tooltip text={text}>
				<span className="dataviews-action-icon">{iconElement}</span>
			</Tooltip>
			<span className="dataviews-action-label">{text}</span>
		</>
	);

export default iconLabel;
