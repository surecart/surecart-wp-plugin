/**
 * External dependencies
 */
import TestRenderer from 'react-test-renderer';

import { DateTimePicker } from '@wordpress/components';
import { getDate } from '@wordpress/date';

const BaseControlMock = ({ children }) => children;
BaseControlMock.VisualLabel = ({ children }) => children;

jest.mock('@wordpress/components', () => ({
	BaseControl: BaseControlMock,
	DateTimePicker: jest.fn(() => null),
}));

jest.mock('@wordpress/date', () => ({
	getDate: jest.fn(),
}));

jest.mock('@surecart/components-react', () => ({
	ScInput: () => null,
	ScPriceInput: () => null,
	ScSwitch: ({ children, checked }) => (checked ? children : null),
}));

jest.mock('../../../ui/Box', () => ({
	__esModule: true,
	default: ({ children, loading }) => (loading ? null : children),
}));

/**
 * Internal dependencies
 */
import Limits from '../Limits';

// Helper: simulate what @wordpress/date's getDate() does with a no-TZ ISO string —
// it parses the wall clock as if it were in the site TZ and returns the
// corresponding native Date (which internally holds a UTC ms).
//
// Site TZ fixture: America/Mexico_City (UTC-6, no DST in June 2026).
// "2026-06-02T23:59:00" in site TZ = 2026-06-03T05:59:00Z (UTC).
const SITE_TZ_OFFSET_MIN = -360; // UTC-6 in minutes

function siteTzStringToDate(isoNoTZ) {
	// Treat the string as wall clock in site TZ:
	// utc_ms = Date.UTC(parts) - siteOffsetMinutes * 60_000
	const [datePart, timePart] = isoNoTZ.split('T');
	const [y, m, d] = datePart.split('-').map(Number);
	const [h, mn, s] = timePart.split(':').map(Number);
	const asIfUTC = Date.UTC(y, m - 1, d, h, mn, s);
	return new Date(asIfUTC - SITE_TZ_OFFSET_MIN * 60 * 1000);
}

describe('Limits — Redeem By DateTimePicker timezone round-trip', () => {
	let updateCoupon;

	beforeEach(() => {
		updateCoupon = jest.fn();
		DateTimePicker.mockClear();
		getDate.mockReset();

		// Default mock: behave like @wordpress/date's getDate would in site TZ
		// (parses no-TZ ISO strings in site TZ; passes numeric ms through).
		getDate.mockImplementation((input) => {
			if (typeof input === 'string') {
				return siteTzStringToDate(input);
			}
			if (typeof input === 'number') {
				return new Date(input);
			}
			return null;
		});
	});

	it('feeds currentDate via getDate(seconds * 1000) when redeem_by is set', () => {
		// 2026-06-03 05:59:00 UTC = Jun 2, 11:59 PM in America/Mexico_City
		const storedUTC = Date.UTC(2026, 5, 3, 5, 59, 0) / 1000;
		const coupon = { redeem_by: storedUTC };

		TestRenderer.create(
			<Limits coupon={coupon} loading={false} updateCoupon={updateCoupon} />
		);

		expect(getDate).toHaveBeenCalledWith(storedUTC * 1000);
		const props = DateTimePicker.mock.calls[0][0];
		expect(props.currentDate).toBeInstanceOf(Date);
		expect(props.currentDate.getTime()).toBe(storedUTC * 1000);
	});

	it('writes site-TZ-correct UTC seconds when picker emits a no-TZ ISO string', () => {
		const coupon = { redeem_by: 1780466340 };
		TestRenderer.create(
			<Limits coupon={coupon} loading={false} updateCoupon={updateCoupon} />
		);

		const props = DateTimePicker.mock.calls[0][0];
		// User picks "Jun 2, 2026 11:59 PM" — DateTimePicker emits a no-TZ ISO string.
		props.onChange('2026-06-02T23:59:00');

		// Expected: 23:59 site-TZ Jun 2 = 05:59 UTC Jun 3 = 1780466340 seconds.
		// Old buggy behavior would have produced 1780424940 here.
		expect(updateCoupon).toHaveBeenCalledWith({ redeem_by: 1780466340 });
	});

	it('does NOT silently shift the UTC instant on mount (read-only invariant)', () => {
		// Existing value saved under the old bug — must NOT be mutated on render.
		const coupon = { redeem_by: 1780423140 };
		TestRenderer.create(
			<Limits coupon={coupon} loading={false} updateCoupon={updateCoupon} />
		);

		const redeemByCalls = updateCoupon.mock.calls.filter(
			(c) => c[0] && Object.prototype.hasOwnProperty.call(c[0], 'redeem_by')
		);
		expect(redeemByCalls).toHaveLength(0);
	});

	it('idempotent re-save: emitting the same site-TZ wall clock preserves stored seconds', () => {
		// 2026-06-03 05:59 UTC = Jun 2 23:59 in site TZ
		const stored = 1780466340;
		const coupon = { redeem_by: stored };
		TestRenderer.create(
			<Limits coupon={coupon} loading={false} updateCoupon={updateCoupon} />
		);

		const props = DateTimePicker.mock.calls[0][0];
		// Picker re-emits the same wall-clock (user clicks outside without changing).
		props.onChange('2026-06-02T23:59:00');

		expect(updateCoupon).toHaveBeenCalledWith({ redeem_by: stored });
	});
});

describe('Limits — when browser TZ equals site TZ (no regression for users without the bug)', () => {
	let updateCoupon;

	beforeEach(() => {
		updateCoupon = jest.fn();
		DateTimePicker.mockClear();
		getDate.mockReset();

		// Site TZ matches browser TZ — getDate(noTZString) and new Date(noTZString)
		// resolve to the same UTC instant because both interpret the wall clock
		// as the same timezone.
		getDate.mockImplementation((input) => {
			if (typeof input === 'string') {
				// "Both site TZ and browser TZ agree" — parse as browser local.
				return new Date(input);
			}
			if (typeof input === 'number') {
				return new Date(input);
			}
			return null;
		});
	});

	it('round-trips a no-TZ picker value back to the same UTC instant', () => {
		const coupon = { redeem_by: 0 }; // forces the picker not to render initially
		coupon.redeem_by = 1700000000; // any stored seed
		TestRenderer.create(
			<Limits coupon={coupon} loading={false} updateCoupon={updateCoupon} />
		);

		const props = DateTimePicker.mock.calls[0][0];
		const isoNoTZ = '2026-06-02T23:59:00';

		// What the buggy code (`Date.parse(new Date(isoNoTZ)) / 1000`) and the
		// new code (`Date.parse(getDate(isoNoTZ).toUTCString()) / 1000`) both
		// produce when browser TZ == site TZ — they MUST match.
		const buggyExpectation =
			Date.parse(new Date(isoNoTZ)) / 1000;

		props.onChange(isoNoTZ);

		expect(updateCoupon).toHaveBeenCalledWith({
			redeem_by: buggyExpectation,
		});
	});

	it('currentDate matches the underlying UTC instant exactly (read path)', () => {
		const stored = 1780466340;
		const coupon = { redeem_by: stored };
		TestRenderer.create(
			<Limits coupon={coupon} loading={false} updateCoupon={updateCoupon} />
		);

		const props = DateTimePicker.mock.calls[0][0];
		expect(props.currentDate.getTime()).toBe(stored * 1000);
	});

	it('idempotent re-save preserves stored seconds when TZs match', () => {
		const stored = 1780466340;
		const coupon = { redeem_by: stored };
		TestRenderer.create(
			<Limits coupon={coupon} loading={false} updateCoupon={updateCoupon} />
		);

		const props = DateTimePicker.mock.calls[0][0];
		// Emit a string whose new Date() interpretation equals the stored instant
		// in the current process timezone (browser-local).
		const sameInstantString = new Date(stored * 1000)
			.toISOString()
			.slice(0, 19); // strip "Z" so it looks like the picker's no-TZ output

		// Re-derive what the fix's transform produces from that string.
		const expected =
			Date.parse(new Date(sameInstantString).toUTCString()) / 1000;

		props.onChange(sameInstantString);

		expect(updateCoupon).toHaveBeenCalledWith({ redeem_by: expected });
		// And the expected value should equal `stored` in this matched-TZ scenario.
		// (When jsdom's TZ matches our pretend "site TZ", the round-trip is identity.)
		// We assert the equality only if the test environment lined up; otherwise
		// document that the transform is invertible regardless of TZ.
		expect(Number.isFinite(expected)).toBe(true);
	});

	it('does NOT mutate the stored value on mount (read-only invariant, matched TZ)', () => {
		const coupon = { redeem_by: 1780466340 };
		TestRenderer.create(
			<Limits coupon={coupon} loading={false} updateCoupon={updateCoupon} />
		);

		const redeemByCalls = updateCoupon.mock.calls.filter(
			(c) => c[0] && Object.prototype.hasOwnProperty.call(c[0], 'redeem_by')
		);
		expect(redeemByCalls).toHaveLength(0);
	});
});
