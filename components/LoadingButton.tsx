import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";

type LoadingButtonProps = ComponentProps<typeof Button> & {
  loading?: boolean;
  loadingLabel?: string;
};

export function LoadingButton({ loading = false, loadingLabel = "Loading...", children, disabled, ...props }: LoadingButtonProps) {
  return (
    <Button disabled={disabled || loading} {...props}>
      {loading ? loadingLabel : children}
    </Button>
  );
}
