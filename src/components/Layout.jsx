import PropTypes from 'prop-types';
import Sidebar from "./Sidebar/Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="w-full flex flex-col p-4 m-10 items-center">
      {/* <SearchBar /> */}
      <div className="w-full flex min-h-screen relative">
        <div className="w-1/4 fixed top-40 left-10 h-[calc(100vh-5rem)] overflow-y-auto mt-4">
          <Sidebar />
        </div>
        <div className="w-1/3" /> {/* Spacer for fixed sidebar */}
        <div className="w-2/3 overflow-y-auto pl-4">
          {children}
        </div>
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;