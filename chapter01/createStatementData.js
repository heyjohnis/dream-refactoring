export default function createStatementData(invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);

  function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance);
    result.play = playFor(result);
    result.amount = amountFor(result);
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
    return account;
  }

  function volumeCreditsFor(aPerf) {
    let volume = 0;
    volume = Math.max(aPerf.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ("comedy" === aPerf.play.type)
      volume += Math.floor(aPerf.audience / 5);
    return volume;
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
  return statementData;

}