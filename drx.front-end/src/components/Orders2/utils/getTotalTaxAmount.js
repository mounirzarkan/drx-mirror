export default function getTotalTaxAmount(objectsArray) {
  const totalTaxAmount = objectsArray.reduce(
    (accumulator, currentObject) => {
      const taxAmountFloat = Number(currentObject?.taxAmount);
      if (!isNaN(taxAmountFloat)) {
        accumulator += taxAmountFloat;
      }

      return accumulator;
    },
    0,
  );

  return totalTaxAmount.toString();
}
