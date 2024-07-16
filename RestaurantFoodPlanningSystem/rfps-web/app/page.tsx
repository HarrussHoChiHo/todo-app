import {Link} from "@nextui-org/react";


export default function Home() {
    return (
        <>
            <div className={"flex flex-col items-center justify-center h-screen w-screen"}>
                <Link href={"/login"} 
                      isBlock={true} 
                      underline={"hover"}
                >Login</Link>
            </div>
        </>
    );
}
