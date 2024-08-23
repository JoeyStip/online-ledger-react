import './App.css';
import { useState } from 'react';

function Members(){
  return (
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
  );
};

function Ledger(){

  const [members, setMembers] = useState(["Brad", "Carson", "Sean"]);
  const [costs, setCosts] = useState({
    "recurringCosts": ["water/sewer", "electric", "natural gas"],
    "OtherCosts": ["Netflix"]
  })
  const [values, setValues] = useState({
    "recurringCosts": {
      "totals":{
        "overall": 0,
        "Brad": 0,
        "Carson": 0,
        "Sean": 0
      },
      "water/sewer": {
        "total": 0,
        "Brad": 0,
        "Carson" : 0,
        "Sean" : 0
      },
      "electric": {
        "total": 0,
        "Brad": 0,
        "Carson" : 0,
        "Sean" : 0
      },
      "natural gas": {
        "total": 0,
        "Brad": 0,
        "Carson" : 0,
        "Sean" : 0
      }
    },
    "otherCosts": {
      "total": 0,
      "netflix": {
        "total": 0,
        "Brad": 0,
        "Carson" : 0,
        "Sean" : 0
      }
    },
    "paymentsMade": {
        "Brad": 50,
        "Carson" : 40,
        "Sean" : 80
    },
    "Balances": {
      "BeginBal": {
        "Brad": 34.59,
        "Carson": 68.13,
        "Sean": 35.74
      },
      "LESS: Payments": {
        "Brad": 0,
        "Carson": 0,
        "Sean": 0
      },
      "ADD: Total Costs": {
        "Brad": 0,
        "Carson": 0,
        "Sean": 0
      },
      "Current Balance": {
        "Brad": 0,
        "Carson": 0,
        "Sean": 0
      }
    }
  })
  
  const round=(n)=>{
    return Math.round(n*100)/100
  }
  
  const splitCost =(e)=>{
    const split = e.target.value/3;
    //console.log(e.target.id);
    let valuesCopy = structuredClone(values);
    valuesCopy["recurringCosts"][e.target.id]["total"] = round(e.target.value);
    for(let x = 0; x < members.length; x++){
      valuesCopy["recurringCosts"][e.target.id][members[x]] = round(split);
    };
    
    updateTotals(e, valuesCopy)
  };

  const updateTotals =(e, valuesDeepCopy)=>{
    // per member vertical total for recurring
    let total = 0;
    for(let x = 0; x < members.length; x++){
      for(let i = 0; i < costs["recurringCosts"].length; i++){
        total = total + valuesDeepCopy["recurringCosts"][costs["recurringCosts"][i]][members[x]]
      }
      valuesDeepCopy["recurringCosts"]["totals"][members[x]] = round(total);
      total = 0;
    }
    //overall total
    for(let y = 0; y < costs["recurringCosts"].length; y++){
      total = total + valuesDeepCopy["recurringCosts"][costs["recurringCosts"][y]]["total"]
    }
    if(total>0){
      valuesDeepCopy["recurringCosts"]["totals"]["overall"] = round(total);
    } else {
      valuesDeepCopy["recurringCosts"]["totals"]["overall"] = 0.00;
    }
    updateBalances(e, valuesDeepCopy)
  }

  const updateBalances =(e, valuesDeepCopy)=>{
    for(let x = 0; x < members.length; x++){
      let totalCosts = 0
      for(let y = 0; y < costs["recurringCosts"].length; y++){
        totalCosts = totalCosts + valuesDeepCopy["recurringCosts"][costs["recurringCosts"][y]][members[x]]
      }
      valuesDeepCopy["Balances"]["ADD: Total Costs"][members[x]] = round(totalCosts);
      totalCosts = 0
    }
    setValues(valuesDeepCopy)
  }

  const [ledgerElements, setLedgerElements] = useState([
    <span>water/sewer</span>,
    <input onChange={splitCost} id="water/sewer" type="text" placeholder="0.00"/>,
    <input type="date" />,
    <span className="amount Brad">{values["recurringCosts"]["water/sewer"]["Brad"]}</span>,
    <span className="amount Carson">{values["recurringCosts"]["water/sewer"]["Carson"]}</span>,
    <span className="amount Sean">{values["recurringCosts"]["water/sewer"]["Sean"]}</span>,
    <span>electric</span>,
    <input onChange={splitCost} id="electric" type="text" placeholder="0.00"/>,
    <input type="date" />,
    <span className="amount Brad">{values["recurringCosts"]["electric"]["Brad"]}</span>,
    <span className="amount Carson">{values["recurringCosts"]["electric"]["Carson"]}</span>,
    <span className="amount Sean">{values["recurringCosts"]["electric"]["Sean"]}</span>,
    <span>natural gas</span>,
    <input onChange={splitCost} id="natural gas" type="text" placeholder="0.00"/>,
    <span>8/20/2024</span>,
    <span className="amount Brad">{values["recurringCosts"]["natural gas"]["Brad"]}</span>,
    <span className="amount Carson">{values["recurringCosts"]["electric"]["Carson"]}</span>,
    <span className="amount Sean">{values["recurringCosts"]["natural gas"]["Sean"]}</span>
  ])

  const addCost =()=>{
    setLedgerElements();
  } 

  return (
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
          {ledgerElements}
          <span className="totals">Total</span>
          <span id="overallRecurringTotal" className="amount totals">{values["recurringCosts"]["totals"]["overall"]}</span>
          <span></span>
          <span className="amount totals Brad">{values["recurringCosts"]["totals"]["Brad"]}</span>
          <span className="amount totals Carson">{values["recurringCosts"]["totals"]["Carson"]}</span>
          <span className="amount totals Sean">{values["recurringCosts"]["totals"]["Sean"]}</span>
          <button onClick={addCost}>+</button>
          <div></div>
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
          <span>{values["Balances"]["ADD: Total Costs"]["Brad"]}</span>
          <span>{values["Balances"]["ADD: Total Costs"]["Carson"]}</span>
          <span>{values["Balances"]["ADD: Total Costs"]["Sean"]}</span>
          <span>Current Balance:</span>
          <span></span>
          <span></span>
          <span>$104.59</span>
          <span>$148.13</span>
          <span>$75.74</span>
        </div>
      </div>
    </div>
  );
};

function Analysis(){
  return (
    <div id="analysis">

    </div>
  );
};

function App() {
  return (
    <div className="App">
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
            <Members />
            <Ledger />
            <Analysis />
        </div>
    </div>
  );
}

export default App;
