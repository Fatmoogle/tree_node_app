import "./App.css";
import "../node_modules/react-simple-tree-menu/dist/main.css"; // CSS for TreeMenu library
import { useState, useEffect } from "react";
import TreeMenuItem, { TreeMenu, ItemComponent}  from 'react-simple-tree-menu';
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Form, Button, Row, Col, FormGroup, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { NameErr, ChildrenErr, MinErr, MaxErr } from "./components/FormValidation/index";


// Create a temporary object to
// hold all the values to then send
// to the db

// Create conditional render for edit 
// button when a row is highlighted or active

// Create Modal for form
// create regeneration method for facroties that already exist
// create delete button and functionality for each factory


function App() {

  const [name, setName] = useState("");
  const [children, setChildren] = useState();
  const [min, setMin] = useState();
  const [max, setMax] = useState();
  const [active, setActive] = useState(null);
  const [factories, setFactories] = useState([
    {
      name: "",
      children: null,
      min: null,
      max: null,
      childArray: [],
    }
  ]);

  // Gets all factories from db
  const loadFactories = () => {
    axios
      .get("/api/factories")
      .then(res => {
        setFactories(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  // Loading all factories on start up
  useEffect(() => {
    loadFactories();
  }, []);

  let treeDataCopy = [];

  // This creates an object for each factory that the TreeMenu library will be able to utilize.
  factories.forEach((factory) => {
    let treeDataObject = {};
    let nodeKey = factory._id;
    let nodeLabel = factory.name;
    let nodeArray = [];

    for (let i = 0; i < factory.childArray.length; i++) {
      let secondaryObject = {
        // A unique key has to be generated for each node. Simply using "i", caused errors.
        key: uuidv4(),
        label: factory.childArray[i],
      };
      nodeArray.push(secondaryObject);
    }

    treeDataObject = {
      key: nodeKey,
      label: nodeLabel,
      nodes: nodeArray,
    };

    treeDataCopy.push(treeDataObject);
  });

  const treeData = [
    {
      key: "Root",
      label: "Main",
      nodes: treeDataCopy,
    },
  ];

  const submitFactory = async (e) => {
    e.preventDefault();

    let tempArray = [];
    for(let i = 0; i < children; i++) {
      tempArray.push(randomInt(min, max));
    }
    let temporaryFactory = {
      name: name,
      children: children,
      min: min,
      max: max,
      childArray: tempArray
    };

    try {
      await axios.post("/api/factories", temporaryFactory);
      loadFactories();
    } catch (err) {
      console.log(err)
    }
  }

  const randomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  const setActiveFactory = (e) => {

    // Because "Root" is not in the database, "Root"
    // will never be an active element because it
    // does not contain "_id" like other items.
    
    for(let i = 0; i < factories.length; i++) {
      if(e.key.includes(factories[i]._id)) {
        setActive(e.key);
      } else if(e.key === "Root") {
        setActive(null);
      }
    }
  }

  const deleteFactory = async () => {
    if(active === null) {
      return;
    }

    let selectedFactory = factories.find(factory => "Root/" + factory._id  === active);

    try {
      await axios.delete("/api/factories/" + selectedFactory._id, selectedFactory);
      loadFactories();
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="App">
      <h1>Tree Node Generator</h1>
      <TreeMenuItem data={treeData} hasSearch={false} key={treeData.key} onClickItem={(e) => setActiveFactory(e)}></TreeMenuItem>
      <Button variant="danger" type="submit" disabled={active === null} onClick={() => deleteFactory()}>Delete</Button>
      <Container className="d-flex justify-content-center">
        <Form> 

          <Form.Group>
            <Form.Label>Factory Name</Form.Label>
            <Form.Control required type="text" placeholder="Factory Name" onChange={(e) => setName(e.target.value)}></Form.Control>
            <NameErr name={name}/>
          </Form.Group>

          <Form.Group>
            <Form.Label className="mt-3">Nodes</Form.Label>
            <Form.Control required type="number" min="1" max="15" placeholder="Must be between 1 and 15" onChange={(e) => setChildren(e.target.value)}></Form.Control>
            <ChildrenErr children={children}/>
          </Form.Group>

          <Row className="mb-3 mt-3">

            <FormGroup as={Col}>
              <Form.Label>Min Value</Form.Label>
              <Form.Control required type="number" min="0" onChange={(e) => setMin(parseInt(e.target.value))}></Form.Control>
              <MinErr min={min}/>
            </FormGroup>

            <FormGroup as={Col}>
              <Form.Label>Max Value</Form.Label>
              <Form.Control required type="number" min="0" onChange={(e) => setMax(parseInt(e.target.value))}></Form.Control>
              <MaxErr min={min} max={max} />
            </FormGroup>

          </Row>
          

          <Button variant="primary" type="submit" disabled={name === "" || max < min || min < 0 || children > 15 || children < 1 || max == null || min == null || children == null} className="mt-4 w-25"  onClick={(e) => submitFactory(e)}>Submit</Button>
        </Form>
      </Container>
    </div>
  );

  ///// If error in validation, use terfary operator to display either a checkmark with "all good!" componenent, or an error componenet. 

    // Name
    // if(name.trim().length < 1) {error: please enter a name for your factory.}
    // Children
    // if(children.value < 1 || children.value > 15) {error: please pick a number between 1 and 15.}
    // Min
    // if(min.value < 0) {error: You cannot pick a number less than 0.}
    // Max
    // if(max.value < min.value) {error: your max must be greater than your min.}
    // else if(max.value > 1000000) {error: relax. You dont need a number bigger than that...}
}

export default App;
