(function ($) {
    $(document).ready(() => {

        let KPApp = {
            init: () => {
                console.log('init');
            }
        };

        window.KPApp = KPApp;
        KPApp.init();
    });

})(jQuery);