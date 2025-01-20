import Spinner from "./components/Spinner";
import Header from "./components/Header";
import Main from "./components/Main";
import Home from "./components/Home";
import Footer from "./components/Footer";
import { useAuthChecked } from "./hooks/auth";

function App() {
  const isAuthChecked = useAuthChecked();

  if (!isAuthChecked) {
    return <Spinner />;
  }

  return (
    <>
      <Header />
      <Main>
        <Home />
      </Main>
      <Footer />
    </>
  );
}

export default App;
