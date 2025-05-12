(() => {
  const init = () => {
    buildHTML().then(() => {
      setEvents();
    });
    buildCSS();
  };

  const showToast = (message) => {
    const toast = document.createElement('div');
    toast.className = 'custom_toast show';
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
      document.body.removeChild(toast);
    }, 2000);
  };

  const titleComponent = (title) => {
    return `
        <div class="banner_titles">
          <h2 class="title_primary">${title}</h2>
        </div>
      `;
  };

  const navComponent = (id, className) => {
    return `
        <button class="slider_nav ${className}" id="${id}">${
      id == 'prev' ? '<' : '>'
    }  </button>
      `;
  };

  const productComponent = (product, favoriteProducts) => {
    const { id, url, brand, name, img, price, original_price } = product;

    const isDiscount = price < original_price;

    const discountRate = !isDiscount
      ? 0
      : Math.trunc((100 - (price * 100) / original_price).toFixed(1));

    const isFavorite = favoriteProducts.includes('' + id);

    return `
        <div class="product" data-id="${id}" data-url="${url}">
  
          <div class="product_image">
            <img src="${img}" alt="${brand} ${name}">
            <button class="product_favorite ${
              isFavorite ? 'product_favorite_active' : ''
            }" data-id="${id}" data-favorite="${isFavorite == true}"></button>
          </div>
  
            <p class="product_title"> <b>${brand} -</b> ${name}</p>
            <div class="product_price">
            
              ${
                isDiscount
                  ? `<div class="product_discounted">
                <span class="product_dicounted_oldprice">${original_price} TL</span>
                <span class="product_discount_rate">% ${discountRate}</span>
                </div>
                <span class="product_dicounted_newprice">${price} TL</span>
              `
                  : '<span class="product_price_new">' + price + ' TL</span>'
              }
            
            </div>
            <div class="product_promo">Farklı Ürünlerde 3 Al 2 Öde</div>
            
  
            <button class="product_add_to_cart">Sepete Ekle</button>
  
        </div>
      `;
  };

  const buildHTML = async () => {
    console.log('builhtml başladı');
    let productsData = [];

    const storedData = localStorage.getItem('products');
    const storedTimeStamp = parseInt(localStorage.getItem('productTimeStamp'));
    const oneDay = 24 * 60 * 60 * 1000;
    const now = Date.now();

    if (storedData && storedTimeStamp && now - storedTimeStamp < oneDay) {
      try {
        productsData = JSON.parse(storedData);
      } catch (error) {
        console.error('Veri bozuk!', error);
      }
    } else {
      try {
        const productsResponse = await fetch(
          'https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json'
        );
        if (productsResponse.ok) {
          productsData = await productsResponse.json();
          localStorage.setItem('products', JSON.stringify(productsData));
          localStorage.setItem('productTimeStamp', now);
        } else {
          console.error(
            'Veri yüklenirken hata oluştu, hata kodu: ',
            productsResponse.status
          );
        }
      } catch (error) {
        console.error('Ürünler yüklenirken hata oluştu:', error);
      }
    }
    console.log('buildHtml verisi :', productsData);
    const appElement = document.createElement('div');
    appElement.id = 'app';

    appElement.innerHTML = titleComponent('Beğenebileceğinizi düşündüklerimiz');

    const sliderWrapper = document.createElement('div');
    sliderWrapper.className = 'slider_wrapper';

    const prevButton = document.createElement('div');
    prevButton.className = 'slider_nav_container';
    prevButton.innerHTML = navComponent('prev', 'prev_btn');

    const nextButton = document.createElement('div');
    nextButton.className = 'slider_nav_container';
    nextButton.innerHTML = navComponent('next', 'next_btn');

    const productWrapper = document.createElement('div');
    productWrapper.className = 'product_wrapper';

    const favoriteProducts =
      JSON.parse(localStorage.getItem('favoriteProducts')) || [];

    const productListHtml = productsData
      .map((product) => productComponent(product, favoriteProducts))
      .join('');
    productWrapper.innerHTML = productListHtml;

    sliderWrapper.appendChild(prevButton);
    sliderWrapper.appendChild(productWrapper);
    sliderWrapper.appendChild(nextButton);

    appElement.appendChild(sliderWrapper);
    document.body.appendChild(appElement);
    console.log('buildhtml tamamlandı');
  };

  const buildCSS = () => {
    const style = document.createElement('style');
    style.classList.add('carousel_style');
    style.innerHTML = `
        /* Font import */
        @import url("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Quicksand:wght@300..700&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
        /* Temel stil sıfırlama */
        * {
          box-sizing: border-box;
          font-family: "Poppins", sans-serif;
        }
        html {
          font-size: 60%;
        }
        body {
          margin: 0;
          line-height: 1.6;
          color: rgb(125, 125, 125);
          text-align: left;
          background-color: #fff;
        }
        #app {
          padding: 20px;
          max-width: 1280px;
          margin: 0 auto;
        }
        .banner_titles {
          display: flex;
          justify-content: space-between;
          background-color: #fef6eb;
          padding: 25px 67px;
          border-top-left-radius: 35px;
          border-top-right-radius: 35px;
          font-weight: 700;
        }
        .title_primary {
          font-size: 3rem;
          font-weight: 700;
          font-family: "Quicksand", sans-serif;
          line-height: 1.11;
          color: #f28e00;
          margin: 0;
        }
        .slider_wrapper {
          position: relative;
          display: flex;
          flex-direction: row;
          gap: 6px;
        }
        .slider_nav_container {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .prev_btn {
          margin-left: -46px;
        }
        .next_btn {
          margin-right: -46px;
        }
        .slider_nav {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          color: #f28e00;
          background-color: #fff7ec;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          z-index: 10;
          font-size: 18px;
          font-weight: bold;
        }
        .slider_nav:hover {
          background-color: #fff;
          color: #f28e00;
          border: 1px solid orange;
        }
        .product_wrapper {
          display: flex;
          overflow-x: hidden;
          scroll-behavior: smooth;
          gap: 20px;
          padding: 20px 0;
          box-shadow: 15px 15px 30px 0 #ebebeb80;
          background-color: #fff;
          border-bottom-left-radius: 35px;
          border-bottom-right-radius: 35px;
        }
        .product {
          position: relative;
          min-width: 160px;
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 16px;
          max-width: 230px;
          background-color: white;
          cursor: pointer;
        }
        .product:hover {
          box-shadow: 0 0 0 0 #00000030, inset 0 0 0 3px #f28e00;
        }
        .product_content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          max-height: 300px;
          overflow: hidden;
        }
        .product_image {
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
        }
        .product_image img {
          max-height: 100%;
          width: 100%;
        }
        .product_title {
          display: -webkit-box;
          font-size: 1.2rem;
          text-align: start;
          line-height: 14.08px;
          margin-bottom: 10px;
          height: 44px;
          font-weight: 500;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .product_price {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          font-size: 2.2rem;
          font-weight: 500;
          text-align: left;
          margin-bottom: 10px;
        }
        .product_discounted {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .product_dicounted_oldprice {
          font-size: 1.4rem;
          font-weight: 500;
          text-decoration: line-through;
        }
        .product_dicounted_newprice {
          display: block;
          width: 100%;
          font-size: 2.2rem;
          font-weight: 600;
          color: #00a365;
        }
        .product_discount_rate {
          color: #00a365;
          font-size: 1.875rem;
          font-weight: 700;
          display: inline-flex;
          justify-content: center;
        }
        .product_discount_rate::after {
          position: relative;
          content: "";
          display: block;
          width: 22px;
          height: 22px;
          margin-top: 3px;
          margin-left: 3px;
          background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="470px" height="470px" transform="matrix(1,0,0,-1,0,0)"><path fill-rule="evenodd" clip-rule="evenodd" d="M223 462q8 5 16 0l46 -30l54 3q9 1 14 -8l25 -49l48 -24q8 -5 8 -14l-3 -54l31 -46q5 -8 0 -16l-30 -46l3 -54q0 -9 -8 -14l-49 -24l-24 -49q-5 -9 -14 -8l-54 3l-46 -30q-4 -2 -8 -2t-8 2l-46 30l-54 -3q-9 -1 -14 8l-24 49l-49 24q-8 5 -8 14l3 54l-30 46q-5 8 0 16 l30 46l-3 54q0 9 8 14l49 24l24 49q5 9 14 8l54 -3zM232 336q-5 0 -9 -4t-4 -9v-151l-69 69q-5 6 -12.5 4t-9.5 -9.5t4 -12.5l91 -91q4 -4 9 -4t9 4l91 91q6 5 4 12.5t-9.5 9.5t-12.5 -4l-69 -69v151q0 5 -4 9t-9 4z" fill="%2300A365"/></svg>');
          background-size: cover;
        }
        .product_price_new {
          font-size: 2.2rem;
          font-weight: 700;
          height: 62.5px;
          display: flex;
          align-items: flex-end;
        }
        .product_promo {
          background: #eaf8f3;
          color: #4bb788;
          border-radius: 15px;
          width: fit-content;
          padding: 5.5px 9px 4.5px;
          font-weight: 600;
          font-size: 1.08rem;
        }
  
        .product_add_to_cart {
          width: 100%;
          padding: 15px 20px;
          border-radius: 37.5px;
          font-size: 13.44px;
          font-weight: 700;
          border: none;
          color: #f28e00;
          background-color: #fff7ec;
          margin-top: 20px;
          transition: background-color 0.3s, color 0.3s;
        }
        .product_add_to_cart:hover {
          background-color: #f28e00;
          color: white;
        }
        .product_favorite {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 52px;
          height: 52px;
          border: none;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          border-radius: 50%;
          background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none"><path d="M30 30.5H37" stroke="%23FF8A00" stroke-width="2" stroke-linecap="round"/><path d="M33.5 27L33.5 34" stroke="%23FF8A00" stroke-width="2" stroke-linecap="round"/><circle cx="26" cy="26" r="25" stroke="%23FF8A00"/><path fill-rule="evenodd" clip-rule="evenodd" d="M36.6339 17.9745C35.4902 16.8303 33.9388 16.1875 32.3211 16.1875C30.7034 16.1875 29.152 16.8303 28.0084 17.9745L26.8332 19.1497L25.658 17.9745C23.2761 15.5926 19.4144 15.5926 17.0325 17.9745C14.6506 20.3564 14.6506 24.2181 17.0325 26.6L18.2077 27.7752L26.8332 36.4007L35.4587 27.7752L36.6339 26.6C37.778 25.4564 38.4208 23.9049 38.4208 22.2872C38.4208 20.6695 37.778 19.1181 36.6339 17.9745Z" stroke="%23FF8A00" stroke-width="2.17391" stroke-linecap="round" stroke-linejoin="round"/><circle cx="33.5" cy="30.5" r="5.5" fill="%23FFF7EC"/><path d="M30 30.5H37" stroke="%23FF8A00" stroke-width="2" stroke-linecap="round"/><path d="M33.5 27L33.5 34" stroke="%23FF8A00" stroke-width="2" stroke-linecap="round"/></svg>');
          background-color: transparent;
        }
        .product_favorite_active {
          background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none"><circle cx="26" cy="26" r="25" stroke="%23FF8A00" stroke-opacity="0.2"/><path fill-rule="evenodd" clip-rule="evenodd" d="M36.6339 17.9745C35.4902 16.8303 33.9388 16.1875 32.3211 16.1875C30.7034 16.1875 29.152 16.8303 28.0084 17.9745L26.8332 19.1497L25.658 17.9745C23.2761 15.5926 19.4144 15.5926 17.0325 17.9745C14.6506 20.3564 14.6506 24.2181 17.0325 26.6L18.2077 27.7752L26.8332 36.4007L35.4587 27.7752L36.6339 26.6C37.778 25.4564 38.4208 23.9049 38.4208 22.2872C38.4208 20.6695 37.778 19.1181 36.6339 17.9745Z" fill="%23FF8A00" stroke="%23FF8A00" stroke-width="2.17391" stroke-linecap="round" stroke-linejoin="round"/><path d="M30.1636 34.8314L31.0475 33.9475L30.1636 34.8314C30.5354 35.2031 31.0422 35.4175 31.5775 35.4175C32.1128 35.4175 32.6196 35.2031 32.9914 34.8314L32.1075 33.9475L32.9914 34.8314L38.6614 29.1614C39.4395 28.3832 39.4395 27.1118 38.6614 26.3336C37.8832 25.5555 36.6118 25.5555 35.8336 26.3336L31.5775 30.5897L30.1614 29.1736C29.3832 28.3955 28.1118 28.3955 27.3336 29.1736C26.5555 29.9518 26.5555 31.2232 27.3336 32.0014L30.1636 34.8314Z" fill="%23FFF7EC" stroke="%23FFF7EC" stroke-width="2.5"/><path d="M30.8707 34.1243C31.0571 34.3106 31.3104 34.4175 31.5775 34.4175C31.8446 34.4175 32.0979 34.3106 32.2843 34.1243L37.9543 28.4543C38.3419 28.0666 38.3419 27.4284 37.9543 27.0407C37.5666 26.6531 36.9284 26.6531 36.5407 27.0407L31.5775 32.0039L29.4543 29.8807C29.0666 29.4931 28.4284 29.4931 28.0407 29.8807C27.6531 30.2684 27.6531 30.9066 28.0407 31.2943L30.8707 34.1243Z" fill="%23FF8A00" stroke="%23FF8A00" stroke-width="0.5"/></svg>');
        }
  
        @media (max-width: 576px) {
          #app {
            max-width: 100vw;
          }
          .banner_titles {
            padding: 0 22px 0 10px;
            background-color: transparent;
            text-align: left;
          }
          .banner_titles > h2 {
            font-size: 2.2rem;
            line-height: 1.5;
          }
          .slider_nav {
            display: none;
          }
          .product_wrapper {
            overflow-x: auto;
            scrollbar-width: none;
          }
          .product {
            width: 50%;
          }
        }
  
        @media (min-width: 576px) {
          #app {
            max-width: 540px;
          }
          .product {
            width: 50%;
          }
        }
  
        @media (min-width: 768px) {
          #app {
            max-width: 720px;
          }
          .product {
            width: 50%;
          }
        }
  
        @media (min-width: 992px) {
          #app {
            max-width: 960px;
          }
          .product {
            width: 284px;
          }
        }
  
        @media screen and (min-width: 1280px) {
          #app {
            max-width: 1180px;
          }
          .product {
            width: 230px;
          }
        }
  
        @media screen and (min-width: 1480px) {
          #app {
            max-width: 1296px;
          }
          .product {
            width: 260px;
          }
        }
  
      `;
    document.head.appendChild(style);
  };

  const setEvents = () => {
    const productWrapper = document.querySelector('.product_wrapper');

    productWrapper.addEventListener('click', (event) => {
      const product = event.target.closest('.product');
      const cartButton = event.target.closest('.product_add_to_cart');
      const favoriButton = event.target.closest('.product_favorite');

      if (product && !cartButton && !favoriButton) {
        const url = product.getAttribute('data-url');
        if (url) {
          window.open(url, '_blank').focus();
        }
      }

      if (cartButton) {
        event.stopPropagation();

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (!cart.includes(product.getAttribute('data-id'))) {
          cart.push(product.getAttribute('data-id'));
          localStorage.setItem('cart', JSON.stringify(cart));
          alert('Ürün sepete eklendi!');
        } else {
          alert('Ürün zaten sepetinizde!');
        }
      }

      if (favoriButton) {
        event.stopPropagation();

        const productId = favoriButton.getAttribute('data-id');
        const favorite = favoriButton.getAttribute('data-favorite');

        favoriButton.setAttribute(
          'data-favorite',
          favorite === 'true' ? 'false' : 'true'
        );
        favoriButton.classList.toggle('product_favorite_active');

        let favoriteProducts =
          JSON.parse(localStorage.getItem('favoriteProducts')) || [];

        if (favoriteProducts.includes(productId)) {
          favoriteProducts = favoriteProducts.filter((id) => id != productId);
          showToast('kaldırıldı');
        } else {
          favoriteProducts.push(productId);
          showToast('eklendi');
        }

        localStorage.setItem(
          'favoriteProducts',
          JSON.stringify(favoriteProducts)
        );
      }
    });

    const prevButton = document.querySelector('#prev');
    const nextButton = document.querySelector('#next');

    const scrollPrev = () => {
      productWrapper.scrollBy({ left: -240, behavior: 'smooth' });
    };
    const scrollNext = () => {
      productWrapper.scrollBy({ left: 240, behavior: 'smooth' });
    };

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' && prevButton) {
        scrollPrev();
      } else if (e.key === 'ArrowRight' && nextButton) {
        scrollNext();
      }
    });

    if (prevButton) {
      prevButton.addEventListener('click', scrollPrev);
    }
    if (nextButton) {
      nextButton.addEventListener('click', scrollNext);
    }
  };

  //if (window.location.pathname != '/') {
  //console.log('wrong page');
  //return;
  //}
  init();
})();
