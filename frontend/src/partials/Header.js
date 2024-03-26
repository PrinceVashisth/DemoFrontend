import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Logo from "../images/logo-removebg.png";
import "./Header.css";
import { MdOutlineAccountCircle } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

function Header() {
  const { cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);

  return (
    <section className="header mb-3">
      <nav className="sec-1 border-bottom">
        <div className="container d-flex">
          <ul className="nav me-auto">
            <li className="nav-item d-flex align-items-center">
              <a href="#" className="nav-link link-dark address">
                Omaxe World Street, Faridabad
              </a>
            </li>
          </ul>
          <ul className="nav social-icons d-none d-md-block">
            <li className="nav-item">
              <a href="#" className="nav-link link-dark">
                <i className="bi bi-facebook"></i>
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link link-dark">
                <i className="bi bi-instagram"></i>
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link link-dark">
                <i className="bi bi-whatsapp"></i>
              </a>
            </li>
          </ul>
        </div>
      </nav>
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
            <Link className="navbar-brand" to="/">
              <img
                src={Logo}
                alt=""
                style={{ maxWidth: "150px", height: "auto" }}
              />
            </Link>
            <div className="d-flex header-icons d-lg-none">
              <Link to="/cart">
                <i className="bi bi-bag-heart"></i>
              </Link>
              {isAuthenticated ? (
                <div class="dropdown">
                  <button class="dropdown-btn">
                    <i className="bi bi-person"></i>
                  </button>
                  <div class="dropdown-menu">
                    <div className="p-2 d-flex align-items-center">
                      <MdOutlineAccountCircle
                        size={50}
                        className="user-info-img "
                      />

                      <div className="p-1 strong">
                        <strong>{user.name}</strong>
                      </div>
                    </div>
                    <hr className="hr-dark mb-1 mx-1 color-app" />
                    <Link
                      to="/user/profile"
                      className="d-flex align-items-center"
                    >
                      <div className="mx-1">
                        <IoMdSettings />
                      </div>
                      Account
                    </Link>
                    <Link className="d-flex align-items-center">
                      <div className="mx-1">
                        <FaSignOutAlt />
                      </div>
                      Sign out
                    </Link>
                  </div>
                </div>
              ) : (
                // <Link to="/user/profile">
                //   <i className="bi bi-person"></i>
                // </Link>
                <div className="d-flex align-items-center ">
                  <Link className="color-white" to="/user/login">
                    Login or SignUp{" "}
                  </Link>
                </div>
              )}
            </div>
            <div className="collapse navbar-collapse" id="navbarScroll">
              <ul
                className="navbar-nav mx-auto my-2 my-lg-0 navbar-nav-scroll"
                style={{ "--bs-scroll-height": "auto" }}
              >
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" to="/">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" to="/products?category=food">
                    Food
                  </a>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/products?category=cakes">
                    Cakes
                  </Link>
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
              <div className="d-flex header-icons d-none d-lg-flex notifications-icon-container">
                <Link to="/cart">
                  {cartItems.length > 0 && (
                    <div class="notifications-count">{cartItems.length}</div>
                  )}
                  <i className="bi bi-bag-heart"></i>
                </Link>
                {isAuthenticated ? (
                  <div class="dropdown">
                    <button class="dropdown-btn">
                      <i className="bi bi-person"></i>
                    </button>
                    <div class="dropdown-menu">
                      <div className="p-2 d-flex align-items-center">
                        <MdOutlineAccountCircle
                          size={50}
                          className="user-info-img "
                        />

                        <div className="p-1 strong">
                          <strong>{user.name}</strong>
                        </div>
                      </div>
                      <hr className="hr-dark mb-1 mx-1 color-app" />
                      <Link
                        to="/user/profile"
                        className="d-flex align-items-center"
                      >
                        <div className="mx-1">
                          <IoMdSettings />
                        </div>
                        Account
                      </Link>
                      <Link className="d-flex align-items-center">
                        <div className="mx-1">
                          <FaSignOutAlt />
                        </div>
                        Sign out
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex align-items-center color-white">
                    <Link className="color-white" to="/user/login">
                      Login or SignUp{" "}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
    </section>
  );
}

export default Header;
