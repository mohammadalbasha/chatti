import React, { useContext } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Authenticated } from './authenticated';
import AuthContext from '../../store/auth-context';
import { Can } from '../../store/auth-context';

export function Authorized({ subject, action, children }) {
  const authCtx = useContext(AuthContext);

  return (
    <Authenticated>
      <Can I={action} a={subject}>
        {children}
      </Can>
    </Authenticated>
  );
}
