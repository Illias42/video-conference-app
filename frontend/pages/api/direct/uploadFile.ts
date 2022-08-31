import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'
import formidable from 'formidable'

export const config = {
  api: {
    bodyParser: false,
  }
}

async function Upload (
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

  data.files.file && formData.append('file', fs.createReadStream(data.files.file.filepath));

  axios.post(
    'https://confserver1.herokuapp.com/direct/upload',
    formData,
    {
      headers: {
        ...formData.getHeaders()
      },
    }
  ).then(response => {
    res.send(response.data);
  }).catch(e => {
    res.status(e.response.status).send(e.response.data);
  });
}

export default Upload;