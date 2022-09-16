import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

async function isTokenExpired(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, new TextEncoder().encode('at-secret'));
  } catch (e) {
    return true;
  }
  return false;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const response = new NextResponse();

  if (!pathname.includes('_next') && !pathname.includes('auth')) {
    const access_token = req.cookies.get('access_token');
    const refresh_token = req.cookies.get('refresh_token');

    if (access_token && refresh_token) {
      const expired = await isTokenExpired(access_token);
      
      if (!expired) {
        return NextResponse.next(response);
      } else {
        const resp = await fetch('https://confserver1.herokuapp.com/auth/refresh', 
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${refresh_token}`,
          }
        });

        if (resp.status === 200) {
          const data = await resp.json();
          console.log("data: ", data);

          response.cookies.set('access_token', data.access_token, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            path: '/',
            sameSite: 'none',
            secure: process.env.NODE_ENV === 'production',
          });

          response.cookies.set('refresh_token', data.refresh_token, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            path: '/',
            httpOnly: true,
            sameSite: 'none',
            secure: process.env.NODE_ENV === 'production',
          });

          return NextResponse.next(response);
        }
      }
    }

    return NextResponse.redirect('http://localhost:3000/auth/signin');
    // return NextResponse.redirect('https://video-conference-app1.herokuapp.com/auth/signin');
  }

  return NextResponse.next(response);
}