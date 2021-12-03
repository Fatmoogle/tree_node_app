import "./App.css";
import "../node_modules/react-simple-tree-menu/dist/main.css"; // CSS for TreeMenu library
import { useState, useEffect } from "react";
import TreeMenu from "react-simple-tree-menu";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Form, Button, Row, Col, FormGroup, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// Create a temporary object to
// hold all the values to then send
// to the db

// Create conditional render for edit 
// button when a row is highlighted or active

function App() {
  const [name, setName] = useState("");
  const [children, setChildren] = useState();
  const [min, setMin] = useState();
  const [max, setMax] = useState();
  const [childArray, setChildArray] = useState();
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
      .get("./api/factories")
      .then((res) => {
        setFactories(res.data);
      })
      .catch((err) => {
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

  const submitFactory = (e) => {
    e.preventDefault();
    let temporaryFactory = {
      name: name,
      children: children,
      min: min,
      max: max,
      childArray: [1,2,3]
    };

    axios
      .post("/api/factories", temporaryFactory)
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
    
    loadFactories();
  }
  

  return (
    <div className="App">
      <h1>Tree Node Generator</h1>
      <TreeMenu data={treeData} hasSearch={false}></TreeMenu>
      <Container >
        <Form className="d-flex justify-content-center"> 
          <Form.Group>
            <Form.Label>Factory Name</Form.Label>
            <Form.Control type="text" placeholder="Factory Name" onChange={(e) => setName(e.target.value)}></Form.Control>

            <Form.Label>Nodes</Form.Label>
            <Form.Control type="text" placeholder="Must be between 1 and 15" onChange={(e) => setChildren(e.target.value)}></Form.Control>

            <Row className="mb-3">
              <FormGroup as={Col}>
                <Form.Label>Min Value</Form.Label>
                <Form.Control type="number" onChange={(e) => setMin(e.target.value)}></Form.Control>
              </FormGroup>
              <FormGroup as={Col}>
                <Form.Label>Max Value</Form.Label>
                <Form.Control type="number" onChange={(e) => setMax(e.target.value)}></Form.Control>
              </FormGroup>
            </Row>
            <Button variant="primary" type="submit" className="mt-4 w-25" onClick={(e) => submitFactory(e)}>Submit</Button>
          </Form.Group>
        </Form>
      </Container>
    </div>
  );
}

export default App;
