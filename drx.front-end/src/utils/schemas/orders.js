import { object, array, string, number, date } from 'yup';

const odataOrderHeadersSchema = array(object({
  HeaderId: number().required().positive().integer(),
  OrderNumber: string().required(),
  OnlineStoreOrderNumber: string().nullable(true),
  OrderStatus: string().required(),
  OrderedDate: date().default(() => new Date()),
  LimitedOrderTaxesTotal: string().required(),
  LimitedOrderChargesTotal: string().required(),
  LimitedOrderLinesTotal: string().required(),
  OrderCurrency: string().required(),
  LimitedOrderTotal: string().required()
}));

const odataOrderLinesSchema = array(object({
  OrderLineNumber: number().required().positive().integer(),
  QuantityOrdered: number().required().positive().integer(),
  OrderedItem: string().required(),
  ItemDescription: string().required(),
  LineStatus: string().required(),
  UnitSellingPrice: string().required(),
  TotalSellingPrice: string().required(),
  OrderNumber: string().required(),
  HeaderId: number().required().positive().integer()
}));

const sageOrderHeadersSchema = array(object({
  id: string().required(),
  externalReferenceNumber: string().required(),
  orderNumber: string().required(),
  orderStatus: string().required(),
  orderDate: string().required(),
  currency: string().required(),
  totalAmount: number().required().positive(),
  endCustomer: object({
    patient: object({
      cochlearId: string().required()
    })
  }),
  requestorCustomer: object({
    patient: object({
      cochlearId: string().required()
    })
  })
}));

const sageOrderLinesSchema = object({
  id: number().required().positive().integer(),
  externalReferenceNumber: string().required(),
  orderNumber: string().required(),
  orderDate: string().required(),
  currency: string().required(),
  totalAmount: number().required().positive(),
  totalShipping: number().required().positive(),
  totalTax: number().required().positive(),
  orderItems: array(object({
    status: string().required(),
    quantity: number().required().positive().integer(),
    itemPrice: number().required().positive(),
    itemAmount: number().required().positive(),
    itemNumber: number().required().positive(),
    product: object({
      partNumber: string().required(),
      description: string().required()
    })
  }))
});

export { 
  odataOrderHeadersSchema,
  odataOrderLinesSchema,
  sageOrderHeadersSchema,
  sageOrderLinesSchema
}