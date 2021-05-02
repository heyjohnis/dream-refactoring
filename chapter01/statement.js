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
}

function htmlStatement(invoice, plays) {
  return renderHtml(createStatementData(invoice, plays));
}

function renderHtml(data) {
  let result = `<h1>청구 내역 (고객명: ${data.customer})</h1>\n`;
  result += `<table>\n `;
  result += `  <tr><th>연극</th><th>좌석 수</th><th>금액</th>\n`;
  for (let perf of data.performances) {
    result += `  <tr><td>${perf.play.name}</td><td>${usd(perf.amount/100)}</td><td>${perf.audience}좌수</td>`;
    result += `<td>${usd(data.totalAmount/100)}</td></tr>\n`;
  }
  result += `</table>`;
  return result;
}

function usd(aNumber) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(aNumber);
}

module.exports = statement;