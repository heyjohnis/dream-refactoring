/* Test 를 위해 임시로 추가 */
let plays;  
let invoice;

function statement(_invoice, _plays) {
  plays = _plays;
  invoice = _invoice;
  
  let result = `Statement for ${invoice.customer}\n`;
  for (let perf of invoice.performances) {
    // print line for this order
    result += ` ${playFor(perf).name}: ${usd(amountFor(perf)/100)} (${perf.audience} seats)\n`;
  }
    
  result += `Amount owed is ${usd(totalAmount()/100)}\n`;
  // 변수 인라인하기 : 변수제거하기 let volumeCredits = 0;
  result += `You earned ${totalVolumeCredits()} credits\n`;
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

function playFor(aPerformance){
  return plays[aPerformance.playID];
}

function usd(aNumber) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(aNumber);
}

function volumeCreditsFor(aPerf) {
  let volume = 0;
  volume = Math.max(aPerf.audience - 30, 0);
  // add extra credit for every ten comedy attendees
  if ("comedy" === playFor(aPerf).type) 
    volume += Math.floor(aPerf.audience / 5);
  return volume;
}

function totalVolumeCredits() {
  let result = 0;
  for (let perf of invoice.performances) {
    // add volume credits
    result += volumeCreditsFor(perf);
  }
  return result;
}

function totalAmount() {
  let account = 0;
  for (let perf of invoice.performances) {
    account += amountFor(perf);
  }
  return account;
}

module.exports = statement;