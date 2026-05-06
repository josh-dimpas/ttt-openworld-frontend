import { CaretLeftIcon } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'

type BackButtonProps = {} & React.ComponentProps<'a'>

export function BackButton({ ...props }: BackButtonProps) {
  return (
    <Button
      asChild
      className="px-0 w-fit text-primary-foreground"
      variant="link"
    >
      <Link to="/" {...props}>
        <CaretLeftIcon /> Back
      </Link>
    </Button>
  )
}
