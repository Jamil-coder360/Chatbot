import Chat from "@/views/Chat";
import { redirect } from "next/navigation";
// export default function Home() { redirect("/"); }

const Home = () => {
  return (
    <>
      <Chat />
    </>
  );
};

export default Home;
