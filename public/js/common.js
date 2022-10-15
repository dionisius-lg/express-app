!(function($) {
    "use strict";

    // remove element error on change
    $('input, select, textarea').on('change', function() {
        const formGroup = $(this).parents('.form-group');

        if ($(this).hasClass('is-invalid')) {
            $(this).removeClass('is-invalid');
        }

        formGroup.find('.invalid-feedback').empty();
        formGroup.find('.form-error').empty();
    });

    // remove element error on keyup
    $('input, textarea').on('keyup', function(e) {
        const formGroup = $(this).parents('.form-group');
        const keyCode = (e.keyCode ? e.keyCode : e.which);

        if (keyCode !== 13) {
            if ($(this).hasClass('is-invalid')) {
                $(this).removeClass('is-invalid');
            }

            formGroup.find('.invalid-feedback').empty();
            formGroup.find('.form-error').empty();
        }
    });

    // remove element.datepicker error on change
    $('.datepicker').on('change.datetimepicker', function(){
        $(this).parents('.form-group').find('.invalid-feedback').empty();
        $(this).removeClass('is-invalid');
    });

    // enable numeric only
    $('.numeric').on('keyup', function () {
        this.value = this.value.replace(/[^0-9\.]/g,'');
    });

    // enable alpha space only
    $('.alpha-space').on('keyup', function () {
        this.value = this.value.replace(/^[a-z][a-z\s]*$/,'');
    });

    // initialize datepicker
    if (typeof $.fn.datepicker === 'function') {
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

    // initialize select2
    if (typeof $.fn.select2 === 'function') {
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

    // initialize inputmask
    if (typeof $.fn.inputmask === 'function') {
        $('.currency').inputmask({
            alias : 'currency',
            prefix: '',
            placeholder: '0',
            digits: 0,
            digitsOptional: false,
            // groupSeparator: '.',
            clearMaskOnLostFocus: false
        });
    }

    // autofocus on modal show
    $('.modal').on('shown.bs.modal', function() {
        $(this).find('[autofocus]').focus();
    });

    // activate navigation on current page
    if (!window.location.origin) { // for IE
        window.location.origin = window.location.protocol + "//" + (window.location.port ? ':' + window.location.port : '');      
    }

    let currentUrl = window.location.origin + window.location.pathname;
        currentUrl = currentUrl.split("/").splice(0, 6).join("/");

    $('.main-sidebar .sidebar nav li > a').each(function() {
        const linkUrl = this.href;

        if (linkUrl == currentUrl) {
            $(this).addClass('active');
            $(this).closest('li.has-treeview').addClass('menu-open').find('.treeview-link').addClass('active');
        }
    });

    // get sidebar attr from local storage
    const sidebarAttr = getLocalStorage('sidebar-attr');

    // set sidebar collapse or open on load document
    if (sidebarAttr.collapse) {
        $('body').addClass('sidebar-collapse');
    } else {
        $('body').removeClass('sidebar-collapse');
    }
})(jQuery);

$.fn.sameHeight = function() {
	let selector = this;
	let heights = [];

	// reset heights of every element
	$(this).css('height','auto');

	// save the heights of every element into an array
	selector.each(function(){
		let height = $(this).height();
		heights.push(height);
	});

	// get the biggest height
	let maxHeight = Math.max.apply(null, heights);

	// Set the maxHeight to every selected element
	selector.each(function(){
		$(this).height(maxHeight);
	});
};

function setLocalStorage(key, val = null) {
    if (key && val !== null) {
        if (typeof val === 'object') {
            val = JSON.stringify(val);
        }

        localStorage.setItem(key, val);
        return key;
    }

    return false;
}

function getLocalStorage(key) {
    if (key) {
        const val = localStorage.getItem(key);

        if (val !== null) {
            const parseVal = JSON.parse(val);

            if (typeof parseVal === 'object' || typeof parseVal === 'boolean') {
                return parseVal;
            }

            return val;
        }
    }

    return false;
}

function deleteLocalStorage(key) {
    if (key) {
        localStorage.removeItem(key);
        return true;
    }

    return false;
}

// get element tag body
const elementBody = document.getElementsByTagName('body')[0];

// define mutation
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        let attributeValue = $(mutation.target).prop(mutation.attributeName);

        if (attributeValue.search('sidebar-collapse') === -1) {
            setLocalStorage('sidebar-attr', { collapse: false });
        } else {
            setLocalStorage('sidebar-attr', { collapse: true });
        }
    });
});

// observe mutation on class change
observer.observe(elementBody, {
    attributes: true,
    attributeFilter: ['class']
});
