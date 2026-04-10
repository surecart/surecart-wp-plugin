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

  it('maps state from administrative_area_level_2 when level_1 does not match regions (Spain)', () => {
    const place: AddressSuggestion = {
      displayName: 'Sagrada Família',
      fullDisplayName: 'Sagrada Família, Barcelona, Spain',
      placeId: 'places/es1',
      addressComponents: [
        { types: ['country'], shortText: 'ES', longText: 'Spain', languageCode: 'es' },
        { types: ['route'], shortText: 'C/ de Mallorca', longText: 'Carrer de Mallorca', languageCode: 'es' },
        { types: ['street_number'], shortText: '401', longText: '401', languageCode: 'es' },
        { types: ['locality'], shortText: 'Barcelona', longText: 'Barcelona', languageCode: 'es' },
        { types: ['administrative_area_level_2'], shortText: 'B', longText: 'Barcelona', languageCode: 'es' },
        { types: ['administrative_area_level_1'], shortText: 'CT', longText: 'Cataluña', languageCode: 'es' },
        { types: ['postal_code'], shortText: '08013', longText: '08013', languageCode: 'es' },
      ],
    };

    const regions = [
      { value: 'B', label: 'Barcelona' },
      { value: 'M', label: 'Madrid' },
      { value: 'V', label: 'Valencia/València' },
    ];
    const result = buildReplacementAddressFromPlace(place, regions, null);

    expect(result.state).toBe('B');
    expect(result.city).toBe('Barcelona');
    expect(result.postal_code).toBe('08013');
    expect(result.country).toBe('ES');
  });

  it('maps state from administrative_area_level_2 when level_1 does not match regions (Italy)', () => {
    const place: AddressSuggestion = {
      displayName: 'Colosseum',
      fullDisplayName: 'Colosseum, Roma, Italy',
      placeId: 'places/it1',
      addressComponents: [
        { types: ['country'], shortText: 'IT', longText: 'Italy', languageCode: 'it' },
        { types: ['route'], shortText: 'Piazza del Colosseo', longText: 'Piazza del Colosseo', languageCode: 'it' },
        { types: ['street_number'], shortText: '1', longText: '1', languageCode: 'it' },
        { types: ['locality'], shortText: 'Roma', longText: 'Roma', languageCode: 'it' },
        { types: ['administrative_area_level_2'], shortText: 'RM', longText: 'Città Metropolitana di Roma Capitale', languageCode: 'it' },
        { types: ['administrative_area_level_1'], shortText: 'Lazio', longText: 'Lazio', languageCode: 'it' },
        { types: ['postal_code'], shortText: '00184', longText: '00184', languageCode: 'it' },
      ],
    };

    const regions = [
      { value: 'RM', label: 'Roma' },
      { value: 'MI', label: 'Milano' },
      { value: 'NA', label: 'Napoli' },
    ];
    const result = buildReplacementAddressFromPlace(place, regions, null);

    expect(result.state).toBe('RM');
    expect(result.city).toBe('Roma');
    expect(result.postal_code).toBe('00184');
    expect(result.country).toBe('IT');
  });

  it('maps state via label match when shortText is abbreviated and longText lacks diacritics (Mexico)', () => {
    // Real Google Places API response: shortText "Yuc.", longText "Yucatan" (no accent).
    // SureCart stores { value: "YUC", label: "Yucatán" } (with accent).
    const place: AddressSuggestion = {
      displayName: 'Chichén Itzá',
      fullDisplayName: 'Chichén Itzá, Yucatan, Mexico',
      placeId: 'places/mx1',
      addressComponents: [
        { types: ['country'], shortText: 'MX', longText: 'Mexico', languageCode: 'en' },
        { types: ['administrative_area_level_1'], shortText: 'Yuc.', longText: 'Yucatan', languageCode: 'en' },
        { types: ['postal_code'], shortText: '97751', longText: '97751', languageCode: 'en-US' },
      ],
    };

    const regions = [
      { value: 'YUC', label: 'Yucatán' },
      { value: 'AGU', label: 'Aguascalientes' },
      { value: 'JAL', label: 'Jalisco' },
    ];
    const result = buildReplacementAddressFromPlace(place, regions, null);

    expect(result.state).toBe('YUC');
    // No locality component in Google response for this landmark — city is null.
    expect(result.city).toBeNull();
    expect(result.postal_code).toBe('97751');
    expect(result.country).toBe('MX');
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
