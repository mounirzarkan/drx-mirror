'use strict';

const {log} = require('../util/index.js');
const axios = require('axios');

class ODataConnector {
  constructor({odEndpoint, odUsername, odPassword, oDataOrderTypes = ''}) {
    this.oDataOrderTypes = oDataOrderTypes;

    const authorization =
      'Basic ' + Buffer.from(odUsername + ':' + odPassword).toString('base64');

    this.baseURL = odEndpoint;

    this.connection = axios.create({
      baseURL: this.baseURL,
      headers: {authorization}
    });
  }

  async getOrdersList(soldToPartyId, days) {
    const url = `/OrderHeaders?$select=OrderType,BillToPartyName,OrderNumber,ShipToPartyName,LastUpdateDate,OrderStatus,OrderedDate,HeaderId,ShippingMethodCode,DateCreated,ShipmentPriority,BillToAccountName,ShipToAccountName,SoldToAccountName,OrderCurrency,ShippingInstructions,SoldToPartyName,ShippingMethod,ShipmentPriorityCode,LimitedOrderTaxesTotal,LimitedOrderChargesTotal,LimitedOrderLinesTotal,OnlineStoreOrderNumber& $count=true & $format=application/json;odata.metadata=minimal & $filter=SoldToPartyId eq '${soldToPartyId}' and ${this.oDataOrderTypes} & days=${days} & $orderby=DateCreated desc`;
    try {
      const resp = await this.connection.get(url);
      log.debug('ODataConnector, getOrdersList resp:');
      log.debug(resp.data);

      return resp.data.value;
    } catch (e) {
      log.error('ODataConnector, getOrdersList error:');
      log.error(e);
      throw new Error(e);
    }
  }

  async getOrderDetails(headerId) {
    const url = `/OrderLines?$select=OrderNumber,QuantityCancelled,ShipToPartyName,LastUpdateDate,HeaderId,Model,DeliveryTrackingNumber,ItemDescription,BillToAccountName,DeviceType,UnitSellingPrice,ShipToAccountName,SoldToAccountName,TopModelLineId,SoldToPartyName,ActualShipmentDate,HeaderCreationDate,HoldStatus,QuantityShipped,LineNumber,FlowStatusCode,ProductFamily,ItemType,BillToPartyName,QuantityOrdered,LineStatus,ShipmentMethod,LineTypeId,DateCreated,OrderedItem,HeaderLastUpdateDate,DeliverCarrier,TotalSellingPrice,ItemTypeCode,LineId,MsiItemType,DeliveryWayBillNumber,ShipmentPriorityCode,LinkToLineId,OrderLineNumber,TaxValue,TaxAmount,Hcpc,SoldToPartyId&$count=true&$format=application/json;odata.metadata=minimal&$filter=HeaderId eq ${headerId} &showAllTypes=true`;

    try {
      const resp = await this.connection.get(url);
      log.debug('ODataConnector, getOrderDetails resp:');
      log.debug(resp.data);

      return resp.data.value;
    } catch (e) {
      log.error('ODataConnector, getOrderDetails error:');
      console.error(e);
      console.error(e.response.data);
      throw new Error(e);
    }
  }

  async getOrderStatus(headerId) {
    log.debug('ODataConnector, getOrderStatus headerId:');
    log.debug(headerId);

    const url = `/OrderStatus?$select=OrderId,RecipientId,OrderStatus,OrderType,OrderCreationDate,GathDocStartDate,InsAuthStartDate,PrepShipStartDate,ShippedDate,TrackingNumber,ShippingUrl,LastUpdateDate&$count=true&$format=application/json;odata.metadata=minimal&$filter=OrderId eq ${headerId}`;

    try {
      const resp = await this.connection.get(url);
      log.debug('ODataConnector, getOrderStatus resp:');
      log.debug(resp.data);

      return resp.data.value[0];
    } catch (e) {
      log.error('ODataConnector, getOrderStatus error:');
      console.error(e);
      console.error(e.response.data);
      throw new Error(e);
    }
  }
}

module.exports = ODataConnector;
