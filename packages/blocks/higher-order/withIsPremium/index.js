import { forwardRef } from '@wordpress/element';
import { createHigherOrderComponent } from '@wordpress/compose';

/**
 * Detects if the premium plan is active which allows for specific
 *  items in the UI
 *
 * @param  {WPComponent} OriginalComponent Original component.
 *
 * @return {WPComponent} Wrapped component.
 */
export default createHigherOrderComponent((OriginalComponent) => {
	function Component(props, ref) {
		// todo: maybe make a fetch call here
		const propsOut = {
			...props,
			isPremium: true,
		};

		return isForwardRef ? (
			<OriginalComponent {...propsOut} ref={ref} />
		) : (
			<OriginalComponent {...propsOut} />
		);
	}

	let isForwardRef;
	const { render } = OriginalComponent;
	// Returns a forwardRef if OriginalComponent appears to be a forwardRef
	if (typeof render === 'function') {
		isForwardRef = true;
		return forwardRef(Component);
	}
	return Component;
});
