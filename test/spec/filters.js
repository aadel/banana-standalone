'use strict';

/* jasmine specs for filters go here */

define(['angular', 'angular-mocks', 'banana-filters'], 

function() {
  
  describe('Banana filters', function() {
  
    it('should pass', () => {
        expect(1).toEqual(1);
    });

    beforeEach(function() {
      module('banana.filters');
    });

    it('should sort a string', inject(function($filter) {
      expect($filter('stringSort')).not.toBeNull();
    }));

    it("should slice a string", inject(function($filter) {
      expect($filter('slice')('abcd', 2, 4)).toEqual('cd');
    }));
    
    it("should not throw an error with undefined string", inject(function($filter) {
      expect($filter('slice')(undefined, 2, 4)).not.toBeDefined();
    }));
    
    it("should stringfy an array", inject(function($filter) {
      expect($filter('stringify')(['b', 'a'])).toEqual('b,a');
    }));
    
    it("should stringfy an object", inject(function($filter) {
      expect($filter('stringify')({b: 'b',a: 'a'})).toEqual('{"b":"b","a":"a"}');
    }));
    
    it("should escape XML", inject(function($filter) {
      expect($filter('noXml')
        ('<?xml version="1.0" encoding="UTF-8"?><俄语 լեզու="ռուսերեն">данные</俄语>'))
        .toEqual('&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;&lt;俄语 լեզու=&quot;ռուսերեն&quot;&gt;данные&lt;/俄语&gt;');
    }));
    
    it("should create a link for a given URL", inject(function($filter) {
      expect($filter('urlLink')('https://github.com'))
        .toEqual('<a href="https://github.com" target="_blank">https://github.com</a>');
    }));

    it("should create a link for a given URL", inject(function($filter) {
      expect($filter('urlLink')('www.github.com'))
        .toEqual('<a href="http://www.github.com" target="_blank">www.github.com</a>');
    }));

    it("should create a link for a given URL", inject(function($filter) {
      expect($filter('urlLinkAsIcon')('www.github.com'))
      .toEqual('<a class="icon-search pointer" href="http://www.github.com" target="_blank"></a>');
    }));

    it("should create a link for a given email address", inject(function($filter) {
      expect($filter('urlLinkAsIcon')('mary@example.com'))
      .toEqual('<a class="icon-search pointer" href="mailto:mary@example.com"></a>');
    }));

    it("should capitalize a string", inject(function($filter) {
      expect($filter('capitalize')('brian'))
      .toEqual('Brian');
    }));

    it("should convert CR's to HTML br tags", inject(function($filter) {
      expect($filter('newlines')('Lorem ipsum \n dolor sit\n'))
      .toEqual('Lorem ipsum <br/> dolor sit<br/>');
    }));

    it("should strip ampersand and HTML tag characters", inject(function($filter) {
      expect($filter('striphtml')('Lorem ipsum <br/> dolor sit<br/>'))
      .toEqual('Lorem ipsum &lt;br/&gt; dolor sit&lt;br/&gt;');
    }));

    it("should mark down text", inject(function($filter) {
      expect($filter('markdown')('# Lorem ipsum \n dolor _sit_'))
      .toEqual('<h1 id="loremipsum">Lorem ipsum</h1>\n\n<p>dolor <em>sit</em></p>');
    }));

    it("should do digit grouping", inject(function($filter) {
      expect($filter('thousandSeparator')(12345678)).toEqual('12,345,678');
    }));

    it("should do digit grouping", inject(function($filter) {
      expect($filter('thousandSeparator')(-12345678)).toEqual('-12,345,678');
    }));

    it("should do digit grouping", inject(function($filter) {
      expect($filter('thousandSeparator')(-1234.5678)).toEqual('-1,234.5678');
    }));

    it("should make a fragment safe by replacing dots with underscores", inject(function($filter) {
      expect($filter('safeFragment')('string.fragment')).toEqual('string_fragment');
    }));

  });
});