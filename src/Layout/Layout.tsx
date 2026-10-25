
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Layout() {
  return (
  <><Navbar />

<div className="containner w-[80%] mx-auto">
<Outlet />

</div>





</>
  





  )
}
