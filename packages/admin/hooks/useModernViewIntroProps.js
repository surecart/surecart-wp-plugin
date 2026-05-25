const useModernViewIntroProps = () => {
	const intro =
		typeof window !== 'undefined' && window.scData?.modern_view_intro;
	if (!intro?.enabled) return null;

	return {
		enabled: !!intro.enabled,
		dismissed: !!intro.dismissed,
		imageUrl: intro.image_url,
		toggleId: intro.toggle_id,
		dismissUrl: intro.dismiss_url,
		dismissNonce: intro.dismiss_nonce,
	};
};

export default useModernViewIntroProps;
