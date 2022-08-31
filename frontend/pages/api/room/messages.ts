import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";

async function Direct(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const cookies = nookies.get({ req });
    const roomId = req.query.room;

    const response = await axios.get(
      `https://confserver1.herokuapp.com/rooms/${roomId}/messages`,
      {
        headers: {
          Authorization: "Bearer " + cookies.access_token,
        },
      }
    );
    res.send(response.data);
  } catch (e: any) {
    if (e.response.status === 401) {
      res.redirect("/auth/signout");
    } else {
      res.status(e.response.status).send(e.response.data);
    }
  }
}

export default Direct;
