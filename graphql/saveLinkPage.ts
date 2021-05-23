import { KeystoneContext, SessionStore } from "@keystone-next/types";
import omit from "../lib/omit";
import slugify from "../lib/slugify";
import { LinkPageSaveInput } from "../types/types";

export default async function saveLinkPage(
  _parent: any,
  { data }: { data: LinkPageSaveInput },
  context: KeystoneContext
): Promise<LinkPageSaveInput> {
  const session = context.session;
  if (!session.itemId) {
    throw new Error("Not authenticated");
  }

  // See if the user has a link page
  const allUserLinkPages = await context.lists.LinkPage.findMany({
    where: { owner: { id: session.itemId } },
    first: 1,
    // resolveFields: "id,",
  });

  const [existingLinkPage] = allUserLinkPages;

  if (existingLinkPage) {
    return await context.lists.LinkPage.updateOne({
      id: existingLinkPage.id,
      data: omit(data, ["slug", "owner"]),
      // resolveFields:""
    });
  }

  // A very mediocre attempt at finding a unique slug
  // It will die after 11, but for the purposes of this
  // small demo it'll do
  const baseSlug = slugify(session.data.name);
  const slugNumericRange = 10;
  const slugs = (() => [
    baseSlug,
    ...new Array(slugNumericRange)
      .fill(null)
      .map((_, i) => `${baseSlug}-${i + 1}`),
  ])();

  const allLinkPages = await context.lists.LinkPage.findMany({
    where: {
      slug_in: slugs,
    },
    resolveFields: "slug",
  });

  const slug =
    allLinkPages.length < slugs.length
      ? slugs[allLinkPages.length]
      : `${baseSlug}-${slugNumericRange + 1}`;

  return await context.lists.LinkPage.createOne({
    data: {
      ...data,
      slug,
      owner: {
        connect: { id: session.itemId },
      },
    },
    // resolveFields: ''
  });
}
