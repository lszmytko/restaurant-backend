import logo from "../logo/logo.png";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Basket, Sidebar } from "../components/index";
import React from "react";

const Navigation = () => {
  return (
    <Wrapper>
      <div className="nav-container section-center">
        <ul className="pages">
          <li className="page">
            <Link to="/">start</Link>
          </li>
          <li className="page">
            <Link to="/menu">menu</Link>
          </li>
          <li className="page">
            <Link to="/order">zamówienie</Link>
          </li>
          <li className="page">
            <Link to="/delivery">dostawa</Link>
          </li>
          <li className="page">
            <Link to="/customer">twoje konto</Link>
          </li>
        </ul>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.nav`
  z-index: 1;
  box-shadow: 4px 4px 12px var(--clr-primary-3);
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  background: var(--clr-white);

  .nav-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 2rem;
    height: 100px;
  }

  .pages {
    width: 50%;
    min-width: 30rem;
  }

  .pages li a {
    color: var(--clr-primary-3);
    font-weight: bold;
  }

  .pages li a:hover {
    color: var(--clr-primaty-5);
  }

  .logo-div {
    display: none;
  }

  .logo-img {
    color: var(--clr-primary-3);
  }
  .pages {
    display: none;
    color: var(--clr-primary-5);
    font-size: 1.25rem;
  }
  .page {
    text-transform: uppercase;
  }

  .page h2 {
    cursor: pointer;
  }

  .nav-sidebar {
    position: static;
  }

  @media screen and (min-width: 768px) {
    .pages {
      display: flex;
      justify-content: space-between;
    }

    .nav-container {
      padding: 0;
      width: 98%;
      margin: 0 auto;
    }

    .logo-div {
      width: 4rem;
      display: block;
    }
  }

  @media screen and (min-width: 992px) {
    .nav-container {
    }
  }
`;

export default Navigation;
