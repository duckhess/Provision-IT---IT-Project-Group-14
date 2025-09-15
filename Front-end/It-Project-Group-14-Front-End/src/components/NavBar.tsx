import React from "react";
import { Link, NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar: React.FC = () => {
  return (
    <nav className={styles.wrapper}>
      <div className={styles.inner}>
        {/* Logo (Link) */}
        <Link to="/" aria-label="Home" className={styles.logoLink}>
          <div className={styles.logoCircle}>
            {/* could be an <img> or svg; using initial here */}
            L
          </div>
        </Link>

        {/* Center links (NavLink gives us active state) */}
        <div className={styles.navLinks}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/search"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Search
          </NavLink>

          <NavLink
            to="/compare"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Compare
          </NavLink>
        </div>

        {/* Profile on the right */}
        <Link to="/profile" className={styles.profile} aria-label="Profile">
          Profile
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
