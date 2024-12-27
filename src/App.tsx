import "./App.css";
import { Button } from "@/components/ui/button";

function App() {
  return (
    <>
      <div className="w-screen h-screen ">
        <div className="navBar flex justify-end">
          <h3 className="text-[30px] mr-auto ml-[20px] mt-[8px]">HC</h3>
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
      </div>
    </>
  );
}

export default App;
