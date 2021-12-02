import './App.css';
import TreeMenu from 'react-simple-tree-menu';
import '../node_modules/react-simple-tree-menu/dist/main.css';

function App() {
  
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
    <div className="App">
      <h1>Hello!</h1>
      <TreeMenu data={treeData} hasSearch={false}></TreeMenu>
    </div>
  );
}

export default App;
