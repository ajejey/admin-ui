import './App.css';
import Header from './components/Header/Header';
import Admin from './components/Admin/Admin';
import GlobalProvider from './context/Provider';

function App() {
  return (
    <>
      <GlobalProvider>
        <div className="container">
          <Header />
          <Admin />
        </div>
      </GlobalProvider>
    </>
  );
}

export default App;
