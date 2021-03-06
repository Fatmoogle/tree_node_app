import "./App.css";
import "../node_modules/react-simple-tree-menu/dist/main.css"; // CSS for TreeMenu library
import { useState, useEffect } from "react";
import TreeMenuItem  from "react-simple-tree-menu";
import TreeLogo from "./assets/images/TreeLogo.png"
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Form, Button, Row, Col, FormGroup, Container, Modal, ButtonToolbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { NameErr, ChildrenErr, MinErr, MaxErr } from "./components/FormValidation/index";

function App() {

  const [name, setName] = useState("Factory Name");
  const [children, setChildren] = useState();
  const [min, setMin] = useState();
  const [max, setMax] = useState();
  const [activeId, setActiveId] = useState(null);
  const [show, setShow] = useState(false);
  const [modalTitle, setModalTitle] = useState("")
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

  // Sets name, children, min, and max to default values.
  const setDefaultValues = () => {
    setName("Factory Name");
    setChildren();
    setMin();
    setMax();
    setModalTitle("");
  }

  // Temporary array to hold all the factories and be used for the TreeMenu library.
  let treeDataCopy = [];

  // This creates an object for each factory that the TreeMenu library will be able to utilize.
  factories.forEach((factory) => {
    let treeDataObject = {};
    let nodeKey = factory._id;
    let nodeLabel = factory.name;
    let nodeArray = [];

    for (let i = 0; i < factory.childArray.length; i++) {
      let secondaryObject = {
        // A unique key has to be generated for each node. 
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

  // Functions to open and close the modal form
  const handleShow = (e) => {
    if(e.target.classList.contains("addBtn")) {
      setModalTitle("Add a New Factory");
    } else if(e.target.classList.contains("editBtn")) {
      setModalTitle("Edit Factory")
    }
    setShow(true)
  }

  const handleClose = () => {
    setShow(false);
    setDefaultValues();
  }

  // Function to submit a new factory to the DB
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
      setActiveId(null)
      setDefaultValues();
      setShow(false);
    } catch (err) {
      console.log(err)
    }
  }

  // Function that generates random integer based on min and max. Includes min value in generation.
  const randomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  // Sets the clicked factory id as active
  const setActiveFactory = (e) => {
    for(let i = 0; i < factories.length; i++) {
      if(e.hasNodes === false) {
        setActiveId(null)
      } else if(e.key.includes(factories[i]._id)) {
        setActiveId(e.key);
      } else if(e.key === "Root") {
        setActiveId(null);
      }
    }
  }

  // Function to edit a factory
  const editFactory = async (e) => {
    e.preventDefault();
  
    let selectedFactory = factories.find(factory => "Root/" + factory._id  === activeId);
    handleShow(e);
    let tempArray = [];

    for(let i = 0; i < children; i++) {
      tempArray.push(randomInt(min, max));
    }

    let tempObj = {
      name: name,
      children: children,
      min: min,
      max: max,
      childArray: tempArray
    };

    try {
      await axios.put("/api/factories/" + selectedFactory._id, tempObj );
      loadFactories();
      handleClose();
    } catch (err) {
      console.log(err)
    }
  }

  // Function to delete a selected factory.
  const deleteFactory = async () => {
  
    if(activeId === null) {
      return;
    }

    let selectedFactory = factories.find(factory => "Root/" + factory._id  === activeId);

    try {
      await axios.delete("/api/factories/" + selectedFactory._id, selectedFactory);
      loadFactories();
      setActiveId(null)
    } catch (err) {
      console.log(err)
    }
  }

  // Regenerates ONLY the numbers of the factory selected.
  const regenerateNumbers = async () => {

    let selectedFactory = factories.find(factory => "Root/" + factory._id  === activeId);

    let factoryArrayLength = selectedFactory.children;
    let tempArray = [];

    for(let i = 0; i < factoryArrayLength; i++) {
      tempArray.push(randomInt(selectedFactory.min, selectedFactory.max))
    }

    try {
      await axios.put("/api/factories/" + selectedFactory._id, {childArray: tempArray} );
      loadFactories();
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="App">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img className="logo" src={TreeLogo} alt="NodeTreeLogo" width="350" height="350" />
      </div>
      <h1 className="display-4" style={{ textAlign: "center", marginBottom: "35px" }}>Tree Node Generator</h1>
      <TreeMenuItem data={treeData} hasSearch={false} key={treeData.key} onClickItem={(e) => setActiveFactory(e)}></TreeMenuItem>
      <ButtonToolbar className="d-flex justify-content-center mb-3 gap-2">
        <Button variant="primary" onClick={(e) => handleShow(e)} className="addBtn">Add Factory</Button>
        <Button variant="primary" disabled={activeId === null} onClick={handleShow} className="editBtn">Edit Factory</Button>
        <Button variant="success" disabled={activeId === null} onClick={() => regenerateNumbers()} >Regenerate Numbers</Button>
        <Button variant="danger" type="submit" disabled={activeId === null} onClick={() => deleteFactory()}>Delete</Button>
      </ButtonToolbar>
      <Modal show={show} onHide={handleClose} className="d-flex align-items-center">
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Container className="mt-4">
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
            <ButtonToolbar className="d-flex justify-content-center mb-3 gap-3 ">
              <Button variant="primary" type="submit" disabled={name === "" || name === "Factory Name" || max < min || min < 0 || children > 15 || children < 1 || max == null || min == null || children == null} className="mt-4"  onClick={modalTitle === "Edit Factory" ? (e) => editFactory(e) : (e) => submitFactory(e)}>Submit</Button>
            </ButtonToolbar>
          </Form>
        </Container>
      </Modal>
    </div>
  );
}

export default App;
