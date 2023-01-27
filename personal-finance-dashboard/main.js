function percentChangeCalc(x, y) {
              return (x != 0 ? (y - x) * 100 / x : 0);
          }

          function percentChangeRow(percentChange) {
              if (percentChange > 0) {
                  return "<td class='positive'>" + percentChange.toFixed(2) + "%</td>";
              }
              else if (percentChange < 0) {
                  return "<td class='negative'>" + percentChange.toFixed(2) + "%</td>";
              }
              else {
                  return "<td>" + percentChange.toFixed(2) + "%</td>";
              }
          }

          function getPortfolio() {
              fetch("/portfolio")
                  .then(response => response.json())
                  .then(data => {
                      // console.log(data);
                      var table = document.getElementById("portfolio");
                      var tableHTML = `<tr>
                          <th>Ticker</th>
                          <th>Number of shares</th>
                          <th>Total cost</th>
                          <th>Current value</th>
                          <th>Percent change</th>
                      </tr>`;

                      var portfolioCost = 0;
                      var portfolioCurrent = 0;

                      for (var ticker in data) {
                          var totalShares = data[ticker]['total_shares'];
                          var totalCost = data[ticker]['total_cost'];
                          var currentValue = data[ticker]['current_value'];
                          var percentChange = percentChangeCalc(totalCost, currentValue);

                          row = "<tr>";
                          row += "<td>$" + ticker + "</td>";
                          row += "<td>" + totalShares + "</td>";
                          row += "<td>$" + totalCost.toFixed(2)  + "</td>";
                          row += "<td>$" + currentValue.toFixed(2) + "</td>";
                          row += percentChangeRow(percentChange);
                          row += "</tr>";
                          tableHTML += row;

                          portfolioCost += totalCost;
                          portfolioCurrent += currentValue;
                      }

                      portfolioPercentChange = percentChangeCalc(portfolioCost, portfolioCurrent);

                      tableHTML += "<tr>";
                      tableHTML += "<th>Total</th>";
                      tableHTML += "<th>&nbsp;</th>";
                      tableHTML += "<th>$" + portfolioCost.toFixed(2) + "</th>";
                      tableHTML += "<th>$" + portfolioCurrent.toFixed(2) + "</th>";
                      tableHTML += percentChangeRow(portfolioPercentChange);
                      tableHTML += "</tr>"

                      table.innerHTML = tableHTML;
                  });

          }

          getPortfolio();

          // refresh portfolio every 60 seconds
          setInterval(function() {
              getPortfolio()
          }, 60000)
