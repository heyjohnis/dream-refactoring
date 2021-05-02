const statement = require('./statement');
const fs = require('fs');

test('example statement', () => {
   const invoice = JSON.parse(fs.readFileSync('./invoice.json', 'utf8'));
   const plays = JSON.parse(fs.readFileSync('./plays.json', 'utf8'));
   
   const statement_string = statement(invoice, plays);
   console.log("statement_string : ", statement_string);
   expect(statement_string).toMatchSnapshot();
});