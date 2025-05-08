"use client";

import { use } from "react";

interface PostItemProps {
  userId?: number;
  id: number;
  title: string;
  body: string;
}

interface ServerComponentProps {
  promise: Promise<PostItemProps[]>;
}

const InnerComponent = ({ promise }: ServerComponentProps) => {
  const data = use(promise);
  return (
    <ul>
      {data.map((post) => (
        <li key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </li>
      ))}
    </ul>
  );
};

export default InnerComponent;
