import { RegisterPage } from "@/components/pages/register";
import { Suspense } from "react";

export default function Register() {
    return (
        <Suspense>
            <RegisterPage />
        </Suspense>
    );
}
