export function formatTime(
	s,
	options = {
		timeStyle: 'medium',
		dateStyle: 'full',
		timeZone: 'UTC',
	},
	locale = []
) {
	const dtFormat = new Intl.DateTimeFormat( locale, options );
	return dtFormat.format( new Date( s * 1e3 ) );
}
