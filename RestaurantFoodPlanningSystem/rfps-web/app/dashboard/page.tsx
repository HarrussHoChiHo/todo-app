"use client"

import {useAuth} from "../AuthContext";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {Card, CardBody} from "@nextui-org/react";
import roleDto from "../../lib/models/RoleDto";

export default function Page() {
    const {
        user
    } = useAuth();
    
    return (
      <>
        <h2 className={"text-[48px]"}>Hello, {user?.userName}!</h2>
          <Card className={"w-1/2 h-[114px] flex flex-col justify-center items-center"}>
              <CardBody className={"w-[272px] h-[125px] flex flex-col justify-center items-center"}>
                  <span className={"w-full"}>User name: {user?.userName}</span>
                  <span className={"w-full"}>Role: {user?.role.join(", ")}</span>
              </CardBody>
          </Card>
      </>  
    );
}