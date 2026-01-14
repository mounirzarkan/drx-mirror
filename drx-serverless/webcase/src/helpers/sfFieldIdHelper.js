function sfFieldIdHelper(env) {
  const fieldData = {
    Development: {
      orgid: {
        value: '00D1j0000008arI'
      },
      region: {
        field: '00N2400000IdRfl'
      },
      origin: {
        field: '00N2400000IGOyY'
      },
      descriptionJson: {
        field: '00N1j00000242xK'
      },
      country: {
        field: '00N2400000JGUKT'
      },
      debug: {
        field: true
      }
    },
    Staging: {
      orgid: {
        value: '00D1q0000008amy'
      },
      region: {
        field: '00N2400000IdRfl'
      },
      origin: {
        field: '00N2400000IGOyY'
      },
      descriptionJson: {
        field: '00N1q000000xHKp'
      },
      country: {
        field: '00N2400000JGUKT'
      },
      debug: {
        field: true
      }
    },
    sit: {
      orgid: {
        value: '00D7a0000005Pn0'
      },
      region: {
        field: '00N2400000IdRfl'
      },
      origin: {
        field: '00N2400000IGOyY'
      },
      descriptionJson: {
        field: '00N1q000000xHKp'
      },
      country: {
        field: '00N2400000JGUKT'
      },
      debug: {
        field: true
      }
    },
    uat: {
      orgid: {
        value: '00D7a0000005Pn0'
      },
      region: {
        field: '00N2400000IdRfl'
      },
      origin: {
        field: '00N2400000IGOyY'
      },
      descriptionJson: {
        field: '00N1q000000xHKp'
      },
      country: {
        field: '00N2400000JGUKT'
      },
      debug: {
        field: true
      }
    },
    production: {
      orgid: {
        value: '00DE0000000dnBO'
      },
      region: {
        field: '00N2400000IdRfl'
      },
      origin: {
        field: '00N2400000IGOyY'
      },
      descriptionJson: {
        field: '00N1p00000K4LbT'
      },
      country: {
        field: '00N2400000JGUKT'
      },
      debug: {
        field: false
      }
    },
    prd: {
      orgid: {
        value: '00DE0000000dnBO'
      },
      region: {
        field: '00N2400000IdRfl'
      },
      origin: {
        field: '00N2400000IGOyY'
      },
      descriptionJson: {
        field: '00N1p00000K4LbT'
      },
      country: {
        field: '00N2400000JGUKT'
      },
      debug: {
        field: false
      }
    }
  };
  return fieldData[env];
}

module.exports = {
  sfFieldIdHelper
};
