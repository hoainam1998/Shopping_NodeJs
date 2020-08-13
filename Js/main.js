$(document).ready(function () {
  let allProducts = [];

  async function Search() {
    $('.search button[type="submit"]').click(async function (evt) {
      evt.preventDefault();
      let value = $('.search input[type="text"]').val();
      if (value !== "") {
        $('.listResult').show();
        $('.listResult').empty();
        let data = await $.post('/api/search', { search: value });
        if (data !== undefined) {
          $('.listResult').append(`<li class="resultFound"><a href="/shop">Co <b id="listResultLength">${data.length}</b> ket qua duoc tim thay</a></li>`)
          let products = getCart();
          data.map((item, index) => {
            let productExisted = products.find((el) => el._id === item._id)
            $('.listResult').append(`<li class="itemResult">
                                          <a href="/productDetail?id_product=${item._id}" data-id="${item._id}">
                                            <img src="../images/${item.images[0]}" alt="img">
                                            <span class="nameResult">${item.name}</span>
                                          </a>
                                          ${
              (productExisted !== undefined) ?
                '<button class="buy bought">da them vao gio</button>'
                : '<button class="buy">chon mua</button>'}
                                      </li>`)
            if (index === 3) { return; }
          })
          $('.hideListSearch').show();
        }
        addEventForBnt_Buy(data);
      }
    })
  }

  async function getCategories() {
    $.get("/api/categories", function (data, status) {
      data.map(item => {
        $('.listcategories').append(`<li class="itemCategories"><a href="/shop?${item._id}">${item.categories_name}</a></li>`)
      })

      data.forEach(function(item){
        $('.listCategoriesLink').append(`<li><a href="/shop?${item._id}">${item.categories_name}</a></li>`);
      })

      data.map(item => {
        $('.sliderCategories').append(`<a href="/shop/?${item._id}">
                                        <img src="../images/${item.imagesCategories}" alt="imcategories">
                                        <h3>${item.categories_name}</h3>
                                    </a>`)
      })

      data.map(item => {
        $('.categoriesLinkFeatured').append(
          `<li class="itemCategoriesLinkFeatured" data-filter=".${item._id}">
          <a href="#">${item.categories_name}</a>
        </li>`)
      })

      $('.sliderCategories').slick({
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        speed: 600,
        autoplaySpeed: 2000,
        nextArrow: '.btn_next',
        prevArrow: '.btn_previous',
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              infinite: true,
            }
          }
        ]
      });
    });
  }

  async function getAllProduct() {
    let products = await $.get("/api/products")
    products.map(item => {
      $('.containerFeaturedProducts').append(
        `<div class="mix ${item.categories_id}">
          <div class="product">
              <div class="imgProductAndControl">
                  <a href="/productDetail?id_product=${item._id}"><img src="../images/${item.images[0]}" alt="imgproduct1"></a>
                  <div class="btn_control_product" data-idproduct=${item._id}>
                      <button class="addToMyFavourite"><i class="fas fa-heart"></i></button>
                      <button class="shareToMyFriends"><i class="fas fa-retweet"></i></button>
                      <button class="addToMyCarts"><i class="fas fa-shopping-cart"></i></button>
                  </div>
              </div>
              <div class="inforProduct">
                  <a href="/productDetail?id_product=${item._id}" class="nameProduct">${item.name}</a>
                  <h3 class="priceProduct displayPrice">
                    <span class="newPrice">${floorTotal(item.price - (item.price * (item.salePercent / 100))).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })} </span>
                    ${(item.salePercent > 0) ? `<del class="oldPrice">${item.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</del>` : ''}
                  </h3>
              </div>
          </div>
      </div>`)
    })

    addStyleforProductBought();

    if ($('.containerFeaturedProducts').length > 0) {
      mixitup('.containerFeaturedProducts');
    }
    $('.itemCategoriesLinkFeatured a').click(function (evt) { evt.preventDefault(); })

    return products;
  }

  async function getProductLatest() {
    let productLatest = await $.get('/api/products/date');
    var totalpage = Math.floor(productLatest.length / 3);

    for (let page = 1; page <= totalpage; page++) {
      $('.slider_latest_product').append(`<div id=boxslatest${page} class="boxsProduct"></div>`);
      for (let i = (page - 1) * 3; i < (page * 3); i++) {
        $(`#boxslatest${page}.boxsProduct`).append(renderBoxProductItem(productLatest[i]))
      }
    }
    createSliderForLatestProducts();
  }

  async function getProductRated() {
    let productRated = await $.get('/api/products/rated');
    var totalpage = Math.floor(productRated.length / 3);

    for (let page = 1; page <= totalpage; page++) {
      $('.slider_rated_product').append(`<div id=boxsrated${page} class="boxsProduct"></div>`);
      for (let i = (page - 1) * 3; i < (page * 3); i++) {
        $(`#boxsrated${page}.boxsProduct`).append(renderBoxProductItem(productRated[i]))
      }
    }
    createSliderForRatedProducts();
  }

  async function getProductView() {
    let productViews = await $.get('/api/products/views');
    var totalpage = Math.floor(productViews.length / 3);
    for (let page = 1; page <= totalpage; page++) {
      $('.slider_review_product').append(`<div id=boxsreview${page} class="boxsProduct"></div>`);
      for (let i = (page - 1) * 3; i < (page * 3); i++) {
        $(`#boxsreview${page}.boxsProduct`).append(renderBoxProductItem(productViews[i]))
      }
    }
    createSliderForReviewProducts();
  }

  renderBoxProductItem = (product) => {
    return `<a href="/productDetail?id_product=${product._id}" class="boxProductItem">
              <img src="../images/${product.images[0]}" alt="product">
                <div class="productInforBox">
                    <h3 class="nameProduct">${product.name}</h3>
                    <span class="priceProduct">
                      <span class="newPrice">${floorTotal(product.price - (product.price * (product.salePercent / 100))).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
                      ${(product.salePercent > 0) ? `<del class="oldPrice">${product.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</del>` : ''}
                    </span>
                </div>
            </a>`
  }

  createSliderForLatestProducts = () => {
    $('.slider_latest_product').slick({
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: '.btn_latestProduct .btn_slider_product_next',
      prevArrow: '.btn_latestProduct .btn_slider_product_previous',
    });
  }

  createSliderForRatedProducts = () => {
    $('.slider_rated_product').slick({
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: '.btn_ratedProduct .btn_slider_product_next',
      prevArrow: '.btn_ratedProduct .btn_slider_product_previous',
    });
  }

  createSliderForReviewProducts = () => {
    $('.slider_review_product').slick({
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: '.btn_reviewProduct .btn_slider_product_next',
      prevArrow: '.btn_reviewProduct .btn_slider_product_previous',
    });
  }

  $('.titleCategories').click(function () {
    $(this).children('.fa-chevron-down').toggleClass('rotateIconDown');
    $('.listcategories').slideToggle();
  })

  if ($(location).attr('pathname') !== "/") {
    $('.listcategories').slideUp();
  }

  function setCart(cart) {
    let productBought = getCart();
    let productExisted = productBought.find((item) => item._id === cart._id);
    if (productExisted === undefined) {
      productBought.push(cart)
      localStorage.setItem('carts', JSON.stringify(productBought));
      return true;
    }
    return false;
  }

  function getCart() {
    if (JSON.parse(localStorage.getItem('carts')) === null) {
      localStorage.setItem('carts', JSON.stringify([]))
    }
    return JSON.parse(localStorage.getItem('carts'));
  }

  function addStyleforProductBought() {
    getCart().forEach(function (item) {
      $(`[data-idproduct="${item._id}"]`).children('button:last-child').addClass('newStyleBntsProduct');
    })
  }

  function addStyleforProductFavorite() {
    $('addToMyFavourite').removeClass('newStyleBntsProduct');
    getFavoriteList().forEach(function (item) {
      $(`[data-idproduct="${item._id}"]`).children('button:first-child').addClass('newStyleBntsProduct');
      $(`[data-idproduct="${item._id}"]`).children('button:first-child').off('click');
    })
  }

  function addEventForBntAddToMyCarts(products) {
    $('.addToMyCarts').click(function () {
      console.log('add to cart home');
      let id_productToAddMyCart = $(this).parent().data('idproduct')
      let productToAddMyCart = products.find(item => item._id === id_productToAddMyCart);
      let { _id, images, name, quanity, price, salePercent } = productToAddMyCart;

      let priceAfterFloor = floorTotal(price - (price * salePercent / 100));
      itemAddToCart = {
        _id: _id,
        image: images[0],
        name: name,
        quanity: quanity,
        quantityBought: 1,
        price: priceAfterFloor
      }

      let addToCartSuccess = setCart(itemAddToCart);
      if (addToCartSuccess) {
        $(this).addClass('newStyleBntsProduct ');
        $('.containerPopUp img').attr('src', `../images/${images[0]}`);
        $('.containerPopUp .nameProductPopup').html(name)

        $('.containerPopUp').show();
        setTimeout(function () {
          $('.containerPopUp').addClass('hidePopUp');
          $('.containerPopUp').hide();
        }, 1500)

        changeCartLength();
        changeTotalHeader();
      }
      $(this).off('click');
    })
  }

  function addEventForBntShareToMyFriend() {
    $('.shareToMyFriends').click(function () {
      let id_product = $(this).parent().data('idproduct');
      $('.shareLink ').show();
      setTimeout(() => {
        $('.shareLink ').hide();
      }, 1000)
      $('.contentShareLink textarea').val(`http://localhost:5000/productDetail?id_product=${id_product}`)
      $('.contentShareLink textarea').select();
      document.execCommand('copy');
      $('.shareToMyFriends').each(function () {
        $(this).removeClass('newStyleBntsProduct');
      })

      $(this).addClass('newStyleBntsProduct');
      $(this).off('click');
      $(`[data-idproduct="${id_product}"] .shareToMyFriends`).addClass('newStyleBntsProduct');
    })
  }

  function addEventForBntAddToMyFavourite() {
    $('.addToMyFavourite').click(function () {
      let idproduct = $(this).parent().data('idproduct');
      actionForEventForBntAddToMyFavourite(idproduct);
      getFavoriteList().forEach(function (item) {
        $(`[data-idproduct="${item._id}"]`).children('button:first-child').off('click');
      })
      addStyleforProductFavorite();
    })
  }

  function actionForEventForBntAddToMyFavourite(idproduct) {
    let id_productToAddFavoriteList = idproduct;
    let productToAddFavoriteList = allProducts.find(item => item._id === id_productToAddFavoriteList);
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

  function addEventForBtnFavoriteHeader() {
    $('.favourite').click(function () {
      $('.listProducts').empty();
      let myFavoriteList = getFavoriteList();
      myFavoriteList.forEach(function (item) {
        $('.listProducts').append(renderProductFavorite(item));
      })

      $('.favoriteList').show(function () {
        addEventForMyFavoritePanel();
      });
    })
  }

  function renderProductFavorite(product) {
    return `<a href="#" class="productFavorite">
              <img src="../images/${product.image}" alt="imgproduct">
              <div class="btns-controlFavoriteProduct">
                  <button class="dots-btn">
                      <i class="fas fa-ellipsis-h"></i>
                  </button>
                  <div class="moreOption" data-idproduct=${product._id}>
                      <button class="addtoCarts"><i class="fas fa-shopping-cart"></i></button>
                      <button class="dislike"><i class="fas fa-thumbs-down"></i></button>
                  </div>
              </div>
              <div class="inforFavoriteProduct">
                  <h1 class="nameProductFavorite">${product.name}</h1>
                  <ul class="listStars starsFavorite">
                      ${renderStarsFavoriteProduct(product.ratemark)}
                  </ul>
                  ${(product.newPrice !== product.oldPrice) ?
        `<h3 class="priceProduct displayPrice">
                          <span class="newPrice">${product.newPrice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })} </span>
                          <del class="oldPrice" style="margin-left:2rem">${product.oldPrice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</del>
                       </h3>`
        : `<h3 class="priceProduct displayPrice" style="justify-content: center">
                          <span class="newPrice">${product.newPrice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })} </span>
                      </h3>`}
                  </div>
            </a>`
  }

  function renderStarsFavoriteProduct(ratemark) {
    let stars = ratemark / 2;
    let halfstar = ratemark % 2;
    let listStars = '';
    for (let i = 0; i < 5; i++) {
      if (i < stars) {
        listStars += '<li><i class="fas fa-star"></i></li>';
      } else if (halfstar > 0) {
        listStars += '<li><i class="fas fa-star-half-alt"></i></li>';
        halfstar = 0;
      } else {
        listStars += '<li><i class="far fa-star"></i></li>';
      }
    }

    return listStars;
  }

  function addEventForMyFavoritePanel() {
    $('.cancel').click(function () {
      $('.favoriteList').hide();
    })

    $('.favoriteList').click(function (evt) {
      if ($(evt.target).is($(this))) {
        $(this).hide();
      }
    })

    $('.addtoCarts').click(function () {
      let productFavorite = getFavoriteList().find(item => item._id === $(this).parent().data('idproduct'));
      let { _id, image, name, quanity, newPrice } = productFavorite;
      itemAddToCart = {
        _id: _id,
        image: image,
        name: name,
        quanity: quanity,
        quantityBought: 1,
        price: newPrice
      }

      let addToCartSuccess = setCart(itemAddToCart);
      if (addToCartSuccess) {
        $(this).addClass('newStyleBntsProduct ');
        $('.containerPopUp img').attr('src', `../images/${image}`);
        $('.containerPopUp .nameProductPopup').html(name)

        $('.containerPopUp').show();
        setTimeout(function () {
          $('.containerPopUp').addClass('hidePopUp');
          $('.containerPopUp').hide();
        }, 1500)
      }

      changeCartLength();
      changeTotalHeader();
    })

    let listIdfromCart = getCart().map(item => item._id);
    $('.moreOption').each(function () {
      let idproduct = $(this).data('idproduct');
      if (listIdfromCart.includes(idproduct)) {
        $(this).children('button.addtoCarts').addClass('newStyleBntsProduct');
      }
    })

    $('.dislike').click(function () {
      let idproduct = $(this).parent().data('idproduct');
      let productFavoriteUpdated = getFavoriteList().filter(item => item._id !== idproduct);
      setFavoriteList(productFavoriteUpdated);
      $(this).parents('.productFavorite').remove();
      $('#favoritelength').html(getFavoriteList().length);
      if ($('.listProducts').children().length <= 0) {
        $('.favoriteList').hide();
      }
      $(`[data-idproduct="${idproduct}"]`).children('button:first-child').on('click', function () {
        $(this).off('click');
        actionForEventForBntAddToMyFavourite(idproduct);
        addStyleforProductFavorite();
      });
      addStyleforProductFavorite()
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

  function addEventForBnt_Buy(products) {
    $('.buy').click(function () {
      let productBuy_id = $(this).prev().data('id');
      let productBuy = products.find(item => item._id === productBuy_id);
      let { _id, images, name, quanity, price, salePercent } = productBuy;

      let priceAfterFloor = floorTotal(price - (price * salePercent / 100));
      itemAddToCart = {
        _id: _id,
        image: images[0],
        name: name,
        quanity: quanity,
        quantityBought: 1,
        price: priceAfterFloor
      }

      let addToCartSuccess = setCart(itemAddToCart);
      if (addToCartSuccess) {
        $(this).html('Da them vao gio');
        $(this).off('click');
        $(this).addClass('bought');
        $('.containerPopUp img').attr('src', `../images/${images[0]}`);
        $('.containerPopUp .nameProductPopup').html(name)

        $('.containerPopUp').show();
        setTimeout(function () {
          $('.containerPopUp').addClass('hidePopUp');
          $('.containerPopUp').hide();
        }, 1000)
      }
      changeCartLength();
      changeTotalHeader();
      $(`[data-idProduct="${productBuy._id}"]`).children('a:last-child').addClass('.newStyleBntsProduct ');

      if (location.pathname === "/shopping/cart") {
        location.reload();
      }

      if (location.pathname === "/billingDetail") {
        location.reload();
      }
    })
  }

  function addEvetForSearchList() {
    $('.hideListSearch').click(function () {
      $('.listResult').hide();
      $(this).hide();
    })
  }

  async function renderHomePage() {
    await Search();
    await getCategories();
    allProducts = await getAllProduct();
    await getProductLatest();
    await getProductRated();
    await getProductView();
    addEventForBntAddToMyCarts(allProducts);
    addEventForBntAddToMyFavourite();
    changeCartLength();
    changeTotalHeader();
    addEvetForSearchList();
    addEventForBntShareToMyFriend();
    addStyleforProductBought();
    addStyleforProductFavorite();
    addEventForBtnFavoriteHeader();
    $('#favoritelength').html(getFavoriteList().length);
    $('.products .addToMyFavourite').off('click');
  }

  renderHomePage();
})
