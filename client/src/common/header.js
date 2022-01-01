import React from 'react';
import css from "./header.module.css";

const Header = () => {
    return (
        <header className={css.Header}>
           <h1>Norwegian Rails</h1>
        </header>
    );
};

export default Header;