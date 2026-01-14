export { 
  odataOrderHeadersSchema,
  odataOrderLinesSchema,
  sageOrderHeadersSchema,
  sageOrderLinesSchema,
} from './orders';

export async function validateSchema(schema, data) {
  let odataFlow = true;

  try {
    odataFlow = await schema.validate(data);
    
    if (odataFlow) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}
