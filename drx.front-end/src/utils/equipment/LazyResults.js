export default class LazyResults {
  constructor() {
    
    this.initialResult = false;
  }

  hasInitialResult() {
    return this.initialResult;
  }

  setLoadingInitialResult() {
    this.initialResult = true;
  }

  next(page) {
    const num = Number.parseInt(page, 10);
    if (this.initialResult) {
      return Number.isInteger(num) ? num : -1;
    }
    if (num === 0) {
      this.setLoadingInitialResult();
      return 0;
    }
    return -1;
  }
}
