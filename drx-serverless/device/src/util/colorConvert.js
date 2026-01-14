'use strict';

const {isNil} = require('lodash');

const N5 = {
  Black: 'Black',
  Sand: 'Sand',
  Brown: 'Brown',
  Charcoal: 'Charcoal',
  White: 'White'
};

const N6 = {
  Carbon: 'Carbon',
  Maize: 'Maize',
  Mocha: 'Mocha',
  Smoke: 'Smoke',
  White: 'White'
};

const N7 = {
  'Black, gold detail': 'Black, gold',
  'Black, golden detail': 'Black, gold',
  'Black, platinum detail': 'Black',
  Brown: 'Brown',
  Grey: 'Grey',
  Sand: 'Sand',
  White: 'White'
};

const N8 = {
  Black: 'Black',
  Brown: 'Brown',
  Grey: 'Grey',
  Sand: 'Sand',
  White: 'White',
  Silver: 'Silver'
};

const Kanso = {
  Black: 'Black',
  'Chocolate brown': 'Chocolate brown',
  'Copper brown': 'Copper brown',
  'Golden blonde': 'Golden blonde',
  'Sandy blonde': 'Sandy blonde',
  Silver: 'Silver',
  'Slate grey': 'Slate grey',
  White: 'White'
};

const Baha4 = {
  'Champagne Blonde': 'Champagne Blonde',
  'Soft Black': 'Soft Black',
  'Slate Grey': 'Slate Grey',
  'Chestnut Brown': 'Chestnut Brown',
  'Ocean Blue': 'Ocean Blue',
  Brown: 'Brown'
};

const Baha5 = {
  Black: 'Black',
  Blonde: 'Blonde',
  Silver: 'Silver',
  Brown: 'Brown',
  Copper: 'Copper'
};

const Baha5Power = {
  Black: 'Black',
  Blonde: 'Blonde',
  Silver: 'Silver',
  Brown: 'Brown',
  Copper: 'Copper'
};

const Baha5SuperPower = {
  Carbon: 'Carbon',
  Smoke: 'Smoke',
  Mocha: 'Mocha',
  Maize: 'Maize'
};

const Freedom = {
  Beige: 'Beige',
  Black: 'Black',
  Silver: 'Silver',
  Brown: 'Brown',
  'Pearl blue': 'Pearl blue',
  'Pearl pink': 'Pearl pink'
};

const map = new Map();
map.set('CP800', N5);
map.set('CP900', N6);
map.set('CP1000', N7);
map.set('CP1110', N8);
map.set('CP950', Kanso);
map.set('BAHA 4', Baha4);
map.set('BAHA 5', Baha5);
map.set('BAHA 5 POWER', Baha5Power);
map.set('SUPERPOWER', Baha5SuperPower);
map.set('SP12', Freedom);

function colorConvert(args) {
  const cm = map.get(args[0]);
  let color = 'N/A';

  if (!isNil(cm)) {
    Object.keys(cm).some((k) => {
      if (args[1].toUpperCase().includes(k.toUpperCase())) {
        color = cm[k];
        return true;
      } else {
        return false;
      }
    });
  }
  return color;
}

module.exports = {
  colorConvert
};
