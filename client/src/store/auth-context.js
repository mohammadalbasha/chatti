import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { fetchConverations } from "./redux/reducers/conversation-reducer";

const AuthContext = React.createContext({
  tokens: {},
  isLoggedIn: false,
  login: (profile) => {},
  logout: () => {},
  profile: {},
  profileHandler: (profile) => {},
});

export const AuthContextProvider = (props) => {
  const accessToken = Cookies.get("jwt");
  const refreshToken = Cookies.get("jwt");

  const [tokens, setTokens] = useState({ accessToken, refreshToken });

  const [profile, setProfile] = useState();

  const userIsLoggedIn = !!accessToken;

  const [isLoggedIn, setIsLoggedIn] = useState(userIsLoggedIn);

  const dispatch = useDispatch();

  console.log(isLoggedIn);
  //const history = useHistory();
  //const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/users/currentuser", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        profileHandler(response?.data?.currentUser);
      })
      .catch((err) => {
        if (
          err.response?.data?.error?.statusCode == 401 ||
          err.response?.data?.error?.message === "Unauthorized"
        ) {
          //history.push("/login");
          //navigate('/login'); // react router 6

          logoutHandler();
        }
      });
  }, []);

  const logoutHandler = () => {
    setTokens(null);
    setIsLoggedIn(false);
    setProfile(null);
    Cookies.remove("jwt");
  };

  const loginHandler = (profile) => {
    const accessToken = Cookies.get("jwt");
    const refreshToken = Cookies.get("jwt");
    setTokens({ accessToken, refreshToken });
    profileHandler(profile);
    setIsLoggedIn(true);
    //navigate("/login"); // react router 6
  };

  const profileHandler = (data) => {
    setProfile(data);
    dispatch(fetchConverations({ conversations: data?.conversations }));
  };
  const contextValue = {
    tokens: tokens,
    isLoggedIn: isLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    profile,
    profileHandler,
  };
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
