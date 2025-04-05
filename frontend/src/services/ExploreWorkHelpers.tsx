import { Work, Artist, WorksDoneDTO } from "../constants/ExploreTypes";

// export async function fetchWorksAndTransform(): Promise<Work[]> {
//   try {
//     const data = await getAllWorksDone();
//     const transformedData = data.map((work: Work) => ({
//       ...work,
//       artist: {
//         ...work.artist,
//         baseUser: {
//           ...work.artist.baseUser!,
//         },
//       },
//     }));
//     return transformedData;
//   } catch (error) {
//     console.error("Error fetching works:", error);
//     throw error;
//   }
// }

export function getFirstThreeArtists(works: WorksDoneDTO[]): any {
  // const uniqueArtistsMap = new Map<number, Artist>();

  // works.forEach((work) => {
  //   if (work.artist && !uniqueArtistsMap.has(work.artist.id)) {
  //     uniqueArtistsMap.set(work.artist.id, work.artist);
  //   }
  // });

  return null;
}
