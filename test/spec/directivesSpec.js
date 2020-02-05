'use strict';

/* jasmine specs for directives go here */

define(['angular-mocks', 'app', 'config'],

function(angularMocks, app, config) {

  describe('app', () => {
    it('should be defined', () => {
      expect(app).toBeDefined();
    });
  });

  describe('app-version', function() {
    beforeEach(() => {
      module('kibana.directives');
    });
    
    it('should print the current version', () => {
      inject(function($compile, $rootScope) {
        var element = $compile('<span app-version></span>')($rootScope);
        $rootScope.$digest();

        // Naïve
        expect(element.text()).toEqual(config.REV);
      });
    });
  });

  describe('array-join', function() {
    var $compile, $rootScope, changeInputValue;

    beforeEach(() => {
      module('kibana.directives');
    });
    
    beforeEach(inject(function(_$compile_, _$rootScope_, $sniffer){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $compile = _$compile_;
      $rootScope = _$rootScope_;

      changeInputValue = (elm, value) => {
        elm.val(value);
        browserTrigger(elm, $sniffer.hasEvent('input') ? 'input' : 'change');
      };
    }));
    
    it('should join array values using commas', () => {
      $rootScope.model = ['a', 'b', 'c'];
      var element = $compile('<input array-join ng-model="model"></input>')($rootScope);
      $rootScope.$digest();
      
      expect(element.val()).toEqual('a,b,c');
    });

    it('should split comma delimited field values', () => {
      var element = $compile('<input array-join ng-model="model"></input>')($rootScope);
      $rootScope.$digest();
      changeInputValue(element, 'a,b,c');
      
      expect($rootScope.model).toEqual(['a', 'b', 'c']);
    });

  });
});
