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
  try {
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

    ["email", "password", "newPassword", "tag", "name", "avatar"].forEach(key => {
      data.fields[key] && formData.append(key, data.fields[key]);
      data.files[key] && 
        formData.append(key, fs.createReadStream(data.files[key].filepath));
    });

    const response = await axios.post(
      'https://confserver1.herokuapp.com/auth/local/update',
      formData,
      {
        headers: {
            ...formData.getHeaders()
        },
      }
    );
    
    const { user_data, access_token, refresh_token } = response.data;

    nookies.set({ res }, "refresh_token", refresh_token as string, {
      secure: process.env.NODE_ENV === "production",
      maxAge: 72576000,
      httpOnly: true,
      path: "/"
    });

    nookies.set({ res }, "access_token", access_token as string, {
      maxAge: 72576000,
      path: "/"
    });

    res.send({ user_data, refresh_token });
  } catch (e) {
    console.log(e);
    res.send("Failed");
  }
}

export default SignUp;