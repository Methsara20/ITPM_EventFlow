//import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar } from './component/NavBar/Navbar';
import {eventDashboard} from './component/AI-handler/eventDashboard';
import {fotter} from './component/fotter/fotter';

function App() {
  return (
    <div className="App">
      <Navbar />
      <eventDashboard />
      <fotter />
    </div>
  );
}

export default App;
