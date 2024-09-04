'use client'
import Image from "next/image";
import { Layout } from '../components';
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Layout>
        <div className="text-blue-900 flex justify-between">
          <h2>Loading...</h2>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
        <h2>
          Hello, <b>{session?.user?.username}</b>
        </h2>
        <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden">
          {/* <img src={session?.user?.image} alt="" className="w-6 h-6"/> */}
          <span className="px-2">
            {session?.user?.username }, 
            you are signed in
          </span>
        </div>
      </div>
    </Layout>
  );
}
