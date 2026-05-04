import { createFileRoute } from "@tanstack/react-router";

import { AuthForms } from "@/components/blocks/auth-forms";
import { router } from "@/router";
import { DjangoApiService } from "@/services/ApiService.Django";

export const Route = createFileRoute("/(anon)/register")({
    component: RouteComponent,
});

const api = new DjangoApiService();

function RouteComponent() {
    return (
        <AuthForms.SignUp
            title="Register"
            className="pt-24"
            onSignIn={() => router.navigate({ to: "/login" })}
            onSubmit={async (data) => {
                await api.fetch("register", {
                    password: data.password,
                    username: data.name,
                });
                router.navigate({ to: "/login" });
            }}
        />
    );
}
