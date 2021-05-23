import AppLayout from "../../../components/AppLayout";
import Head from "../../../components/Head";
import ProtectedPage from "../../../hoc/ProtectedPage";

export function AppNewLinkPage() {
  return (
    <AppLayout>
      <Head title="New" />
      <p>Hi</p>
    </AppLayout>
  );
}

export default ProtectedPage(AppNewLinkPage);
