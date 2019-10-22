"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var burgos_agency_1 = require("../src/burgos.agency");
describe('BurgosAgency', function () {
    it('name', function () {
        burgos_agency_1.BurgosAgency.SetName('Burgosland');
        var result = burgos_agency_1.BurgosAgency.GetName();
        expect(result).toBe('Burgosland');
    });
    it('manager', function () {
        burgos_agency_1.BurgosAgency.SetManager('Joseph');
        var result = burgos_agency_1.BurgosAgency.GetManager();
        expect(result).toBe('Joseph');
    });
});
//# sourceMappingURL=burgos.agency.test.js.map