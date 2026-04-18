import './App.css'
import { RegisterPage } from "./pages/registerPage";
import { Footer } from "./components/Footer";

import "./sytles/auth.css";
import "./sytles/footer.css";


function App() {

  return (
    <div className='app'>
      <main>

        <RegisterPage />

      </main>

      <Footer />

    </div>
  )
}

export default App
