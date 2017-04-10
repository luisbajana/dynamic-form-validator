/*
  Author: Luis Bajana
  Dependencies: jQuery
*/

var DynamicFormValidator = (function(){

  function validator_required( input , obj ){
    var value = input.value;
    if( value === '' ) validator_print_error( input , obj );
    else validator_clear_error( input , obj );
  }

  function validator_min_length( input , obj ){
    var value = input.value,
        min_length = obj.min_length;

    if( value.length < min_length && value !== '' ) validator_print_error( input , obj );
    else validator_clear_error( input , obj );
  }

  function validator_max_length( input , obj ){
    var value = input.value,
        max_length = obj.max_length;

    if( value.length > max_length && value !== '' ){
      validator_print_error( input , obj );
    }
    else validator_clear_error( input , obj );
  }

  function validator_email( input , obj ){
    var value = input.value,
        re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(!re.test(value) && value !== '') validator_print_error( input , obj );
    else validator_clear_error( input , obj );
  }

  function validator_only_numbers( input , obj ){
    var value = input.value,
        re = /^\d+$/;

    if(!re.test(value) && value !== '') validator_print_error( input , obj );
    else validator_clear_error( input , obj );
  }

  function validator_only_letters( input , obj ){
    var value = input.value,
        re = /^[a-zA-Z]*$/;

    if(!re.test(value) && value !== '') validator_print_error( input , obj );
    else validator_clear_error( input , obj );
  }

  function special_characters( input , obj ){
    var value = input.value,
        re = /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/;

    if(re.test(value) && value !== '') validator_print_error( input , obj );
    else validator_clear_error( input , obj );
  }

  function validator_no_accents( input , obj ){
    var value = input.value,
        re = /[À-ž]/;

    if(re.test(value) && value !== '') validator_print_error( input , obj );
    else validator_clear_error( input , obj );
  }

  function validator_no_whitespace( input , obj ){
    var value = input.value,
        re = /[\s]/;

    if(re.test(value) && value !== '') validator_print_error( input , obj );
    else validator_clear_error( input , obj );
  }

  function validator_confirmation( input , obj ){
    var value = input.value,
        target = document.getElementById( obj.target_id ).value;

    if( value !== target ) validator_print_error( input , obj );
    else validator_clear_error( input , obj );

  }

  function validator_print_error( input , validation_obj ){
    var obj = $(input),
        cont = obj.closest('div'),
        help_block = cont.find('.help-block'),
        error_message = validation_obj.error_msg;

    if( help_block.length === 0 ){
      help_block.remove();
      cont.addClass('has-error');
      cont.addClass('validation_'+validation_obj.validation);
      obj.after('<span class="help-block form-error">'+error_message+'</span>');
    }
  }

  function validator_clear_error( input , validation_obj ){
    var obj = $(input),
        cont = obj.closest('div'),
        custom_class = 'validation_'+validation_obj.validation;

    if( cont.hasClass('has-error') && cont.hasClass( custom_class ) ){
      cont.removeClass('has-error');
      cont.removeClass( custom_class );
      cont.find('.help-block').remove();
    }
  }


  function go_up(){
    $("html, body").animate({
       scrollTop: $('.help-block').first().offset().top - 65
   }, 200);
  }

  function trigger( formulario ){
    var f = $('#'+formulario);
    if( f.find('.help-block').length === 0 ) f.submit();
    else go_up();
  }

  function classifier( input ){

  var type = JSON.parse( input.getAttribute('data-form-validation') );

    for( var i = 0 ; i < type.length ; i++ ){

      for( var prop in type[i] ){

        var validation_type = type[i][prop],
            validation = type[i];

        if( validation_type === "required" ){
          validator_required( input , validation );
        }else if( validation_type === "minlength" ){
          validator_min_length( input , validation );
        }else if( validation_type === "maxlength" ){
          validator_max_length( input , validation );
        }else if( validation_type === "email" ){
          validator_email( input , validation );
        }else if( validation_type === "onlynumbers" ){
          validator_only_numbers( input , validation );
        }else if( validation_type === "specialcharacters" ){
          special_characters( input , validation );
        }else if( validation_type === "confirmation" ){
          validator_confirmation( input , validation );
        }else if( validation_type === "onlyletters" ){
          validator_only_letters( input , validation );
        }else if( validation_type === "noaccents" ){
          validator_no_accents( input , validation );
        }else if( validation_type === "nowhitespace" ){
          validator_no_whitespace( input , validation );
        }

      }

    }

  }

  function finder(id){
    var inputs, index;

    inputs = document.getElementById(id);
    for (index = 0; index < inputs.length; ++index) {
        var input = inputs[index];
        if( input.hasAttribute('data-form-validation') ){
          classifier( input );
          assignarListeners(input);
        }
    }

    function assignarListeners( i ){
      i.addEventListener("keyup", function(){ classifier( i ); }, false);
    }

  }

  return {
    init: function(id){
      finder(id);
      trigger(id);
    }
  };

})();
