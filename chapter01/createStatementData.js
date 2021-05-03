export default function createStatementData(invoice, plays) {
  const result = {};
  result.customer = invoice.customer;
  result.performances = invoice.performances.map(enrichPerformance);
  result.totalAmount = totalAmount(result);
  result.totalVolumeCredits = totalVolumeCredits(result);

  function enrichPerformance(aPerformance) {
    const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));
    const result = Object.assign({}, aPerformance);
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
    return result;
  }

  function createPerformanceCalculator(aPerformance, aPlay) {
    return new PerformanceCalculator(aPerformance, aPlay);
  }
  
  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  function totalVolumeCredits(data) {
    let result = 0;
    for (let perf of data.performances) {
      // add volume credits
      result += volumeCreditsFor(perf);
    }
    return result;
  }

  function totalAmount(data) {
    let account = 0;
    for (let perf of data.performances) {
      account += perf.amount;
    }
    return data.performances
      .reduce((total, p) => total + p.amount,0);
  }

  function volumeCreditsFor(aPerf) {
    return new PerformanceCalculator(aPerf, playFor(aPerf)).volumeCredits;
  }

  return result;
}

class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance;
    this.play = aPlay
  }

  get amount() {
    let result = 0;
    switch (this.play.type) {
      case "tragedy":
        result = 40000;
        if (this.performance.audience > 30) {
          result += 1000 * (this.performance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (this.performance.audience > 20) {
          result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        break;
      default:
        throw new Error(`unknown type: ${this.play.type}`);
    }
    return result;

  }

  get volumeCredits() {
    let result = 0;
    result = Math.max(this.performance.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ("comedy" === this.play.type)
      result += Math.floor(this.performance.audience / 5);
    return result;
  }


}