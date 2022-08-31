import { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";
import axios from "axios";
import { setUser } from "../../../store/slices/user";
import { store } from "../../../store/store";

function SignIn (
  req: NextApiRequest,
  res: NextApiResponse
): void {
    axios.post(
      'https://confserver1.herokuapp.com/auth/local/signin',
      req.body,
      { 
        validateStatus: (status) => status === 200,
        headers: {
          "content-type": "application/json"
        },
      }
    ).then(response => {
      const { user_data, access_token, refresh_token } = response.data;
      store.dispatch(setUser(user_data));

      nookies.set({ res }, "refresh_token", refresh_token as string, {
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: "none",
        path: "/"
      });

      nookies.set({ res }, "access_token", access_token as string, {
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: "none",
        path: "/"
      });

      res.send({ user_data, refresh_token })

  }).catch(e => {
    res.status(e.response.status).send(e.response.data);
  })
}

export default SignIn;
