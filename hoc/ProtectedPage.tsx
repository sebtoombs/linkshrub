import { useRouter } from "next/router";
import { FunctionComponent, ReactElement } from "react";
import { useUser } from "../hooks/useUser";

export default function ProtectedPage(
  WrappedComponent: FunctionComponent
): FunctionComponent {
  return function ProtectedPageComponent(props: any): ReactElement | null {
    const { user, loading } = useUser();
    const router = useRouter();

    if (typeof window === "undefined" || loading) return null;

    if (!user) {
      router.push("/auth/signin");
      return null;
    }

    return <WrappedComponent {...props} user={user} />;
  };
}
