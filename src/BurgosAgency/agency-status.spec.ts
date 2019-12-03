import { BurgosAgency } from './burgos-agency';

describe('BurgosAgency', () => {

  it('t015_agencyStatusWithoutAtendee', function () {
    BurgosAgency.SetName('Burgosland');
    let result = BurgosAgency.GetName();
    expect(result).toBe('Burgosland');
  });

});
