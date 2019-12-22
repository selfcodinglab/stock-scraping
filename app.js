const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());


app.get('/', (req, res, next) => {
  axios.get('https://old.nasdaq.com/screening/companies-by-name.aspx?letter=0&exchange=nasdaq&render=download')
    .then(response => {
      let stockList = response.data.split('\r\n').map(stock => {
        return stock.replace(/",/g, "").replace(/\"/g, "|").split("|").splice(1);
        
      });
      stockList.pop();
      stockList.shift();
      let stocks = stockList.map(stock => {
        return {
          symbol: stock[0],
          name: stock[1],
          lastSale: stock[2],
          marketCap: stock[3],
          ipoYear: stock[4],
          sector: stock[5],
          industry: stock[6],
          summaryQuote: stock[7]
        }
      })
      
      return res.send(stocks)
    })
});

const port = process.env.PORT || 5000;
app.listen(port, err => {
  if (err) return console.log(err);
  console.log('server running on port ' + port);
})