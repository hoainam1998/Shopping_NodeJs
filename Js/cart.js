$(document).ready(function(){
    
    function changeContentBreadCum() {
        $('.breadCrumbs').empty();
        $('.breadCrumbs').append(`<li><a href="/">Home</a></li>`);
        $('.breadCrumbs').append(`<li>Shopping cart</li>`);
    }

    function renderCartRow(item){
        let itemPrice=floorTotal(item.price);
        return `<li class="cartrow" data-idProduct="${item._id}">
                    <img src="../images/${item.image}" alt="img">
                    <span class="name">${item.name}</span>
                    <b class="price" data-price="${itemPrice}">${itemPrice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</b>
                    <input type="number" name="qunatity" min="1" max="${item.quanity}" value="${item.quantityBought}">
                    <b class="totalcart" data-total="${itemPrice*item.quantityBought}">${(itemPrice*item.quantityBought).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</b>
                    <span class="remove"><i class="fas fa-times"></i></span>
                </li>`
    }

    function getCart(){
        if(JSON.parse(localStorage.getItem('carts'))===null){
          localStorage.setItem('carts',JSON.stringify([]))
        }
        return JSON.parse(localStorage.getItem('carts'));
    }

    function setCart(carts){
        localStorage.setItem('carts',JSON.stringify(carts))
    }

    function changeCartLength(){
        $('#cartlength').html(getCart().length);
    }

    function renderProductToCart(){
        let productToCart=getCart();
        productToCart.reverse();
        $('.listcart').empty();
        productToCart.forEach(function(item){
            $('.listcart').append(renderCartRow(item));
        })
    }

    function addEventForInputQuantity(){
        $('input[type="number"]').change(function(){
            let price=parseInt($(this).prev().attr('data-price'));
            let quantityBought=$(this).val();

            let index=getCart().findIndex(item=>item._id===$(this).parent().attr('data-idProduct'));

            let cartArray=[...getCart()];

            cartArray[index]={...cartArray[index],quantityBought:quantityBought}

            setCart(cartArray);

            let total=price*quantityBought;
            let actualTotal=floorTotal(total);
            $(this).next().attr('data-total',actualTotal);
            $(this).next().html(actualTotal.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }));
            calcTotal()
        })
    }

    function addEventForRemoveBnt(){
        $('.remove').click(function(){
           let productBought=getCart();
           productBought=productBought.filter(item=>item._id!==$(this).parent().attr('data-idProduct'));
           setCart(productBought);
           $(this).parent().remove();
           calcTotal();
           changeCartLength();
        })
    }

    function addEventForToCheckout(){
        $('.toCheckout').click(function(evt){
            evt.preventDefault();
            if(getCart().length===0){
                $('.popUpNotProductInCart').show();
            }else {
                $(location).attr('href',`${$(this).attr('href')}`);
            }
        })
    }

    function addEventForPopUpNotProductInCart(){
        $('.btns_controlPopUp button').click(function(){
            $('.popUpNotProductInCart').hide();
        })  
    }

    function floorTotal(value){
        if((value%1000)<500){
            return value-(value%1000);
        }else if((value%1000)>=500){
            let valueTemplate=value-(value%1000);
            return(((valueTemplate/1000)+1)*1000);
        }
    }

    function calcTotal(){
        let total=0;
        $('.totalcart').each(function(){
            total+=parseInt($(this).attr('data-total'));
        })
        $('#subtotal').html(total.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }));
        $('#total').html(total.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }));
        $('#totalHeader').empty().html(total.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }));
    }

    $('.actionCouponCode input[type="submit"]').click(function(evt){
        evt.preventDefault();
    })

    function renderShoppingCart(){
        changeContentBreadCum();
        renderProductToCart();
        addEventForInputQuantity();
        addEventForRemoveBnt();
        changeCartLength();
        calcTotal();
        addEventForToCheckout();
        addEventForPopUpNotProductInCart();
    }

    renderShoppingCart();
})