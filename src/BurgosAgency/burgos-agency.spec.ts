import { BurgosAgency } from './burgos-agency';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

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
