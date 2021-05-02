const statement = require('./statement');
const fs=require('fs');

test('example statement', () => {
   const invoice = JSON.parse(fs.readFileSync('./invoice.json', 'utf8'));
   const plays = JSON.parse(fs.readFileSync('./plays.json', 'utf8'));
   console.log(plays);
   const statement_string = statement(invoice, plays);
   expect(statement_string).toMatchSnapshot();
});