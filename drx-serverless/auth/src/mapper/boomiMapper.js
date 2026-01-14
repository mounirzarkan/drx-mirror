function handlePersonas(personas) {
  const validPersonas = new Map([
    [['Pending'], 'Provisional'],
    [['Candidate'], 'Recipient'],
    [['Carer', 'Candidate'], 'Carer-Recipient'],
    [['Recipient', 'Carer'], 'Carer-Recipient'],
    [['Recipient'], 'Recipient'],
    [['Carer'], 'Carer']
  ]);

  /* Note: The keys below are arrays of strings that represent different SHFC "personas" and the values are the corresponding DRX "userTypes".
  The code uses a for loop to iterate through each key-value pair in the "validPersonas" Map.
  Inside the loop, it checks if all the keys in the current pair are included in the "personas" array using the "every" method.
  If all keys are present in the "personas" array, it assigns the corresponding value to the "persona" variable and exits the loop using the "return" statement. */

  for (const [keys, value] of validPersonas) {
    if (keys.every((key) => personas.includes(key))) {
      return (userType = value);
    }
  }

  return null;
}

module.exports = {
  handlePersonas
};
