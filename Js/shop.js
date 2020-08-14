$(document).ready(function () {

    let renderList = false;

    function getProductWidthParam() {
        let categories = location.search.substring(1);
        if (categories.length > 0) {
            $(`.itemDepartment a[data-categories="${categories}"]`).click();
        }
    }

    async function renderCategoriesDepartment() {
        let data = await $.get('/api/categories')
        data.map(item => {
            $('.listDepartment')
                .append(`<li class="itemDepartment">
                                <a href="/api/products/${item._id}" data-categories="${item._id}">${item.categories_name}</a>
                        </li>`)
        })
    }

    async function clickItemCategoriesDepartment() {
        $('.itemDepartment a').click(async function (evt) {
            evt.preventDefault();
            let href = $(this).attr("href");
            let data = await $.get(href)
            $('.productSaleOff').empty();
            $('.product_Categories').empty();
            data.map(item => {
                if (item.salePercent > 0) {
                    $('.productSaleOff').append(renderProductWithSale(item));
                }
            })
            setProduct(data);
            setAllProducts(data);
            addStyleforProductBought();
            addEventForBntAddToMyCarts(data);
            $('.fa-th-large').click();
            $('.listSaleOffLength b').html($('.productSaleOff').children().length)
            $('.productSaleOff').slick('unslick');
            $('.product').each(function () {
                if ($(this).attr('tabindex') !== undefined) {
                    $(this).remove();
                }
            })
            addSliderForSaleOfProducts()
            $('#valueNumberFound').html(data.length);
        })
    }

    function addSliderForSaleOfProducts() {
        $('.productSaleOff').slick({
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 3,
            speed: 700,
            prevArrow: '.btns_controlSliderSaleOff .previous_saleoff',
            nextArrow: '.btns_controlSliderSaleOff .next_saleoff',
            responsive: [
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,
                  }
                }]
        })
    }

    function Sort() {
        $('.sort > select').change(async function () {
            let products = [];

            products = getProduct();

            if (parseInt($(this).val()) === 1) {
                let i, j;
                for (i = 1; i < products.length; i++) {
                    j = i;
                    while (j > 0 && products[j].price < products[j - 1].price) {
                        let template = products[j - 1];
                        products[j - 1] = products[j];
                        products[j] = template;

                        j -= 1;
                    }
                }
            } else if (parseInt($(this).val()) === -1) {
                let i, j;
                for (i = 1; i < products.length; i++) {
                    j = i;
                    while (j > 0 && products[j].price > products[j - 1].price) {
                        let template = products[j - 1];
                        products[j - 1] = products[j];
                        products[j] = template;

                        j -= 1;
                    }
                }
            }

            $('.product_Categories').empty();
            if (renderList) {
                products.map(item => {
                    $('.product_Categories').append(renderProductList(item))
                })
            } else {
                products.map(item => {
                    if (item.salePercent > 0) {
                        $('.product_Categories').append(renderProductWithSale(item))
                    } else {
                        $('.product_Categories').append(renderProduct(item))
                    }
                })
            }
            addStyleforProductBought()
            addEventForBntShareToMyFriend();
        })
    }

    function clickDisplayProducts() {
        $('#grid').addClass('changeColorForBnts_display');
        $('.display').click(function (evt) {
            let element = $(evt.target).parent();
            $('.product_Categories').empty();
            displayProduct(element, getProduct());
            changeColorForDisplayButton(element);
        })
    }

    function displayProduct(el, product) {
        if ($(el).attr('id') === 'grid') {
            renderList = false;
            $('.product_Categories').addClass('renderGrid');
            product.forEach(function (item) {
                if (item.salePercent > 0) {
                    $('.product_Categories').append(renderProductWithSale(item))
                } else {
                    $('.product_Categories').append(renderProduct(item))
                }
            })
        } else if ($(el).attr('id') === 'list') {
            renderList = true;
            $('.product_Categories').removeClass('renderGrid');
            product.forEach(function (item) {
                $('.product_Categories').append(renderProductList(item))
                renderStarsProduct(item._id, item.ratemark)
            })
        }
        addStyleforProductBought();
        addEventForBntAddToMyCarts(product);
        addEventForBntShareToMyFriend();
    }

    function changeColorForDisplayButton(el) {
        $('.changeColorForBnts_display').removeClass('changeColorForBnts_display');
        $(el).addClass('changeColorForBnts_display');
    }

    function renderStarsProduct(id, ratemark) {
        $(`.productsList#${id} .starts`).empty();
        let star = ratemark / 2;
        let halfstars = ratemark % 2;
        for (let i = 1; i <= 5; i++) {
            if (i <= star) {
                $(`.productsList#${id} .starts`).append('<li><i class="fas fa-star"></i></li>')
            } else if (halfstars > 0) {
                $(`.productsList#${id} .starts`).append('<li><i class="fas fa-star-half-alt"></i></li>')
                halfstars = 0;
            } else {
                $(`.productsList#${id} .starts`).append('<li><i class="far fa-star"></i></li>')
            }
        }
    }

    async function renderPriceRange() {
        await $.get('/api/price', function (data, status) {
            let range = data[0].price;
            for (let i = 0; i < range; i += 50000) {
                let value = i + 50000;
                if (value > range) {
                    value = range;
                }

                if (i === 0) {
                    $('.bnts_price').append(`<button class="btn_pricerange">
                            <span data-from="0">Duoi</span>
                            <span data-to="${value}">${value.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
                        </button>`)
                } else {
                    $('.bnts_price').append(`<button class="btn_pricerange">
                                <span data-from="${i}">${i.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
                                <span data-to="${value}">${value.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
                        </button>`)
                }
            }
        })
    }

    function renderProductPriceRange() {
        $('.btn_pricerange').click(function () {
            let valueFrom = parseInt($(this).children('span:first-child').attr('data-from'));
            let valueTo = parseInt($(this).children('span:last-child').attr('data-to'));

            $('.product_Categories').empty();
            let product = getAllProducts();
            let productSorted = [];
            product.forEach(function (item) {
                itemPrice = floorTotal(item.price - (item.price * (item.salePercent / 100)))
                if (itemPrice >= valueFrom && itemPrice <= valueTo) {
                    productSorted.push(item);
                    if (item.salePercent > 0) {
                        $('.product_Categories').append(renderProductWithSale(item));
                    } else {
                        $('.product_Categories').append(renderProduct(item));
                    }
                }
            })
            addStyleforProductBought();
            setProduct(productSorted);
            $('#valueNumberFound').html(productSorted.length);
        })
    }

    async function renderProductShop() {
        $('.product_Categories').empty();
        $('.productSaleOff').empty();
        let product = await $.get('/api/search');
        if (product.length > 0) {
            $.ajax({
                url: '/api/destroyValueSearch',
                type: 'delete',
                success: function (data, status) {
                    console.log(data);
                }
            })
        }

        if (product.length === 0) {
            product = await $.get('/api/products');
        }

        product.map(item => {
            if (item.salePercent > 0) {
                $('.productSaleOff').append(renderProductWithSale(item));
                $('.product_Categories').append(renderProductWithSale(item));
            } else {
                $('.product_Categories').append(renderProduct(item));
            }
        })

        $('.listSaleOffLength b').html($('.productSaleOff').children().length)
        addStyleforProductBought();
        addEventForBntShareToMyFriend();
        setAllProducts(product);
        setProduct(product);
        $('#valueNumberFound').html(product.length);
    }

    function renderProductList(product) {
        return `<div class="product productsList" id="${product._id}">
                        <a href="/productDetail?id_product=${product._id}"><img src="../images/${product.images[0]}" alt="imgProduct"></a>
                        <div class="inforProductGrid">
                            <h2 class="nameProductList">${product.name}</h2>
                            <ul class="starts">
                                <li><i class="fas fa-star"></i></li>
                                <li><i class="fas fa-star"></i></li>
                                <li><i class="fas fa-star"></i></li>
                                <li><i class="far fa-star"></i></li>
                                <li><i class="far fa-star"></i></li>
                            </ul>
                            <h3 class="priceProduct">
                                <span class="newPrice">${floorTotal(product.price - (product.price * (product.salePercent / 100))).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
                                ${(product.salePercent > 0) ? `<del class="oldPrice">${product.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</del>` : ''}
                            </h3>
                            <p class="description">${product.description}</p>
                            <div class="bnts_controlProductListBox" data-idproduct="${product._id}">
                                <a href="/productDetail?id_product=${product._id}" class="viewmore">Xem them</a>
                                <button class="addToCart addToMyCarts">
                                    <i class="fas fa-shopping-cart"></i>
                                </button>
                            </div>
                        </div>
                    </div>`
    }

    function renderProduct(product) {
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
                            ${product.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
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

    function addEventForBntAddToMyCarts(products) {
        $('.addToMyCarts').click(function () {
            console.log('add to cart')
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
                $(this).addClass('newStyleBntsProduct');
                $('.containerPopUp img').attr('src', `../images/${images[0]}`);
                $('.containerPopUp .nameProductPopup').html(name)

                $('.containerPopUp').show();
                setTimeout(function () {
                    $('.containerPopUp').addClass('hidePopUp');
                    $('.containerPopUp').hide();
                }, 1500)

                changeCartLength();
                changeTotalHeader();
                addStyleforProductBought();
            }
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
            $(`[data-idproduct="${id_product}"] .shareToMyFriends`).addClass('newStyleBntsProduct');
        })
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

    function addStyleforProductBought() {
        getCart().forEach(function (item) {
            $(`[data-idproduct="${item._id}"] .addToMyCarts`).addClass('newStyleBntsProduct');
            $(`[data-idproduct="${item._id}"] .addToCart`).addClass('alreadyInCart').removeClass('addToCart').html('Da them vao gio')
        })
    }

    function changeCartLength() { $('#cartlength').html(getCart().length); }

    function changeTotalHeader() {
        let cart = getCart();
        let cartTotal = 0;
        cart.forEach(function (item) {
            cartTotal += floorTotal(item.price) * item.quantityBought;
        })
        $('#totalHeader').html(cartTotal.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }));
    }

    function renderStarsFavoriteProduct(ratemark){
        let stars=ratemark/2;
        let halfstar=ratemark%2;
        let listStars='';
        for(let i=0;i<5;i++){
          if(i<stars){
            listStars+='<li><i class="fas fa-star"></i></li>';
          }else if(halfstar>0){
            listStars+='<li><i class="fas fa-star-half-alt"></i></li>';
            halfstar=0;
          }else {
            listStars+='<li><i class="far fa-star"></i></li>';
          }
        }
        return listStars;
    }

    function renderProductFavorite(product) {
        return `<div class="productFavorite">
                <a href="/productDetail?id_product=${product._id}"><img src="../images/${product.image}" alt="imgproduct"></a>
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
                    <a href="/productDetail?id_product=${product._id}"><h1 class="nameProductFavorite">${product.name}</h1></a>
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
                </div>`
    }

    function addStyleforProductFavorite() {
        console.log('remove style');
        $('.addToMyFavourite').removeClass('newStyleBntsProduct');
        getFavoriteList().forEach(function (item) {
            $(`[data-idproduct="${item._id}"]`).children('button:first-child').addClass('newStyleBntsProduct');
            $(`[data-idproduct="${item._id}"]`).children('button:first-child').off('click');
        })
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

    function addEventForBntAddToMyFavourite() {
        $('.addToMyFavourite').click(function () {
            let idproduct = $(this).parent().data('idproduct');
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
        let existedProduct=myFavorite.find(item=>item._id===id_productToAddFavoriteList);
        if(existedProduct===undefined){
            myFavorite.push(itemAddToFavoriteList);
            setFavoriteList(myFavorite);
        }
        
        $('#favoritelength').html(getFavoriteList().length);
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
          };
          addStyleforProductFavorite();
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

    function setProduct(products) {
        localStorage['products'] = [];
        localStorage.setItem('products', JSON.stringify(products));
    }

    function getProduct() {
        return JSON.parse(localStorage.getItem('products'));
    }

    function setAllProducts(allProduct) {
        localStorage['Allproducts'] = [];
        localStorage.setItem('Allproducts', JSON.stringify(allProduct));
    }

    function getAllProducts() {
        return JSON.parse(localStorage.getItem('Allproducts'));
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

    async function callRendershop() {
        await renderCategoriesDepartment();
        await clickItemCategoriesDepartment();
        await renderPriceRange();
        await renderProductShop();
        await renderProductPriceRange();
        clickDisplayProducts();
        Sort();
        getProductWidthParam();
        addEventForBntAddToMyFavourite();
        addEventForBtnFavoriteHeader()
        addStyleforProductFavorite();
        addEventForBntAddToMyCarts(getAllProducts());
        addEventForBntShareToMyFriend();
        addSliderForSaleOfProducts();
        $('.containerFeaturedProducts .addToMyFavourite').off('click');
        $('.containerFeaturedProducts .addToMyCarts').off('click');
        if(location.pathname.includes('shop')){
            $('.breadCrumbs li:last-child').html('shopping')
        }
    }

    callRendershop();

})
