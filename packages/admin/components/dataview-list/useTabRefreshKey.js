import { useCallback, useState } from 'react';

export default function useTabRefreshKey() {
	const [refreshKey, setRefreshKey] = useState(0);
	const bump = useCallback(() => setRefreshKey((k) => k + 1), []);
	return { refreshKey, bump };
}
