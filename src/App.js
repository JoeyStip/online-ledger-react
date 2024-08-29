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

function AddDialogue({visibilityState, setVisibilityState ,addCost, dialogueType, costs}){

  const handleSubmit=(e)=>{
    e.preventDefault();
    setVisibilityState("hidden");
    const costName = e.target[0].value;
    const costDate = e.target[1].value;
    let regex = new RegExp(`${costName}`, "i")
    if(costs[dialogueType].findIndex((i)=>regex.test(i))>-1){
      alert("Cost Name already exists. Please choose a new one")
      return
    }

    addCost(costName, costDate)
  }

  return (
    <div id="addCostDialogue" style={{visibility: visibilityState}}>
      <h1>
        {dialogueType==="recurring" ? "Add Recurring Cost" : "Add Other Cost"}
      </h1>
      <form id="inputWrapper" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="costName">Cost Name:
            <input type="text" id="costName" />
          </label>
        </div>
        <div>
          <label htmlFor="costDate">Date:
            <input type="date" id="costDate" placeholder={Date.now()}/>
          </label>
        </div>
        <button type="submit">Add</button>
      </form>
    </div>
  )
}

function Ledger(){

  const [dialogueType, setDialogueType] = useState("");
  const [visibilityState, setVisibilityState] = useState("hidden");
  const [members, setMembers] = useState(["Brad", "Carson", "Sean"]);
  const [costs, setCosts] = useState({
    "recurringCosts": ["water/sewer", "electric", "natural gas"],
    "otherCosts": ["Netflix"]
  })
  const [values, setValues] = useState({
    "recurringCosts": [
      {
        "name":"water/sewer", 
        "date": "01/01/2024",
        "total": 0,
        "Brad": 0,
        "Carson" : 0,
        "Sean" : 0
      },
      {
        "name": "electric",
        "date": "01/01/2024",
        "total": 0,
        "Brad": 0,
        "Carson" : 0,
        "Sean" : 0
      },
      {
        "name": "natural gas",
        "date": "01/01/2024",
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
    "otherCosts":[
      {
        "name": "netflix",
        "date": "01/01/2024",
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
    "paymentsMade": [
        {
          "name": "Brad",
          "date": "01/01/2024",
          "amt": 0
        },
        {
          "name": "Sean",
          "date": "01/01/2024",
          "amt": 0
        },
        {
          "name": "Carson",
          "date": "01/01/2024",
          "amt": 0
        }
    ],
    "Balances": [
      { 
        "name": "BeginBal", 
        "Brad": 34.59,
        "Carson": 68.13,
        "Sean": 35.74
      },
      {
        "name": "LESS: Payments",
        "Brad": 0,
        "Carson": 0,
        "Sean": 0
      },
      {
        "name": "ADD: Total Costs",
        "Brad": 0,
        "Carson": 0,
        "Sean": 0
      },
      {
        "name": "Current Balance",
        "Brad": 0,
        "Carson": 0,
        "Sean": 0
      }
    ]
  })
  
  const round=(n)=>{
    return Math.round(n*100)/100
  }
  
  const splitCost =(e)=>{
    const split = e.target.value/3;
    let valuesDeepCopy = structuredClone(values);
    let costType = e.target.classList[1]
    const index = valuesDeepCopy[costType].findIndex((x)=> x.name===e.target.id)
    valuesDeepCopy[costType][index]["total"] = round(e.target.value);
    for(let x = 0; x < members.length; x++){
      valuesDeepCopy[costType][index][members[x]] = round(split);
    };
    updateTotals(valuesDeepCopy, null, costType)
  };

  const updateTotals =(valuesDeepCopy, costDeepCopy, costType)=>{
    let costObj = {};
    if(costDeepCopy){
      costObj = costDeepCopy
    } else {
      costObj = costs;
    }
    const totalsIndex = costObj[costType].length;
    // per member vertical total for recurring
    let total = 0;
    for(let x = 0; x < members.length; x++){
      for(let i = 0; i < costObj[costType].length; i++){
        total = total + valuesDeepCopy[costType][i][members[x]]
      }
      valuesDeepCopy[costType][totalsIndex][members[x]] = round(total);
      total = 0;
    }
    //overall total
    for(let y = 0; y < costObj[costType].length; y++){
      total = total + valuesDeepCopy[costType][y]["total"]
    }
    if(total>0){
      valuesDeepCopy[costType][totalsIndex]["total"] = round(total);
    } else {
      valuesDeepCopy[costType][totalsIndex]["total"] = 0.00;
    }
    updateBalances(valuesDeepCopy, costObj, costType)
  }

  const updateBalances =(valuesDeepCopy, costObj, costType)=>{
    for(let x = 0; x < members.length; x++){
      let totalCosts = 0
      for(let i = 0; i<2; i++){
        let costTypeArr = Object.getOwnPropertyNames(costs)
        for(let y = 0; y < costObj[costTypeArr[i]].length; y++){
          totalCosts = totalCosts + valuesDeepCopy[costTypeArr[i]][y][members[x]]
        }
      }
      valuesDeepCopy["Balances"][2][members[x]] = round(totalCosts);
      totalCosts = 0
    }
    setValues(valuesDeepCopy)
  }

  const addCost =(costName, costDate)=>{
    let newCostName = costName;
    let costDeepCopy = structuredClone(costs);
    costDeepCopy[dialogueType].push(newCostName);
    setCosts(costDeepCopy);
    let newValueObj = {
      "name": newCostName,
      "date": costDate,
      "total": 0.00
    };
    for(let x = 0; x < members.length; x++){
      newValueObj[members[x]] = 0.00;
    };
    let valuesDeepCopy = structuredClone(values);
    let spliceIndex = valuesDeepCopy[dialogueType].length-1;
    valuesDeepCopy[dialogueType].splice(spliceIndex, 0, newValueObj);
    setValues(valuesDeepCopy);
  }

  const removeCost =(e)=>{
    if(e.target.id==="recurringCostsAddButton" || e.target.id==="recurringCostsMinusButton"){
      console.log("set Dialogue")
      setDialogueType("recurringCosts")
    } else {
      console.log("set Dialogue")
      setDialogueType("otherCosts")
    };
    console.log(e.target.id, costs[dialogueType], costs, dialogueType)
    let costDeepCopy = structuredClone(costs);
    let spliceIndex = costs[dialogueType].length-1;
    costDeepCopy[dialogueType].splice(spliceIndex, 1);
    setCosts(costDeepCopy);
    //console.log(`costDeepCopy:`, costDeepCopy, `costs:`, costs);
    let valuesDeepCopy = structuredClone(values);
    spliceIndex = values[dialogueType].length-2;
    valuesDeepCopy[dialogueType].splice(spliceIndex, 1);
    updateTotals(valuesDeepCopy, costDeepCopy, dialogueType);
  }

  const showDialogue=(e)=>{
    if(e.target.id==="recurringCostsAddButton"){
      setDialogueType("recurringCosts")
    } else {
      setDialogueType("otherCosts")
    }
    setVisibilityState("visible")
  }

  const renderPmt=(e)=>{
    //console.log(e.target.id)
    setValues((val)=>{
      let index = val["paymentsMade"].findIndex((x)=>x.name===e.target.id)
      
      return {
        ...val,
        paymentsMade: val["paymentsMade"].map((item, i)=>{
          if(i===index){
            return {
              ...item,
              "amt": e.target.value
            };
          } else {
              return item;
          }
        }),
        Balances: val["Balances"].map((item, i)=>{
          if(i===1){
            //let x = e.taget.id
            return {
              ...val["Balances"][1],
              "Brad" : e.target.value
            }
          } else {
            return item
          }
        })
      }
    }) 
  }

  return (
    <div id="ledger">
      <AddDialogue 
        visibilityState={visibilityState} 
        setVisibilityState={setVisibilityState} 
        addCost={addCost}
        dialogueType={dialogueType}
        setDialogueType={setDialogueType}
        costs={costs}
      />
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
                {cost.name!=="totals" ? <input onChange={splitCost} id={cost.name} className="amtInput recurringCosts" type="number" placeholder="0.00"/> : <span>{cost.total}</span>}
                <span>{cost.date}</span>
                {members.map((member, index)=>{
                  return (
                    <span key={index}>${cost[member]}</span>
                  )
                })}
              </div>
            )
          })}
          <button id="recurringCostsAddButton" onClick={showDialogue}>+</button>
          <button id="recurringCostsMinusButton" onClick={removeCost}>-</button>
          <div></div>
        </div>
      </div>
      <div id="otherCosts" className="ledgerSection">
        <span className="sectionHeader">Other Costs</span>
        <div className="sectionTable">
          {values["otherCosts"].map((cost, index)=>{
            return (
              <div key={index} className="costRow">
                <span>{cost.name}</span>
                {cost.name!=="totals" ? <input onChange={splitCost} id={cost.name} className="amtInput otherCosts" type="text" placeholder="0.00"/> : <span></span>}
                <span>{cost.date}</span>
                {members.map((member, index)=>{
                  return (
                    <span key={index}>${cost[member]}</span>
                  )
                })}
              </div>
            )
          })}
          <button id="otherCostButton" onClick={showDialogue}>+</button>
        </div>
      </div>
      <div id="payments" className="ledgerSection">
        <span className="sectionHeader">Payments Made</span>
        <div className="sectionTable">
          {values["paymentsMade"].map((pmt, index)=>{
            return (
              <div key={index} className="costRow">
                <span>{pmt.name}</span>
                <input onChange={renderPmt} id={pmt.name} className="amtInput" type="text" placeholder="0.00"/>
                <span>{pmt.date}</span>
                {members.map((member, index)=>{
                  return (
                    <span>
                      { pmt.name===member ? "$"+pmt.amt : "" }
                    </span>
                  )
                })}
              </div>
            )
          })}
          <button id="otherCostsAddButton" onClick={showDialogue}>+</button>
          <button id="otherCostsMinusButton" onClick={removeCost}>-</button>
        </div>
      </div>
      <div id="balances" className="ledgerSection">
        <span className="sectionHeader">Balances</span>
        <div className="sectionTable">
          {values["Balances"].map((bal, index)=>{
            return(
              <div key={index} className="costRow">
                <span>{bal.name}</span>
                <span></span>
                <span></span>
                {members.map((member)=>{
                  return <span>{bal[member]}</span>
                })}
              </div>
            )
          })}
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
