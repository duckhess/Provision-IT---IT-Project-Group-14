import React from 'react'
import styles from './NavBar.module.css';
import * as data from './links.json';
const linksString = JSON.stringify(data);
const links = JSON.parse(linksString).links;


type Link = {
    label: string;
    href: string;
};

// rafce - creates a functional react component 
// React.fc is the type (TS requires a type)


/* need to set up routing to links?? */
const Links: React.FC<{ links: Link[]}> = ({ links }) => {
    return (
        <div className={styles['links-container']}>
            {links.map((link: Link) => {
                  return(
                    <div key={link.href} className={styles['link']}>
                        <a href = {link.href}>
                            {link.label}
                        </a>
                    </div>
                  )
            })}
        </div>
    )
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
const NavBar : React.FC<{}> = () => {  
  return (
    <nav className = {styles.navbar}>
        <div className={styles['logo-container']}>
            <span>Logo</span>
        </div>
        
        <Links links={links}/>

    </nav>
  )
}

export default NavBar