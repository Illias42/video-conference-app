import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";

async function NewDirect (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const cookies = nookies.get({req});
    const response = await axios.post("https://confserver1.herokuapp.com/direct/create", req.body,
    {
      headers: {
        "Authorization": "Bearer " + cookies.access_token
      }
    });

    res.send(response.data);
  } catch (e: any) {
    if (e.response.status === 401) {
      res.redirect("/auth/signout");
    } else {
      res.status(e.response.status).send(e.response.data);
    }
  }
}

export default NewDirect;