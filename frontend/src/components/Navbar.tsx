import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  return (
    <nav className="m-2 p-2 h-16 flex justify-between">
      <h1 className="font-bold">
        <Link to='/'>ReviewTube</Link>
      </h1>
      <LogoutButton />
    </nav>
  )
}

export default Navbar