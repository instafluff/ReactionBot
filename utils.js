/* eslint-disable no-param-reassign */
module.exports = {
  hslToDec: (h, s, l) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  },
  lookForEmpty(v) {
    if (typeof v !== 'object') return v;
    return Object.fromEntries(
      Object.entries(v)
        .filter(([, v1]) => (typeof v1 !== 'object' || (v1 != null && Object.keys(v1).length !== 0)))
        .map(([i1, v1]) => [i1, this.lookForEmpty(v1)]),
    );
  },
  lookFullyForEmpty(v) {
    const depth = this.getDepth(v);
    let last = {};
    for (let i = 0; i < depth; i += 1) {
      last = JSON.parse(JSON.stringify(v));
      const result = this.lookForEmpty(v);
      if (JSON.stringify(last) === JSON.stringify(result)) {
        v = last;
        break;
      }
      v = result;
    }
    return v;
  },
  getDepth(object) {
    return Object.keys(object).reduce((a, v) => {
      let depth = 0;
      if (typeof object[v] === 'object') {
        depth = this.getDepth(object[v]) + 1;
      }
      return Math.max(depth, a);
    }, 1);
  },
  debug: {
    logThenReturn(arg, ...args) {
      console.log(arg, ...args);
      return arg;
    },
  },
};
