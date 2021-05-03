export default function createStatementData(invoice, plays) {
  const result = {};
  result.customer = invoice.customer;
  result.performances = invoice.performances.map(enrichPerformance);
  result.totalAmount = totalAmount(result);
  result.totalVolumeCredits = totalVolumeCredits(result);

  function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
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
    let result = 0;
    result = Math.max(aPerf.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ("comedy" === aPerf.play.type)
      result += Math.floor(aPerf.audience / 5);
    return result;
  }

  function amountFor(aPerformance) {
    let result = 0;
    switch (playFor(aPerformance).type) {
      case "tragedy":
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(`unknown type: ${playFor(aPerformance)}`);
    }
    return result;

  }
  return result;

}