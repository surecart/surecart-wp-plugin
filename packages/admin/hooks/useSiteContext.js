const useSiteContext = () => {
	const scData = (typeof window !== 'undefined' && window.scData) || {};
	return {
		siteName:
			scData.site_name ||
			(typeof window !== 'undefined'
				? window.location?.hostname ?? ''
				: ''),
		siteHref:
			scData.home_url ||
			(typeof window !== 'undefined' ? window.location?.origin : ''),
		siteIconUrl: scData.site_icon_url || '',
		dashboardHref: 'index.php',
	};
};

export default useSiteContext;
