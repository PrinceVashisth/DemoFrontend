import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Header.css";

function Header() {
  const { cartItems } = useSelector((state) => state.cart);
  const isAuthenticated = true;

  const userDetails = {
    name: "Harsh yadav",
    email: "Yaduvansi524@gmail.com",
  };

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
          {/* <ul className="nav social-icons d-none d-md-block">
            <li className="nav-item">
              <a
                href="https://www.facebook.com/profile.php?id=61555291071635"
                className="nav-link link-dark"
              >
                <i className="bi bi-facebook"></i>
              </a>
            </li>
            <li className="nav-item">
              <a
                href="https://www.instagram.com/eiko.patisserie/"
                className="nav-link link-dark"
              >
                <i className="bi bi-instagram"></i>
              </a>
            </li>
            <li className="nav-item">
              <a href="https://wa.me/9643280404" className="nav-link link-dark">
                <i className="bi bi-whatsapp"></i>
              </a>
            </li>
          </ul> */}
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
              <img src="./images/goldcroplogo.svg" alt="" />
            </Link>
            <div className="d-flex header-icons d-lg-none align-items-center">
              <Link to="/cart">
                <i className="bi bi-bag-heart"></i>
              </Link>

              {isAuthenticated ? (
                <div class="dropdown">
                  <button class="dropdown-btn">
                    <i className="bi bi-person"></i>
                  </button>
                  <div class="dropdown-menu">
                    <div>
                      <div>
                        <strong>Name : </strong>
                        <span>{userDetails.name}</span>
                      </div>
                      <div>
                        <strong>Email : </strong>
                        <span>{userDetails.email}</span>
                      </div>
                    </div>
                    <hr></hr>
                    <Link to="/profile">Account</Link>
                    <Link>Log Out</Link>
                  </div>
                </div>
              ) : (
                <Link className="nav-link" to="/login">
                  Login
                </Link>
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
                  <a className="nav-link" to="/">
                    Food
                  </a>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/products">
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
              <div className="d-flex header-icons d-none d-lg-flex notifications-icon-container align-items-center">
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
                      <div>
                        <div>
                          <strong>Name : </strong>
                          <span>{userDetails.name}</span>
                        </div>
                        <div>
                          <strong>Email : </strong>
                          <span>{userDetails.email}</span>
                        </div>
                      </div>
                      <hr></hr>
                      <Link to="/profile">Account</Link>
                      <Link>Log Out</Link>
                    </div>
                  </div>
                ) : (
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
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
