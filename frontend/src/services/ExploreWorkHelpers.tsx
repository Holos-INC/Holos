import { getAllWorksDone } from "@/src/services/WorksDoneApi";
import { Work, Artist } from "../constants/WorkTypes";

export async function fetchWorksAndTransform(): Promise<Work[]> {
  try {
    const data = await getAllWorksDone();
    const transformedData = data.map((work: Work) => ({
      ...work,
      artist: {
        ...work.artist,
        baseUser: {
          ...work.artist.baseUser!,
        },
      },
    }));
    return transformedData;
  } catch (error) {
    console.error("Error fetching works:", error);
    throw error;
  }
}

export function getFirstThreeArtists(works: Work[]): Artist[] {
  const uniqueArtistsMap = new Map<number, Artist>();

  works.forEach((work) => {
    if (work.artist && !uniqueArtistsMap.has(work.artist.id)) {
      uniqueArtistsMap.set(work.artist.id, work.artist);
    }
  });

  return Array.from(uniqueArtistsMap.values()).slice(0, 3);
}
