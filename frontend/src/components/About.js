import React from "react";
import { MdLocationPin } from "react-icons/md";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div>
      {" "}
      {/* <animated.div style={aboutProps}> */}
      <section id="about" className="bg-white padding-one-bottom m-md-5 m-3">
        <div
          className="conatiner"
          style={{
            background: "#fffcfa ",
            borderRadius: "15px ",
            padding: "3rem ",
          }}
        >
          <div className="row justify-content-center">
            <div
              className="col-12 col-sm-6 text-center "
              data-zanim-timeline='{"delay":0}'
              data-zanim-o="1"
            >
              <h2 className="sectionhead mb-3  text-center text-uppercase">
                About Us
              </h2>
              <img
                src="images/about.png"
                className="mx-auto img-fluid mb-2"
                width="200"
                data-no-retina=""
                alt="about "
              />
              <div style={{ lineHeight: "2rem", fontWeight: "100" }}>
                <p>
                  The phrase "EIKO" translates to 'flourishing and prosperous'.
                  It began with a sprinkle of dreams and a bowl brimming with
                  passion. At EIKO, we meticulously create outstanding baked
                  goods, employing only the finest ingredients, precision, and
                  an abundance of love. Our creations are 100% eggless, yet they
                  encapsulate sheer delight in every single bite.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* </animated.div> */}
      {/* <animated.div style={aboutProps}> */}
      <section id="about" className="bg-white padding-one-bottom m-md-5 m-3">
        <div
          className="conatiner"
          style={{
            background: "#fffcfa ",
            borderRadius: "15px ",
            padding: "3rem ",
          }}
        >
          <div className="row justify-content-center">
            <div
              className="col-12 col-sm-6 text-center "
              data-zanim-timeline='{"delay":0}'
              data-zanim-o="1"
            >
              <h2 className="sectionhead mb-3  text-center text-uppercase">
                Our Locations
              </h2>
              <div style={{ lineHeight: "2rem", fontWeight: "100" }}>
                Omaxe World Street, Faridabad{" "}
                <Link
                  to="https://maps.app.goo.gl/WkLB8pLj1VDZ3uFw8"
                  target="_blank"
                >
                  <MdLocationPin size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* </animated.div> */}
    </div>
  );
};

export default About;
