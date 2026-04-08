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

  it('maps city from administrative_area_level_2 when locality is absent (Brazil)', () => {
    const place: AddressSuggestion = {
      displayName: 'Rua Francisca Costa Cunha',
      fullDisplayName: 'Rua Francisca Costa Cunha, Goiás, Brazil',
      placeId: 'places/br1',
      addressComponents: [
        { types: ['country'], shortText: 'BR', longText: 'Brazil', languageCode: 'pt-BR' },
        { types: ['route'], shortText: 'R. Francisca Costa Cunha', longText: 'Rua Francisca Costa Cunha', languageCode: 'pt-BR' },
        { types: ['administrative_area_level_2'], shortText: 'Goiânia', longText: 'Goiânia', languageCode: 'pt-BR' },
        { types: ['administrative_area_level_1'], shortText: 'GO', longText: 'Goiás', languageCode: 'pt-BR' },
        { types: ['postal_code'], shortText: '74075-300', longText: '74075-300', languageCode: 'pt-BR' },
        { types: ['sublocality'], shortText: 'St. Aeroporto', longText: 'Setor Aeroporto', languageCode: 'pt-BR' },
      ],
    };

    const regions = [{ value: 'GO', label: 'Goiás' }];
    const result = buildReplacementAddressFromPlace(place, regions, 'Test User');

    expect(result.city).toBe('Goiânia');
    expect(result.state).toBe('GO');
    expect(result.postal_code).toBe('74075-300');
    expect(result.line_2).toBe('St. Aeroporto');
    expect(result.country).toBe('BR');
  });

  it('maps city from postal_town when locality is absent (UK)', () => {
    const place: AddressSuggestion = {
      displayName: '10 Downing Street',
      fullDisplayName: '10 Downing Street, London, UK',
      placeId: 'places/uk1',
      addressComponents: [
        { types: ['country'], shortText: 'GB', longText: 'United Kingdom', languageCode: 'en' },
        { types: ['street_number'], shortText: '10', longText: '10', languageCode: 'en' },
        { types: ['route'], shortText: 'Downing St', longText: 'Downing Street', languageCode: 'en' },
        { types: ['postal_town'], shortText: 'London', longText: 'London', languageCode: 'en' },
        { types: ['administrative_area_level_1'], shortText: 'England', longText: 'England', languageCode: 'en' },
        { types: ['postal_code'], shortText: 'SW1A 2AA', longText: 'SW1A 2AA', languageCode: 'en' },
      ],
    };

    const regions: Array<{ value: string; label: string }> = [];
    const result = buildReplacementAddressFromPlace(place, regions, null);

    expect(result.city).toBe('London');
    expect(result.line_1).toBe('10 Downing Street');
    expect(result.postal_code).toBe('SW1A 2AA');
    expect(result.country).toBe('GB');
  });

  it('prefers locality over administrative_area_level_2 when both are present', () => {
    const place: AddressSuggestion = {
      displayName: '123 Test St',
      fullDisplayName: '123 Test St, City, Country',
      placeId: 'places/both',
      addressComponents: [
        { types: ['country'], shortText: 'US', longText: 'United States', languageCode: 'en' },
        { types: ['locality'], shortText: 'San Francisco', longText: 'San Francisco', languageCode: 'en' },
        { types: ['administrative_area_level_2'], shortText: 'San Francisco County', longText: 'San Francisco County', languageCode: 'en' },
      ],
    };

    const regions: Array<{ value: string; label: string }> = [];
    const result = buildReplacementAddressFromPlace(place, regions, null);

    expect(result.city).toBe('San Francisco');
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
