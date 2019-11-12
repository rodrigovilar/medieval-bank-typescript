import { BurgosAgency } from './burgos-agency';

describe('BurgosAgency', () => {

  it('name', function () {
    BurgosAgency.SetName('Burgosland');
    let result = BurgosAgency.GetName();
    expect(result).toBe('Burgosland');
  });

  it('manager', function() {
    BurgosAgency.SetManager('Joseph');
  let result = BurgosAgency.GetManager();
  expect(result).toBe( 'Joseph');
  });

});
