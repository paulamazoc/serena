const salesOrders = [{
  'id': 'S1',
  'created': '2020-01-02',
  'quantity': 6
}, {
  'id': 'S2', 
  'created': '2020-11-05',
  'quantity': 2 
}, {
  'id': 'S3', 
  'created': '2019-12-04',
  'quantity': 3 
}, {
  'id': 'S4', 
  'created': '2020-01-20',
  'quantity': 2 
}, {
  'id': 'S5', 
  'created': '2019-12-15',
  'quantity': 9 
}];

const purchaseOrders = [{
  'id': 'P1', 
  'receiving': '2020-01-04',
  'quantity': 4
}, {
  'id': 'P2',
  'receiving': '2020-01-05',
  'quantity': 3 
}, {
  'id': 'P3', 
  'receiving': '2020-02-01',
  'quantity': 5 
}, {
  'id': 'P4', 
  'receiving': '2020-03-05',
  'quantity': 1 
}, {
  'id': 'P5', 
  'receiving': '2020-02-20',
  'quantity': 7
}];

const orderListByKeyValue = (list, key) =>
  list.sort((firstItem, secondItem) => new Date(firstItem[key]) - new Date (secondItem[key]));

const calculateDeliveryDate = (purchases, quantityNeeded) => {
  let quantityAccumulator = 0;
  for (let index = 0; index < purchases.length; index++) {
    const quantityAvailable = purchases[index].quantity;
    const dateToBeDelivered = purchases[index].receiving;

    if (quantityAccumulator < quantityNeeded) quantityAccumulator += quantityAvailable;

    if (quantityAccumulator === quantityNeeded) {
      purchases.splice(0, index + 1);
      return dateToBeDelivered;
    }

    if (quantityAccumulator > quantityNeeded) {
      purchases[index].quantity = quantityAccumulator - quantityNeeded;
      purchases.splice(0, index)
      return dateToBeDelivered;
    }
  }
};


function allocate(salesOrders, purchaseOrders) {
  let sales = orderListByKeyValue(salesOrders, 'created');
  let purchasesAvailability = orderListByKeyValue(purchaseOrders, 'receiving');
  let ordersToBeDelivered = [];

  for (let index = 0; index < sales.length; index++) {
    const quantityNeeded = sales[index].quantity;
    ordersToBeDelivered.push({ 
      id: sales[index].id,
      dateToBeDelivered: calculateDeliveryDate(purchasesAvailability, quantityNeeded) || 'No inventory available yet'}
    );
  }

  return ordersToBeDelivered;

}

const allocation = allocate(salesOrders, purchaseOrders);
console.log(allocation);



// ASSUMPTIONS
// Delivery time is 0 days.
// The product is ready to be delivered the date it arrives.
