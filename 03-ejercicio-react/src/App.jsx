import HomePage from './pages/Home.jsx'
import NotFoundPage from './pages/404.jsx'
import SearchPage from './pages/Search.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Route from './components/Route.jsx'

function App() {

  return (
    <>
      <Header />
      <Route path="/" component={HomePage} />
      <Route path="/search" component={SearchPage} />
      <Route path="*" component={NotFoundPage} />
      <Footer />
    </>
  )
}
export default App
