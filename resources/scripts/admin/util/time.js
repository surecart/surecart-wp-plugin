export function formatTime( s ) {
	const dtFormat = new Intl.DateTimeFormat( [], {
		timeStyle: 'medium',
		dateStyle: 'full',
		timeZone: 'UTC',
	} );

	return dtFormat.format( new Date( s * 1e3 ) );
}
