"use client";

import { NextPage } from "next";
import { useFetchUsers } from "./useFetchUsers";

const Page: NextPage = () => {
  const { data, isLoading, isError } = useFetchUsers();

  if (isError) {
    return <div>{"...error"}</div>;
  }

  if (isLoading) {
    return <div>{"...loading"}</div>;
  }

  return (
    <div>
      <h1>{"Users"}</h1>
      <ul>
        {data.map((user: any) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};
export default Page;
