export default class CommonTable {
  get first() {
    return this.all[0] || null;
  }

  get last() {
    return this.all[this.all.length - 1] || null;
  }
}
