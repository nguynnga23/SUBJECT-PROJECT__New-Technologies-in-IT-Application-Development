import Sidebar from "./Sidebar"

function Layout({children}) {
    return ( 
        <div>
            <Sidebar />
            <div>{children}</div>
        </div>
     );
}

export default Layout;