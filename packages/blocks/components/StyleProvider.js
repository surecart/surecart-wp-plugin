/**
 * External dependencies
 */
import { CacheProvider } from '@emotion/core';
import createCache from '@emotion/cache';
import memoize from 'memize';
import * as uuid from 'uuid';
import { useRef, useState, useEffect } from 'react';

const uuidCache = new Set();

const memoizedCreateCacheWithContainer = memoize((container) => {
	// Emotion only accepts alphabetical and hyphenated keys so we just
	// strip the numbers from the UUID. It _should_ be fine.
	let key = uuid.v4().replace(/[0-9]/g, '');
	while (uuidCache.has(key)) {
		key = uuid.v4().replace(/[0-9]/g, '');
	}
	uuidCache.add(key);
	return createCache({ container, key });
});

export function StyleProvider({ children }) {
	const ref = useRef();
	const [ready, setReady] = useState(false);

	// Wait for the ref to be attached before rendering children.
	// This ensures @emotion styles are injected into the correct document (iframe).
	useEffect(() => {
		if (ref.current?.ownerDocument) {
			setReady(true);
		}
	}, []);

	return (
		<>
			<div ref={ref} style={{ display: 'none' }} />
			{ready && ref?.current?.ownerDocument ? (
				<CacheProvider
					value={memoizedCreateCacheWithContainer(
						ref?.current?.ownerDocument?.head
					)}
				>
					{children}
				</CacheProvider>
			) : (
				children
			)}
		</>
	);
}

export default StyleProvider;
