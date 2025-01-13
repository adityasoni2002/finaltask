// import logo from './logo.svg';
// import './App.css';
import ProductTable from "./components/ProductsTable";
import AnalyticsPage from './AnalyticsPage';
// import Aboutgym from './components/Aboutgym';

import { BrowserRouter as Router, Switch, Route, Routes} from 'react-router-dom'

function App() {
  return (
    
    <div >
     < Router>
     
     {/* <Switch> */}
     <Routes>
     <Route path="/" element={<ProductTable   />} />
     <Route path="/AnalyticsPage" element={<AnalyticsPage   />} />
     </Routes>
      {/* </Routes> */}

     </Router>
    </div>
  );
}

export default App;
