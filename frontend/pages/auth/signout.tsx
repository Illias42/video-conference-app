import { GetServerSideProps } from "next";
import nookies from "nookies";

export default function SignOut() {
  return <></>
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // nookies.destroy(context, "access_token", { path: "/" });
  // nookies.destroy(context, "refresh_token", { path: "/" });
  
  return {
    redirect: { permanent: false, destination: "/auth/signin" },
    props: { initialState: {} }
  }
}