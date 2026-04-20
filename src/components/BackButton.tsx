import { CaretLeftIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

type BackButtonProps = {} & React.ComponentProps<"a">;

export function BackButton({ ...props }: BackButtonProps) {
    return (
        <Button asChild className="text-primary-foreground mb-6 w-fit px-0" variant="link">
            <Link to="/" {...props}>
                <CaretLeftIcon /> Back
            </Link>
        </Button>
    );
}
