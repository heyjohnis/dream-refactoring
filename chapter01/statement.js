function statement(invoice, plays) {
  
  return renderPlainText(createStatementData(invoice, plays));
  
  function createStatementData(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    return statementData;
  }
  
  function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    return result;
  }
  
  function playFor(aPerformance){
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

}


function renderPlainText(data) {
  let result = `청구 내역 (고객명: ${data.customer})\n`;
  for (let perf of data.performances) {
    // print line for this order
    result += ` ${perf.play.name}: ${usd(perf.amount/100)} (${perf.audience} seats)\n`;
  }
    
  result += `총액: ${usd(data.totalAmount/100)}\n`; 
  // 변수 인라인하기 : 변수제거하기 let volumeCredits = 0;
  result += `적립 포인트: ${data.totalVolumeCredits} credits\n`;
  return result;

  function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
    }).format(aNumber);
  }
  
}




module.exports = statement;