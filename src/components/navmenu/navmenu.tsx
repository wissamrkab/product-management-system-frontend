import './nav.css';

const Navmenu = () => {
    return (
        <aside className="sidenav">
            <nav className="menu">
                <a href="/">Dashboard</a>
                <a href="/products">Products</a>
                <a href="/categories">Categories</a>
            </nav>
        </aside>
    )
}

export default Navmenu;