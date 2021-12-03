// import React from 'react'
// import { useState, useEffect} from 'react'; 
// import TreeMenu, { defaultChildren, ItemComponent }from 'react-simple-tree-menu';
// import axios from 'axios';
// import { v4 as uuidv4 } from 'uuid';

// export default function MenuTree() {

//     const [factories, setFactories] = useState([{
//         name: "",
//         children: null,
//         min: null,
//         max: null,
//         childArray: []
//     }]);

//     // Gets all factories from db
//     const loadFactories = () => {
//         axios.get('./api/factories')
//         .then(res => {
//             setFactories(res.data);
//         })
//         .catch(err => {
//             console.log(err)
//         })
//     }

//     // Loading all factories on start up
//     useEffect(() => {
//         loadFactories();
//     }, []);

//     let treeDataCopy = [];
    
//     // This creates an object for each factory that the TreeMenu library will be able to utilize.
//     factories.forEach(factory => {
//         let treeDataObject = {};
//         let nodeKey = factory._id;
//         let nodeLabel = factory.name;
//         let nodeArray = [];
        
//         for(let i = 0; i < factory.childArray.length; i++) {
//             let secondaryObject = {
//                 // A unique key has to be generated for each node. Simply using "i", caused errors.
//                 key: uuidv4(),
//                 label: factory.childArray[i]
//             };

//             nodeArray.push(secondaryObject);
//         }

//         treeDataObject = {
//             key: nodeKey,
//             label: nodeLabel,
//             nodes: nodeArray
//         }

//         treeDataCopy.push(treeDataObject);
//     })

//     const treeData = [
//         {
//         key: 'Root',
//         label: 'Main',
//         nodes: treeDataCopy
//         }
//     ];

//     return (
//         <>
//             <TreeMenu data={treeData} hasSearch={false}></TreeMenu>
//             <button onClick={() => console.log(factories)}>Test to see state</button>
//         </>
//     )
// }
