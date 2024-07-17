import {Button, Link} from "@nextui-org/react";


export default function Home() {
    return (
        <>
            <div className={"flex flex-col items-center justify-center h-screen w-screen bg-gradient-to-r from-sky-500 to-indigo-500"}>
                <h1 className={"font-serif text-white text-6xl m-4"}>Welcome to Restaurant Food Planning System</h1>
                <Button href={"/login"}
                        as={Link}
                        color={"warning"}
                        showAnchorIcon={true}
                        variant={"ghost"}
                        className={"font-serif h-fit p-4 text-4xl"}
                        size={"lg"}
                        
                >
                    Login
                </Button>
            </div>
        </>
    );
}
