import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {
  return (
    <div classNameName="App">
      {/* <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="index.css">
        <title>Online Ledger</title>
      </head> */}
      <header>
            Online Ledger
      </header>
        <div id="container">
            <div id="members">
              <span id="header">Members</span>
              <span className="member">Brad</span>
              <button className="removeButton">-</button>
              <span className="member">Carson</span>
              <button className="removeButton">-</button>
              <span className="member">Sean</span>
              <button className="removeButton">-</button>
              <button id="add">+</button>
            </div>
            <div id="ledger">
              <div id="ledgerHeader" className="ledgerSection">
                <span id="MonthYear">August 2024</span>
                <span>Amount</span>
                <span>Date</span>
                <span>Brad</span>
                <span>Carson</span>
                <span>Sean</span>
              </div>
              <div id="recurringCosts" className="ledgerSection">
                <span className="sectionHeader">Recurring Costs</span>
                <div className="sectionTable">
                  <span>water/sewer</span>
                  <span>$60.00</span>
                  <span>8/20/2024</span>
                  <span className="amount line1 Brad">$20.00</span>
                  <span className="amount line1 Carson">$20.00</span>
                  <span className="amount line1 Sean">$20.00</span>
                  <span>electric</span>
                  <span>$90.00</span>
                  <span>8/20/2024</span>
                  <span className="amount line2 Brad">$30.00</span>
                  <span className="amount line2 Carson">$30.00</span>
                  <span className="amount line2 Sean">$30.00</span>
                  <span>natural gas</span>
                  <span>$30.00</span>
                  <span>8/20/2024</span>
                  <span className="amount line3 Brad">$10.00</span>
                  <span className="amount line3 Carson">$10.00</span>
                  <span className="amount line3 Sean">$10.00</span>
                  <span className="totals">Total</span>
                  <span className="amount totals">$180.00</span>
                  <span></span>
                  <span className="amount totals Brad">$60.00</span>
                  <span className="amount totals Carson">$60.00</span>
                  <span className="amount totals Sean">$60.00</span>
                  <button>+</button>
                </div>
              </div>
              <div id="otherCosts" className="ledgerSection">
                <span className="sectionHeader">Other Costs</span>
                <div className="sectionTable">
                  <span>netflix</span>
                  <span>$30.00</span>
                  <span>8/20/2024</span>
                  <span id="other1" className="amount">$10.00</span>
                  <span id="other1" className="amount">$10.00</span>
                  <span id="other1" className="amount">$10.00</span>
                  <span className="totals">Total</span>
                  <span>$30.00</span>
                  <span></span>
                  <span id="otherTotal" className="amount totals">$10.00</span>
                  <span id="otherTotal" className="amount totals">$10.00</span>
                  <span id="otherTotal" className="amount totals">$10.00</span>
                  <button>+</button>
                </div>
              </div>
              <div id="payments" className="ledgerSection">
                <span className="sectionHeader">Payments Made</span>
                <div className="sectionTable">
                  <span>Brad</span>
                  <span>$50.00</span>
                  <span>8/18/2024</span>
                  <span>$50.00</span>
                  <span>-</span>
                  <span>-</span>
                  <span>Carson</span>
                  <span>$40.00</span>
                  <span>8/19/2024</span>
                  <span>-</span>
                  <span>$40.00</span>
                  <span>-</span>
                  <span>Sean</span>
                  <span>$80.00</span>
                  <span>8/20/2024</span>
                  <span>-</span>
                  <span>-</span>
                  <span>$80.00</span>
                  <button>+</button>
                </div>
              </div>
              <div id="balances" className="ledgerSection">
                <span className="sectionHeader">Balances</span>
                <div className="sectionTable">
                  <span>Beg Bal</span>
                  <span></span>
                  <span></span>
                  <span>$34.59</span>
                  <span>$68.13</span>
                  <span>$35.74</span>
                  <span>LESS: Payments</span>
                  <span></span>
                  <span></span>
                  <span>$50.00</span>
                  <span>$40.00</span>
                  <span>$80.00</span>
                  <span>ADD: Total Costs</span>
                  <span></span>
                  <span></span>
                  <span>$120.00</span>
                  <span>$120.00</span>
                  <span>$120.00</span>
                  <span>Current Balance:</span>
                  <span></span>
                  <span></span>
                  <span>$104.59</span>
                  <span>$148.13</span>
                  <span>$75.74</span>
                </div>
              </div>
            </div>
            <div id="analysis">

            </div>
        </div>
    </div>
  );
}

export default App;
