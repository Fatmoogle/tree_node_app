import React from 'react'
import { useState, useEffect} from 'react'; 
import TreeMenu from 'react-simple-tree-menu';
import axios from 'axios';

export default function MenuTree() {

    const [factories, setFactories] = useState([{
        name: "",
        children: null,
        min: null,
        max: null,
        childArray: []
    }]);

    // Gets all factories from db
    const loadFactories = () => {
        axios.get('./api/factories')
        .then(res => {
            setFactories(res.data);
        })
        .catch(err => {
            console.log(err)
        })
    }

    // Loading all factories on start up
    useEffect(() => {
        loadFactories();
    }, []);

    

    const treeData = [
        {
        key: 'Main node',
        label: 'Main node',
        nodes: [
        {
            key: 'second-level-node-1',
            label: 'Node 1 at the second level',
            nodes: []
        },
        ],
    }
    ];
    return (
        <div>
            <TreeMenu data={treeData} hasSearch={false} />
            <button onClick={() => console.log(factories)}>Test to see state</button>
        </div>
    )
}
