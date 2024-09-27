import './App.css';
import { useState } from 'react';

function Members({members, setMembers, values, setValues, splitCost, updateTotals, updateBalances, round}){

  const [editMode, setEditMode] = useState({"enabled": false, "target":""});

  const removeMember=(e)=>{
    let member = e.target.className;
    setMembers(members.filter((item)=>item!==member));
    adjustColumns();

  }
  const adjustColumns=()=>{
    const stylesheet = document.styleSheets[0];
    let arr = [...stylesheet.cssRules];
    let found = arr.filter((r)=>r.selectorText === ".costRow"|| r.selectorText === "#ledger #ledgerHeader");
    for(let x=0; x<found.length; x++){
      found[x].style
        .setProperty("grid-template-columns", "1.5fr repeat(" + (members.length + 3) + ", 1fr)");
    };
  }
  const addMember=()=>{
    setMembers([...members, "new"]);
    adjustColumns();
    setValues({
      ...values,
      "paymentsMade":[
        ...values["paymentsMade"],
        {
          "name":"new",
          "date":"01/01/2024",
          "amt":0
        }
      ]
    })
    setEditMode({"enabled": true, "target":"new"});
  }
  const editMember=(e)=>{
    let member = e.target.className;
    setEditMode({"enabled": true, "target": member});
  }

  const saveEdits=(e)=>{
    e.preventDefault();
    let oldVal = e.target[1].id;
    let newVal = e.target[0].value;
    console.log("oldVal: "+ oldVal, "newVal: " + newVal);

    let membersDeepCopy = structuredClone(members);
    let index = 0;
    if(editMode.target!=="new"){
      index = membersDeepCopy.findIndex((member)=>member===oldVal);
    } else {
      index = membersDeepCopy.length-1;
    }
    let mappedMembers = membersDeepCopy.map((item, i)=>{
      if(i===index){
        return newVal;
      } else {
        return item;
      };
    })
    setMembers(mappedMembers);
    
    let callback=(item)=>{
      if(oldVal==="new"){
        item[newVal] = 0;
        return item;
      } else {
        let obj = Object.entries(item).map((i)=>{
          if(i[0]===oldVal){
            return [newVal, i[1]];
          } else {
            return i;
          }
        });
        return Object.fromEntries(obj);  
      }
    }

    let valuesCopy = {
      ...values,
      "recurringCosts": values["recurringCosts"].map((item)=>callback(item)),
      "otherCosts": values["otherCosts"].map((item)=>callback(item)),
      "paymentsMade": values["paymentsMade"].map((item)=>{
        if(item.name === oldVal){
          return {
            ...item,
            "name": newVal
          }
        } else {
          return item;
        };
      }),
      "Balances": values["Balances"].map((item)=>callback(item))
    }

    let linesToChange = [];
    for(let x = 0; x<valuesCopy["recurringCosts"].length; x++){
      if(valuesCopy["recurringCosts"][x]["total"]>0){
        linesToChange.push(valuesCopy["recurringCosts"][x]["name"])
      }
    }
    for(let x = 0; x<valuesCopy["otherCosts"].length; x++){
      if(valuesCopy["otherCosts"][x]["total"]>0){
        linesToChange.push(valuesCopy["otherCosts"][x]["name"])
      }
    }
    console.log(linesToChange)
    
    // console.log(valuesCopy)
    splitCost({
      "target":{
        "value": values["recurringCosts"][0]["total"],
        "classList": [0, Object.getOwnPropertyNames(values)[0]],
        "id":"water/sewer"
      }
    }, valuesCopy, mappedMembers)
    setEditMode({"enabled": false, "target": ""})
  }

  return (
    <div id="members">
      <span id="header">Members</span>
      {members.map((member, index)=>{
        return <div key={index} id="memberWrap">
          {editMode.enabled && editMode.target===member ?
            <form onSubmit={saveEdits}>
              <input type="text" id="editMember"/> 
              <button type="submit" id={member}>done</button>
            </form> :
            <span className="member">{member}</span>}
          <div>
            <button className={member} onClick={editMember}>Edit</button>
            <button className={member} onClick={removeMember}>delete</button>
          </div>
        </div>
      })}
      <button id="add" onClick={addMember}>add Member</button>
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

function Ledger({members, values, setValues, splitCost, updateTotals, updateBalances, round, costs, setCosts}){

  const [dialogueType, setDialogueType] = useState("");
  const [visibilityState, setVisibilityState] = useState("hidden");
  

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
      //console.log("set Dialogue")
      setDialogueType("recurringCosts")
    } else {
      //console.log("set Dialogue")
      setDialogueType("otherCosts")
    };
    //console.log(e.target.id, costs[dialogueType], costs, dialogueType)
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
    
    let index = values["paymentsMade"].findIndex((x)=>x.name===e.target.id)
    let targetId = e.target.id
    let valuesDeepCopy =  {
      ...values,
      paymentsMade: values["paymentsMade"].map((item, i)=>{
        if(i===index){
          return {
            ...item,
            "amt": e.target.value
          };
        } else {
            return item;
        }
      }),
      Balances: values["Balances"].map((item, i)=>{
        if(i===1){
          return {
            ...values["Balances"][1],
            [targetId] : e.target.value
          }
        } else {
          return item
        }
      })
    }
    updateBalances(valuesDeepCopy, costs, null);
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
        {members.map((member)=><span>{member}</span>)}
      </div>
      <div id="recurringCosts" className="ledgerSection">
        <span className="sectionHeader">Recurring Costs</span>
        <div className="sectionTable">
          {values["recurringCosts"].map((cost, index)=>{
            return (
              <div key={index} className="costRow">
                <span>{cost.name}</span>
                {cost.name!=="totals" ? 
                  <input 
                    onChange={splitCost} 
                    id={cost.name} 
                    className="amtInput recurringCosts" 
                    type="number" 
                    placeholder="0.00"/> : 
                  <span>{cost.total}</span>}
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
                    <span key={index}>
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
                {members.map((member, index)=>{
                  return <span key={index}>{bal[member]}</span>
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

  const [costs, setCosts] = useState({
    "recurringCosts": ["water/sewer", "electric", "natural gas"],
    "otherCosts": ["Netflix"]
  })
  const [members, setMembers] = useState(["Brad", "Carson", "Sean"]);
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
        "Brad": 0,
        "Carson": 0,
        "Sean": 0
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
  
  const splitCost =(e, passedDeepCopy, membersCopy)=>{
    let valuesDeepCopy = ""
    if(passedDeepCopy){
      valuesDeepCopy = passedDeepCopy
    } else {
      valuesDeepCopy = structuredClone(values);
    }
    let memberArray = ""
    if(membersCopy){
      memberArray = membersCopy
    } else {
      memberArray = members 
    }
    const divideBy = members.length;
    const split = e.target.value/divideBy;
    let costType = e.target.classList[1]
    const index = valuesDeepCopy[costType].findIndex((x)=> x.name===e.target.id)
    valuesDeepCopy[costType][index]["total"] = round(e.target.value);
    for(let x = 0; x < members.length; x++){
      valuesDeepCopy[costType][index][memberArray[x]] = round(split);
    };
    //console.log(members)
    updateTotals(valuesDeepCopy, null, costType, memberArray)
  };

  const updateTotals =(valuesDeepCopy, costDeepCopy, costType, membersCopy)=>{
    let costObj = {};
    if(costDeepCopy){
      costObj = costDeepCopy
    } else {
      costObj = costs;
    }
    let memberArray = []
    if(membersCopy){
      memberArray = membersCopy;
    } else {
      memberArray = members;
    }
    const totalsIndex = costObj[costType].length;
    // per member vertical total for recurring
    let total = 0;
    for(let x = 0; x < memberArray.length; x++){
      for(let i = 0; i < costObj[costType].length; i++){
        total = total + valuesDeepCopy[costType][i][memberArray[x]]
      }
      valuesDeepCopy[costType][totalsIndex][memberArray[x]] = round(total);
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
    updateBalances(valuesDeepCopy, costObj, costType, memberArray)
  }

  const updateBalances =(valuesDeepCopy, costObj, costType, membersCopy)=>{
    let membersArray = []
    if(membersCopy){
      membersArray = membersCopy;
    } else {
      membersArray = members;
    }
    for(let x = 0; x < membersArray.length; x++){
      let totalCosts = 0
      for(let i = 0; i<2; i++){
        let costTypeArr = Object.getOwnPropertyNames(costs)
        for(let y = 0; y < costObj[costTypeArr[i]].length; y++){
          totalCosts = totalCosts + valuesDeepCopy[costTypeArr[i]][y][membersArray[x]]
        }
      }
      valuesDeepCopy["Balances"][2][membersArray[x]] = round(totalCosts);
      let beginBal = valuesDeepCopy["Balances"][0][membersArray[x]]
      let pmts = valuesDeepCopy["Balances"][1][membersArray[x]]
      let curBal = beginBal - pmts + totalCosts
      //console.log(beginBal, pmts, curBal)
      valuesDeepCopy["Balances"][3][membersArray[x]] = round(curBal);
      totalCosts = 0
    }
    setValues(valuesDeepCopy)
    // console.log(valuesDeepCopy)
  }

  return (
    <div className="App">
      <header>
            Online Ledger
      </header>
        <div id="container">
            <Members 
              members={members} 
              setMembers={setMembers} 
              values={values} 
              setValues={setValues}
              splitCost={splitCost}
              updateTotals={updateTotals}
              updateBalances={updateBalances}
              round={round}
            />
            <Ledger 
              members={members} 
              values={values} 
              setValues={setValues}
              splitCost={splitCost}
              updateTotals={updateTotals}
              updateBalances={updateBalances}
              round={round}
              costs={costs}
              setCosts={setCosts}
            />
            <Analysis />
        </div>
    </div>
  );
}

export default App;
