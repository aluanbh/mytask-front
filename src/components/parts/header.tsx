// Importe as bibliotecas necessárias do React e do Next.js
import React from 'react';
import ProfileButton from './profile_menu';
import Logo from './logo';


const Header: React.FC = () => {
    const randomImageURL = 'https://randomuser.me/api/portraits/women/66.jpg';


    return (

        <header className="fixed top-0 left-0 right-0 z-10 flex justify-around items-center bg-white p-3 px-8 shadow-md">
            {/* Logo */}
            <div className="logo">
                <Logo width='150' height='40' />
            </div>



            {/* Botão Profile */}
            <div className="profileButton">
                <ProfileButton userName="Bárbara Campos" imageURL={randomImageURL} />
            </div>
        </header>

    );
};

export default Header;
