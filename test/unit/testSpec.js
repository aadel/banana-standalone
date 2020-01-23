'use strict';

define(['angular', 'app', 'tablePanel'], function(angular, app, tablePanel) {
  describe('Test', function() {
  
      it('should pass', () => {
        expect(1).toEqual(1);
      });

      it('should be defined', () => {
        expect(angular.module).toBeDefined();
      });

      it('should be defined', () => {
        expect(app).toBeDefined();
      });
  });

  describe('requirejs', () => {
		it('works for app', () => {
			var el = $('<div>require.js up and running</div>');
			expect(el.text()).toEqual('require.js up and running');
    });
  });
  
  describe('modules', () => {
    it('should be defined', () => {
      expect(angular.module('kibana')).toBeDefined();
    });
    it('should be defined', () => {
      expect(angular.module('kibana.services')).toBeDefined();
    });
    it('should be defined', () => {
      expect(angular.module('kibana.controllers')).toBeDefined();
    });
    it('should be defined', () => {
      expect(angular.module('kibana.directives')).toBeDefined();
    });
    it('should be defined', () => {
      expect(angular.module('kibana.filters')).toBeDefined();
    });
    it('should be defined', () => {
      expect(angular.module('elasticjs.service')).toBeDefined();
    });
    it('should be defined', () => {
      expect(angular.module('solrjs.service')).toBeDefined();
    });
    it('should be defined', () => {
      expect(angular.module('kibana.panels.table')).toBeDefined();
    });
  });
  
  describe('table panel', function() {
		// Need to load these modules before start testing
		beforeEach(function() {
			angular.module('kibana');
			angular.module('kibana.services');
			angular.module('kibana.controllers');
			angular.module('kibana.directives');
			angular.module('kibana.filters');
			angular.module('elasticjs.service');
			angular.module('solrjs.service');
      angular.module('kibana.panels.table');
		});
	});
});