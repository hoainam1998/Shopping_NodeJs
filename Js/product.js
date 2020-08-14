$(document).ready(function () {

  $(window).resize(function(){
    changeDisplayBreadCum();
  })

  function addSliderForInforProduct() {
    $('.slider-for').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      asNavFor: '.slider-nav',
    });

    $('.slider-nav').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      asNavFor: '.slider-for',
      centerMode: true,
      focusOnSelect: true,
      nextArrow: '.next',
      prevArrow: '.previous',
      responsive: [
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true
          }
        }
      ]
    });
  }

  function changeTotalHeader() {
    let cart = getCart();
    let cartTotal = 0;
    cart.forEach(function (item) {
      cartTotal += floorTotal(item.price) * item.quantityBought;
    })
    $('#totalHeader').html(cartTotal.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }));
  }

  function addEventForControlProduct(quantityProduct) {
    $('.btns_controlQuantity').click(function (evt) {
      let idproduct = new URLSearchParams(location.search).get('id_product');
      let index = getCart().findIndex(item => item._id === idproduct);
      let newCart = [...getCart()];

      let quantity = parseInt($('#valueQuantity').html());
      if ($(evt.target).attr('id') === 'plus') {
        quantity += 1;
        if (quantity >= quantityProduct) {
          quantity = quantityProduct;
        }
      } else if ($(evt.target).attr('id') === 'minus') {
        quantity -= 1;
        if (quantity <= 0) { quantity = 0; }
      }

      newCart[index] = { ...newCart[index], quantityBought: quantity };

      setCart(newCart);
      changeTotalHeader();
      $('#valueQuantity').html(quantity);
    })
  }

  function addSliderForRelatedProduct() {
    $('.containerRelatedProduct').slick({
      infinite: true,
      slidesToShow: 4,
      slidesToScroll: 2,
      nextArrow: '.btns_related_next',
      prevArrow: '.btns_related_previous',
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 2,
            infinite: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            infinite: true
          }
        }
      ]
    });
  }

  async function getProduct() {
    let params = new URLSearchParams(location.search);
    let idProduct = params.get('id_product');
    if (idProduct !== null) {
      return await $.get(`/api/products/item/${idProduct}`);
    }
    return [];
  }

  function changeContentBreadCum(breadcrums) {
    $('.breadCrumbs').empty();
    $('.breadCrumbs').append(`<li><a href="/">Home</a></li>`);
    $('.breadCrumbs').append(`<li><a href="/shop?${breadcrums.categories_id}">${breadcrums.categories_name}</a></li>`);
    $('.breadCrumbs').append(`<li>${breadcrums.product_name}</li>`)
  }

  function changeDisplayBreadCum() {
    let lengthBreadCum = $('.breadCrumbs').children().length;
    if ($(window).width() <= 767) {
        if (lengthBreadCum >= 3) {
            $('.breadCrumbs').css('flex-direction', 'column');
        }
    }else {
      $('.breadCrumbs').removeAttr('style');
    }
}

  function renderStarsProduct(ratemark) {
    $('.listStars').empty();
    let star = ratemark / 2;
    let halfstars = ratemark % 2;
    for (let i = 1; i <= 5; i++) {
      if (i <= star) {
        $('.listStars').append('<li><i class="fas fa-star"></i></li>')
      } else if (halfstars > 0) {
        $('.listStars').append('<li><i class="fas fa-star-half-alt"></i></li>')
        halfstars = 0;
      } else {
        $('.listStars').append('<li><i class="far fa-star"></i></li>')
      }
    }
  }

  let objtoValueRelatedProduct = {};
  let itemAddToCart = {};
  async function renderInforProduct() {
    let product = await getProduct();
    if (product[0] !== undefined) {
      let objValueBreadCrums = {
        categories_id: product[0].categories_id,
        categories_name: product[0].categories[0].categories_name,
        product_name: product[0].name
      }

      objtoValueRelatedProduct = {
        categories_id: product[0].categories_id,
        product_id: product[0]._id
      }

      let priceAfterFloor = floorTotal(product[0].price - (product[0].price * product[0].salePercent / 100));
      itemAddToCart = {
        _id: product[0]._id,
        image: product[0].images[0],
        name: product[0].name,
        quanity: product[0].quanity,
        price: priceAfterFloor
      }

      product[0].images.forEach(function (item) {
        $('.slider-for').append(`<img src="../images/${item}" alt="productimg">`)
        $('.slider-nav').append(`<img src="../images/${item}" alt="productimg">`)
      })
      $('.nameProductDetail').html(product[0].name);
      //(product.price - (product.price * (product.salePercent / 100)
      if (product[0].salePercent > 0) {
        $('.priceProductDetail #oldPrice').show();
        $('.priceProductDetail #oldPrice').html(product[0].price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }));
        $('.priceProductDetail #newPrice').html(floorTotal(product[0].price - (product[0].price * product[0].salePercent / 100)).toLocaleString('it-IT', { style: 'currency', currency: 'VND' }));
      }
      else {
        $('.priceProductDetail #newPrice').html(product[0].price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }));
      }

      if (product[0].price <= 0) {
        $('#instock').html('Not in Stock');
      } else {
        $('#instock').html('In Stock');
      }

      let productExisted = getCart().find(item => item._id === product[0]._id);
      if (productExisted) {
        $('#valueQuantity').html(productExisted.quantityBought);
      }
      $('.contentDescription').html(product[0].description);
      $('#weight').html(product[0].weight);

      renderStarsProduct(product[0].ratemark);
      changeContentBreadCum(objValueBreadCrums);
      addSliderForInforProduct();
      addEventForControlProduct(parseInt(product[0].quanity))
    }
  }

  function renderProduct(product) {
    let price = floorTotal(product.price);
    return `<div class="product" id="${product._id}">
                <div class="imgProductAndControl">
                    <a href="/productDetail?id_product=${product._id}"><img src="../images/${product.images[0]}" alt="imgproduct1"></a>
                    <div class="btn_control_product" data-idproduct=${product._id}>
                      <button class="addToMyFavourite"><i class="fas fa-heart"></i></button>
                      <button class="shareToMyFriends"><i class="fas fa-retweet"></i></button>
                      <button class="addToMyCarts"><i class="fas fa-shopping-cart"></i></button>
                    </div>
                </div>
                <div class="inforProduct">
                    <a href="/productDetail?id_product=${product._id}" class="nameProduct">${product.name}</a>
                    <h3 class="priceProduct">
                    ${price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                    </h3>
                </div>
            </div>`
  }

  function renderProductWithSale(product) {
    return `<div class="product" id="sale${product._id}">
                <div class="imgProductAndControl">
                    <a href="/productDetail?id_product=${product._id}"><img src="../images/${product.images[0]}" alt="imgproduct1"></a>
                    <div class="btn_control_product" data-idproduct=${product._id}>
                      <button class="addToMyFavourite"><i class="fas fa-heart"></i></button>
                      <button class="shareToMyFriends"><i class="fas fa-retweet"></i></button>
                      <button class="addToMyCarts"><i class="fas fa-shopping-cart"></i></button>
                    </div>
                    <span class="percentSale">-${product.salePercent}%</span>
                </div>
                <div class="inforProduct displayInforSaleProduct">
                    <a href="/productDetail?id_product=${product._id}" class="nameProduct">${product.name}</a>
                    <h3 class="priceProduct displayPrice">
                        <span class="newPrice">${floorTotal(product.price - (product.price * (product.salePercent / 100))).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })} </span>
                        <del class="oldPrice">${product.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</del>
                    </h3>
                </div>
            </div>`
  }

  function setCart(carts) {
    localStorage.setItem('carts', JSON.stringify(carts))
  }

  function getCart() {
    if (JSON.parse(localStorage.getItem('carts')) === null) {
      localStorage.setItem('carts', JSON.stringify([]))
    }
    return JSON.parse(localStorage.getItem('carts'));
  }

  function changeCartLength() {
    $('#cartlength').html(getCart().length);
  }

  function floorTotal(value) {
    if ((value % 1000) < 500) {
      return value - (value % 1000);
    } else if ((value % 1000) >= 500) {
      let valueTemplate = value - (value % 1000);
      return (((valueTemplate / 1000) + 1) * 1000);
    }
  }

  function changeTotalHeader() {
    let cart = getCart();
    let cartTotal = 0;
    cart.forEach(function (item) {
      cartTotal += floorTotal(item.price) * item.quantityBought;
    })
    $('#totalHeader').html(cartTotal.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }));
  }

  function addEventForAddToCart() {
    $('.addtoCartProduct').click(function () {
      itemAddToCart.quantityBought = parseInt($('#valueQuantity').html());
      let carts = getCart();
      carts.push(itemAddToCart);
      setCart(carts);
      $(this).hide();
      changeCartLength();
      changeTotalHeader();
    })
  }

  function checkProductExisted() {
    let params = new URLSearchParams(location.search);
    let idproduct = params.get('id_product');
    if (getCart().find(item => item._id === idproduct) !== undefined) {
      $('.addtoCartProduct').hide();
    }
  }

  async function renderRelatedProduct() {
    if (location.pathname.includes('productDetail')) {
      let productRelated = await $.get(`/api/items/${objtoValueRelatedProduct.categories_id}/${objtoValueRelatedProduct.product_id}`);
      $('.containerRelatedProduct').empty();
      productRelated.forEach(function (item) {
        if (item.salePercent > 0) {
          $('.containerRelatedProduct').append(renderProductWithSale(item));
        } else {
          $('.containerRelatedProduct').append(renderProduct(item));
        }
      })
    }
    addSliderForRelatedProduct();
  }

  function addEventForBntAddToMyFavourite() {
    $('.favouriteProductDetail').click(function () {
      let idproduct = new URLSearchParams(location.search).get('id_product');
      actionForEventForBntAddToMyFavourite(idproduct);
      addStyleforProductFavorite();
    })
  }

  function actionForEventForBntAddToMyFavourite(idproduct) {
    let id_productToAddFavoriteList = idproduct;
    let productToAddFavoriteList = getAllProducts().find(item => item._id === id_productToAddFavoriteList);
    let { _id, images, name, price, quanity, salePercent, ratemark } = productToAddFavoriteList;

    let priceAfterFloor = floorTotal(price - (price * salePercent / 100));
    let itemAddToFavoriteList = {
      _id: _id,
      image: images[0],
      name: name,
      quanity: quanity,
      ratemark,
      oldPrice: price,
      newPrice: priceAfterFloor
    }

    let myFavorite = getFavoriteList();
    let existedProduct = myFavorite.find(item => item._id === id_productToAddFavoriteList);
    if (existedProduct === undefined) {
      myFavorite.push(itemAddToFavoriteList);
      setFavoriteList(myFavorite);
    }
    $('#favoritelength').html(getFavoriteList().length);
  }

  function addStyleforProductFavorite() {
    $('addToMyFavourite').removeClass('newStyleBntsProduct');
    getFavoriteList().forEach(function (item) {
      $(`[data-idproduct="${item._id}"]`).children('button:first-child').addClass('newStyleBntsProduct');
      $(`[data-idproduct="${item._id}"]`).children('button:first-child').off('click');
    })
  }

  function setFavoriteList(listFavorite) {
    localStorage.setItem('myFavorite', JSON.stringify(listFavorite));
  }

  function getFavoriteList() {
    let myFavoriteList = JSON.parse(localStorage.getItem('myFavorite'));
    if (myFavoriteList === null) {
      return [];
    }
    return myFavoriteList;
  }

  function getAllProducts() {
    return JSON.parse(localStorage.getItem('Allproducts'));
  }

  async function renderProductDetail() {
    await renderInforProduct();
    await renderRelatedProduct();
    checkProductExisted()
    addEventForAddToCart()
    addEventForBntAddToMyFavourite()
    changeDisplayBreadCum()
  }

  renderProductDetail();
})