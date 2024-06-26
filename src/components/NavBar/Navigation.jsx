import { NavLink } from 'react-router-dom';
import { signInWithGoogle, signOut, useAuthState } from '../../utilities/FireBase';
import React, { useEffect, useState } from 'react';

const SignInButton = () => (
  <button className="ms-auto btn btn-dark" onClick={signInWithGoogle}>Sign in</button>
);

const SignOutButton = () => (
  <button className="ms-auto btn btn-dark" onClick={signOut}>Sign out</button>
);

const AuthButton = () => {
  const [user] = useAuthState();
  return user ? <SignOutButton /> : <SignInButton />;
};

const activation = ({isActive}) => isActive ? 'active' : 'inactive';

const Navigation = () => (
  <nav className="d-flex">
    <AuthButton />
  </nav>
);

export default Navigation;