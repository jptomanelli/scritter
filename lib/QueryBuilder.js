class QueryBuilder {

  constructor(options) {
    this.options = options;
  }

  buildQuery(options) {
    const q = [];
    let l;

    if (options[this.options.l]) {
      l = `${options[this.options.l]}`;
    }

    this.options.q.forEach((key) => {
      if (options[key]) {
        q.push(encodeURIComponent(`${key}:${options[key]}`));
      }
    });

    return `l=${l}&src=${this.options['src']}&q=${q.join('%20')}`;
  }
}

module.exports = QueryBuilder;