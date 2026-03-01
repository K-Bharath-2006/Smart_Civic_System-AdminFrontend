import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <>
      <NavLink to="/">Login</NavLink>
      <NavLink to="/superadmin">SuperAdmin</NavLink>
      <NavLink to="/admin">AdminDashboard</NavLink>
      <NavLink to="/officer">OfficerDashboard</NavLink>
      
    </>
  );
};

export default Header;
