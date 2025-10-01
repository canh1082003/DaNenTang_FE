import Header from '../components/header/header.tsx'
import Footer from '../components/footer/footer.tsx'
import { Outlet } from 'react-router-dom'


const MainLayout = () => {
    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}

export default MainLayout
