import { Link } from 'react-router-dom';
import Logo from "../../../images/logo-removebg.png";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../actions/UserAction';

function AdminHeader() {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <section className="header mb-3">
            <header className="border-bottom">
                <nav className="navbar navbar-expand-lg navbar-dark">
                    <div className="container">
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarScroll"
                            aria-controls="navbarScroll"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <Link className="navbar-brand" to="/dashboard">
                            <img src={Logo} alt="" style={{ maxWidth: '150px', height: 'auto' }} />
                        </Link>
                        <div className="collapse navbar-collapse" id="navbarScroll">
                            <ul className="navbar-nav mx-auto my-2 my-lg-0 navbar-nav-scroll" style={{ '--bs-scroll-height': 'auto' }}>
                                <li className="nav-item">
                                    <a className="nav-link active" aria-current="page" to="/">
                                        Admin Dashboard
                                    </a>
                                </li>
                            </ul>
                            <form className="d-flex me-2">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search..."
                                        aria-label="Input group example"
                                        aria-describedby="btnGroupAddon"
                                    />
                                    <div className="input-group-text" id="btnGroupAddon">
                                        <i className="bi bi-search"></i>
                                    </div>
                                </div>
                            </form>
                            {isAuthenticated ? (
                                <div className="d-flex header-icons d-lg-none align-items-center">
                                    <div class="dropdown">
                                        <button class="dropdown-btn">
                                            <i className="bi bi-person"></i>
                                        </button>
                                        <div class="dropdown-menu">
                                            <div className="p-2 d-flex align-items-center">
                                                <div className="p-1 strong">
                                                    <strong>{user.name}</strong>
                                                </div>
                                            </div>
                                            <hr className="hr-dark mb-1 mx-1 color-app" />
                                            <button onClick={handleLogout} className="d-flex align-items-center">
                                                <div className="mx-1">
                                                    Logout
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex align-items-center color-white">
                                    <Link className="color-white" to="/user/login">
                                        Login
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
            </header>
        </section>
    );
}

export default AdminHeader;
