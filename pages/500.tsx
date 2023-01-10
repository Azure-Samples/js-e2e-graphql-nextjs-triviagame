import type { NextPage } from "next";

const Error: NextPage<{ statusCode?: number }> = ({ statusCode }) => {
  console.log({ statusCode });
  return (
    <p>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : "An error occurred on client"}
    </p>
  );
};

// various log checks
Error.getInitialProps = ({ res, err }) => {
  console.log("err", err);
  console.log("res", res);
  const clientSideError = res ? res.statusCode : Boolean(err);
  console.log({ clientSideError });
  console.log("server", Boolean(res));
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;