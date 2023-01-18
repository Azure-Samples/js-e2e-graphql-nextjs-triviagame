import type { NextPage } from "next";

const Error = (props:any) => {
  console.log(JSON.stringify(props));
  return (
    <p>
      {JSON.stringify(props)}
    </p>
  );
};


export default Error;