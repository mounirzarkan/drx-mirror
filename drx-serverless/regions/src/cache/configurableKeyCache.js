'use strict';

//config is made up of an action and other parameters that the action receives on call.
//actionName is the callable action.
class ConfigurableKeyCache {
  constructor(config = {action: () => {}}, actionName = 'get') {
    this._config = config;
    this._actionName = actionName;
    this[this._actionName] = this._perform.bind(this);
  }

  //actionConfig overrides the initialized config
  //action can be dynamically changed, can be useful to address edge cases.
  _perform(actionConfig) {
    const {action, ...otherConfig} = {...this._config, ...actionConfig};
    return action(otherConfig);
  }
}

module.exports = ConfigurableKeyCache;
