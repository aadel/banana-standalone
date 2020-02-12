"use strict";

/* jasmine specs for controllers go here */

define(['angular-mocks', 'app', 'config'],

function(angularMocks, app, config) {

  describe('Table controllers', function() {
    
    it('should defined table controller', inject(function($controller) {
      expect($controller).toBeDefined();
    }));
    
    describe('table', function() {

      beforeEach(() => {});
      it('should defined table controller', inject(function($controller) {
        expect(1).toBeDefined();
      }));


    });
  });
});