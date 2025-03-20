//import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar } from './components/NavBar/Navbar';
import {fotter} from './components/footer/footer';

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
