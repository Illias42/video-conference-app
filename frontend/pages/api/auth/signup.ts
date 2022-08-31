import { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";
import axios from "axios";
import FormData from "form-data";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  }
}

async function SignUp (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
    const formData = new FormData();
    const data = await new Promise<any>((resolve, reject) => {
      const form = new formidable.IncomingForm();
      form.parse(req, (err: any, fields: any, files: any) => {
        if (err) {
          reject(err);
        }
        resolve({fields, files});
      });
    }).catch(e => {
      console.log(e);
    });

    ["email", "password", "name", "avatar"].forEach(key => {
      data.fields[key] && formData.append(key, data.fields[key]);
      data.files[key] && 
        formData.append(key, fs.createReadStream(data.files[key].filepath));
    });

    axios.post(
      'https://confserver1.herokuapp.com/auth/local/signup',
      formData,
      {
        headers: {
            ...formData.getHeaders()
        },
      }
    ).then(response => {
      const { user_data, access_token, refresh_token } = response.data;

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

      res.send({ user_data, refresh_token });
    }).catch(e => {
      res.status(e.response.status).send(e.response.data);
    });
  
}

export default SignUp;
