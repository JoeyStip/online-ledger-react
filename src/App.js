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
    "recurringCosts": [
      {
        "name":"water/sewer", 
        "total": 0,
        "Brad": 0,
        "Carson" : 0,
        "Sean" : 0
      },
      {
        "name": "electric",
        "total": 0,
        "Brad": 0,
        "Carson" : 0,
        "Sean" : 0
      },
      {
        "name": "natural gas",
        "total": 0,
        "Brad": 0,
        "Carson" : 0,
        "Sean" : 0
      },
      {
        "name": "totals",
        "total": 0,
        "Brad": 0,
        "Carson": 0,
        "Sean": 0
      }
    ],
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
    let valuesDeepCopy = structuredClone(values);
    const index = valuesDeepCopy["recurringCosts"].findIndex((x)=> x.name===e.target.id)
    console.log(e.target.id, "index: ", index);
    valuesDeepCopy["recurringCosts"][index]["total"] = round(e.target.value);
    for(let x = 0; x < members.length; x++){
      valuesDeepCopy["recurringCosts"][index][members[x]] = round(split);
    };
    updateTotals(e, valuesDeepCopy)
  };

  const updateTotals =(e, valuesDeepCopy)=>{
    const totalsIndex = costs["recurringCosts"].length;
    // per member vertical total for recurring
    let total = 0;
    for(let x = 0; x < members.length; x++){
      for(let i = 0; i < costs["recurringCosts"].length; i++){
        total = total + valuesDeepCopy["recurringCosts"][i][members[x]]
      }
      valuesDeepCopy["recurringCosts"][totalsIndex][members[x]] = round(total);
      total = 0;
    }
    //overall total
    for(let y = 0; y < costs["recurringCosts"].length-1; y++){
      total = total + valuesDeepCopy["recurringCosts"][y]["total"]
    }
    if(total>0){
      valuesDeepCopy["recurringCosts"][totalsIndex]["total"] = round(total);
    } else {
      valuesDeepCopy["recurringCosts"][totalsIndex]["total"] = 0.00;
    }
    updateBalances(e, valuesDeepCopy)
  }

  const updateBalances =(e, valuesDeepCopy)=>{
    for(let x = 0; x < members.length; x++){
      let totalCosts = 0
      for(let y = 0; y < costs["recurringCosts"].length-1; y++){
        totalCosts = totalCosts + valuesDeepCopy["recurringCosts"][y][members[x]]
      }
      valuesDeepCopy["Balances"]["ADD: Total Costs"][members[x]] = round(totalCosts);
      totalCosts = 0
    }
    setValues(valuesDeepCopy)
  }

  const addCost =()=>{
    let newCostName = "new cost";
    let costDeepCopy = structuredClone(costs);
    costDeepCopy["recurringCosts"].push(newCostName);
    setCosts(costDeepCopy);
    let newValueObj = {
      "name": newCostName,
      "total": 0
    };
    for(let x = 0; x < members.length; x++){
      newValueObj[members[x]] = 0;
    };
    let valuesDeepCopy = structuredClone(values);
    let spliceIndex = valuesDeepCopy["recurringCosts"].length-1;
    valuesDeepCopy["recurringCosts"].splice(spliceIndex, 0, newValueObj);
    setValues(valuesDeepCopy);
    console.log(values);
  }

  const removeCost =()=>{
    let costDeepCopy = structuredClone(costs);
    let spliceIndex = costs["recurringCosts"].length-1;
    costDeepCopy["recurringCosts"].splice(spliceIndex, 1);
    let valuesDeepCopy = structuredClone(values);
    spliceIndex = values["recurringCosts"].length-2;
    valuesDeepCopy["recurringCosts"].splice(spliceIndex, 1);
    setValues(valuesDeepCopy);
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
          {values["recurringCosts"].map((cost, index)=>{
            return (
              <div key={index} className="costRow">
                <span>{cost.name}</span>
                {cost.name!=="totals" ? <input onChange={splitCost} id={cost.name} className="amtInput" type="text" placeholder="0.00"/> : <span></span>}
                <input type="date" />
                {members.map((member, index)=>{
                  return (
                    <span key={index}>{cost[member]}</span>
                  )
                })}
              </div>
            )
          })}
          <button onClick={addCost}>+</button>
          <button onClick={removeCost}>-</button>
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
