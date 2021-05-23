export type Session = {
  itemId: string;
  listKey: string;
  data: {
    name: string;
  };
};

export type ListAccessArgs = {
  itemId?: string;
  session?: Session;
};

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}

// Rule based function
// Rules can return a boolean - yes or no - or a filter which limits which products they can CRUD.
export const rules = {
  canManageLinkPage({ session }: ListAccessArgs) {
    // Ensure signed in
    if (!isSignedIn({ session })) {
      return false;
    }

    if (session!.listKey === "AdminUser") return true;

    console.log("canManageLinkPage", session);
    // Otherwise, are they the owner?
    return { user: { id: session!.itemId } };
  },
  canManageLinkPageLink({ session }: ListAccessArgs) {
    return true;
    // Ensure signed in
    if (!isSignedIn({ session })) {
      return false;
    }
    // Otherwise, are they the owner?
    return { user: { id: session!.itemId } };
  },
};
