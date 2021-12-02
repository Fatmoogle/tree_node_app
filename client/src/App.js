import './App.css';
import MenuTree from './components/MenuTree.js/MenuTree';
import '../node_modules/react-simple-tree-menu/dist/main.css';  // CSS for TreeMenu library


function App() {
  
  

  return (
    <div className="App">
      <h1>Tree Node Generator</h1>
      <MenuTree />
    </div>
  );
}

export default App;
