/**
 * External dependencies.
 */
import { useRegistry } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { store as interfaceStore } from '@wordpress/interface';

export default function () {
	const registry = useRegistry();

	useEffect(() => {
		registry.register(interfaceStore);
	}, [registry]);

	return null;
}
