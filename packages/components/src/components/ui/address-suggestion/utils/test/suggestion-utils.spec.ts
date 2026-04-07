import { AddressSuggestion } from 'src/types';
import { buildReplacementAddressFromPlace } from '../suggestion-utils';

describe('buildReplacementAddressFromPlace', () => {
  it('replaces structured fields and does not carry over prior city or postal when components omit them', () => {
    const place: AddressSuggestion = {
      displayName: '123 Main St',
      fullDisplayName: '123 Main St, Somewhere',
      placeId: 'places/abc',
      addressComponents: [
        { types: ['country'], shortText: 'US', longText: 'United States', languageCode: 'en' },
        { types: ['street_number'], shortText: '123', longText: '123', languageCode: 'en' },
        { types: ['route'], shortText: 'Main St', longText: 'Main Street', languageCode: 'en' },
      ],
    };

    const regions = [{ value: 'CA', label: 'California' }];

    const result = buildReplacementAddressFromPlace(place, regions, 'Prior Name');

    expect(result.name).toBe('Prior Name');
    expect(result.line_1).toBe('123 Main Street');
    expect(result.country).toBe('US');
    expect(result.city).toBeNull();
    expect(result.postal_code).toBeNull();
    expect(result.state).toBeNull();
    expect(result.line_2).toBeNull();
  });

  it('preserves null name when previous name is unset', () => {
    const place: AddressSuggestion = {
      displayName: '1 Broadway',
      fullDisplayName: '1 Broadway',
      placeId: 'places/xyz',
      addressComponents: [
        { types: ['country'], shortText: 'US', longText: 'United States', languageCode: 'en' },
        { types: ['locality'], shortText: 'NYC', longText: 'New York', languageCode: 'en' },
        { types: ['postal_code'], shortText: '10001', longText: '10001', languageCode: 'en' },
      ],
    };

    const result = buildReplacementAddressFromPlace(place, [], undefined);

    expect(result.name).toBeNull();
    expect(result.city).toBe('New York');
    expect(result.postal_code).toBe('10001');
  });
});
