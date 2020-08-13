$(document).ready(function () {
    $('.breadCrumbs li').last().html('Billing Detail');

    $('.shipto label').click(function () {
        $(this).prev().click();
    })

    $('.inforReceiver').slideUp();
    $('.shipto input[type="checkbox"]').click(function () {
        $('.inforReceiver').slideToggle();
        $(this).val('true');
    })

    function getCart() {
        if (JSON.parse(localStorage.getItem('carts')) === null) {
            localStorage.setItem('carts', JSON.stringify([]))
        }
        return JSON.parse(localStorage.getItem('carts'));
    }

    function renderOrder(item) {
        return `<li class="oderRow">
                    <span class="nameOrder">${item.name}</span>
                    <span class="priceOrder">${item.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
                    <span class="quantityOrder">${item.quantityBought}</span>
                    <b class="totalOrder" data-total="${item.price * item.quantityBought}">${(item.price * item.quantityBought).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })} </b>
                </li>`
    }

    function calcTotal() {
        let total = 0;
        $('.totalOrder').each(function () {
            total += parseInt($(this).attr('data-total'))
        })

        $('#subtotalOrder').html(total.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }))
        $('#maintotalOrder').html(total.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }))
    }

    async function addEventForFormInforCustomer() {
        $('#submitFormInforCustomer').click(async function (evt) {
            evt.preventDefault();
            let inforCustomer = {
                firstname: $('.firstName input').val(),
                lastname: $('.lastName input').val(),
                phone: $('.tel input').val(),
                email: $('.email input').val(),
                town: $('.town input').val(),
                country: $('.state input').val(),
                address: $('.addressBilling textarea').val()
            }

            let inforReceiver = {}
            if ($('.shipto input').val() === 'true') {
                inforReceiver = {
                    nameReceiver: $('.nameReceiver input').val(),
                    phoneReceiver: $('.phoneReceiver input').val(),
                    emailReceiver: $('.emailReceiver input').val(),
                    townReceiver: $('.townReceiver input').val(),
                    countryReceiver: $('.countryReceiver input').val(),
                    addressReceiver: $('.addressReceiver textarea').val(),
                }

                for (properties in inforReceiver) {
                    if (inforReceiver[properties] === '') {
                        inforReceiver = {}
                        break;
                    }
                }
            }

            let carts = [];
            let mainTotal = 0;
            getCart().forEach(function (item) {
                let subTotal = item.quantityBought * item.price
                carts.push({
                    product_id: item._id,
                    quantityBought: item.quantityBought,
                    total: subTotal
                });

                mainTotal += subTotal;
            })

            let note = $('.noteOrder textarea').val()
            let success = await $.post('/api/customer', { infor: inforCustomer, inforReceiver: inforReceiver, note: note, carts: carts, mainTotal: mainTotal });

            if (success) {
                $('.popUpPay').show();
                localStorage.removeItem('carts');
                renderListOrder();
                $('#formInforCustomer')[0].reset();
            }
        })
    }

    function renderListOrder() {
        let listOrders = getCart().reverse();
        $('.listOrder').empty();
        listOrders.forEach(function (item) {
            $('.listOrder').append(renderOrder(item))
        })
        calcTotal()
    }

    async function renderBillingDetail() {
        renderListOrder();
        await addEventForFormInforCustomer();
    }

    renderBillingDetail();

})
