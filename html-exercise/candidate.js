import * as data from './candidate.json';
let products;
let categories;
let locations;
let categorySelected = '';
let locationSelected = '';
const productsList = document.querySelector('.productsList');
const locationSelect = document.querySelector('.location');
const categorySelect = document.querySelector('.category');

const getData = () => {
  products = data?.products;
  // console.table(products);

  categories = products
  .map( product => product.category)
  .filter((product, index, self) => index === self.findIndex(item => item.id === product.id));

  locations = products
  .flatMap( location => location.stores)
  .filter((location, index, self) => index === self.findIndex(item => item.id === location.id));

  productsList.dispatchEvent(new CustomEvent('updateProductList'));
};

const fillSelectOptions = (selectElement, optionsData) => {
  optionsData.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option.id;
    optionElement.text = option.name;
    selectElement.add(optionElement);
  });
};

const isFilterEmpty = optionSelected => optionSelected === '' ;

const filterProductsByCategory = (products, categorySelected) => {
  if (isFilterEmpty(categorySelected)) {
    return products; 
  } else {
    const filteredProducts = products.filter(product => String(product.category.id) === categorySelected);
    return filteredProducts;
  }
};

const getProductStores = stores => stores.flatMap(store => ` ${store.name}`);

const isProductAvailableByStore = (stores) => {
  let isAvailableByIdStore = false;
  if (stores.find(store => String(store.id) === locationSelected)) isAvailableByIdStore = true;
  return isAvailableByIdStore;
};

const formatClassName = (cadena) => (cadena[0].toLowerCase() + cadena.replace(' ', '').slice(1));

const renderProductsList = () => {
  const productsListHTML = categories.map(category => {
    if ((String(category.id) === categorySelected) || isFilterEmpty(categorySelected)) {
      const productsList = filterProductsByCategory(products, String(category.id));
      const productsSection = productsList.map(product => {
        if (isProductAvailableByStore(product.stores) || isFilterEmpty(locationSelected)) {
          return `<li class="product">
              <a class="jobLink" href="http://www.serenaandlily.com/products/${product.id}">
                  <p class="title">${product.title}</p>
                  <p class="stores">${getProductStores(product.stores)}</p>
              </a>
          </li>`
        }
      }).join('');
      if (productsSection) {
        return `
          <h2 class="categoryHeader ${formatClassName(category.name)}">${category.name}</h2>
          <ul class="categoryList ${formatClassName(category.name)}">
            ${productsSection}
          </ul>
          `;
      }
    }
  }).join('');
  productsList.innerHTML = productsListHTML;
}

const updateLocationSelected = (newValue) => {
  if (newValue != locationSelected) {
    locationSelected = newValue;
    productsList.dispatchEvent(new CustomEvent('updateProductList'));
  }
}

const updateCategorySelected = (newValue) => {
  if (newValue != categorySelected) {
    categorySelected = newValue;
    productsList.dispatchEvent(new CustomEvent('updateProductList'));
  }
}

productsList.addEventListener('updateProductList', renderProductsList);
locationSelect.addEventListener('click', event => updateLocationSelected(event.target.value));
categorySelect.addEventListener('click', event => updateCategorySelected(event.target.value));

getData();
fillSelectOptions(locationSelect, locations);
fillSelectOptions(categorySelect, categories);

// ASSUMPTIONS:
// Each product belongs only to one category
