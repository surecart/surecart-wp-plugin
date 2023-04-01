/**
 * External dependencies
 */
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import memoize from 'memize';
import * as uuid from 'uuid';
import { useRef } from 'react';

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

	return (
		<>
			<div ref={ref} style={{ display: 'none' }} />
			{ref?.current?.ownerDocument ? (
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
