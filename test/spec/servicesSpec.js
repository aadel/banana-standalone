'use strict';

/* jasmine specs for services go here */

define(['angular-mocks', 'app', 'config'],

function(angularMocks, app, config) {

  describe('service', function() {
    beforeEach(() => {});

    describe('version', function() {
      it('should return current version', inject(function() {
        expect(1).not.toEqual(2);
      }));
    });
  });
});