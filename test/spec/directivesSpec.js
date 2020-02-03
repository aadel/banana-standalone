'use strict';

/* jasmine specs for directives go here */

define(['angular-mocks', 'app', 'config'],

function(angularMocks, app, config) {

  beforeEach(() => {
    module('kibana');
    module('kibana.directives');
  });

  describe('app', () => {
    it('should be defined', () => {
      expect(app).toBeDefined();
    });
  });

  describe('app-version', function() {
    it('should print the current version', () => {
      inject(function($compile, $rootScope, $timeout) {
        var element = $compile('<span app-version></span>')($rootScope);
        // Naïve
        $timeout(() => {
          expect(element.text()).toEqual(config.REV);
        }, 1000);
      });
    });
  });
});
