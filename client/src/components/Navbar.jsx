import react, { useContext } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo2.png";
import { ConnectWallet } from "@thirdweb-dev/react";
// import { TransactionContext } from "../context/TransactionContext";

const Navbar = () => {
  // const { connectWallet, currentAccount } = useContext(TransactionContext);

  return (
    <div className="flex navbar pl-6 bg-base-300 bg-opacity-80 ">
      <div className="flex-1 ">
        <Link to="/">
          <img className="h-12" src={logo} alt="logo" />
        </Link>
      </div>


        <div className="btn bg-base-100 hover:bg-primary font-bold ">
          <ConnectWallet />
        </div>

      </div>
  );
};

export default Navbar;