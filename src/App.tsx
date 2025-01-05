import "./App.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle } from "./components/ui/card";
import { CardBody, CardContainer, CardItem } from "./components/ui/3d-card";
import { Image, Link } from "lucide-react";
  
function App() {
  return (
    <>
      <div className="h-screen">
        <div className="navBar flex justify-end">
          <button className="text-[20px] pb-0 mr-auto ml-[20px] mt-[8px]">HC</button>
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
          <div className="flex  flex-col items-start mt-[100px] ml-[80px] gap-8">
            <h2 className="text-[30px]">Welcome to my little corner</h2>
            <p className="w-[500px] leading-7">
              My name is Haytham Chhilif and I am a self-taught Web Developer
              riding the ever-lasting journey towards mastering the craft. My
              passions are learning new things and supporting your business with
              simple, efficient, and creative tech solutions.{" "}
              <span className="animate-blink">|</span>
            </p>
            <Button className="" variant={"default"}>
              Contact me here
            </Button>
          </div>
          <div className="absolute mix-blend-multiply opacity-90 filter blur-xl top-0 bg-black rounded-full w-72 h-72 right-[190px] animate-blob"></div>
          <div className="absolute mix-blend-multiply opacity-90 filter blur-xl top-10 bg-gray-800 rounded-full w-72 h-72 right-[80px] animate-blob"></div>
          <div className="absolute mix-blend-multiply opacity-90 filter blur-xl -top-10 bg-slate-800 rounded-full w-72 h-72 right-[60px] animate-blob"></div>
        </div>

        <div className="mt-[100px] h-[500px]"> 
        <p className="ml-[80px] text-[20px] mb-[20px]">My projects</p>
        <div className="flex flex-row gap-3 justify-center items-center">
          {/* Project 1 */}
        <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-[150px] sm:w-[30rem] h-[420px] rounded-xl p-6 border  ">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white"
        >
          Project #1
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
        >
          Tic Tac Toe
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <Image
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            height="200"
            width="200"
            className="h-[200px] w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
        <div className="flex justify-center items-center mt-20">
          {/* <CardItem
            translateZ={20}
            as={Link}
            href="https://twitter.com/mannupaaji"
            target="__blank"
            className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
          >
            Try now →
          </CardItem> */}
          <CardItem
            translateZ={20}
            as="button"
            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
          >
            Sign up
          </CardItem>
        </div>
      </CardBody>
      {/* Project 2 */}
    </CardContainer>
        <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-[150px] sm:w-[30rem] h-[420px] rounded-xl p-6 border  ">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white"
        >
          Project #2
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
        >
          Age calculator
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <Image
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            height="200"
            width="200"
            className="h-[200px] w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
        <div className="flex justify-center items-center mt-20">
          {/* <CardItem
            translateZ={20}
            as={Link}
            href="https://twitter.com/mannupaaji"
            target="__blank"
            className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
          >
            Try now →
          </CardItem> */}
          <CardItem
            translateZ={20}
            as="button"
            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
          >
            Sign up
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
     {/* Project 3 */}
        <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-[150px] sm:w-[30rem] h-[420px] rounded-xl p-6 border  ">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white"
        >
          Project #3
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
        >
          TBD
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <Image
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            height="200"
            width="200"
            className="h-[200px] w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
        <div className="flex justify-center items-center mt-20">
          {/* <CardItem
            translateZ={20}
            as={Link}
            href="https://twitter.com/mannupaaji"
            target="__blank"
            className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
          >
            Try now →
          </CardItem> */}
          <CardItem
            translateZ={20}
            as="button"
            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
          >
            Sign up
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
      </div>
    </div>
  </div>
    </>
  );
}

export default App;
