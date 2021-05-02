import createStatementData from './createStatementData';

function statement(invoice, plays) {
  return renderPlainText(createStatementData(invoice, plays));
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
