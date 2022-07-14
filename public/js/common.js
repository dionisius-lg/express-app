!(function($) {
    "use strict";
})(jQuery);

//remove element error on change
$('input, select, textarea').on('change', function() {
    const formGroup = $(this).parents('.form-group');

    if ($(this).hasClass('is-invalid')) {
        $(this).removeClass('is-invalid');
    }

    formGroup.find('.invalid-feedback').empty();
    formGroup.find('.form-error').empty();
});

//remove element.datepicker error on change
$('.datepicker').on('change.datetimepicker', function(){
    $(this).parents('.form-group').find('.invalid-feedback').empty();
    $(this).removeClass('is-invalid');
});

//enable numeric only
$('.numeric').on('keyup', function () {
    this.value = this.value.replace(/[^0-9\.]/g,'');
});

//enable alpha space only
$('.alpha-space').on('keyup', function () {
    this.value = this.value.replace(/^[a-z][a-z\s]*$/,'');
});

//initialize datepicker
if ($.isFunction($.fn.datepicker)) {
    $('.date').datepicker({
        format : 'yyyy-mm-dd',
        autoclose : true,
        minView : 2,
        weekStart : 1,
        // startDate : '',
        endDate : new Date(),
        todayHighlight: true
    });

    $('.modal').scroll(function() {
        $('.date').datepicker('place')
    });
}

//initialize parsley
if ($.isFunction($.fn.parsley)) {
    $('form.parsley').parsley();
}

//initialize select2
if ($.isFunction($.fn.select2)) {
    $('.select2').select2({
        width: '100%',
        theme: 'bootstrap4',
    });

    $('.select2-multiple').select2({
        width: '100%',
        theme: 'bootstrap4',
        placeholder: 'Please Select',
        //closeOnSelect: false,
    });
}

//autofocus on modal show
$('.modal').on('shown.bs.modal', function() {
    $(this).find('[autofocus]').focus();
});
