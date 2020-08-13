$(document).ready(function () {
    responsizeHeader()
    responsizeProduct()
    responsizeSearch()
    addEventForYourOrder()
    addEventForSideControlShop()
    changeDisplaySideControl()
    addEventForShop()
    addEventForSideMenu()

    $(window).resize(function () {
        responsizeHeader()
        responsizeProduct()
        responsizeSearch()
        changeDisplaySideControl()
    })

    function responsizeHeader() {
        if ($(window).width() <= 768) {
            $('.titleCategories').html('<i class="fas fa-bars" aria-hidden="true"></i>')
        } else {
            $('.titleCategories').html(`<i class="fas fa-bars" aria-hidden="true"></i>
                                        <span class="captionCategories">all departments</span>
                                        <i class="fas fa-chevron-down" aria-hidden="true"></i>`)
        }
    }

    function responsizeProduct() {
        if ($(window).width() <= 768) {
            $('.addtoCartProduct').html('<i class="fas fa-shopping-cart"></i>');
        } else {
            $('.addtoCartProduct').html('add to cart');
        }
    }

    function responsizeSearch() {
        if ($(window).width() <= 767) {
            $('.search button').html('<i class="fas fa-search"></i>')
        } else {
            $('.search button').html('Search');
        }
    }

    function addEventForYourOrder() {
        $('.oderRow').slideUp();
        $('.listOrder').slideUp();
        $('.captionOrder').click(function () {
            $('.oderRow').slideToggle();
            $('.listOrder').slideToggle();
        })
    }

    function changeDisplaySideControl() {
        if ($(window).width() <= 767) {
            $('.sideControl').addClass('displaySideControl');
            $('.sideControl').slideUp();
        } else {
            $('.sideControl').slideDown();
            $('.sideControl').removeClass('displaySideControl');
        }
    }

    function addEventForSideControlShop() {

        $('.filter').click(function () {
            $('.sideControl').slideToggle();
        })

        $('.sideControl').click(function () {
            $(this).slideUp();
        })
    }

    function addEventForShop() {
        $('.shop').click(function (evt) {
            console.log(evt.target);
            if (!$(evt.target).is($('.fa-filter'))) {
                $('.sideControl').slideUp();
            }
        })
    }

    function addEventForSideMenu() {

        $('.sideMenu').click(function (evt) {
            if ($(evt.target).is($(this))) {
                $(this).removeClass('showSideMenu');
                $('body').removeAttr('style');
            }
        })

        $('.mobileBar').click(function () {
            $('.sideMenu').addClass('showSideMenu');
            $('body').css('overflow', 'hidden');
            $('.sideControl').slideUp();
        })

        $('.closeSideMenu').click(function () {
            $('.sideMenu').removeClass('showSideMenu');
            $('body').removeAttr('style');
        })

        $('.listCategoriesLink').slideUp();
        $('.controlCategoriesList').click(function () {
            $('.listCategoriesLink').slideToggle();
            $(this).next().toggleClass('chaneEffectIcon');
        })
    }

})