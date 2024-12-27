import "./App.css";
import { Button } from "@/components/ui/button";

function App() {
  return (
    <>
      <div className="w-screen h-screen ">
        <div className="navBar flex justify-end">
          <Button
            className="text-[20px] pb-0 mr-auto ml-[20px] mt-[8px]"
            variant={"ghost"}
          >
            HC
          </Button>
          <Button className="mt-3" variant={"link"}>
            About me
          </Button>
          <Button className="mt-3" variant={"link"}>
            Projects
          </Button>
          <Button className="mt-3" variant={"link"}>
            Contact
          </Button>
        </div>
        <div className="relative">
          <div className="flex  flex-col items-start mt-[100px] ml-[20px] h-[100px] gap-8">
            <h2 className="text-[30px]">Welcome to my little corner</h2>
            <p className="w-[400px] leading-7">
              My name is Haytham Chhilif and I am a self-taught Web Developer
              riding the ever-lasting journey towards mastering the craft. My
              passions are learning new things and supporting your business with
              simple, efficient, and creative tech solutions{" "}
              <span className="animate-blink">|</span>
            </p>
            <Button className="" variant={"default"}>
              Contact me here
            </Button>
          </div>
          <div className="absolute mix-blend-multiply opacity-70 filter blur-xl top-0 bg-black rounded-full w-72 h-72 right-[150px] animate-blob"></div>
          <div className="absolute mix-blend-multiply opacity-70 filter blur-xl top-10 bg-gray-800 rounded-full w-72 h-72 right-[40px] animate-blob"></div>
          <div className="absolute mix-blend-multiply opacity-70 filter blur-xl -top-10 bg-slate-800 rounded-full w-72 h-72 right-[20px] animate-blob"></div>
        </div>
      </div>
    </>
  );
}

export default App;
