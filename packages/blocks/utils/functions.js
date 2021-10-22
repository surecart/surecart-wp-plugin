/**
 * Unique array of elements by property name
 * @returns
 */
export function unique( array, propertyName ) {
	return array.filter(
		( e, i ) =>
			array.findIndex(
				( a ) => a[ propertyName ] === e[ propertyName ]
			) === i
	);
}
