
import { useContext, useState } from "react";
import { FaBars } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const authContext = useContext(AuthContext);

const userLogin = authContext?.userLogin ?? null;
const setuserLogin = authContext?.setuserLogin;
const navigate = useNavigate()



function logout() {
  localStorage.removeItem("userToken");
  setuserLogin?.(null);
  navigate("/login");
}


  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
  
          <div className="shrink-0 flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-indigo-600"
            >
              Logo
            </Link>
          </div>

         
          <div className="hidden md:flex items-center space-x-8">
            {userLogin ? <>  
             <Link
              to="/"
              className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
            >
              Home
            </Link>

            <Link
              to="/profile"
              className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
            >
              Profile
            </Link>
                 <button onClick={logout}
             
              className="text-gray-700 cursor-pointer hover:text-indigo-600 transition-colors font-medium"
            >
            LogOut
            </button>

            </>:<> 
            <Link
              to="/register"
              className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
            >
              Register
            </Link>

            <Link
              to="/login"
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Login
            </Link></>}

          </div>

          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-indigo-600 focus:outline-none"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <IoMdClose size={28} />
              ) : (
                <FaBars size={24} />
              )}
            </button>
          </div>
        </div>
      </div>



{/* mobile */}

   
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 pt-2 pb-4 space-y-2">
  <div className="flex flex-col gap-4">   
              {userLogin ? <>  
             <Link
              to="/"
              className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
            >
              Home
            </Link>

            <Link
              to="/profile"
              className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
            >
              Profile
            </Link>
            <button onClick={logout}
             
              className="text-gray-700 cursor-pointer hover:text-indigo-600 transition-colors font-medium"
            >
            LogOut
            </button>




            </>
            :<> 
            <Link
              to="/register"
              className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
            >
              Register
            </Link>

            <Link
              to="/login"
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Login
            </Link>
            </>
            }</div>
          </div>
        </div>
      )}
    </nav>
  );
}
