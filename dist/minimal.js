/*
*
* author: Blessed Josiah
* url: https://github.com/joxiah025
*
*/

(function (factory) {
    if(typeof module === "object" && typeof module.exports === "object") {
      factory(require("jquery"), window, document);
    } else {
      factory(jQuery, window, document);
    }
  }(function($, window, document, undefined) {

    // code for attaching minimal to whatever jQuery was passed in goes here.
    
    var $pluginName = "minimal";
    var validation_rules = {
      'required': false,
      'min_length': 0,
      'max_length': 0,
      'email': false,
      'phone': '',
      'regex_match': '',
    };
    var defaults = {
      controls: [],
      realtime: false,
      onSubmit: function () {}
    };
    
    var ValidateForm_Construct = function(element, options) {
      this._defaults = defaults;
      this._rules = validation_rules;
      this._name = $pluginName;
      this._element = element;
      this._options = options;
      this._settings = $.extend({}, this._defaults, this._options || {});    
      this.init();
    }
    
    ValidateForm_Construct.prototype = {
      init: function() {
        this._validatorError = [];
        this.validateOptions(this._element, this._settings);
      },
      rulesCheck: function(data, el) {
        if ($.isEmptyObject(data)) {
            this.debug('undefined validation object!');
            return false;
        } else {
          
          for (var prop in data) {
              if (!this._rules.hasOwnProperty(prop)) {
                  this.debug(prop + ' is not a validation object property!');
                  return false;
              } 
              if (this._rules.hasOwnProperty(prop) && (typeof(data[prop]) != typeof(this._rules[prop]))) {
                 this.debug('validation property "' + prop + '": expecting ' + typeof(this._rules[prop]) + ' but ' + typeof(data[prop]) + ' given.');
                 return false; 
              } 
              else if (this._rules.hasOwnProperty(prop) && prop == 'regex_match' && data[prop] != '') {
                var isValid = true;
                try {
                  new RegExp(data[prop]);
                } 
                catch(e) {
                  isValid = false;   
                }
                if (!isValid) {
                  this.debug(data[prop] + ' is not a valid regular expression!');
                  return false;
                }
              } 
              else {
                this._validatorError.push(prop);
                el.find(':submit').prop('disabled', true);
              }
          }
        }
      },
      validateOptions: function(elem, o) {
        var validatorError = this._validatorError;
        // o = options
        var el = elem.find('[data-controlName]');
        if (o.controls.isArray && o.controls.length == 0) {
          this.debug('No control name to bind to!');
          return false;
        } else if (o.controls.length > 0) {
            // var _d = el.data().split(' ');
          var _c = this;        
          var data = o.controls;
          data.forEach( (key, index) => {
              if (!$.isEmptyObject(key) && key.controlName != null) {
                  var _mainVal = null;
                  $.each (el, function(k, val) { 
                      if ($(val).data().controlname == key.controlName) {
                          _mainVal = val;
                          return false;
                      }
                  });
  
                  if (_mainVal === null) {
                      _c.debug('Control name ' + $(_mainVal).data().controlname + ' not bound!');
                          $.each(el,function() {
                              $(this).off();
                          });
                     return false;
                  } else {
                              
                      _c.rulesCheck(key.validation, elem);
                      // console.log($(val));
                      $(_mainVal).on('keyup keypress blur change', function() {
                          var $t = $(this);
                          var _validate = key.validation;
                          console.log(_validate.length);
                        // required 
                        if( _validate.hasOwnProperty('required') ) {
                              // console.log($t.val(), 'Required!');
                              if ($t.val() === '') {
                                // if (validatorError.indexOf('required') == -1) {
                                //    validatorError.push('required'); 
                                // } 
                                _c._validatorError[index] = 'required';
                                _c.submitButtonEnabler(_c._validatorError, elem);
                                $t.next('span').remove();
                                $t.after($('<span>').css({'color': 'red'}).html(key.errorMessage.required).detach());
                              } else {
                                // validatorError.splice(index, 1);
                                // _c.submitButtonEnabler(validatorError, elem);
                                _c.splicerButton(_c._validatorError, elem, index);
                                $t.next('span').remove();
                                $t.after($('<span>').css({'color': 'green'}).html(key.successMessage.required).detach());                                                                 }
                          }
                        
                        // min_length
                        if ( _validate.hasOwnProperty('min_length') && parseInt(_validate.min_length,0) > 0 && $t.val() != '') {
                          
                            if ($t.val().length < parseInt(_validate.min_length,0)) {
                              // if (validatorError.indexOf('min_length') == -1) {
                              //      validatorError.push('min_length'); 
                              //   }
                                _c._validatorError[index] = 'min_length';
                                _c.submitButtonEnabler(_c._validatorError, elem);
                                $t.next('span').remove();
                                $t.after($('<span>').css({'color': 'red'}).html(key.errorMessage.min_length).detach());
                              } else {
                                // validatorError.splice(index, 1);
                                // _c.submitButtonEnabler(validatorError, elem);
                                _c.splicerButton(_c._validatorError, elem, index);
                                $t.next('span').remove();
                                $t.after($('<span>').css({'color': 'green'}).html(key.successMessage.min_length).detach());                                                              }
                        }
                        
                        // max_length
                        if ( _validate.hasOwnProperty('max_length') && parseInt(_validate.max_length,0) > 0 && $t.val() != '') {
                          
                            if ($t.val().length > parseInt(_validate.max_length,0)) {
                              // if (validatorError.indexOf('min_length') == -1) {
                              //      validatorError.push('min_length'); 
                              //   }
                                _c._validatorError[index] = 'max_length';
                                _c.submitButtonEnabler(_c._validatorError, elem);
                                $t.next('span').remove();
                                $t.after($('<span>').css({'color': 'red'}).html(key.errorMessage.max_length).detach());
                              } else {
                                // validatorError.splice(index, 1);
                                // _c.submitButtonEnabler(validatorError, elem);
                                _c.splicerButton(_c._validatorError, elem, index);
                                $t.next('span').remove();
                                $t.after($('<span>').css({'color': 'green'}).html(key.successMessage.max_length).detach());                                                                 }
                        }
                        
                        // email
                        if ( _validate.hasOwnProperty('email') && $t.val() != '') {
                          
                            if ( !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/.test($t.val())) ) {
                              // if (validatorError.indexOf('min_length') == -1) {
                              //      validatorError.push('min_length'); 
                              //   }
                                _c._validatorError[index] = 'email';
                                _c.submitButtonEnabler(_c._validatorError, elem);
                                $t.next('span').remove();
                                $t.after($('<span>').css({'color': 'red'}).html(key.errorMessage.email).detach());
                              } else {
                                // validatorError.splice(index, 1);
                                // _c.submitButtonEnabler(validatorError, elem);
                                _c.splicerButton(_c._validatorError, elem, index);
                                $t.next('span').remove();
                                $t.after($('<span>').css({'color': 'green'}).html(key.successMessage.email).detach());                                                                 }
                        }
                        
                        // phone 
                        if ( _validate.hasOwnProperty('phone') && $t.val() != '') {
                          
                            if ( !(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/.test($t.val())) ) {
                              // if (validatorError.indexOf('min_length') == -1) {
                              //      validatorError.push('min_length'); 
                              //   }
                                _c._validatorError[index] = 'phone';
                                _c.submitButtonEnabler(_c._validatorError, elem);
                                $t.next('span').remove();
                                $t.after($('<span>').css({'color': 'red'}).html(key.errorMessage.phone).detach());
                              } else {
                                // validatorError.splice(index, 1);
                                // _c.submitButtonEnabler(validatorError, elem);
                                _c.splicerButton(_c._validatorError, elem, index);
                                $t.next('span').remove();
                                $t.after($('<span>').css({'color': 'green'}).html(key.successMessage.phone).detach());                                                                 }
                        }
                        
                        // regex_match 
                        if ( _validate.hasOwnProperty('regex_match') && $t.val() != '') {                        
                            
                            if ( !(`/${_validate.regex_match}/`.test($t.val())) ) {
                                _c._validatorError[index] = 'regex_match';
                                _c.submitButtonEnabler(_c._validatorError, elem);
                                $t.next('span').remove();
                                $t.after($('<span>').css({'color': 'red'}).html(key.errorMessage.regex_match).detach());
                              } else {
                                _c.splicerButton(_c._validatorError, elem, index);
                                $t.next('span').remove();
                                $t.after($('<span>').css({'color': 'green'}).html(key.successMessage.regex_match).detach());                                                               }
                        }
                        
                      });
  
                  }
                         
              }
          });
           
        }
        return true;
      },
      submitButtonEnabler: function(data, el) {
          el.find(':submit').prop('disabled', true);
      },
      splicerButton:  function(data, el, i) {
        var dat = data.filter(x => x);
        dat.splice(i, 1);
        this._validatorError = dat;
        console.log(dat, i);
        if ( dat.length == 0 ) {
          el.find(':submit').prop('disabled', false);
        }
      },
      debug: function (error) {
        if (typeof console == 'object') {
                  console.error(error);
              } else if (typeof opera == 'object') {
                  opera.postError(error);
              }
      }
    }
    
    $.fn[$pluginName] = function ( options ) {
      new ValidateForm_Construct(this, options);
    };
    
   
  }));